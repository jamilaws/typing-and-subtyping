import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Graph, Node } from "../graph";

// TODO Really needed? 
export class Identifier extends AstNode {
    protected type: NodeType = NodeType.Identifier;

    public value: string; // e.g. main, ...

    constructor(value: string){
        super();
        this.value = value;
    }

    public getGraph(): Graph<string> {
        const newNode = this.getGraphNode();
        return new Graph([newNode], []);
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.type + " " + this.value;
    }
}