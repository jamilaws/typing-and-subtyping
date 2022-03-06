import { AbstractType } from "../abstract-type";
import { StructuralSubtypingQueryContext } from "../common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryGraph } from "../common/structural-subtyping/structural-subtyping-query-graph";

export class NotVisitedPlaceholderType extends AbstractType {
    
    public toString(): string {
        return "t";
    }

    public toCdeclEnglish(): string {
        throw new Error('Method not implemented.');
    }

    protected performStructuralSubtypingCheck_step_realSubtypingRelation(other: AbstractType, context: StructuralSubtypingQueryContext): boolean {
        throw new Error("Unexpected method call.");
    }
    
    protected buildQueryGraph_step_extendGraph(graph: StructuralSubtypingQueryGraph): StructuralSubtypingQueryGraph {
        throw new Error("Unexpected method call.");
    }
}