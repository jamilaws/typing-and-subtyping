import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";

export class IndexExpression extends AstNode {
    protected type: NodeType = NodeType.IndexExpression;

    public value: AstNode;
    public index: AstNode; 

    constructor(value: AstNode, index: AstNode){
        super();
        this.value = value;
        this.index = index;
    }

    public getGraph(): Graph<string> {
        const valueGraph = this.value.getGraph();
        const indexGraph = this.index.getGraph();

        const newNode = this.getGraphNode();
        const edges = [new Edge(newNode, this.value.getGraphNode()), new Edge(newNode, this.index.getGraphNode())];


        return new Graph([newNode], edges).merge(valueGraph).merge(indexGraph);
    }
}