import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";

// TODO IMPLEMENT!!!
export class IfStatement extends AstNode {
    protected type: NodeType = NodeType.IfStatement;

    public condition:   AstNode;
    public ifBlock:     AstNode[];
    public elseBlock:   AstNode[];

    constructor(codeLine: number, condition: AstNode, ifBlock: AstNode[], elseBlock: AstNode[]){
        super(codeLine);
        this.condition = condition;
        this.ifBlock = ifBlock;
        this.elseBlock = elseBlock;
    }

    public getGraph(): Graph<AstNode> {
        let conditionGraph = this.condition.getGraph();
        let ifBlockGraphs = this.ifBlock.map(x => x.getGraph());
        let elseBlockGraphs = this.elseBlock.map(x => x.getGraph());

        let successors = [this.condition.getGraphNode()]
        .concat(this.ifBlock.map(x => x.getGraphNode()))
        .concat(this.elseBlock.map(x => x.getGraphNode()));

        const newNode = this.getGraphNode();
        let newEdges = successors.map(s => new Edge(newNode, s));

        return (new Graph([newNode], newEdges))
        .merge(conditionGraph)
        .merge(ifBlockGraphs.reduce((acc, curr) => acc.merge(curr), new Graph([], [])))
        .merge(elseBlockGraphs.reduce((acc, curr) => acc.merge(curr), new Graph([], [])));
    }

    public checkType(t: TypeEnvironment): AbstractType_ {
        throw new Error("Not implemented yet.");
    }

}