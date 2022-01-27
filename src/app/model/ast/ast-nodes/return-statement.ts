import { AstNode } from "../ast-node";
import { Edge, Graph } from "../graph";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";

export class ReturnStatement extends AstNode {

    public value: AstNode;

    constructor(codeLine: number, value: AstNode) {
        super(codeLine);
        this.value = value;
    }

    public getCode(): string {
        throw new Error("Not implemented yet.");
    }

    public getGraphNodeLabel(): string {
        return "return";
    }

    public getGraph(): Graph<AstNode> {
        let valueGraph = this.value.getGraph();

        let newNode = this.getGraphNode();
        let newEdge = new Edge(newNode, this.value.getGraphNode());

        return new Graph([newNode], [newEdge]).merge(valueGraph);
    }
    
    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        return this.type = this.value.performTypeCheck(t);
    }

    public getType(): AbstractType_ {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        return new TypingTree(TypingTreeNodeLabel.APP, "Method not implemented.", "TODO");
    }

}