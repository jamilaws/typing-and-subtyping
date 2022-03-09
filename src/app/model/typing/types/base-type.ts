import { AbstractType, StructuralSubtypingBufferFrame } from "./abstract-type";
import { CdeclHalves } from "./common/cdecl-halves";
import { StructuralSubtypingQueryContext } from "./common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryGraph } from "./common/structural-subtyping/structural-subtyping-query-graph";
import { StructuralSubtypingQueryResult } from "./common/structural-subtyping/structural-subtyping-query-result";

export abstract class BaseType extends AbstractType {

    protected abstract token: string;

    /**
     * Set of predefined subtypes
     */
    protected abstract superTypes: (typeof BaseType)[];

    protected isStrutcturalSubtype_buffer: boolean = null;

    protected performStructuralSubtypingCheck_step_checkRealSubtypingRelation(other: AbstractType, context: StructuralSubtypingQueryContext): boolean {
        return this.superTypes.some(st => other instanceof st);
    }
    
    protected buildQueryGraph_step_extendGraph(graph: StructuralSubtypingQueryGraph, bufferFrame: StructuralSubtypingBufferFrame): StructuralSubtypingQueryGraph {
        return graph;
    }

    protected override isQueryGraphNodeHighlighted(bufferFrame: StructuralSubtypingBufferFrame): boolean {
        return bufferFrame.result === false; // TODO: Check if frame is still correct
    }

    public override toCdeclCImpl(): CdeclHalves {
        return {
            left: "",
            right: "",
            type: this.token
        };
    }

    public toCdeclEnglish(): string {
        return this.token;
    }

}
