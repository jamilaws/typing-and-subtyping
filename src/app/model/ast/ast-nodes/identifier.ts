import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Graph, Node } from "../graph";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";

export class Identifier extends AstNode {
    protected type: NodeType = NodeType.Identifier;

    public value: string; // e.g. main, ...

    constructor(codeLine: number, value: string){
        super(codeLine);
        this.value = value;
    }

    public getGraph(): Graph<AstNode> {
        const newNode = this.getGraphNode();
        return new Graph([newNode], []);
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.type + " " + this.value;
    }
    
    public checkType(t: TypeEnvironment): AbstractType_ {
        const type = t.getTypeOfIdentifier(this.value);
        if (!type) throw new Error("Found undeclared identifier: " + this.value);
        return type;
    }

}