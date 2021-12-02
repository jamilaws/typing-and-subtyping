import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";

export class ReturnStatement extends AstNode {
    protected type: NodeType = NodeType.ReturnStatement;

    public value: AstNode;

    constructor(codeLine: number, value: AstNode) {
        super(codeLine);
        this.value = value;
    }

    public getGraph(): Graph<AstNode> {
        let valueGraph = this.value.getGraph();

        let newNode = this.getGraphNode();
        let newEdge = new Edge(newNode, this.value.getGraphNode());

        return new Graph([newNode], [newEdge]).merge(valueGraph);
    }
    
    public checkType(t: TypeEnvironment): AbstractType_ {
        throw new Error("Not implemented yet.");
    }

}