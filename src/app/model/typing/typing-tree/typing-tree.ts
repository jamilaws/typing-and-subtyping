import { TypingTreeNodeLabel } from "./typing-tree-node-label";

export class TypingTree {

    public static nodeTextPrefix = "Γ ⊢ ";

    label: TypingTreeNodeLabel;
    text: string;
    children: TypingTree[];

    /**
     * 
     * @param label label below the separation line
     * @param children no children (--> leaf node) by default
     */
    constructor(label: TypingTreeNodeLabel, expressionText: string, typeText: string, children: TypingTree[] = []) {
        this.label = label;
        this.text = TypingTree.nodeTextPrefix + expressionText + " : " + typeText;
        this.children = children;
    }

    public getRelativeSizeOfChild(index: number): number {
        return this.children[index].getSize() / this.getSize() * 100;
    }

    public getSize(): number {
        return Math.max(1, this.children.reduce((acc, curr) => acc + curr.getSize(), 0));
    }
}