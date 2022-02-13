import { AbstractType } from "../abstract-type";
import { StructuralSubtypingQuery } from "../structural-subtyping/structural-subtyping-query";

export class FloatType extends AbstractType {
    public toString(): string {
        return "float";
    }
}