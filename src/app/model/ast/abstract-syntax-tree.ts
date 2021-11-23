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
}

export abstract class AstNode {

    protected abstract type: NodeType;
    //protected pos: { file: string, line: number };

    // Will be initialized as soon as requested
    private graphNode: Node<string> = null;

    constructor() {
    }

    /**
     * 
     * @param level index of layer from root; needed for node position calculation
     * @param levelCount number of nodes in the same layer
     */
    public abstract getGraph(): Graph<string>;

    /**
     * Return graph node holding type as string
     * @returns Node
     */
    public getGraphNode(): Node<string> {
        if(!this.graphNode) this.graphNode = new Node(this.getGraphNodeLabel());
        return this.graphNode;
    }

    /**
     * Default node label; Override this if needed.
     * @returns 
     */
    public getGraphNodeLabel(): string {
        return this.type;
    }
  
}

export class AbstractSyntaxTree {
    private roots: AstNode[];

    constructor(roots: AstNode[]) {
        this.roots = roots;
    }

    public getRoots(): AstNode[] {
        return this.roots;
    }

    public getGraph(): Graph<string> {
        return this.roots.map(e => e.getGraph()).reduce((acc, curr) => acc.merge(curr), new Graph([], []));
    }
}