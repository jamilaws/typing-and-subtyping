import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { AbstractType } from "./type/abstract-type";
import { PointerType } from "./type/pointer-type";
import { Type } from "./type/type";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { Declaration } from "../../typing/symbol-table";

export class VariableDeclaration extends AstNode implements Declaration {
    protected type: NodeType = NodeType.VariableDeclaration;

    public defType: AbstractType;
    public name: string;
    public value: AstNode;

    constructor(codeLine: number, defType: Type | PointerType, name: string, value: AstNode){
        super(codeLine);
        this.defType = defType;
        this.name = name;
        this.value = value;
    }

    public getGraph(): Graph<AstNode> {
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
    
    public checkType(t: TypeEnvironment): AbstractType_ {
        throw new Error("Not implemented yet.");
    }

    /*
     * Declaration Implementation
     */

    getDeclarationIdentifier(): string {
        throw new Error("Method not implemented.");
    }

    getDeclarationType(): AbstractType_ {
        throw new Error("Method not implemented.");
    }

}