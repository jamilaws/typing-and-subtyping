import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { AbstractType } from "./type/abstract-type";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";

// e.g. function parameter, struct member
export class Definition extends AstNode {
    protected type: NodeType = NodeType.Definition;

    public defType: AbstractType;
    public name: string;

    constructor(codeLine: number, defType: AbstractType, name: string){
        super(codeLine);
        this.defType = defType;
        this.name = name;
    }

    public getGraph(): Graph<AstNode> {
        let graph = this.defType.getGraph();
        let newNode = this.getGraphNode();
        let addition = new Graph([newNode], [new Edge(newNode, this.defType.getGraphNode())]); 
        return graph.merge(addition);
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.type + " " + this.name;
    }

    public checkType(t: TypeEnvironment): AbstractType_ {
        throw new Error("Not implemented yet.");
    }

}