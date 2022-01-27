import { AbstractType } from "../abstract-type";

export class FloatType extends AbstractType {
    public toString(): string {
        return "float";
    }

    public isSubtypeOf(other: AbstractType): boolean {
        return this.equals(other);
    }
}