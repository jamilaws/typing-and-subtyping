import { AbstractType } from "../abstract-type";

export class PointerType extends AbstractType {

    private baseType: AbstractType;

    constructor(baseType: AbstractType) {
        super();
        this.baseType = baseType;
    }

    public isSubtypeOf(other: AbstractType): boolean {
        throw new Error("Not implemented.");
    }

    public toString(): string {
        return this.baseType.toString() + "*";
    }

    public getBaseType(): AbstractType {
        return this.baseType;
    }
}