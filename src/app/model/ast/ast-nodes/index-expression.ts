import { AstNode } from "../ast-node";
import { Edge, Graph } from "../graph";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { IntType } from "../../typing/types/base-types/int-type";
import { PointerType } from "../../typing/types/type-constructors/pointer-type";
import { ArrayType } from "../../typing/types/type-constructors/array-type";
import { TypeError } from "../../typing/type-error";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";

export class IndexExpression extends AstNode {

    public value: AstNode;
    public index: AstNode; 
   
    constructor(codeLine: number, value: AstNode, index: AstNode){
        super(codeLine);
        
        this.value = value;
        this.index = index;
    }

    public getCode(): string {
        return `${this.value.getCode()}[${this.index.getCode()}]`;
    }

    public getGraphNodeLabel(): string {
        return "[]";
    }

    public getGraph(): Graph<AstNode> {
        const valueGraph = this.value.getGraph();
        const indexGraph = this.index.getGraph();

        const newNode = this.getGraphNode();
        const edges = [new Edge(newNode, this.value.getGraphNode()), new Edge(newNode, this.index.getGraphNode())];


        return new Graph([newNode], edges).merge(valueGraph).merge(indexGraph);
    }
 
    public performTypeCheck(t: TypeEnvironment): AbstractType_ {

        let valueType = this.value.performTypeCheck(t);
        let indexType = this.index.performTypeCheck(t);

        if(!(valueType instanceof PointerType) && !(valueType instanceof ArrayType)) {
            throw new TypeError("Index syntax can only be applied on either pointer or array type.");
        }
        if(!(indexType instanceof IntType)) {
            throw new TypeError("Array accessor index must be of type int");
        }

        return this.type = (<ArrayType | PointerType> valueType).getBaseType();
    }

    public getType(): AbstractType_ {
        return this.type;
    }

    public getTypingTree(): TypingTree {

        let arrayTree = this.value.getTypingTree();
        let indexTree = this.index.getTypingTree();

        return new TypingTree(TypingTreeNodeLabel.ARRAY, this.getCode(), this.getType().toString(), [arrayTree, indexTree]);
    }

    // Move abstract method into AstNode?
    //public getCode(): string {
    //    return `${this.value.getCode()}[${this.index.getCode()}]`;
    //}

}