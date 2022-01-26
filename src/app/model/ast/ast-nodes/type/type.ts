import { TypeEnvironment } from "src/app/model/typing/type-environment";
import { AstNode, NodeType } from "../../abstract-syntax-tree";
import { Graph, Node } from "../../graph";
import { AbstractType } from "./abstract-type";

import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { CharType } from "src/app/model/typing/types/base-types/char-type";
import { FloatType } from "src/app/model/typing/types/base-types/float-type";
import { IntType } from "src/app/model/typing/types/base-types/int-type";
import { VoidType } from "src/app/model/typing/types/base-types/void-type";
import { TypingTree } from "src/app/model/typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "src/app/model/typing/typing-tree/typing-tree-node-label";

// Rafactor: rename enum and move to typing subsystem
export enum TypeName {
    char = "char", float = "float", int = "int", void = "void" // TODO ...
}
export class Type extends AbstractType {
    public name: TypeName; //TODO: clearify 'modifier', e.g. if you add 'struct ' as prefix in function arg

    constructor(codeLine: number, name: TypeName) {
        super(codeLine);
        this.name = name;
    }

    public getCode(): string {
        return this.name;
    }

    public getGraph(): Graph<AstNode> {
        return new Graph([this.getGraphNode()], [])
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.name;
    }

    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        switch(this.name) {
            case TypeName.char:
                this.type = new CharType();
                break;
            case TypeName.float:
                this.type = new FloatType();
                break;
            case TypeName.int:
                this.type = new IntType();
                break;
            case TypeName.void:
                this.type = new VoidType();
                break;
            default: throw new Error("Unexpected: Found invalid type name ast node type");
        }

        return this.type;
    }

    public getType(): AbstractType_ {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        return new TypingTree(TypingTreeNodeLabel.APP, "Method not implemented.", "TODO");
    }
}