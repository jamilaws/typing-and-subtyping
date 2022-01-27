import { AbstractType } from "../abstract-type";

export class VoidType extends AbstractType {
    public toString(): string {
        return "void";
    }

    public isSubtypeOf(other: AbstractType): boolean {
        throw new Error("Not implemented.");
    }
}