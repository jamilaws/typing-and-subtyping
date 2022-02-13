import { AbstractType, otherAliasReplaced } from "../abstract-type";
import { StructuralSubtypingQuery } from "../structural-subtyping/structural-subtyping-query";
import { StructuralSubtypingQueryContext } from "../structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryResult } from "../structural-subtyping/structural-subtyping-query-result";

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
            context.accumulator.value = false;
            return context.accumulator;
        }
    }

    public toString(): string {
        return this.baseType.toString() + "*";
    }

    public getBaseType(): AbstractType {
        return this.baseType;
    }
}