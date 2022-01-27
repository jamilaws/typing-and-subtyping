import { AbstractType } from "../abstract-type";

export class CharType extends AbstractType {

    public toString(): string {
        return "char";
    }

    public isSubtypeOf(other: AbstractType): boolean {
        return this.equals(other);
    }
}