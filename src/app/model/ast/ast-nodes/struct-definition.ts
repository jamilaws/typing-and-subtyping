import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { Definition } from "./definition";

export class StructDefinition extends AstNode {
    protected type: NodeType = NodeType.StructDefinition;

    name: string;
    member: Definition[];

    constructor(name: string, member: Definition[]){
        super();
        this.name = name;
        this.member = member;
        
    }

    public getGraph(): Graph<string> {
        const memberGraphs = this.member.map(m => m.getGraph());

        const newNode = this.getGraphNode();
        const newEdges = this.member.map(m => { return new Edge(newNode, m.getGraphNode()); });

        return new Graph([newNode], newEdges).merge(memberGraphs.reduce((acc, curr) => acc.merge(curr), new Graph([], [])));
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.type + " " + this.name;
    }
}