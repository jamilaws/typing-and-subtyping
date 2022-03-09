import { AbstractType, StructuralSubtypingBufferFrame } from "../abstract-type";
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

    protected performStructuralSubtypingCheck_step_checkRealSubtypingRelation(other: AbstractType, context: StructuralSubtypingQueryContext): boolean {
        const buffer = this.performStructuralSubtypingCheck_getBufferFrameForWriting();

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

    protected buildQueryGraph_step_extendGraph(graph: StructuralSubtypingQueryGraph, bufferFrame: StructuralSubtypingBufferFrame): StructuralSubtypingQueryGraph {

        if(bufferFrame.appendix.parameterNumberMissmatch) return graph; // Do not visualize child types  
        
        const root = graph.getGraph().getRoot();
        
        // Note: These are the parameters of the other function type cached in the query buffer
        const parameterOuts = (<FunctionType>bufferFrame.currentQuery.b).getParameters().map(p => p.buildQueryGraph());
        
        const parameterEdges = parameterOuts.map((sg, index) => new Edge(root, sg.getGraph().getRoot(), "param" + index));

        const returnOut = this.returnType.buildQueryGraph();
        const returnEdge = new Edge(root, returnOut.getGraph().getRoot(), "return");

        parameterOuts.forEach(po => graph.merge(po));
        parameterEdges.forEach(e => graph.getGraph().addEdge(e));

        graph.merge(returnOut);   
        graph.getGraph().addEdge(returnEdge);

        return graph;
    }

    protected override isQueryGraphNodeHighlighted(bufferFrame: StructuralSubtypingBufferFrame): boolean {
        return bufferFrame.appendix.parameterNumberMissmatch;
    }

    /* --- */

    // DEPRECATED
    // public toString(): string {
    //     return `${this.returnType.toString()}(${this.parameterTypes.map(p => p.toString()).join(", ")})`;
    // }

    public toCdeclEnglish(): string {
        const paramTxt: string = "(" + this.parameterTypes.map(pt => pt.toCdeclEnglish()).join(",") + ")";
        return `function ${this.parameterTypes.length > 0 ? paramTxt : ""} returning ${this.returnType.toCdeclEnglish()}`;
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

    adecllist ....
            | adecllist COMMA adecllist
			{
			$$ = cat($1, ds(", "), $3, NullCP);
			}
            | adecl
			{
			$$ = cat($1.type, ds(" "), $1.left, $1.right, NullCP);
			}

    */
    public override toCdeclCImpl(): CdeclHalves {

        const paramCdecls = this.getParameters().map(p => p.toCdeclCImpl());
        const returnCdecl = this.getReturnType().toCdeclCImpl();

        return {
            left: returnCdecl.left,
            right: '(' + paramCdecls.map(tup => tup.type + " " + tup.left + tup.right).join(", ") + ')' + returnCdecl.right,
            type: returnCdecl.type
        }
    }
}

/*
Expected: char *(*(*_(int        **()[]     ))[5])()
Actual:   char *(*(*_(int                   ))[5])()
*/