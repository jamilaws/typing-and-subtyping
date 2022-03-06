import { BaseType } from "../base-type";

export class VoidType extends BaseType {

    protected superTypes: (typeof BaseType)[] = [];
    
    public toString(): string {
        return "void";
    }

    public toCdeclEnglish(): string {
        return "void";
    }
}