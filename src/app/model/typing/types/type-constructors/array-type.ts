import { AbstractType } from "../abstract-type";

export class ArrayType extends AbstractType {

    private baseType: AbstractType;

    constructor(baseType: AbstractType){
        super();
        this.baseType = baseType;
    }

    public toString(): string {
        return this.baseType.toString() + "[]";
    }

    public getBaseType(): AbstractType {
        return this.baseType;
    }

    public isSubtypeOf(other: AbstractType): boolean {
        throw new Error("Not implemented.");
    }
}