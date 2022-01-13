import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { AbstractType } from "./type/abstract-type";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { Declaration } from "../../typing/symbol-table";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";

// e.g. function parameter, struct member
export class Definition extends AstNode implements Declaration {
    protected nodeType: NodeType = NodeType.Definition;

    public defType: AbstractType;
    public name: string;

    private type: AbstractType_ = null;

    constructor(codeLine: number, defType: AbstractType, name: string){
        super(codeLine);
        this.defType = defType;
        this.name = name;
    }

    public getCode(): string {
        return `${this.defType.getCode()} ${this.name}`;
    }

    public getGraph(): Graph<AstNode> {
        let graph = this.defType.getGraph();
        let newNode = this.getGraphNode();
        let addition = new Graph([newNode], [new Edge(newNode, this.defType.getGraphNode())]); 
        return graph.merge(addition);
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.nodeType + " " + this.name;
    }

    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        t.declare(this);
        return this.type = this.defType.performTypeCheck(t);
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