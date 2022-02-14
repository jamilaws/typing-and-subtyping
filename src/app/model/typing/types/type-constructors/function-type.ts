import { AbstractType, otherAliasReplaced } from "../abstract-type";
import { Definition } from "../common/definition";
import { StructuralSubtypingQueryContext } from "../common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryGraph } from "../common/structural-subtyping/structural-subtyping-query-graph";
import { StructuralSubtypingQueryResult } from "../common/structural-subtyping/structural-subtyping-query-result";
import { Graph, Node, Edge } from '../../../common/graph/_module';


function zip<X, Y>(xs: X[], ys: Y[]): [X, Y][] {
    if (xs.length !== ys.length) throw new Error("Cannot zip arrays of unequal length");
    return xs.map((x, i) => [x, ys[i]]);
}

export class FunctionType extends AbstractType {

    private parameterTypes: AbstractType[];
    private returnType: AbstractType;

    private isSubtype_buffer: boolean = false;

    constructor(parameterTypes: AbstractType[], returnType: AbstractType) {
        super();
        this.parameterTypes = parameterTypes;
        this.returnType = returnType;
    }

    @otherAliasReplaced()
    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        const basicCheckResult = super.isStrutcturalSubtypeOf_Impl(other, context);
        if (basicCheckResult.value) {
            this.isSubtype_buffer = basicCheckResult.value;
            return basicCheckResult;
        }

        if (other instanceof FunctionType) {
            if (this.parameterTypes.length !== other.parameterTypes.length) {
                this.isSubtype_buffer = false;
                return { value: false };
            }
            // co-variance of the return type
            const returnTypesCheck = this.returnType.isStrutcturalSubtypeOf_Impl(other.returnType, context);
            // contra-variance of the parameter types
            const parameterTypesCheck = zip(this.parameterTypes, other.parameterTypes).every(tup2 => tup2[1].isStrutcturalSubtypeOf_Impl(tup2[0], context));

            // TODO Check if this is ok !!! Handle message somehow?
            this.isSubtype_buffer = returnTypesCheck && parameterTypesCheck;
            return { value: this.isSubtype_buffer };
        } else {
            this.isSubtype_buffer = false;
            return { value: false };
        }
    }

    public override buildQueryGraph(): StructuralSubtypingQueryGraph {
        let out = super.buildQueryGraph();
        const root = out.getRoot();

        if(!this.isSubtype_buffer) return out; // Do not extend the basic query graph in case of query result false

        // Contra
        const parameterSubgraphs = (<FunctionType>this.subtypingQueryBuffer.b).getParameters().map(p => p.buildQueryGraph());
        const parameterEdges = parameterSubgraphs.map(sg => new Edge(root, sg.getRoot(), ""));

        const returnSubgraph = this.returnType.buildQueryGraph();
        const returnEdge = new Edge(root, returnSubgraph.getRoot(), "return");

        parameterSubgraphs.forEach(sg => out = out.merge(sg));
        parameterEdges.forEach(e => out.addEdge(e));

        out = out.merge(returnSubgraph);
        out.addEdge(returnEdge);

        return out;
    }

    public toString(): string {
        return `${this.returnType.toString()}(${this.parameterTypes.map(p => p.toString()).join(", ")})`;
    }

    public getParameters(): AbstractType[] {
        return this.parameterTypes;
    }

    public getReturnType(): AbstractType {
        return this.returnType;
    }
}