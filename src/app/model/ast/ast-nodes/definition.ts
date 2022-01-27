import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { AbstractTypeExpression } from "./type-expressions/abstract-type-expression";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType } from "src/app/model/typing/types/abstract-type";
import { Declaration } from "../../typing/symbol-table";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";

// e.g. function parameter, struct member
export class Definition extends AstNode implements Declaration {
    protected nodeType: NodeType = NodeType.Definition;

    public defType: AbstractTypeExpression;
    public name: string;

    constructor(codeLine: number, defType: AbstractTypeExpression, name: string){
        super(codeLine);
        this.defType = defType;
        this.name = name;
    }

    public getCode(): string {
        return `${this.defType.getCode()} ${this.name}`;
    }

    public getGraphNodeLabel(): string {
        return this.name;
    }

    public getGraph(): Graph<AstNode> {
        let graph = this.defType.getGraph();
        let newNode = this.getGraphNode();
        let addition = new Graph([newNode], [new Edge(newNode, this.defType.getGraphNode())]); 
        return graph.merge(addition);
    }

    public performTypeCheck(t: TypeEnvironment): AbstractType {
        t.declare(this);
        return this.type = this.defType.performTypeCheck(t);
    }

    public getType(): AbstractType {
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

    getDeclarationType(): AbstractType {
        return this.defType.getType();
    }
}