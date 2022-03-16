import { AstNode } from "../ast-node";
import { Edge, Graph } from "../../common/graph/_module";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { TypeError } from "../../typing/type-error";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";
import { StructuralSubtypingQuery } from "../../typing/types/common/structural-subtyping/structural-subtyping-query";

/**
 * NOTE: 
 * Update method 'validateOperator' in class 'BinaryExpression' whenevery this enum is changed!
 */
export enum BinaryOperator {
    PLUS = '+',
    MINUS = '-',
    MUL = '*',
    DIV = '/',
    EQ = '=',
    
    //ARROW = "->",
    //DOT = "."
}

export class BinaryExpression extends AstNode {

    public operator: BinaryOperator;
    public left: AstNode;
    public right: AstNode;

    // Buffer written in 'performTypeCheck' / read in 'getTypingTree'
    private subtypingQueryBuffer: StructuralSubtypingQuery[] = null;

    constructor(codeLine: number, operator: BinaryOperator, left: AstNode, right: AstNode) {
        super(codeLine);
        this.validateOperator(operator);
        this.operator = operator;
        this.left = left;
        this.right = right;
    }

    private validateOperator(operator: BinaryOperator): void {
        let fail: boolean = true;
        
        if(operator === BinaryOperator.PLUS) fail = false;
        if(operator === BinaryOperator.MINUS) fail = false;
        if(operator === BinaryOperator.MUL) fail = false;
        if(operator === BinaryOperator.DIV) fail = false;
        if(operator === BinaryOperator.EQ) fail = false;

        if(fail) throw new Error("Invalid binary operator " + operator);
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
        const leftType = this.left.performTypeCheck(t);
        const rightType = this.right.performTypeCheck(t);

        const typedefs = t.getTypeDefinitions();

        if (this.operator === BinaryOperator.EQ) {
            const subtypingResult = rightType.isStrutcturalSubtypeOf(leftType, typedefs);

            this.subtypingQueryBuffer = [subtypingResult.getQuery()];

            if (!subtypingResult.value) {
                const msg = `Cannot assign value of type ${rightType.toString()} to ${leftType.toString()}`;
                return this.failTypeCheck(msg, leftType);
            } else {
                return this.type = leftType;
            }
        } else {
            const subtypingResult1 = leftType.isStrutcturalSubtypeOf(rightType, typedefs);
            const subtypingResult2 = rightType.isStrutcturalSubtypeOf(leftType, typedefs);

            this.subtypingQueryBuffer = [
                subtypingResult1.getQuery(),
                subtypingResult2.getQuery(),
            ];

            if (!subtypingResult1.value && !subtypingResult2.value) {
                const msg = `Cannot apply operator '${this.operator}' on values of types ${leftType.toString()} and ${rightType.toString()}`;
                return this.failTypeCheck(msg, leftType);
            } else {
                return this.type = leftType;
            }
        }
    }

    public getType(): AbstractType_ {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        const left = this.left.getTypingTree();
        const right = this.right.getTypingTree();

        let subtypingQueryBuffer = this.subtypingQueryBuffer; // Could be null
        this.subtypingQueryBuffer = null; // Consume buffer

        return new TypingTree(TypingTreeNodeLabel.OP, this, [left, right], subtypingQueryBuffer);
    }

}