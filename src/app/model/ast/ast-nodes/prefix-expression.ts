import { AstNode } from "../ast-node";
import { Edge, Graph } from "../../common/graph/_module";


import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { PointerType } from "../../typing/types/type-constructors/pointer-type";
import { TypeError } from "../../typing/type-error";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";
import { storeError } from "../decorators/store-error";
import { ErrorTypingTree } from "../../typing/typing-tree/error-typing-tree";

export enum PrefixOperator {
    REF = "&",
    DEREF = "*",
    // TODO ...
}

export class PrefixExpression extends AstNode {

    value: AstNode;
    operator: PrefixOperator;

    constructor(codeLine: number, value: AstNode, operator: PrefixOperator) {
        super(codeLine);
        this.value = value;
        this.operator = operator;
    }

    public getCode(): string {
        return this.operator + this.value.getCode();
    }

    public getGraphNodeLabel(): string {
        return this.operator;
    }

    public getGraph(): Graph<AstNode> {
        const subgraph = this.value.getGraph();

        const newNode = this.getGraphNode();
        const newEdge = new Edge(newNode, this.value.getGraphNode());

        return new Graph([newNode], [newEdge]).merge(subgraph);
    }

    @storeError()
    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        const childType = this.value.performTypeCheck(t);

        if(!childType) throw new TypeError("Invalid use of deref operator on type null");

        switch (this.operator) {
            case PrefixOperator.REF:
                return this.type = new PointerType(childType);

            case PrefixOperator.DEREF:
                if (childType instanceof PointerType) {
                    return this.type = childType.getBaseType();
                } else {
                    console.log(childType);
                    throw new TypeError("Invalid use of deref operator on type " + childType.toString());
                }

            default: throw new Error("Invalid prefix operator found: " + this.operator);
        }

    }

    public getType(): AbstractType_ {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        
        var label: TypingTreeNodeLabel;
        switch (this.operator) {
            case PrefixOperator.REF: label = TypingTreeNodeLabel.REF;
                break;
            case PrefixOperator.DEREF: label = TypingTreeNodeLabel.DEREF;
                break;
            default: throw new Error("Invalid prefix operator found: " + this.operator);
        }

        // TODO: Extra decorator for this!
        if(this.getTypeError()) {
            return new ErrorTypingTree(label, this.getCode());
        }
        
        return new TypingTree(label, this.getCode(), this.getType().toString(), [this.value.getTypingTree()]);
    }
}