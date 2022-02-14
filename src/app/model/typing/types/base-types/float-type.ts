import { AbstractType } from "../abstract-type";
import { StructuralSubtypingQuery } from "../common/structural-subtyping/structural-subtyping-query";
import { StructuralSubtypingQueryContext } from "../common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryResult } from "../common/structural-subtyping/structural-subtyping-query-result";

export class FloatType extends AbstractType {

    private isStrutcturalSubtype_buffer: boolean = false;

    public toString(): string {
        return "float";
    }

    // Only override this method to remember its output in subclass
    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        const result = super.isStrutcturalSubtypeOf_Impl(other, context);
        
        // Store value in buffer for 'isQueryGraphNodeHighlighted' method
        this.isStrutcturalSubtype_buffer = result.value;
        
        return result;
    }

    protected override isQueryGraphNodeHighlighted(): boolean {
        return !this.isStrutcturalSubtype_buffer;
    }
}