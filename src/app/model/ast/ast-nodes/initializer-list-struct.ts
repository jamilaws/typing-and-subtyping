import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph, Node } from "../graph";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";
import { PointerType } from "../../typing/types/type-constructors/pointer-type";
import { Identifier } from "./identifier";
import { StructType } from "../../typing/types/type-constructors/struct-type";
import { Definition } from "../../typing/types/common/definition";

export class StructMemberValue extends AstNode{
    protected nodeType: NodeType = NodeType.StructMemberValue;

    member: string; // TODO: Use Identifier instead?
    value: AstNode;

    constructor(codeLine: number, member: string, value: AstNode){
        super(codeLine);
        this.member = member;
        this.value = value;
    }

    public getCode(): string {
        return "." + this.member + " = " + this.value.getCode()
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.nodeType + " " + this.member;
    }

    public getGraph(): Graph<AstNode> {
        //const g1 = this.member.getGraph();
        const g2 = this.value.getGraph();

        //const e1 = new Edge(this.getGraphNode(), this.member.getGraphNode());
        const e2 = new Edge(this.getGraphNode(), this.value.getGraphNode());

        //return new Graph([this.getGraphNode()], [e1, e2]).merge(g1).merge(g2);
        return new Graph([this.getGraphNode()], [e2]).merge(g2);
    }
    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        //this.member.performTypeCheck(t);
        this.value.performTypeCheck(t);
        // TODO;
        return null;
    }
    public getType(): AbstractType_ {
        return null;
    }
    public getTypingTree(): TypingTree {
        return new TypingTree(TypingTreeNodeLabel.APP, "Method not implemented.", "TODO");
    }
}

/**
 * e.g. {.name = "Foo", .age = 3}
 */
export class InitializerListStruct extends AstNode {

    private children: StructMemberValue[];

    constructor(codeLine: number, children: StructMemberValue[]) {
        super(codeLine);
        this.children = children;
        if(children.length === 0) throw new Error("Empty InitializerList not implemented yet.");     
    }

    public getCode(): string {
        return "{" + this.children.map(c => c.getCode()).join(", ") + "}"; 
    }

    public getGraphNodeLabel(): string {
        return "{}";
    }

    public getGraph(): Graph<AstNode> {
        const childGraphs = this.children.map(m => m.getGraph());

        const newNode = this.getGraphNode();
        const newEdges = this.children.map(m => { return new Edge(newNode, m.getGraphNode()); });

        return new Graph([newNode], newEdges).merge(childGraphs.reduce((acc, curr) => acc.merge(curr), new Graph([], [])));
    }
    
    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        this.children.forEach(c => c.performTypeCheck(t));
        // TODO: Handle case with this.children.length === 0
        // TODO: Implement Subtyping!
        return this.type = new StructType("TODO", this.children.map(c => new Definition(c.member, c.value.getType()))); //  TODO!
    }

    public getType(): AbstractType_ {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        return new TypingTree(TypingTreeNodeLabel.APP, "Method not implemented.", "TODO");
    }
}