import { AbstractType } from "../../abstract-type";

export class StructuralSubtypingQuery {
    public a: AbstractType;
    public b: AbstractType;

    constructor(a: AbstractType, b: AbstractType){
        this.a = a;
        this.b = b;
    }

    public equals(other: StructuralSubtypingQuery): boolean {          
        return this.a.equals(other.a) && this.b.equals(other.b);
    }
}