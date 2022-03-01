import { AbstractType, otherAliasReplaced } from "./abstract-type";
import { StructuralSubtypingQueryContext } from "./common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryGraph } from "./common/structural-subtyping/structural-subtyping-query-graph";
import { StructuralSubtypingQueryResult } from "./common/structural-subtyping/structural-subtyping-query-result";

export abstract class BaseType extends AbstractType {

    /**
     * Set of predefined subtypes
     */
    protected abstract superTypes: (typeof BaseType)[];

    protected isStrutcturalSubtype_buffer: boolean = null;

    protected performStructuralSubtypingCheck_step_realSubtypingRelation(other: AbstractType, context: StructuralSubtypingQueryContext): boolean {
        return this.superTypes.some(st => other instanceof st);
    }
    
    protected buildQueryGraph_step_extendGraph(graph: StructuralSubtypingQueryGraph): StructuralSubtypingQueryGraph {
        return graph;
    }

    protected override isQueryGraphNodeHighlighted(): boolean {
        return this.structuralSubtypingBuffer.result === false;
    }

}
