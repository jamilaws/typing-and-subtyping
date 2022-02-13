import { AbstractType } from "../abstract-type";
import { StructuralSubtypingQuery } from "../common/structural-subtyping/structural-subtyping-query";
import { StructuralSubtypingQueryContext } from "../common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryGraph } from "../common/structural-subtyping/structural-subtyping-query-graph";
import { StructuralSubtypingQueryResult } from "../common/structural-subtyping/structural-subtyping-query-result";

export class CharType extends AbstractType {

    public toString(): string {
        return "char";
    }

    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        const out = super.isStrutcturalSubtypeOf_Impl(other, context);
        return out;
    }

    public override buildQueryGraph(): StructuralSubtypingQueryGraph {
        const out = super.buildQueryGraph();
        return out;
    }
}