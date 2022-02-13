import { TypeEnvironment } from "src/app/model/typing/type-environment";
import { AstNode } from "../../ast-node";
import { Graph } from 'src/app/model/common/graph/_module';
import { AbstractTypeExpression } from "./abstract-type-expression";

import { AbstractType as AbstractType_, AliasPlaceholderType } from "src/app/model/typing/types/abstract-type";
import { TypingTree } from "src/app/model/typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "src/app/model/typing/typing-tree/typing-tree-node-label";

export class AliasTypeExpression extends AbstractTypeExpression {

    public name:string;

    constructor(codeLine: number, name: string) {
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
        const targetType = t.getTypeForAlias(this.name);
        return this.type = new AliasPlaceholderType(this.name);
    }

    public getType(): AbstractType_ {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        return new TypingTree(TypingTreeNodeLabel.APP, "Method not implemented.", "TODO");
    }
}