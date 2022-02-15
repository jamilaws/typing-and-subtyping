import { AbstractType, otherAliasReplaced } from "./abstract-type";
import { StructuralSubtypingQueryContext } from "./common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryResult } from "./common/structural-subtyping/structural-subtyping-query-result";

export abstract class BaseType extends AbstractType {

    protected abstract superTypes: (typeof BaseType)[];

    protected isStrutcturalSubtype_buffer: boolean = null;

    // Only override this method to remember its output in subclasses
    @otherAliasReplaced()
    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        let result = super.isStrutcturalSubtypeOf_Impl(other, context);

        result.value = result.value || this.superTypes.some(st => other instanceof st);

        // Store value in buffer for 'isQueryGraphNodeHighlighted' method
        this.isStrutcturalSubtype_buffer = result.value;
        
        return result;
    }

    protected override isQueryGraphNodeHighlighted(): boolean {
        if(this.isStrutcturalSubtype_buffer === null) throw new Error("Must call isStrutcturalSubtypeOf before query graph can be built");
        return !this.isStrutcturalSubtype_buffer;
    }

}
