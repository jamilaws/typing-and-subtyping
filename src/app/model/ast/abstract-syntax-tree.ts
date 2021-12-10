import { TypeCheckable } from "../typing/interfaces/type-checkable";
import { TypeEnvironment } from "../typing/type-environment";
import { AbstractType } from "../typing/types/abstract-type";
import { NoTypePlaceholder } from "../typing/types/common/no-type-placeholder";
import { Graph, Node } from "./graph";

export enum NodeType {
    FunctionDeclaration = "FunctionDeclaration",
    ReturnStatement = "ReturnStatement",
    Type = "Type",
    PointerType = "PointerType",
    StructType = "StructType",
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
    PrefixExpression = "PrefixExpression",
}

export abstract class AstNode implements TypeCheckable {

    protected abstract nodeType: NodeType;
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
        return this.nodeType;
    }

    public abstract performTypeCheck(t: TypeEnvironment): AbstractType;
    public abstract getType(): AbstractType;
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

    public performTypeCheck(t: TypeEnvironment): AbstractType {
        this.roots.forEach(e => e.performTypeCheck(t));
        return new NoTypePlaceholder();
    }

    public getType(): AbstractType {
        throw new Error("Method not implemented.");
    }
}