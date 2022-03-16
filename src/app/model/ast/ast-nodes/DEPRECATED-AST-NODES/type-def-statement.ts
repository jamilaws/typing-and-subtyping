import { TypeEnvironment } from "src/app/model/typing/type-environment";
import { AstNode } from "./../../ast-node";
import { Edge, Graph } from "./../../../common/graph/_module";


import { AbstractType } from "src/app/model/typing/types/abstract-type";
import { TypingTree } from "src/app/model/typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "src/app/model/typing/typing-tree/typing-tree-node-label";
import { AbstractTypeExpression } from "./../type-expressions/abstract-type-expression";

export class TypeDefStatement extends AstNode {

    public target: AbstractTypeExpression;
    public alias: string;

    constructor(codeLine: number, target: AbstractTypeExpression, alias: string) {
        super(codeLine);
        this.target = target;
        this.alias = alias;
    }

    public getCode(): string {
        return "typedef " + this.target.getCode() + " " + this.alias;
    }

    public getGraphNodeLabel(): string {
        return "typedef " + this.alias;
    }

    public getGraph(): Graph<AstNode> {
        let graph = this.target.getGraph();

        let newNode = this.getGraphNode();
        let newEdge = new Edge(newNode, this.target.getGraphNode());
        
        return new Graph([newNode], [newEdge]).merge(graph);
    }

    public performTypeCheck(t: TypeEnvironment): AbstractType {
        const targetType: AbstractType = this.target.performTypeCheck(t);
        t.addTypeDefinition(this.alias, targetType);
        return this.type = null;
    }

    public getType(): AbstractType {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        return new TypingTree(TypingTreeNodeLabel.APP, this);
    }
}