import { AbstractType } from "../abstract-type";
import { StructuralEquivalenceQuery } from "../structural-subtyping/structural-equivalence-query";
import { FloatType } from "./float-type";

export class IntType extends AbstractType {

    public toString(): string {
        return "int";
    }

    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, queryHistory: StructuralEquivalenceQuery[]): boolean {
        if (super.isStrutcturalSubtypeOf_Impl(other, queryHistory)) return true;    
        if (other instanceof FloatType) return true;
        return false;
    }
}