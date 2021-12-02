import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";

export enum BinaryOperator {
    '+',
    '-',
    '*',
    '/',
    '='
    // TODO ...
}

export class BinaryExpression extends AstNode {
    protected type: NodeType = NodeType.BinaryExpression;

    public operator: BinaryOperator;
    public left: AstNode;
    public right: AstNode;

    constructor(codeLine: number, operator: BinaryOperator, left: AstNode, right: AstNode) {
        super(codeLine);
        this.operator = operator;
        this.left = left;
        this.right = right;
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
        return this.type + " " + this.operator;
    }

    public checkType(t: TypeEnvironment): AbstractType_ {

        const t_1 = this.left.checkType(t);
        const t_2 = this.right.checkType(t);

        if(this.operator === BinaryOperator["="]){
            // TODO: Check 't_2 can be converted into t_1'
            return t_1;
        } else {
            // TODO: Check 't_2' === 't_1'
            return t_1;
        }
    }

}