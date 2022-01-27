import { TypeCheckable } from "../typing/interfaces/type-checkable";
import { TypeEnvironment } from "../typing/type-environment";
import { AbstractType } from "../typing/types/abstract-type";
import { NoTypePlaceholder } from "../typing/types/common/no-type-placeholder";
import { TypingTree } from "../typing/typing-tree/typing-tree";
import { AstNode } from "./ast-node";
import { Graph } from "./graph";

export class AbstractSyntaxTree implements TypeCheckable {
    private roots: AstNode[];

    private type: AbstractType;

    constructor(roots: AstNode[]) {
        this.roots = roots;
    }

    public getRoots(): AstNode[] {
        return this.roots;
    }

    public getGraph(): Graph<AstNode> {
        return this.roots.map(e => e.getGraph()).reduce((acc, curr) => acc.merge(curr), new Graph([], []));
    }

    public performTypeCheck(t: TypeEnvironment): AbstractType {
        this.roots.forEach(e => e.performTypeCheck(t));
        return this.type = new NoTypePlaceholder();
    }

    public getType(): AbstractType {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        // TODO: Do not throw an error. Think of sensible implementation instead.
        throw new Error("Method getTypingTree() of AbstractSyntaxTree object has been called, what is not expected. Call the method on an AstNode instance instead.");
    }
}