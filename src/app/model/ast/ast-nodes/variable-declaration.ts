import { AstNode } from "../ast-node";
import { Edge, Graph } from "../../common/graph/_module";

import { AbstractTypeExpression } from "./type-expressions/abstract-type-expression";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType } from "src/app/model/typing/types/abstract-type";
import { Declaration } from "../../typing/symbol-table";
import { NoTypePlaceholder } from "../../typing/types/common/no-type-placeholder";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";

export class VariableDeclaration extends AstNode implements Declaration {

    public defType: AbstractTypeExpression;
    public name: string;
    public value: AstNode;

    constructor(codeLine: number, defType: AbstractTypeExpression, name: string, value: AstNode){
        super(codeLine);
        
        this.defType = defType;
        this.name = name;
        this.value = value;
    }

    public getCode(): string {
        throw new Error("Not implemented yet.");
    }

    public getGraphNodeLabel(): string {
        return "Declaration: " + this.name;
    }

    public getGraph(): Graph<AstNode> {
        const defTypeGraph = this.defType.getGraph();
        const valueGraph = this.value.getGraph();

        const newNode = this.getGraphNode();
        const edges = [new Edge(newNode, this.defType.getGraphNode()), new Edge(newNode, this.value.getGraphNode())];
        
        return new Graph([newNode], edges).merge(defTypeGraph).merge(valueGraph);
    }

    // TODO: Suptyping! - Check 't_2 can be converted into t_1'
    public performTypeCheck(t: TypeEnvironment): AbstractType {

        const typeType = this.defType.performTypeCheck(t);
        const valueType = this.value.performTypeCheck(t);

        if (!valueType.isStrutcturalSubtypeOf(typeType, t.getTypeDefinitions())) {
            throw new TypeError(`Cannot assign value of type '${valueType.toString()}' to '${typeType.toString()}'`);
        }

        t.declare(this);
        return this.type = new NoTypePlaceholder();
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