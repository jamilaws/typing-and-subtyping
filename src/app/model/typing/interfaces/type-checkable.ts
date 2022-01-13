import { TypeEnvironment } from "../type-environment";
import { AbstractType } from "../types/abstract-type";
import { TypingTree } from "../typing-tree/typing-tree";

export interface TypeCheckable {
    performTypeCheck(t: TypeEnvironment): AbstractType;
    getType(): AbstractType;
    getTypingTree(): TypingTree;
}