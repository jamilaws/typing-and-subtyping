import { TypeError } from "../../type-error";
import { AbstractType, StructuralSubtypingBufferFrame } from "../abstract-type";
import { CdeclHalves } from "../common/cdecl-halves";
import { StructuralSubtypingQueryContext } from "../common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryGraph } from "../common/structural-subtyping/structural-subtyping-query-graph";

export class TypeErrorPlaceholderType extends AbstractType {

    private error: TypeError;
    
    constructor(error: TypeError) {
        super();
        this.error = error;
    }

    public toCdeclCImpl(): CdeclHalves {
        return {
            left: "",
            right: "",
            type: this.error.message
        };
    }

    public toCdeclEnglish(): string {
        throw new Error('Method not implemented.');
    }

    protected performStructuralSubtypingCheck_step_checkRealSubtypingRelation(other: AbstractType, context: StructuralSubtypingQueryContext): boolean {
        throw new Error("Unexpected method call.");
    }
    
    protected buildQueryGraph_step_extendGraph(graph: StructuralSubtypingQueryGraph): StructuralSubtypingQueryGraph {
        throw new Error("Unexpected method call.");
    }
}