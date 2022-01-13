import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { PointerType } from "../../typing/types/type-constructors/pointer-type";
import { TypeError } from "../../typing/type-error";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";

export enum PrefixOperator {
    REF = "&",
    DEREF = "*",
    // TODO ...
}

export class PrefixExpression extends AstNode {
    protected nodeType: NodeType = NodeType.PrefixExpression;

    value: AstNode;
    operator: PrefixOperator;

    private type: AbstractType_ = null;

    constructor(codeLine: number, value: AstNode, operator: PrefixOperator) {
        super(codeLine);
        this.value = value;
        this.operator = operator;
    }

    public getCode(): string {
        return this.operator + this.value.getCode();
    }

    public getGraph(): Graph<AstNode> {
        const subgraph = this.value.getGraph();

        const newNode = this.getGraphNode();
        const newEdge = new Edge(newNode, this.value.getGraphNode());

        return new Graph([newNode], [newEdge]).merge(subgraph);
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.nodeType + " " + this.operator;
    }

    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        const childType = this.value.performTypeCheck(t);

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
        return new TypingTree(label, this.getCode(), this.getType().toString());
    }
}