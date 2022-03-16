import { TypeCheckable } from "../typing/interfaces/type-checkable";
import { TypeEnvironment } from "../typing/type-environment";
import { AbstractType, WildcardPlaceholderType } from "../typing/types/abstract-type";
import { NotVisitedPlaceholderType } from "../typing/types/placeholder-types/not-visited-placeholder-type";
import { TypingTree } from "../typing/typing-tree/typing-tree";
import { Graph, Node } from 'src/app/model/common/graph/_module';
import { TypeErrorPlaceholderType } from "../typing/types/placeholder-types/type-error-placeholder-type";


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
    TypeDefStatement = "TypeDefStatement",
}

export abstract class AstNode implements TypeCheckable {

    protected codeLine: number;

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
     * Sets this.type to a new TypeErrorPlaceholderType object holding the passed errorMessage and some additional information about the recoveryType. 
     * @param errorMessage explanation to the user about the reason for the failure. 
     * @param recoveryType Type that actually should have been computed during performTypeCheck() call without the occured failure. When not provided, WildcardPlaceholderType is used.
     * @returns recoveryType
     */
    protected failTypeCheck(errorMessage: string, recoveryType: AbstractType = new WildcardPlaceholderType()): AbstractType {
        const messageSuffix = " [Recovery Type: " + recoveryType.toString() + "]";

        const error = new TypeError(errorMessage + messageSuffix);
        const errorType = new TypeErrorPlaceholderType(error);

        this.type = errorType;

        return recoveryType;
    }

   
    /**
     * returns the label displayed on corresponding graph node
     */
    public abstract getGraphNodeLabel(): string;
    public abstract performTypeCheck(t: TypeEnvironment): AbstractType;
    public abstract getType(): AbstractType;
    public abstract getTypingTree(): TypingTree;
}