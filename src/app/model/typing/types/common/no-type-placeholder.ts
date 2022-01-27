import { AbstractType } from "../abstract-type";

/**
 * Type placeholder for e.g. if-statements
 * TODO: Clearify if other approach (e.g. using VoidType instead) is more suitable
 */
export class NoTypePlaceholder extends AbstractType {
    public toString(): string {
        return "No Type.";
    }

    public isSubtypeOf(other: AbstractType): boolean {
        throw new Error("Not implemented.");
    }
}