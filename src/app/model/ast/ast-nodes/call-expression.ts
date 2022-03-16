import { AstNode } from "../ast-node";
import { Edge, Graph } from "../../common/graph/_module";

import { Identifier } from "./identifier";

import { TypeEnvironment } from "../../typing/type-environment";
import { AbstractType } from "src/app/model/typing/types/abstract-type";
import { FunctionType } from "../../typing/types/type-constructors/function-type";
import { TypeError } from "../../typing/type-error";
import { TypingTree } from "../../typing/typing-tree/typing-tree";
import { TypingTreeNodeLabel } from "../../typing/typing-tree/typing-tree-node-label";
import { StructuralSubtypingQuery } from "../../typing/types/common/structural-subtyping/structural-subtyping-query";
import { Definition } from "./DEPRECATED-AST-NODES/definition";

export class CallExpression extends AstNode {

    // Note: In the typical case, base will be an identifier belonging to a declaration of a function.
    public base: AstNode;
    public args: Definition[];

    // Buffer written in 'performTypeCheck' / read in 'getTypingTree'
    private subtypingQueryBuffer: StructuralSubtypingQuery[] = null;

    constructor(codeLine: number, base: Identifier, args: Definition[]) {
        super(codeLine);
        this.base = base;
        this.args = args;
    }

    public getCode(): string {
        return `${this.base.getCode()}(${this.args.map(arg => arg.getCode()).join(", ")})`;
    }

    public getGraphNodeLabel(): string {
        return "( )";
    }

    public getGraph(): Graph<AstNode> {
        let baseGraph = this.base.getGraph();
        let argGraphs = this.args.map(a => a.getGraph());

        let successors = [this.base.getGraphNode()].concat(this.args.map(a => a.getGraphNode()));
        let newNode = this.getGraphNode();
        let newEdges = successors.map(s => new Edge(newNode, s));

        let newGraph = baseGraph.merge(argGraphs.reduce((acc, curr) => acc.merge(curr), new Graph([], [])));

        newGraph.addNode(newNode);
        newEdges.forEach(e => newGraph.addEdge(e));

        return newGraph;
    }

    public performTypeCheck(t: TypeEnvironment): AbstractType {        
        const functionType: AbstractType = this.base.performTypeCheck(t);

        if(functionType instanceof FunctionType){

            const declarationParamTypes = functionType.getParameters();
            const callParamTypes = this.args.map(arg => arg.performTypeCheck(t));

            const returnType = functionType.getReturnType();

            if(declarationParamTypes.length !== callParamTypes.length){
                const msg = `Expected ${declarationParamTypes.length} parameters, but got ${callParamTypes.length}`;
                return this.failTypeCheck(msg, returnType);
            }

            // Check if call params are subtypes of the declaration param types (per index)
            const subtypingChecks = declarationParamTypes.map((pt, index) => callParamTypes[index].isStrutcturalSubtypeOf(pt, t.getTypeDefinitions()));
            
            this.subtypingQueryBuffer = subtypingChecks.map(check => check.getQuery());

            if(!subtypingChecks.every(check => check.value)){
                const msg = `Function parameter missmatch. Cannot apply [${callParamTypes}] to [${declarationParamTypes}]`;
                return this.failTypeCheck(msg, returnType);
            }

            return this.type = returnType;
        } else {
            throw new TypeError(functionType.toString() + " is not a function");
        }
    }

    public getType(): AbstractType {
        return this.type;
    }

    public getTypingTree(): TypingTree {
        const children = [this.base.getTypingTree()].concat(this.args.map(arg => arg.getTypingTree()));

        let subtypingQueryBuffer = this.subtypingQueryBuffer; // Could be null
        this.subtypingQueryBuffer = null; // Consume buffer

        return new TypingTree(TypingTreeNodeLabel.APP, this, children, subtypingQueryBuffer);
    }
}