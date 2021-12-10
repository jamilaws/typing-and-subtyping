import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Graph, Node } from "../graph";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";

export class Identifier extends AstNode {
    protected nodeType: NodeType = NodeType.Identifier;

    public value: string; // e.g. main, ...

    private type: AbstractType_ = null;

    constructor(codeLine: number, value: string){
        super(codeLine);
        this.value = value;
    }

    public getName(): string {
        return this.value;
    }

    public getGraph(): Graph<AstNode> {
        const newNode = this.getGraphNode();
        return new Graph([newNode], []);
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.nodeType + " " + this.value;
    }
    
    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        const type = t.getTypeOfIdentifier(this.value);
        if (!type) throw new Error("Found undeclared identifier: " + this.value);
        return this.type = type;
    }

    public getType(): AbstractType_ {
        return this.type;
    }

}