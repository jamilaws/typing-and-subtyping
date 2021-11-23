import { Injectable } from '@angular/core';
import { AbstractSyntaxTree, AstNode, NodeType } from '../model/ast/abstract-syntax-tree';
import { CallExpression } from '../model/ast/ast-nodes/call-expression';
import { Definition } from '../model/ast/ast-nodes/definition';
import { FunctionDeclaration } from '../model/ast/ast-nodes/function-declaration';
import { GlobalVariableDeclaration } from '../model/ast/ast-nodes/global-variable-declaration';
import { Identifier } from '../model/ast/ast-nodes/identifier';
import { IfStatement } from '../model/ast/ast-nodes/if-statement';
import { IndexExpression } from '../model/ast/ast-nodes/index-expression';
import { Literal } from '../model/ast/ast-nodes/literal';
import { PointerType } from '../model/ast/ast-nodes/type/pointer-type';
import { ReturnStatement } from '../model/ast/ast-nodes/return-statement';
import { StructDefinition } from '../model/ast/ast-nodes/struct-definition';
import { Type } from '../model/ast/ast-nodes/type/type';
import { VariableDeclaration } from '../model/ast/ast-nodes/variable-declaration';
const parse = require('../../../cparse/cparse');

//declare var Parser: any;

@Injectable({
  providedIn: 'root'
})
export class ParsingService {

  constructor() {

  }

  public parse(code: string): AbstractSyntaxTree {
    const parsedRaw: any[] = parse(code);
    const roots = parsedRaw.map(x => this.rawToAstNode(x));

    console.log(parsedRaw);
    

    return new AbstractSyntaxTree(roots);
  }

  private rawToAstNode(x: any): AstNode {
    const type = x["type"];
    if (!type) throw new Error("Unexpected: Parsed raw ast node does not contain field 'type'.");

    let out: AstNode;

    switch (type) {
      case NodeType.CallExpression:
        out = this.rawToAstNode_CallExpression(x);
        break;
      case NodeType.Definition:
        out = this.rawToAstNode_Definition(x);
        break;
      case NodeType.FunctionDeclaration:
        out = this.rawToAstNode_FunctionDeclaration(x);
        break;
      case NodeType.GlobalVariableDeclaration:
        out = this.rawToAstNode_GlobalVariableDeclaration(x);
        break;
      case NodeType.Identifier:
        out = this.rawToAstNode_Identifier(x);
        break;
      case NodeType.IfStatement:
        out = this.rawToAstNode_IfStatement(x);
        break;
      case NodeType.IndexExpression:
        out = this.rawToAstNode_IndexExpression(x);
        break;
      case NodeType.Literal:
        out = this.rawToAstNode_Literal(x);
        break;
      case NodeType.PointerType:
        out = this.rawToAstNode_PointerType(x);
        break;
      case NodeType.ReturnStatement:
        out = this.rawToAstNode_ReturnStatement(x);
        break;
      case NodeType.StructDefinition:
        out = this.rawToAstNode_StructDefinition(x);
        break;
      case NodeType.Type:
        out = this.rawToAstNode_Type(x);
        break;
      case NodeType.VariableDeclaration:
        out = this.rawToAstNode_VariableDeclaration(x);
        break;
      default: throw new Error("Found invalid type in parsed raw ast node: " + type);
    }

    return out;
  }

  // One method mapping from any to AstNode for every subtype
  // TODO: Move to classes instead??
  private rawToAstNode_CallExpression(x: any): CallExpression {
    const base: Identifier = <Identifier>this.rawToAstNode(x["base"]);
    const args: AstNode[] = x["arguments"].map((x: any) => <AstNode>this.rawToAstNode(x));
    return new CallExpression(base, args);
  }

  private rawToAstNode_Definition(x: any): Definition {
    const defType = <Type | PointerType> this.rawToAstNode(x["defType"]);
    const name: string = x["name"]
    return new Definition(defType, name);
  }

  private rawToAstNode_FunctionDeclaration(x: any): FunctionDeclaration {
    const defType = <Type | PointerType> this.rawToAstNode(x["defType"]);
    const name: string = x["name"];
    const args = <Definition[]> x["arguments"].map((x: any) => this.rawToAstNode(x));
    const body = x["body"].map((x: any) => this.rawToAstNode(x));

    return new FunctionDeclaration(defType, name, args, body);
  }

  private rawToAstNode_GlobalVariableDeclaration(x: any): GlobalVariableDeclaration {
    const defType = <Type | PointerType> this.rawToAstNode(x["defType"]);
    const name: string = x["name"];
    const value = this.rawToAstNode(x["value"]);
    return new GlobalVariableDeclaration(defType, name, value);
  }

  private rawToAstNode_Identifier(x: any): Identifier {
    const value = x["value"];
    return new Identifier(value);
  }

  private rawToAstNode_IfStatement(x: any): IfStatement {
    const condition = this.rawToAstNode(x["condition"]);
    const ifBlock   = x["body"].map((x: any) => this.rawToAstNode(x));
    const elseBlock = x["else"].map((x: any) => this.rawToAstNode(x));
    return new IfStatement(condition, ifBlock, elseBlock);
  }

  private rawToAstNode_IndexExpression(x: any): IndexExpression {
    const value = this.rawToAstNode(x["value"]);
    const index = this.rawToAstNode(x["index"]);
    return new IndexExpression(value, index);
  }

  private rawToAstNode_Literal(x: any): Literal {
    const value = x["value"];
    return new Literal(value);
  }

  private rawToAstNode_PointerType(x: any): PointerType {
    const target = <Type> this.rawToAstNode(x["target"]);
    return new PointerType(target);
  }
    
  private rawToAstNode_ReturnStatement(x: any): ReturnStatement {
    const value = this.rawToAstNode(x["value"]);
    return new ReturnStatement(value);
  }
    
  private rawToAstNode_StructDefinition(x: any): StructDefinition {
    const name = x["name"];
    const member = x["member"].map((x: any) => this.rawToAstNode(x));
    return new StructDefinition(name, member);
  }
  
  private rawToAstNode_Type(x: any): Type {
    const name = x["name"];
    return new Type(name);
  }
  
  private rawToAstNode_VariableDeclaration(x: any): VariableDeclaration {
    const defType = <Type | PointerType> this.rawToAstNode(x["defType"]);
    const name: string = x["name"];
    const value = this.rawToAstNode(x["value"]);
    return new VariableDeclaration(defType, name, value);
  }
}
