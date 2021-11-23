import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { Definition } from "./definition";
import { AbstractType } from "./type/abstract-type";
import { PointerType } from "./type/pointer-type";
import { Type } from "./type/type";

export class FunctionDeclaration extends AstNode {
    protected type: NodeType = NodeType.FunctionDeclaration;
    
    public defType: AbstractType; // TODO: Check if ok; (returning struct types?)
    public name: string;
    public args: Definition[]; // TODO Check if ok
    public body: AstNode[];

    constructor(defType: Type | PointerType, name: string, args: Definition[], body: AstNode[]) {
        super();

        this.defType = defType;
        this.name = name;
        this.args = args;
        this.body = body;
    }

    public getGraph(): Graph<string> {
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
        return this.type + " " + this.name;
    }
}