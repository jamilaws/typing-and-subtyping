import { AstNode } from "../ast-node";
import { Graph, Node } from "../graph";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";

export class Identifier extends AstNode {

    public value: string; // e.g. main, ...

    constructor(codeLine: number, value: string){
        super(codeLine);
        this.value = value;
    }

    public getCode(): string {
        return this.value;
    }

    public getName(): string {
        return this.value;
    }

    public getGraphNodeLabel(): string {
        return this.value;
    }

    public getGraph(): Graph<AstNode> {
        const newNode = this.getGraphNode();
        return new Graph([newNode], []);
    }
    
    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        const type = t.getTypeOfIdentifier(this.value);
        if (!type) throw new Error("Found undeclared identifier: " + this.value);
        
        return this.type = type;
    }

    public getType(): AbstractType_ {
        return this.type;
    }

    public getTypingTree(): TypingTree {      
        return new TypingTree(TypingTreeNodeLabel.VAR, this.getCode(), this.getType().toString());
    }

}