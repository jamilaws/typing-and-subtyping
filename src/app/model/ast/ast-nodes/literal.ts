import { AstNode } from "../ast-node";
import { Graph } from "../../common/graph/_module";


import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";

/**
 * TODO: Handle literals for type struct
 */
export class Literal extends AstNode {

    value: string; // e.g. 1, "Hello World", ...

    constructor(codeLine: number, value: string) {
        super(codeLine);
        this.value = value;                
    }

    public getCode(): string {
        return this.value;
    }

    public getGraphNodeLabel(): string {
        return this.value;
    }

    public getGraph(): Graph<AstNode> {
        return new Graph([this.getGraphNode()], []);
    }
    
    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        this.type = t.getTypeOfConstant(this.value);
        return this.type;
    }

    public getType(): AbstractType_ {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        return new TypingTree(TypingTreeNodeLabel.CONST, this);
    }
}