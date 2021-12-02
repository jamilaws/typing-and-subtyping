import { TypeCheckable } from "../typing/interfaces/type-checkable";
import { TypeEnvironment } from "../typing/type-environment";
import { AbstractType } from "../typing/types/abstract-type";
import { FunctionDeclaration } from "./ast-nodes/function-declaration";
import { Graph, Node } from "./graph";

export enum NodeType {
    FunctionDeclaration = "FunctionDeclaration",
    ReturnStatement = "ReturnStatement",
    Type = "Type",
    PointerType = "PointerType",
    IndexExpression = "IndexExpression", // Array get
    CallExpression = "CallExpression", // TODO: Rename to 'FunctionCall' ? 
    Literal = "Literal",
    Identifier = "Identifier",
    Definition = "Definition", // TODO: Rename to 'Parameter' ? 
    GlobalVariableDeclaration = "GlobalVariableDeclaration",
    VariableDeclaration = "VariableDeclaration",
    StructDefinition = "StructDefinition",
    IfStatement = "IfStatement",
    BinaryExpression = "BinaryExpression",
    StructAccess = "StructAccess", // TODO: Document somewhere (not included in parsed raw type)
    ExpressionStatement = "ExpressionStatement",
}

export abstract class AstNode implements TypeCheckable {

    protected abstract type: NodeType;
    protected codeLine: number; //{ file: string, line: number };

    // Will be initialized as soon as requested
    private graphNode: Node<AstNode> = null;

    constructor(codeLine: number) {
        this.codeLine = codeLine;
    }

    /**
     * 
     * @param level index of layer from root; needed for node position calculation
     * @param levelCount number of nodes in the same layer
     */
    public abstract getGraph(): Graph<AstNode>;

    /**
     * Return graph node holding type as string
     * @returns Node
     */
    public getGraphNode(): Node<AstNode> {
        if(!this.graphNode) this.graphNode = new Node(this);
        return this.graphNode;
    }

    /**
     * Default node label; Override this if needed.
     * @returns 
     */
    public getGraphNodeLabel(): string {
        return this.type;
    }

    public abstract checkType(t: TypeEnvironment): AbstractType;
}

export class AbstractSyntaxTree implements TypeCheckable {
    private roots: AstNode[];

    constructor(roots: AstNode[]) {
        this.roots = roots;
    }

    public getRoots(): AstNode[] {
        return this.roots;
    }

    public getGraph(): Graph<AstNode> {
        return this.roots.map(e => e.getGraph()).reduce((acc, curr) => acc.merge(curr), new Graph([], []));
    }

    public checkType(t: TypeEnvironment): AbstractType {
        this.roots.forEach(e => e.checkType(t));
        return null;
    }
}