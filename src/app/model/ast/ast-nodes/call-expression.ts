import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { Identifier } from "./identifier";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { FunctionType } from "../../typing/types/type-constructors/function-type";
import { TypeError } from "../../typing/type-error";

export class CallExpression extends AstNode {
    protected nodeType: NodeType = NodeType.CallExpression;

    public base: Identifier // TODO: Refactor to name: string instead ?
    public args: AstNode[]; // TODO: Change to concrete subclass

    private type: AbstractType_ = null;

    constructor(codeLine: number, base: Identifier, args: AstNode[]) {
        super(codeLine);
        this.base = base;
        this.args = args;
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
        const identifier = this.base.getName();
        const functionDeclaration = <FunctionType> t.getTypeOfIdentifier(identifier);

        if(functionDeclaration instanceof FunctionType){
            
            /*
             * Check if parameters are compatible
             */

            const declarationParamTypes = functionDeclaration.getParameters();
            const callParamTypes = this.args.map(arg => arg.performTypeCheck(t));


            if(declarationParamTypes.length !== callParamTypes.length) throw new TypeError(`Expected ${declarationParamTypes.length} parameters, but got ${callParamTypes.length}`);
            if(!declarationParamTypes.every((value, index) => value.equals(callParamTypes[index]))){
                throw new TypeError(`Function parameter missmatch. Cannot apply [${callParamTypes}] to [${declarationParamTypes}]`);
            }


            return this.type = functionDeclaration.getReturnType();
        } else {
            throw new TypeError(identifier + " is not a function");
        }
    }

    public getType(): AbstractType_ {
        return this.type;
    }
}