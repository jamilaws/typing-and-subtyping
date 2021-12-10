import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { AbstractType } from "./type/abstract-type";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";


// TODO: Clearify!

// e.g. function parameter, struct member
export class ExpressionStatement extends AstNode {
    protected nodeType: NodeType = NodeType.ExpressionStatement;
    public expression: AbstractType;

    private type: AbstractType_ = null;

    constructor(codeLine: number, expression: AbstractType){
        super(codeLine);
        this.expression = expression;
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
    
}