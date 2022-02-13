import { AbstractType, otherAliasReplaced } from "../abstract-type";
import { StructuralSubtypingQueryContext } from "../structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryResult } from "../structural-subtyping/structural-subtyping-query-result";
import { FloatType } from "./float-type";

export class IntType extends AbstractType {

    public toString(): string {
        return "int";
    }

    @otherAliasReplaced()
    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        const basicCheckResult = super.isStrutcturalSubtypeOf_Impl(other, context);
        if (basicCheckResult.value) return basicCheckResult; 
        
        context.accumulator.value = (other instanceof FloatType); // Add additional supertypes
        return context.accumulator;
    }
}