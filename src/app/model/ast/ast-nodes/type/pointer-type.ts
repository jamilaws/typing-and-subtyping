import { TypeEnvironment } from "src/app/model/typing/type-environment";
import { AstNode, NodeType } from "../../abstract-syntax-tree";
import { Edge, Graph } from "../../graph";
import { AbstractType } from "./abstract-type";
import { Type } from "./type";

import { PointerType as PointerType_ } from "src/app/model/typing/types/type-constructors/pointer-type";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";

// e.g. char*, int[], ...
export class PointerType extends AbstractType {

    protected type: NodeType = NodeType.PointerType;

    public target: Type;

    constructor(codeLine: number, target: Type) {
        super(codeLine);
        this.target = target;
    }

    public getGraph(): Graph<AstNode> {
        let graph = this.target.getGraph();

        let newNode = this.getGraphNode();
        let newEdge = new Edge(newNode, this.target.getGraphNode());
        
        return new Graph([newNode], [newEdge]).merge(graph);
    }

    public checkType(t: TypeEnvironment): AbstractType_ {
        const targetType: AbstractType_ = this.target.checkType(t);
        return new PointerType_(targetType);
    }
}