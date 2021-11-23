import { NodeType } from "../../abstract-syntax-tree";
import { Graph, Node } from "../../graph";
import { AbstractType } from "./abstract-type";

export enum TypeName {
    "char", "int", "double", "float" // TODO ...
}
export class Type extends AbstractType {
    protected type: NodeType = NodeType.Type;

    //TODO: clearify 'modifier', e.g. if you add 'struct ' as prefix in function arg
    public name: TypeName;

    constructor(name: TypeName) {
        super();
        this.name = name;
    }

    public getGraph(): Graph<string> {
        return new Graph([this.getGraphNode()], [])
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.type + " " + this.name;
    }
}