import { AbstractType } from "../abstract-type";

export class StructuralEquivalenceQuery {
    public a: AbstractType;
    public b: AbstractType;

    constructor(a: AbstractType, b: AbstractType){
        this.a = a;
        this.b = b;
    }

    public equals(other: StructuralEquivalenceQuery): boolean {          
        return this.a.equals(other.a) && this.b.equals(other.b);
    }
}