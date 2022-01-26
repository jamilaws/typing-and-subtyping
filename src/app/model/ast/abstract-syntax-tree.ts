import { TypeCheckable } from "../typing/interfaces/type-checkable";
import { TypeEnvironment } from "../typing/type-environment";
import { AbstractType } from "../typing/types/abstract-type";
import { NoTypePlaceholder } from "../typing/types/common/no-type-placeholder";
import { NotVisitedPlaceholderType } from "../typing/types/placeholder-types/not-visited-placeholder-type";
import { TypingTree } from "../typing/typing-tree/typing-tree";
import { Graph, Node } from "./graph";

export enum NodeType {
    FunctionDeclaration = "FunctionDeclaration",
    ReturnStatement = "ReturnStatement",
    Type = "Type",
    PointerType = "PointerType",
    StructType = "StructType",
    IndexExpression = "IndexExpression", // Array get
    CallExpression = "CallExpression", // TODO: Rename to 'FunctionApplication' ? 
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
    InitializerListArray = "InitializerListArray",
    InitializerListStruct = "InitializerListStruct",
    StructMemberValue = "StructMemberValue",
}

export abstract class AstNode implements TypeCheckable {

    protected codeLine: number; //{ file: string, line: number };

    // Will be initialized as soon as requested
    private graphNode: Node<AstNode> = null;


    protected type: AbstractType = new NotVisitedPlaceholderType(); // TODO: Distinction in NotVisited and NoType!
    // Will be set correctly by storeError decorator if AstNode.performTypeCheck decorated.
    protected typeError: Error = null;
    public getTypeError(): Error { return this.typeError; }
    public setTypeError(error: Error): void { this.typeError = error; }

    constructor(codeLine: number) {
        this.codeLine = codeLine;
    }

    public getCodeLine(): number { return this.codeLine; }
    public abstract getCode(): string;

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
     * returns the label displayed on corresponding graph node
     */
    public abstract getGraphNodeLabel(): string;
    public abstract performTypeCheck(t: TypeEnvironment): AbstractType;
    public abstract getType(): AbstractType;
    public abstract getTypingTree(): TypingTree;
}

export class AbstractSyntaxTree implements TypeCheckable {
    private roots: AstNode[];

    private type: AbstractType;

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
        return this.type = new NoTypePlaceholder();
    }

    public getType(): AbstractType {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        // TODO: Do not throw an error. Think of sensible implementation instead.
        throw new Error("Method getTypingTree() of AbstractSyntaxTree object has been called, what is not expected. Call the method on an AstNode instance instead.");
    }
}