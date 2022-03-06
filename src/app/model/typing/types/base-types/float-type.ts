import { BaseType } from "../base-type";

export class FloatType extends BaseType {

    protected superTypes: (typeof BaseType)[] = [];

    public toString(): string {
        return "float";
    }

    public toCdeclEnglish(): string {
        return "float";
    }
}