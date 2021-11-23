import { AstNode, NodeType } from "../../abstract-syntax-tree";
import { Edge, Graph } from "../../graph";
import { AbstractType } from "./abstract-type";
import { Type } from "./type";

// e.g. char*, int[], ...
export class PointerType extends AbstractType {
    protected type: NodeType = NodeType.PointerType;

    public target: Type;

    constructor(target: Type) {
        super();
        this.target = target;
    }

    public getGraph(): Graph<string> {
        let graph = this.target.getGraph();

        let newNode = this.getGraphNode();
        let newEdge = new Edge(newNode, this.target.getGraphNode());
        
        return new Graph([newNode], [newEdge]).merge(graph);
    }
}