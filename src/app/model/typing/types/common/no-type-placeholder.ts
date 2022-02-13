import { AbstractType } from "../abstract-type";
import { StructuralSubtypingQueryContext } from "./structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryResult } from "./structural-subtyping/structural-subtyping-query-result";

/**
 * Type placeholder for e.g. if-statements
 * TODO: Clearify if other approach (e.g. using VoidType instead) is more suitable. Better: Refactor to "Expression" superclass
 */
export class NoTypePlaceholder extends AbstractType {
    public toString(): string {
        return "No Type.";
    }

    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        throw new Error("Method call unexpected.");
    }
}