import { AstNode } from "./../../ast-node";
import { Edge, Graph } from "./../../../common/graph/_module";


import { TypeEnvironment } from "./../../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { IntType } from "./../../../typing/types/base-types/int-type";
import { TypeError } from "./../../../typing/type-error";
import { NoTypePlaceholder } from "./../../../typing/types/common/no-type-placeholder";
import { TypingTree } from "./../../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "./../../../typing/typing-tree/typing-tree-node-label";

// TODO IMPLEMENT!!!
export class IfStatement extends AstNode {

    public condition:   AstNode;
    public ifBlock:     AstNode[];
    public elseBlock:   AstNode[];

    constructor(codeLine: number, condition: AstNode, ifBlock: AstNode[], elseBlock: AstNode[]){
        super(codeLine);
        this.condition = condition;
        this.ifBlock = ifBlock;
        this.elseBlock = elseBlock;
    }

    public getCode(): string {
        throw new Error("Not implemented yet.");
    }

    public getGraphNodeLabel(): string {
        return "If-Statement";
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

    public performTypeCheck(t: TypeEnvironment): AbstractType_ {
        const conditionType = this.condition.performTypeCheck(t);
        if (!(conditionType instanceof IntType)) throw new TypeError("Condition of if-statement must be of type 'int'");

        t.getSymbolTable().enterNewScope();
        this.ifBlock.forEach(e => e.performTypeCheck(t));
        t.getSymbolTable().leaveScope();

        t.getSymbolTable().enterNewScope();
        this.elseBlock.forEach(e => e.performTypeCheck(t));
        t.getSymbolTable().leaveScope();

        return this.type = new NoTypePlaceholder();
    }

    public getType(): AbstractType_ {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        throw new Error("Method not implemented.");
    }

}