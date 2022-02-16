import { AbstractType } from "./types/abstract-type";

export interface TypeDefinitionTableUiData {
    alias: string;
    type: string;
}

export type TypeDefinitionTable = Map<string, AbstractType>;