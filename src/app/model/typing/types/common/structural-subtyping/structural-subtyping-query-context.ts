import { AbstractType } from "../../abstract-type";
import { StructuralSubtypingQuery } from "./structural-subtyping-query";
import { StructuralSubtypingQueryResult } from "./structural-subtyping-query-result";

export interface StructuralSubtypingQueryContext {
    typeDefinitions: Map<string, AbstractType>;
    queryHistory: StructuralSubtypingQuery[];
}