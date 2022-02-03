import { AstNode } from "../ast-node";
import { Edge, Graph } from "../graph";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { TypeError } from "../../typing/type-error";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";

export enum BinaryOperator {
    PLUS = '+',
    MINUS = '-',
    MUL = '*',
    DIV = '/',
    EQ = '=',
    ARROW = "->",
    DOT = "."
    // TODO ...
}

export class BinaryExpression extends AstNode {

    public operator: BinaryOperator;
    public left: AstNode;
    public right: AstNode;

    constructor(codeLine: number, operator: BinaryOperator, left: AstNode, right: AstNode) {
        super(codeLine);

        this.operator = operator;
        this.left = left;
        this.right = right;
    }

    public getCode(): string {
        return `${this.left.getCode()} ${this.operator} ${this.right.getCode()}`;
    }

    public getGraph(): Graph<AstNode> {
        let leftGraph = this.left.getGraph();
        let rightGraph = this.right.getGraph();

        const newNode = this.getGraphNode();
        const newEdges = [
            new Edge(newNode, this.left.getGraphNode()),
            new Edge(newNode, this.right.getGraphNode())
        ];

        return new Graph([newNode], newEdges)
            .merge(leftGraph)
            .merge(rightGraph);
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.operator;
    }

    /**
     * TODO: SUBTYPING
     */
    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        const t_1 = this.left.performTypeCheck(t);
        const t_2 = this.right.performTypeCheck(t);

        console.log("t1: " + t_1.toString());
        console.log("t1: " + t_2.toString());


        if (this.operator === BinaryOperator.EQ) {
            // TODO: Suptyping! - Check 't_2 can be converted into t_1'
            if (!t_1.equals(t_2)) throw new TypeError(`Cannot apply operator '${this.operator}' on values of types ${t_1.toString()} and ${t_2.toString()}`);
            return this.type = t_1;
        } else {
            if (!t_1.equals(t_2)) throw new TypeError(`Cannot apply operator '${this.operator}' on values of types ${t_1.toString()} and ${t_2.toString()}`);
            return this.type = t_1;
        }
    }

    public getType(): AbstractType_ {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        const left = this.left.getTypingTree();
        const right = this.right.getTypingTree();
        return new TypingTree(TypingTreeNodeLabel.OP, this.getCode(), this.type.toString(), [left, right]);
    }

}