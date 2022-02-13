import { AstNode } from "../ast-node";
import { Edge, Graph } from "../../common/graph/_module";

import { Definition } from "./definition";
import { AbstractTypeExpression } from "./type-expressions/abstract-type-expression";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { Declaration } from "../../typing/symbol-table";
import { FunctionType } from "../../typing/types/type-constructors/function-type";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";

export class FunctionDeclaration extends AstNode implements Declaration {
    
    public defType: AbstractTypeExpression; // TODO: Check if ok; (returning struct types?)
    public name: string;
    public args: Definition[]; // TODO Check if ok
    public body: AstNode[];

    constructor(codeLine: number, defType: AbstractTypeExpression, name: string, args: Definition[], body: AstNode[]) {
        super(codeLine);

        this.defType = defType;
        this.name = name;
        this.args = args;
        this.body = body;
    }

    public getCode(): string {
        throw new Error("Not implemented yet.");
    }

    public getGraphNodeLabel(): string {
        return "Declaration: " + this.name;
    }

    public getGraph(): Graph<AstNode> {
        let defTypeGraph = this.defType.getGraph();
        let argGraphs = this.args.map(a => a.getGraph());
        let bodyGraphs = this.body.map(a => a.getGraph());

        let successors = [this.defType.getGraphNode()]
        .concat(this.args.map(a => a.getGraphNode()))
        .concat(this.body.map(b => b.getGraphNode()));

        let newNode = this.getGraphNode();
        let newEdges = successors.map(s => new Edge(newNode, s));

        let newGraph = defTypeGraph.merge(argGraphs.reduce((acc, curr) => acc.merge(curr), new Graph([], [])))
        .merge(bodyGraphs.reduce((acc, curr) => acc.merge(curr), new Graph([], [])));
        
        newGraph.addNode(newNode);
        newEdges.forEach(e => newGraph.addEdge(e));

        return newGraph;
    }

    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        t.declare(this);

        t.getSymbolTable().enterNewScope();

        const parameterTypes: AbstractType_[] = this.args.map(a => a.performTypeCheck(t));
        const returnType: AbstractType_ = this.defType.performTypeCheck(t);

        this.body.forEach(e => e.performTypeCheck(t));

        t.getSymbolTable().leaveScope();
        
        return this.type = new FunctionType(parameterTypes, returnType);
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
        return this.type;
    }
}