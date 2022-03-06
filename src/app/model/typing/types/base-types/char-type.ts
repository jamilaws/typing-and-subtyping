import { BaseType } from "../base-type";

export class CharType extends BaseType {

    protected superTypes: (typeof BaseType)[] = [];

    public toString(): string {
        return "char";
    }

    public toCdeclEnglish(): string {
        return "char";
    }
}