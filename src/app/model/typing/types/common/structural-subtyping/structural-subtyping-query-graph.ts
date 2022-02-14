import { Graph } from "src/app/model/common/graph/_module";
import { StructuralSubtypingQuery } from "./structural-subtyping-query";


export interface QueryGraphNodeData {
    query: StructuralSubtypingQuery;
    highlight: boolean;
};

export type StructuralSubtypingQueryGraph = Graph<QueryGraphNodeData, string>;