import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { Identifier } from "./identifier";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { FunctionType } from "../../typing/types/type-constructors/function-type";
import { TypeError } from "../../typing/type-error";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";

export class CallExpression extends AstNode {

    // IMPORTANT!!!
    // TODO: Base does not necessarily be of type Identifier! Could be some more complex expression!
    public base: Identifier;
    public args: AstNode[]; // TODO: Change to concrete subclass, Definition?

    constructor(codeLine: number, base: Identifier, args: AstNode[]) {
        super(codeLine);
        this.base = base;
        this.args = args;
    }

    public getCode(): string {
        return `${this.base.getCode()}(${this.args.map(arg => arg.getCode()).join(", ")})`;
    }

    public getGraphNodeLabel(): string {
        return "...(...)";
    }

    public getGraph(): Graph<AstNode> {
        let baseGraph = this.base.getGraph();
        let argGraphs = this.args.map(a => a.getGraph());

        let successors = [this.base.getGraphNode()].concat(this.args.map(a => a.getGraphNode()));
        let newNode = this.getGraphNode();
        let newEdges = successors.map(s => new Edge(newNode, s));

        let newGraph = baseGraph.merge(argGraphs.reduce((acc, curr) => acc.merge(curr), new Graph([], [])));

        newGraph.addNode(newNode);
        newEdges.forEach(e => newGraph.addEdge(e));

        return newGraph;
    }

    public performTypeCheck(t: TypeEnvironment): AbstractType_ {        
        const functionType: AbstractType_ = this.base.performTypeCheck(t);

        if(functionType instanceof FunctionType){

            const declarationParamTypes = functionType.getParameters();
            const callParamTypes = this.args.map(arg => arg.performTypeCheck(t));

            // TODO: Check subtyping!
            if(declarationParamTypes.length !== callParamTypes.length) throw new TypeError(`Expected ${declarationParamTypes.length} parameters, but got ${callParamTypes.length}`);
            if(!declarationParamTypes.every((value, index) => value.equals(callParamTypes[index]))){
                throw new TypeError(`Function parameter missmatch. Cannot apply [${callParamTypes}] to [${declarationParamTypes}]`);
            }


            return this.type = functionType.getReturnType();
        } else {
            throw new TypeError(this.base.getName() + " is not a function");
        }
    }

    public getType(): AbstractType_ {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        const children = [this.base.getTypingTree()].concat(this.args.map(arg => arg.getTypingTree()));
        return new TypingTree(TypingTreeNodeLabel.APP, this.getCode(), this.getType().toString(), children);
    }
}