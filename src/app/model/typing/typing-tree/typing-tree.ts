import { AstNode } from "../../ast/ast-node";
import { StructuralSubtypingQuery } from "../types/common/structural-subtyping/structural-subtyping-query";
import { TypingTreeNodeLabel } from "./typing-tree-node-label";

export class TypingTree {

    public static nodeTextPrefix = "Γ ⊢ ";

    public node: AstNode;

    public label: TypingTreeNodeLabel;
    public text: string;
    public children: TypingTree[];

    // Possibility to store a StructuralSubtypingQuery; null if not necessary
    public structuralSubtypingQuery: StructuralSubtypingQuery;

    /**
     * 
     * @param label label below the separation line
     * @param children no children (--> leaf node) by default
     */
    constructor(label: TypingTreeNodeLabel, node: AstNode, children: TypingTree[] = [], structuralSubtypingQuery: StructuralSubtypingQuery = null) {
        this.node = node;
        
        this.label = label;
        this.text = TypingTree.nodeTextPrefix + node.getCode() + " : " + node.getType().toString();
        this.children = children;

        this.structuralSubtypingQuery = structuralSubtypingQuery;
    }

    public getRelativeSizeOfChild(index: number): number {
        return this.children[index].getSize() / this.getSize() * 100;
    }

    public getSize(): number {
        return Math.max(1, this.children.reduce((acc, curr) => acc + curr.getSize(), 0));
    }
}