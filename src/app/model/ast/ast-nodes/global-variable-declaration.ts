import { AstNode, NodeType } from "../abstract-syntax-tree";
import { Edge, Graph } from "../graph";
import { AbstractType } from "./type/abstract-type";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType as AbstractType_ } from "src/app/model/typing/types/abstract-type";
import { Declaration } from "../../typing/symbol-table";
import { NoTypePlaceholder } from "../../typing/types/common/no-type-placeholder";

export class GlobalVariableDeclaration extends AstNode implements Declaration {
    protected nodeType: NodeType = NodeType.GlobalVariableDeclaration;

    public defType: AbstractType; // TODO: Check if ok
    public name: string;
    public value: AstNode;

    private type: AbstractType_ = null;

    constructor(codeLine: number, defType: AbstractType, name: string, value: AstNode) {
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
        return this.nodeType + " " + this.name;
    }

    public performTypeCheck(t: TypeEnvironment): AbstractType_ {

        const typeType = this.defType.performTypeCheck(t);
        const valueType = this.value.performTypeCheck(t);

        // TODO: Check if typeType and valueType are compatible! TypeError otherwise.

        t.declare(this);
        return this.type = new NoTypePlaceholder();
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
        return this.defType.getType();
    }
}