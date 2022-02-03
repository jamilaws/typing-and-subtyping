import { AbstractType } from "../abstract-type";
import { StructuralEquivalenceQuery } from "../structural-subtyping/structural-equivalence-query";

export class FloatType extends AbstractType {
    public toString(): string {
        return "float";
    }
}