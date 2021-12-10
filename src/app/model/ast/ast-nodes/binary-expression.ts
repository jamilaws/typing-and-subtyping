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
    protected nodeType: NodeType = NodeType.BinaryExpression;

    public operator: BinaryOperator;
    public left: AstNode;
    public right: AstNode;

    private type: AbstractType_ = null;

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
        return this.nodeType + " " + this.operator;
    }

    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        const t_1 = this.left.performTypeCheck(t);
        const t_2 = this.right.performTypeCheck(t);

        if(this.operator === BinaryOperator["="]){
            // TODO: Check 't_2 can be converted into t_1'
            return this.type = t_1;
        } else {
            // TODO: Check 't_2' === 't_1'
            return this.type = t_1;
        }
    }

    public getType(): AbstractType_ {
        return this.type;
    }

}