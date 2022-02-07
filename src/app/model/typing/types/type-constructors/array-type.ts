import { AbstractType } from "../abstract-type";
import { StructuralEquivalenceQuery } from "../structural-subtyping/structural-equivalence-query";

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

    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, queryHistory: StructuralEquivalenceQuery[]): boolean {
        if (super.isStrutcturalSubtypeOf_Impl(other, queryHistory)) return true;
        if(other instanceof ArrayType) {
            return this.baseType.isStrutcturalSubtypeOf_Impl(other.baseType, queryHistory);
        } else {
            return false;
        }
    }
}