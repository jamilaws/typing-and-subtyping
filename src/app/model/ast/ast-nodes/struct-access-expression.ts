import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { Identifier } from "./identifier";
import { StructType } from "../../typing/types/type-constructors/struct-type";
import { TypeError } from "../../typing/type-error";

/**
 * TODO: Handle in binary expression instead!
 */
export class StructAccessExpression extends AstNode {
    protected nodeType: NodeType = NodeType.StructAccess;

    public struct: Identifier;
    public member: Identifier;

    private type: AbstractType_ = null;

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

    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        const struct = t.getTypeOfIdentifier(this.struct.value);
        if(struct instanceof StructType) {
            const member = struct.getMembers().find(m => m.getName() === this.member.getName());
            if(!member) throw new TypeError(`Struct '${this.struct.getName()}' does not include member '${this.member.getName()}'`);
            
            return this.type = member.getType(); 
        } else {
            throw new TypeError("Cannot use '.' operator on type " + struct.toString());
        }
    }

    public getType(): AbstractType_ {
        return this.type;
    }

}