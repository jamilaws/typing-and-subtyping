import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { AbstractType } from "./type/abstract-type";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";

// e.g. function parameter, struct member
export class ExpressionStatement extends AstNode {
    protected type: NodeType = NodeType.ExpressionStatement;

    public expression: AbstractType;

    constructor(codeLine: number, expression: AbstractType){
        super(codeLine);
        this.expression = expression;
    }

    public getGraph(): Graph<AstNode> {
        let graph = this.expression.getGraph();
        let newNode = this.getGraphNode();
        return new Graph([newNode], [new Edge(newNode, this.expression.getGraphNode())]).merge(graph); 
    }

    public checkType(t: TypeEnvironment): AbstractType_ {
        throw this.expression.checkType(t);
    }
    
}