import { Edge } from "src/app/model/common/graph/_module";
import { AbstractType, otherAliasReplaced } from "../abstract-type";
import { StructuralSubtypingQuery } from "../common/structural-subtyping/structural-subtyping-query";
import { StructuralSubtypingQueryContext } from "../common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryGraph } from "../common/structural-subtyping/structural-subtyping-query-graph";
import { StructuralSubtypingQueryResult } from "../common/structural-subtyping/structural-subtyping-query-result";

export class PointerType extends AbstractType {

    private baseType: AbstractType;

    constructor(baseType: AbstractType) {
        super();
        this.baseType = baseType;
    }

    @otherAliasReplaced()
    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        const basicCheckResult = super.isStrutcturalSubtypeOf_Impl(other, context);
        if (basicCheckResult.value) return basicCheckResult;
        if(other instanceof PointerType) {
            return this.baseType.isStrutcturalSubtypeOf_Impl(other.baseType, context);
        } else {
            return { value: false };
        }
    }

    public override buildQueryGraph(): StructuralSubtypingQueryGraph {
        let out = super.buildQueryGraph();
        const root = out.getGraph().getRoot();

        if(this.loopDetectedBuffer) return out;

        const targetOut = this.baseType.buildQueryGraph();
        const newEdge = new Edge(root, targetOut.getGraph().getRoot(), "");

        out.merge(targetOut);
        out.getGraph().addEdge(newEdge);

        return out;
    }

    public toString(): string {
        return this.baseType.toString() + "*";
    }

    public getBaseType(): AbstractType {
        return this.baseType;
    }
}