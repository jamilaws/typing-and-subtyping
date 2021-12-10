import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { Definition } from "./definition";
import { AbstractType } from "./type/abstract-type";
import { PointerType } from "./type/pointer-type";
import { Type } from "./type/type";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { Declaration } from "../../typing/symbol-table";
import { FunctionType } from "../../typing/types/type-constructors/function-type";

export class FunctionDeclaration extends AstNode implements Declaration {
    protected nodeType: NodeType = NodeType.FunctionDeclaration;
    
    public defType: AbstractType; // TODO: Check if ok; (returning struct types?)
    public name: string;
    public args: Definition[]; // TODO Check if ok
    public body: AstNode[];

    private type: AbstractType_ = null;

    constructor(codeLine: number, defType: Type | PointerType, name: string, args: Definition[], body: AstNode[]) {
        super(codeLine);

        this.defType = defType;
        this.name = name;
        this.args = args;
        this.body = body;
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

    // @Override
    public getGraphNodeLabel(): string {
        return this.nodeType + " " + this.name;
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