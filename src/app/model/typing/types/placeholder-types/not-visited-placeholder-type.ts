import { AbstractType } from "../abstract-type";
import { StructuralSubtypingQuery } from "../structural-subtyping/structural-subtyping-query";
import { StructuralSubtypingQueryContext } from "../structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryResult } from "../structural-subtyping/structural-subtyping-query-result";

export class NotVisitedPlaceholderType extends AbstractType {
    public toString(): string {
        return "t";
    }

    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        throw new Error("Method call unexpected.");
    }
}