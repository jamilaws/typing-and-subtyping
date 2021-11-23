import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";

export class ReturnStatement extends AstNode {
    protected type: NodeType = NodeType.ReturnStatement;

    public value: AstNode;

    constructor(value: AstNode) {
        super();
        this.value = value;
    }

    public getGraph(): Graph<string> {
        let valueGraph = this.value.getGraph();

        let newNode = this.getGraphNode();
        let newEdge = new Edge(newNode, this.value.getGraphNode());

        return new Graph([newNode], [newEdge]).merge(valueGraph);
    }
}