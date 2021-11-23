import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { AbstractType } from "./type/abstract-type";

// e.g. function parameter, struct member
export class Definition extends AstNode {
    protected type: NodeType = NodeType.Definition;

    public defType: AbstractType;
    public name: string;

    constructor(defType: AbstractType, name: string){
        super();
        this.defType = defType;
        this.name = name;
    }

    public getGraph(): Graph<string> {
        let graph = this.defType.getGraph();
        let newNode = this.getGraphNode();
        let addition = new Graph([newNode], [new Edge(newNode, this.defType.getGraphNode())]); 
        return graph.merge(addition);
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.type + " " + this.name;
    }

}