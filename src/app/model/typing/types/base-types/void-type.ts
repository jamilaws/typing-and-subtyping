import { AbstractType } from "../abstract-type";
import { StructuralSubtypingQuery } from "../common/structural-subtyping/structural-subtyping-query";

export class VoidType extends AbstractType {
    public toString(): string {
        return "void";
    }
}