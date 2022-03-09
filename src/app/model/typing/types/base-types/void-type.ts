import { BaseType } from "../base-type";

export class VoidType extends BaseType {

    protected token: string = "void";
    protected superTypes: (typeof BaseType)[] = [];
    
    // DEPRECATED
    // public toString(): string {
    //     return "void";
    // }
}