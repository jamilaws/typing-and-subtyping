import { AbstractType } from "../abstract-type";
import { CdeclHalves } from "./cdecl-halves";
import { StructuralSubtypingQueryContext } from "./structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryGraph } from "./structural-subtyping/structural-subtyping-query-graph";
import { StructuralSubtypingQueryResult } from "./structural-subtyping/structural-subtyping-query-result";

/**
 * Type placeholder for e.g. if-statements
 * TODO: Clearify if other approach (e.g. using VoidType instead) is more suitable. Better: Refactor to "Expression" superclass
 */
export class NoTypePlaceholder extends AbstractType {

    private token: string = "No Type."
    
    // DEPRECATED
    // public toString(): string {
    //     return "No Type.";
    // }

    public toCdeclCImpl(): CdeclHalves {
        return {
            left: "",
            right: "",
            type: this.token
        }
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