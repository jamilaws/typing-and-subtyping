import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { Definition } from "./definition";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { Declaration } from "../../typing/symbol-table";
import { StructType } from "../../typing/types/type-constructors/struct-type";
import { Definition as Definition_ } from "../../typing/types/common/definition";

export class StructDefinition extends AstNode implements Declaration {
    protected nodeType: NodeType = NodeType.StructDefinition;

    name: string;
    member: Definition[];

    private type: AbstractType_ = null;

    constructor(codeLine: number, name: string, member: Definition[]){
        super(codeLine);
        this.name = name;
        this.member = member;
        
    }

    public getGraph(): Graph<AstNode> {
        const memberGraphs = this.member.map(m => m.getGraph());

        const newNode = this.getGraphNode();
        const newEdges = this.member.map(m => { return new Edge(newNode, m.getGraphNode()); });

        return new Graph([newNode], newEdges).merge(memberGraphs.reduce((acc, curr) => acc.merge(curr), new Graph([], [])));
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.nodeType + " " + this.name;
    }
    
    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        t.declare(this);
        const members = this.member.map(m => new Definition_(m.name, m.defType.performTypeCheck(t)));
        return this.type = new StructType(this.name, members);
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
        return this.getType();
    }
}