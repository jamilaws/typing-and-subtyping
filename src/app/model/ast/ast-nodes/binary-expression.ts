import { AstNode } from "../ast-node";
import { Edge, Graph } from "../../common/graph/_module";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { TypeError } from "../../typing/type-error";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";
import { StructuralSubtypingQuery } from "../../typing/types/common/structural-subtyping/structural-subtyping-query";

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

    // Buffer written in 'performTypeCheck' / read in 'getTypingTree'
    private subtypingQueryBuffer: StructuralSubtypingQuery = null;

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
     * In case of left and right operator are of different type (even if they are in a subtype relation of either direction), the type of this
     * AST-Node is ambiguously. This method handles this circumstance by returning the type of the first operand.
     * @param t 
     * @returns 
     */
    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        const t_1 = this.left.performTypeCheck(t);
        const t_2 = this.right.performTypeCheck(t);

        const typedefs = t.getTypeDefinitions();

        if (this.operator === BinaryOperator.EQ) {
            const subtypingResult = t_2.isStrutcturalSubtypeOf(t_1, typedefs);
            this.subtypingQueryBuffer = subtypingResult.queryGraph.getGraph().getRoot().getData().query; // TODO: Write method for this!
            if (!subtypingResult.value){
                const msg = `Cannot assign value of type ${t_2.toString()} to ${t_1.toString()}`;
                return this.failTypeCheck(msg, t_1);
            } else {
                return this.type = t_1;
            }
        } else {
            if (!t_1.isStrutcturalSubtypeOf(t_2, typedefs).value && !t_2.isStrutcturalSubtypeOf(t_1, typedefs).value){
                const msg = `Cannot apply operator '${this.operator}' on values of types ${t_1.toString()} and ${t_2.toString()}`;
                return this.failTypeCheck(msg, t_1);
            } else {
                return this.type = t_1;
            }
        }
    }

    public getType(): AbstractType_ {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        const left = this.left.getTypingTree();
        const right = this.right.getTypingTree();

        let subtypingQueryBuffer = null;
        if(this.subtypingQueryBuffer){
            subtypingQueryBuffer = this.subtypingQueryBuffer;
            this.subtypingQueryBuffer = null; // Consume buffer
        }

        return new TypingTree(TypingTreeNodeLabel.OP, this, [left, right], subtypingQueryBuffer);
    }

}