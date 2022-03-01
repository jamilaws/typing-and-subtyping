import { AbstractType } from "../abstract-type";
import { StructuralSubtypingQueryContext } from "../common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryGraph } from "../common/structural-subtyping/structural-subtyping-query-graph";
import { Graph, Node, Edge } from '../../../common/graph/_module';
import { CdeclHalves } from "../common/cdecl-halves";

function zip<X, Y>(xs: X[], ys: Y[]): [X, Y][] {
    if (xs.length !== ys.length) throw new Error("Cannot zip arrays of unequal length");
    return xs.map((x, i) => [x, ys[i]]);
}

export class FunctionType extends AbstractType {

    private parameterTypes: AbstractType[];
    private returnType: AbstractType;

    constructor(parameterTypes: AbstractType[], returnType: AbstractType) {
        super();
        this.parameterTypes = parameterTypes;
        this.returnType = returnType;
    }

    /* Structural Subtyping */

    protected performStructuralSubtypingCheck_step_realSubtypingRelation(other: AbstractType, context: StructuralSubtypingQueryContext): boolean {
        const buffer = this.getCurrentStructuralSubtypingBufferFrame();

        if (other instanceof FunctionType) {
            if (this.parameterTypes.length !== other.parameterTypes.length) {
                buffer.appendix.parameterNumberMissmatch = true;
                return false;
            }
            // co-variance of the return type
            const returnTypesCheck = this.returnType.performStructuralSubtypingCheck(other.returnType, context);
            const parameterTypesCheck = zip(this.parameterTypes, other.parameterTypes).every(tup2 => {
                // contra-variance of the parameter types
                return tup2[1].performStructuralSubtypingCheck(tup2[0], context);
            });

            return returnTypesCheck && parameterTypesCheck;
        } else {
            return false;
        }
    }

    protected buildQueryGraph_step_extendGraph(graph: StructuralSubtypingQueryGraph): StructuralSubtypingQueryGraph {
        const buffer = this.getCurrentStructuralSubtypingBufferFrame();

        if(buffer.appendix.parameterNumberMissmatch) return graph; // Do not visualize child types  
        
        const root = graph.getGraph().getRoot();
        
        // Note: These are the parameters of the other function type cached in the query buffer
        const parameterOuts = (<FunctionType>buffer.currentQuery.b).getParameters().map(p => p.buildQueryGraph());
        
        const parameterEdges = parameterOuts.map((sg, index) => new Edge(root, sg.getGraph().getRoot(), "param" + index));

        const returnOut = this.returnType.buildQueryGraph();
        const returnEdge = new Edge(root, returnOut.getGraph().getRoot(), "return");

        parameterOuts.forEach(po => graph.merge(po));
        parameterEdges.forEach(e => graph.getGraph().addEdge(e));

        graph.merge(returnOut);   
        graph.getGraph().addEdge(returnEdge);

        return graph;
    }

    protected override isQueryGraphNodeHighlighted(): boolean {
        return this.getCurrentStructuralSubtypingBufferFrame().appendix.parameterNumberMissmatch;
    }

    /* --- */

    public toString(): string {
        return `${this.returnType.toString()}(${this.parameterTypes.map(p => p.toString()).join(", ")})`;
    }

    public getParameters(): AbstractType[] {
        return this.parameterTypes;
    }

    public getReturnType(): AbstractType {
        return this.returnType;
    }

    /* YACC RULE:

    adecl: FUNCTION '(' adecllist ')' RETURNING adecl
            {
            if (prev == 'f')
                unsupp("Function returning function",
                       "function returning pointer to function");
            else if (prev=='A' || prev=='a')
                unsupp("Function returning array",
                       "function returning pointer");
            $$.left = $6.left;
            $$.right = cat(ds("("),$3,ds(")"),$6.right,NullCP);
            $$.type = $6.type;
            prev = 'f';
            }

    */
    public override cdeclToStringImpl(context: { prev: string }): CdeclHalves {

        context.prev = 'f'; // Check if this is ok

        return {
            left: this.getReturnType().cdeclToStringImpl(context).left,
            right: '(' + this.getParameters().map(p => p.cdeclToStringImpl(context)) + ')' + this.getReturnType().cdeclToStringImpl(context).right,
            type: this.getReturnType().cdeclToStringImpl(context).type
        }
    }
}