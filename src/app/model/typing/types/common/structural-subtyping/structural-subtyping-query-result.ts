import { Graph, Node } from 'src/app/model/common/graph/_module';
import { StructuralSubtypingQuery } from "./structural-subtyping-query";

// TODO
export enum StructuralSubtypingQueryResultMessage {
    OK = "OK",
    QUERY_LOOP = "QUERY_LOOP",
    TYPE_MISSMATCH = "TYPE_MISSMATCH",
};

export interface StructuralSubtypingQueryResult {
    value: boolean;
    //message?: StructuralSubtypingQueryResultMessage;
    queryGraph?: Graph<StructuralSubtypingQuery, string>;
}