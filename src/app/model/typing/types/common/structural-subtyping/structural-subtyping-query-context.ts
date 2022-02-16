import { AbstractType } from "../../abstract-type";
import { StructuralSubtypingQuery } from "./structural-subtyping-query";

export interface StructuralSubtypingQueryContext {
    typeDefinitions: Map<string, AbstractType>;
    queryHistory: StructuralSubtypingQuery[];
}