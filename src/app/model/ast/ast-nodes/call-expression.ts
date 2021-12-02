import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { Identifier } from "./identifier";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";

export class CallExpression extends AstNode {
    protected type: NodeType = NodeType.CallExpression;

    public base: Identifier // TODO: Refactor to name: string instead ?
    public args: AstNode[]; // TODO: Change to concrete subclass

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

    public checkType(t: TypeEnvironment): AbstractType_ {
        throw new Error("Not implemented yet.");
    }
}