import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { AbstractType } from "./type/abstract-type";
import { PointerType } from "./type/pointer-type";
import { Type } from "./type/type";

export class GlobalVariableDeclaration extends AstNode {
    protected type: NodeType = NodeType.GlobalVariableDeclaration;

    public defType: AbstractType; // TODO: Check if ok
    public name: string;
    public value: AstNode;

    constructor(defType: AbstractType, name: string, value: AstNode){
        super();
        this.defType = defType;
        this.name = name;
        this.value = value;
    }

    public getGraph(): Graph<string> {
        const defTypeGraph = this.defType.getGraph();
        const valueGraph = this.value.getGraph();

        const newNode = this.getGraphNode();
        const edges = [new Edge(newNode, this.defType.getGraphNode()), new Edge(newNode, this.value.getGraphNode())];
        
        return new Graph([newNode], edges).merge(defTypeGraph).merge(valueGraph);
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.type + " " + this.name;
    }
}