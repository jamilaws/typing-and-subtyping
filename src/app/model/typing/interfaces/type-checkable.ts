import { TypeEnvironment } from "../type-environment";
import { AbstractType } from "../types/abstract-type";

export interface TypeCheckable {
    performTypeCheck(t: TypeEnvironment): AbstractType;
    getType(): AbstractType;
}