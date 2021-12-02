import { TypeEnvironment } from "src/app/model/typing/type-environment";
import { AstNode, NodeType } from "../../abstract-syntax-tree";
import { Graph, Node } from "../../graph";
import { AbstractType } from "./abstract-type";

import { AbstractType as AT } from "src/app/model/typing/types/abstract-type";

// Rafactor: rename enum and move to typing subsystem
export enum TypeName {
    "char", "int", "double", "float" // TODO ...
}
export class Type extends AbstractType {
    protected type: NodeType = NodeType.Type;

    //TODO: clearify 'modifier', e.g. if you add 'struct ' as prefix in function arg
    public name: TypeName;

    constructor(codeLine: number, name: TypeName) {
        super(codeLine);
        this.name = name;
    }

    public getGraph(): Graph<AstNode> {
        return new Graph([this.getGraphNode()], [])
    }

    // @Override
    public getGraphNodeLabel(): string {
        return this.type + " " + this.name;
    }

    public checkType(t: TypeEnvironment): AT {
        return null;
    }
}