import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { Identifier } from "./identifier";


export class StructAccessExpression extends AstNode {
    protected type: NodeType = NodeType.StructAccess;

    public struct: Identifier;
    public member: Identifier;

    constructor(codeLine: number, struct: Identifier, member: Identifier) {
        super(codeLine);
        this.struct = struct;
        this.member = member;
    }

    public getGraph(): Graph<AstNode> {
        let structGraph = this.struct.getGraph();
        let memberGraph = this.member.getGraph();
        
        const newNode = this.getGraphNode();
        const newEdges = [
            new Edge(newNode, this.struct.getGraphNode()),
            new Edge(newNode, this.member.getGraphNode())
        ];

        return new Graph([newNode], newEdges)
        .merge(structGraph)
        .merge(memberGraph);
    }

    public checkType(t: TypeEnvironment): AbstractType_ {
        throw new Error("Not implemented yet.");
    }

}