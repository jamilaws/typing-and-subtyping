import { AbstractType } from "../abstract-type";
import { StructuralEquivalenceQuery } from "../structural-subtyping/structural-equivalence-query";

/**
 * Type placeholder for e.g. if-statements
 * TODO: Clearify if other approach (e.g. using VoidType instead) is more suitable
 */
export class NoTypePlaceholder extends AbstractType {
    public toString(): string {
        return "No Type.";
    }

    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, queryHistory: StructuralEquivalenceQuery[]): boolean {
        throw new Error("Method call unexpected.");
    }
}