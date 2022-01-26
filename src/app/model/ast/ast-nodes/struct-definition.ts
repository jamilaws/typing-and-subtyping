import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { Definition } from "./definition";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { Declaration } from "../../typing/symbol-table";
import { StructType } from "../../typing/types/type-constructors/struct-type";
import { Definition as Definition_ } from "../../typing/types/common/definition";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";

// TODO: Why does this implement Declaration?!
export class StructDefinition extends AstNode implements Declaration {

    name: string;
    member: Definition[];

    constructor(codeLine: number, name: string, member: Definition[]){
        super(codeLine);
        this.name = name;
        this.member = member;
        
    }

    public getCode(): string {
        throw new Error("Not implemented yet.");
    }

    public getGraphNodeLabel(): string {
        return "Definition: struct " + this.name;
    }

    public getGraph(): Graph<AstNode> {
        const memberGraphs = this.member.map(m => m.getGraph());

        const newNode = this.getGraphNode();
        const newEdges = this.member.map(m => { return new Edge(newNode, m.getGraphNode()); });

        return new Graph([newNode], newEdges).merge(memberGraphs.reduce((acc, curr) => acc.merge(curr), new Graph([], [])));
    }
    
    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        t.declare(this);
        const members = this.member.map(m => new Definition_(m.name, m.defType.performTypeCheck(t)));
        return this.type = new StructType(this.name, members);
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
        return this.getType();
    }
}