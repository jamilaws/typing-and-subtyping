import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";

export class ReturnStatement extends AstNode {
    protected nodeType: NodeType = NodeType.ReturnStatement;

    public value: AstNode;

    private type: AbstractType_ = null;

    constructor(codeLine: number, value: AstNode) {
        super(codeLine);
        this.value = value;
    }

    public getGraph(): Graph<AstNode> {
        let valueGraph = this.value.getGraph();

        let newNode = this.getGraphNode();
        let newEdge = new Edge(newNode, this.value.getGraphNode());

        return new Graph([newNode], [newEdge]).merge(valueGraph);
    }
    
    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        return this.type = this.value.performTypeCheck(t);
    }

    public getType(): AbstractType_ {
        return this.type;
    }

}