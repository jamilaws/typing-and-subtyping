import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { Definition } from "./definition";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";

export class StructDefinition extends AstNode {
    protected type: NodeType = NodeType.StructDefinition;

    name: string;
    member: Definition[];

    constructor(codeLine: number, name: string, member: Definition[]){
        super(codeLine);
        this.name = name;
        this.member = member;
        
    }

    public getGraph(): Graph<AstNode> {
        const memberGraphs = this.member.map(m => m.getGraph());

        const newNode = this.getGraphNode();
        const newEdges = this.member.map(m => { return new Edge(newNode, m.getGraphNode()); });

        return new Graph([newNode], newEdges).merge(memberGraphs.reduce((acc, curr) => acc.merge(curr), new Graph([], [])));
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.type + " " + this.name;
    }
    
    public checkType(t: TypeEnvironment): AbstractType_ {
        throw new Error("Not implemented yet.");
    }
}