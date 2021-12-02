import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Graph } from "../graph";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";

export class Literal extends AstNode {
    protected type: NodeType = NodeType.Literal;

    value: string; // e.g. 1, "Hello World", true, ...

    constructor(codeLine: number, value: string){
        super(codeLine);
        this.value = value;
    }

    public getGraph(): Graph<AstNode> {
        return new Graph([this.getGraphNode()], []);
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.type + " " + this.value;
    }
    
    public checkType(t: TypeEnvironment): AbstractType_ {
        return t.getTypeOfConstant(this.value);
    }
}