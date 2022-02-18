import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Declaration } from 'src/app/model/typing/symbol-table';
import { TypeDefinitionTable } from 'src/app/model/typing/type-definition-table';
import { TypeEnvironment } from 'src/app/model/typing/type-environment';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { TypingTree } from 'src/app/model/typing/typing-tree/typing-tree';
import { ParsingService } from 'src/app/service/parsing.service';
import { SymbolTableAdapter } from './adapter/symbol-table-adapter';
import { generateAstChart } from './util/generate-ast-chart';
import { TypeError } from "src/app/model/typing/type-error";


@Component({
  selector: 'app-type-construction-kit-demo-view',
  templateUrl: './type-construction-kit-demo-view.component.html',
  styleUrls: ['./type-construction-kit-demo-view.component.css']
})
export class TypeConstructionKitDemoViewComponent implements OnInit {

  @ViewChild("inputExpression") inputExpression: ElementRef;

  public typeDefs: TypeDefinitionTable = new Map();
  public declarations: Declaration[] = new Array();

  isAstValid: boolean = false;
  _graphOptions: EChartsOption;

  typingTree: TypingTree = null;
  typingErrorMessage: string = null;

  constructor(private parsingService: ParsingService) { }

  ngOnInit(): void {
  }

  public onChangeExpression(): void {

    const code = this.inputExpression.nativeElement.value;
    
    // Parse code and generate AST

    const ast = this.parsingService.parseExpression(code);

    // Map AST to displayable graph

    try{
      this._graphOptions = generateAstChart(ast);
      this.isAstValid = true;
    } catch(e) {
      this.isAstValid = false;
    }

    // Perform type check on AST (with adapter symbol table) and get typing tree

    const symbolTableAdapter = new SymbolTableAdapter(this.declarations);
    const typeEnv = new TypeEnvironment(this.typeDefs, symbolTableAdapter);

    try {
      const type = ast.performTypeCheck(typeEnv);
      this.typingTree = ast.getTypingTree();
      this.typingErrorMessage = null;
    } catch(e) {
      this.typingTree = null;
      if(e instanceof TypeError) {
        this.typingErrorMessage = e.message;
      }
      throw e;
    }

  }

  public onTypedefsChange(typeDefs: TypeDefinitionTable) {
    this.typeDefs = typeDefs;
  }

  public onDeclarationsChange(declarations: Declaration[]) {
    this.declarations = declarations;
  }
  
}
