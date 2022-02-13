import { Graph, Node } from 'src/app/model/common/graph/_module';
import { StructuralSubtypingQuery } from "./structural-subtyping-query";

export interface StructuralSubtypingQueryResult {
    value: boolean;
    queryGraphRoot?: Node<StructuralSubtypingQuery>;
    queryGraph?: Graph<StructuralSubtypingQuery, string>;
}