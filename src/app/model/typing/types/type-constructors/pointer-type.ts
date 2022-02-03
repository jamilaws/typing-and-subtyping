import { AbstractType } from "../abstract-type";
import { StructuralEquivalenceQuery } from "../structural-subtyping/structural-equivalence-query";

export class PointerType extends AbstractType {

    private baseType: AbstractType;

    constructor(baseType: AbstractType) {
        super();
        this.baseType = baseType;
    }

    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, queryHistory: StructuralEquivalenceQuery[]): boolean {
        if (super.isStrutcturalSubtypeOf_Impl(other, queryHistory)) return true;
        if(other instanceof PointerType) {
            return this.baseType.isStrutcturalSubtypeOf_Impl(other, queryHistory);
        } else {
            return false;
        }
    }

    public toString(): string {
        return this.baseType.toString() + "*";
    }

    public getBaseType(): AbstractType {
        return this.baseType;
    }
}