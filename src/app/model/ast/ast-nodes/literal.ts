import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Graph } from "../graph";

export class Literal extends AstNode {
    protected type: NodeType = NodeType.Literal;

    value: string; // e.g. 1, "Hello World", true, ...

    constructor(value: string){
        super();
        this.value = value;
    }

    public getGraph(): Graph<string> {
        return new Graph([this.getGraphNode()], []);
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.type + " " + this.value;
    }
}