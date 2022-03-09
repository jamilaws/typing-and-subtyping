import { BaseType } from "../base-type";

export class CharType extends BaseType {

    protected token: string = "char";
    protected superTypes: (typeof BaseType)[] = [];

    // DEPRECATED
    // public toString(): string {
    //     return "char";
    // }
}