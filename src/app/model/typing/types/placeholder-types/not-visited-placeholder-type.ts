import { AbstractType } from "../abstract-type";
import { StructuralEquivalenceQuery } from "../structural-subtyping/structural-equivalence-query";

export class NotVisitedPlaceholderType extends AbstractType {
    public toString(): string {
        return "t";
    }

    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, queryHistory: StructuralEquivalenceQuery[]): boolean {
        throw new Error("Method call unexpected.");
    }
}