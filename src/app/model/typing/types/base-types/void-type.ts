import { AbstractType } from "../abstract-type";
import { StructuralSubtypingQuery } from "../structural-subtyping/structural-subtyping-query";

export class VoidType extends AbstractType {
    public toString(): string {
        return "void";
    }
}