import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { AbstractTypeExpression } from "./type-expressions/abstract-type-expression";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";


// TODO: Clearify!

// e.g. function parameter, struct member
export class ExpressionStatement extends AstNode {
    public expression: AbstractTypeExpression;

    constructor(codeLine: number, expression: AbstractTypeExpression){
        super(codeLine);
        this.expression = expression;
    }

    public getCode(): string {
        return this.expression.getCode();
    }

    public getGraphNodeLabel(): string {
        return "Expression"; // TODO?
    }

    public getGraph(): Graph<AstNode> {
        let graph = this.expression.getGraph();
        let newNode = this.getGraphNode();
        return new Graph([newNode], [new Edge(newNode, this.expression.getGraphNode())]).merge(graph); 
    }

    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        return this.type = this.expression.performTypeCheck(t);
    }

    public getType(): AbstractType_ {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        return new TypingTree(TypingTreeNodeLabel.APP, "Method not implemented.", "TODO");
    }
    
}