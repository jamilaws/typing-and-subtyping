import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { AbstractType } from "./type/abstract-type";
import { PointerType } from "./type/pointer-type";
import { Type } from "./type/type";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { Declaration } from "../../typing/symbol-table";
import { NoTypePlaceholder } from "../../typing/types/common/no-type-placeholder";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";

export class VariableDeclaration extends AstNode implements Declaration {
    protected nodeType: NodeType = NodeType.VariableDeclaration;

    public defType: AbstractType;
    public name: string;
    public value: AstNode;

    private type: AbstractType_ = null;

    constructor(codeLine: number, defType: AbstractType, name: string, value: AstNode){
        super(codeLine);
        this.defType = defType;
        this.name = name;
        this.value = value;
    }

    public getCode(): string {
        throw new Error("Not implemented yet.");
    }

    public getGraph(): Graph<AstNode> {
        const defTypeGraph = this.defType.getGraph();
        const valueGraph = this.value.getGraph();

        const newNode = this.getGraphNode();
        const edges = [new Edge(newNode, this.defType.getGraphNode()), new Edge(newNode, this.value.getGraphNode())];
        
        return new Graph([newNode], edges).merge(defTypeGraph).merge(valueGraph);
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.nodeType + " " + this.name;
    }
    
    public performTypeCheck(t: TypeEnvironment): AbstractType_ {

        const typeType = this.defType.performTypeCheck(t);
        const valueType = this.value.performTypeCheck(t);

        // TODO: Check subtyping!
        if (!typeType.equals(valueType)) throw new TypeError(`Cannot assign value of type '${valueType.toString()}' to '${typeType.toString()}'`);

        t.declare(this);
        return this.type = new NoTypePlaceholder();
    }

    public getType(): AbstractType_ {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        return new TypingTree(TypingTreeNodeLabel.APP, "Method not implemented.", "TODO");
    }

    /*
     * Declaration Implementation
     */

    getDeclarationIdentifier(): string {
        return this.name;
    }

    getDeclarationType(): AbstractType_ {
        return this.defType.getType();
    }

}