import { AbstractType } from "../abstract-type";

export class NotVisitedPlaceholderType extends AbstractType {
    public toString(): string {
        return "t";
    }

    public isSubtypeOf(other: AbstractType): boolean {
        throw new Error("Not implemented.");
    }
}