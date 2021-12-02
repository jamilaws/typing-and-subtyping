import { TypeEnvironment } from "../type-environment";
import { AbstractType } from "../types/abstract-type";

export interface TypeCheckable {
    checkType(t: TypeEnvironment): AbstractType;
}