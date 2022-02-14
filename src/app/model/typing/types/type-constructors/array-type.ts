import { AbstractType, otherAliasReplaced } from "../abstract-type";
import { StructuralSubtypingQueryContext } from "../common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryGraph } from "../common/structural-subtyping/structural-subtyping-query-graph";
import { StructuralSubtypingQueryResult } from "../common/structural-subtyping/structural-subtyping-query-result";
import { Graph, Node, Edge } from '../../../common/graph/_module';


export class ArrayType extends AbstractType {

    private baseType: AbstractType;

    constructor(baseType: AbstractType){
        super();
        this.baseType = baseType;
    }

    public toString(): string {
        return this.baseType.toString() + "[ ]";
    }

    public getBaseType(): AbstractType {
        return this.baseType;
    }

    @otherAliasReplaced()
    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        const basicCheckResult = super.isStrutcturalSubtypeOf_Impl(other, context);
        if (basicCheckResult.value) return basicCheckResult;
        if(other instanceof ArrayType) {
            return this.baseType.isStrutcturalSubtypeOf_Impl(other.baseType, context);
        } else {
            return { value: false };
        }
    }

    public override buildQueryGraph(): StructuralSubtypingQueryGraph {
        let out = super.buildQueryGraph();
        const root = out.getRoot();

        const subgraph = this.baseType.buildQueryGraph();
        const newEdge = new Edge(root, subgraph.getRoot(), "");

        out = out.merge(subgraph);
        out.addEdge(newEdge);

        return out;
    }
}