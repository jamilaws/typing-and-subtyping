import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { IntType } from "../../typing/types/base-types/int-type";
import { PointerType } from "../../typing/types/type-constructors/pointer-type";
import { ArrayType } from "../../typing/types/type-constructors/array-type";

export class IndexExpression extends AstNode {
    protected type: NodeType = NodeType.IndexExpression;

    public value: AstNode;
    public index: AstNode; 

    constructor(codeLine: number, value: AstNode, index: AstNode){
        super(codeLine);
        this.value = value;
        this.index = index;
    }

    public getGraph(): Graph<AstNode> {
        const valueGraph = this.value.getGraph();
        const indexGraph = this.index.getGraph();

        const newNode = this.getGraphNode();
        const edges = [new Edge(newNode, this.value.getGraphNode()), new Edge(newNode, this.index.getGraphNode())];


        return new Graph([newNode], edges).merge(valueGraph).merge(indexGraph);
    }
 
    public checkType(t: TypeEnvironment): AbstractType_ {

        let valueType = this.value.checkType(t);
        let indexType = this.index.checkType(t);

        if(!(valueType instanceof PointerType) && !(valueType instanceof ArrayType)) {
            throw new Error("Index syntax can only be applied on either pointer or array type.");
        }
        if(!(indexType instanceof IntType)) {
            throw new Error("Array accessor index must be of type int");
        }

        return (<ArrayType | PointerType> valueType).getBaseType();
    }

}