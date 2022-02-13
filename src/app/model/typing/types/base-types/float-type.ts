import { AbstractType } from "../abstract-type";
import { StructuralSubtypingQuery } from "../common/structural-subtyping/structural-subtyping-query";

export class FloatType extends AbstractType {
    public toString(): string {
        return "float";
    }
}