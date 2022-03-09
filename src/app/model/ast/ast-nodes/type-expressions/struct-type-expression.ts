import { TypeEnvironment } from "src/app/model/typing/type-environment";
import { AstNode } from "../../ast-node";
import { Graph } from 'src/app/model/common/graph/_module';
import { AbstractTypeExpression } from "./abstract-type-expression";

import { AbstractType } from "src/app/model/typing/types/abstract-type";
import { TypingTree } from "src/app/model/typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "src/app/model/typing/typing-tree/typing-tree-node-label";

export class StructTypeExpression extends AbstractTypeExpression {

    public name: string;

    constructor(codeLine: number, name: string) {
        super(codeLine);
        this.name = name;
    }

    public getCode(): string {
        return `struct ${this.name}`;
    }

    public getGraph(): Graph<AstNode> {
        return new Graph([this.getGraphNode()], [])
    }

    // @Override
    public getGraphNodeLabel(): string {
        return `struct ${this.name}`;
    }

    public performTypeCheck(t: TypeEnvironment): AbstractType {
        //return this.type = t.getTypeOfIdentifier(this.name);
        return this.type = t.getTypeForAlias(this.name);
    }

    public getType(): AbstractType {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        throw new Error("Method not implemented.");
    }
}