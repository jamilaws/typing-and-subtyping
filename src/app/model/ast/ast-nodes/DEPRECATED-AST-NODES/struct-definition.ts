import { AstNode } from "./../../ast-node";
import { Edge, Graph } from "./../../../common/graph/_module";

import { Definition } from "./definition";

import { TypeEnvironment } from "./../../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { Declaration } from "./../../../typing/symbol-table";
import { StructType } from "./../../../typing/types/type-constructors/struct-type";
import { Definition as Definition_ } from "./../../../typing/types/common/definition";
import { TypingTree } from "./../../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "./../../../typing/typing-tree/typing-tree-node-label";


/**
 * TODO: CHECK IF THIS CLASS IS REALLY NECESSARY 
 * */
export class StructDefinition extends AstNode {

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
        const members = this.member.map(m => new Definition_(m.name, m.defType.performTypeCheck(t)));
        this.type = new StructType(this.name, members);

        t.addTypeDefinition(this.name, this.type); // TODO: Check if this is ok
        return this.type;
    }

    public getType(): AbstractType_ {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        throw new Error("Method not implemented.");
    }

    /*
     * Declaration Implementation
     */

    // getDeclarationIdentifier(): string {
    //     return this.name;
    // }

    // getDeclarationType(): AbstractType_ {
    //     return this.getType();
    // }
}