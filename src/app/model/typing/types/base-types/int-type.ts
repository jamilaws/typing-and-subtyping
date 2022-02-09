import { AbstractType, otherAliasReplaced, SubtypingContext } from "../abstract-type";
import { StructuralEquivalenceQuery } from "../structural-subtyping/structural-equivalence-query";
import { FloatType } from "./float-type";

export class IntType extends AbstractType {

    public toString(): string {
        return "int";
    }

    @otherAliasReplaced()
    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: SubtypingContext): boolean {
        if (super.isStrutcturalSubtypeOf_Impl(other, context)) return true;    
        if (other instanceof FloatType) return true;
        return false;
    }
}