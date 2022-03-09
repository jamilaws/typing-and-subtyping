import { AbstractType } from "../abstract-type";
import { BaseType } from "../base-type";
import { StructuralSubtypingQueryContext } from "../common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryResult } from "../common/structural-subtyping/structural-subtyping-query-result";
import { FloatType } from "./float-type";

export class IntType extends BaseType {

    protected token: string = "int";
    protected superTypes: (typeof BaseType)[] = [ FloatType ];

    // DEPRECATED
    // public toString(): string {        
    //     return "int";
    // }
}