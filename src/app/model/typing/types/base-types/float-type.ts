import { BaseType } from "../base-type";

export class FloatType extends BaseType {

    protected token: string = "float";
    protected superTypes: (typeof BaseType)[] = [];

    // DEPRECATED
    // public toString(): string {
    //     return "float";
    // }
}