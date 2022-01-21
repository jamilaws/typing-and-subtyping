import { TypingTree } from "./typing-tree";
import { TypingTreeNodeLabel } from "./typing-tree-node-label";

const TYPE_LABEL: string = "ERROR";

export class ErrorTypingTree extends TypingTree {
    constructor(label: TypingTreeNodeLabel, expressionText: string){
        //const dummyLeaf = new TypingTree();
        super(label, expressionText, TYPE_LABEL, []);
    }
}