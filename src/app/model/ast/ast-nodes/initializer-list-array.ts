import { AstNode } from "../ast-node";
import { Edge, Graph } from "../../common/graph/_module";


import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";
import { PointerType } from "../../typing/types/type-constructors/pointer-type";

/**
 * e.g. {1, 2, 3}
 */
export class InitializerListArray extends AstNode {

    private children: AstNode[];

    constructor(codeLine: number, children: AstNode[]) {
        super(codeLine);
        this.children = children;
        if(children.length === 0) throw new Error("Empty InitializerList not implemented yet.");     
    }

    public getCode(): string {
        return "{" + this.children.map(c => c.getCode()).join(", ") + "}"; 
    }

    public getGraph(): Graph<AstNode> {
        const childGraphs = this.children.map(m => m.getGraph());

        const newNode = this.getGraphNode();
        const newEdges = this.children.map(m => { return new Edge(newNode, m.getGraphNode()); });

        return new Graph([newNode], newEdges).merge(childGraphs.reduce((acc, curr) => acc.merge(curr), new Graph([], [])));
    }

    // @Override
    public getGraphNodeLabel(): string {
        return "{}";
    }
    
    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        const baseType = this.children[0].performTypeCheck(t);
        // TODO: Check all children and throw error if needed.
        // TODO: Handle case with this.children.length === 0
        return this.type = new PointerType(baseType);
    }

    public getType(): AbstractType_ {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        return new TypingTree(TypingTreeNodeLabel.APP, "Method not implemented.", "TODO");
    }
}