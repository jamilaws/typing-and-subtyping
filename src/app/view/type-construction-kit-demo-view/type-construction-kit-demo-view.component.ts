import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Declaration } from 'src/app/model/typing/symbol-table';
import { TypeDefinitionTable } from 'src/app/model/typing/type-definition-table';
import { TypeEnvironment } from 'src/app/model/typing/type-environment';
import { AbstractType, WildcardPlaceholderType } from 'src/app/model/typing/types/abstract-type';
import { TypingTree } from 'src/app/model/typing/typing-tree/typing-tree';
import { ParsingService } from 'src/app/service/parsing.service';
import { SymbolTableAdapter } from './adapter/symbol-table-adapter';
import { generateAstChart } from './util/generate-ast-chart';
import { TypeError } from "src/app/model/typing/type-error";
import { StructuralSubtypingQueryResult } from 'src/app/model/typing/types/common/structural-subtyping/structural-subtyping-query-result';
import { SingleselectDropdownComponent } from 'src/app/util/dropdown/singleselect-dropdown/singleselect-dropdown.component';
import { CdeclService } from 'src/app/service/cdecl.service';
import { AbstractSyntaxTree } from 'src/app/model/ast/abstract-syntax-tree';
import { ComponentInterconnectionService } from 'src/app/service/component-interconnection.service';
import { MatTabGroup } from '@angular/material/tabs';


@Component({
  selector: 'app-type-construction-kit-demo-view',
  templateUrl: './type-construction-kit-demo-view.component.html',
  styleUrls: ['./type-construction-kit-demo-view.component.css']
})
export class TypeConstructionKitDemoViewComponent implements OnInit {

  private MAT_TAB_SUBTYPING_INDEX: number = 1;

  @ViewChild("matTabGroup") matTabGroup: MatTabGroup;

  @ViewChild("inputExpression") inputExpression: ElementRef;
  
  @ViewChild("typeOneDropdown") typeOneDropdown: SingleselectDropdownComponent;
  @ViewChild("typeTwoDropdown") typeTwoDropdown: SingleselectDropdownComponent;

  public availableTypes: AbstractType[] = new Array();
  public typeDefs: TypeDefinitionTable = new Map();
  public declarations: Declaration[] = new Array();

  private _typedefsCode: string = "";
  private _declarationsCode: string = "";

  isAstValid: boolean = false;
  _graphOptions: EChartsOption;

  typingTree: TypingTree = null;
  typingErrorMessage: string = null;

  /*
  Tab 'Structural Subtyping'
  */

  public structuralSubtypingQueryResult: StructuralSubtypingQueryResult;

  constructor(private parsingService: ParsingService, private componentInterconnectionService: ComponentInterconnectionService) { }

  ngOnInit(): void {
    this.componentInterconnectionService.clickedStructuralSubtypingQuery.subscribe(query => {
      // Update dropdowns
      this.typeOneDropdown.setSelectedOption((o) => o.toString() === query.a.toString());
      this.typeTwoDropdown.setSelectedOption((o) => o.toString() === query.b.toString());
      // Navigate to Tab "Structural Subtyping"
      this.matTabGroup.selectedIndex = this.MAT_TAB_SUBTYPING_INDEX;
      // Update
      this.onClickCheckSubtyping();
    });
  }

  public onChangeExpression(): void {

    const code = this.inputExpression.nativeElement.value;

    if(!code) {
      // Reset
      this._graphOptions = null;
      this.isAstValid = false;
      
      return;
    }
    
    let ast: AbstractSyntaxTree;

    try {

      // Parse code and generate AST
      ast = this.parsingService.parseExpression(code);
      // Map AST to displayable graph
      this._graphOptions = generateAstChart(ast);

      this.isAstValid = true;
    } catch(e) {
      this.isAstValid = false;
      return;
    }

    // Perform type check on AST (with adapter symbol table) and get typing tree

    const symbolTableAdapter = new SymbolTableAdapter(this.declarations);
    const typeEnv = new TypeEnvironment(this.typeDefs, symbolTableAdapter);

    try {
      const type = ast.performTypeCheck(typeEnv);
      // dropdown here
      console.log(ast)
      this.typingTree = ast.getTypingTree();
      this.typingErrorMessage = null;
    } catch(e) {
      this.typingTree = null;
      if(e instanceof TypeError) {
        this.typingErrorMessage = e.message;
      } else {
        throw e;
      }
    }

  }

  public onClickCheckSubtyping() {
    const type1 = this.typeOneDropdown.value;
    const type2 = this.typeTwoDropdown.value;
    //alert(type1.toString() + " <= " + type2.toString());
    this.structuralSubtypingQueryResult = type1.isStrutcturalSubtypeOf(type2, this.typeDefs);
  }

  public onTypesChange(types: AbstractType[]) {
    this.availableTypes = types.concat([new WildcardPlaceholderType()]);
    this.updateTrees();
  }
  public onTypedefsChange(typeDefs: TypeDefinitionTable) {
    this.typeDefs = typeDefs;

    const arr = Array.from(typeDefs.entries());

    // TODO: Refactor this to declaration class implementing this logic!
    this._typedefsCode = arr.map(tup => {
      const identifier = tup[0];
      const type = tup[1];
      return "typedef " + type.toCdeclC(identifier);
    }).join(";\n");
    if(this._typedefsCode.length > 0) this._typedefsCode += ";";

    this.updateTrees();
  }

  public onDeclarationsChange(declarations: Declaration[]) {
    this.declarations = declarations;

    // TODO: Refactor this to declaration class implementing this logic!
    this._declarationsCode = declarations.map(d => {
      const identifier = d.getDeclarationIdentifier();
      const type = d.getDeclarationType();
      return type.toCdeclC(identifier);
    }).join(";\n");
    if(this._declarationsCode.length > 0) this._declarationsCode += ";";
    
    this.updateTrees();
  }

  private updateTrees(): void {
    if(this.inputExpression) this.onChangeExpression();
    if(this.typeOneDropdown && this.typeTwoDropdown) this.onClickCheckSubtyping();
  }

  /*
   * Helpers 
   */

  public typeToName(type: AbstractType){

    return type.toString();
  }
/*
  public getCode(): string {
    const separation = this._typedefsCode.length > 0 && this._declarationsCode.length > 0 ? "\n\n" : "";
    const out = this._typedefsCode + separation + this._declarationsCode;
    if(out.length > separation.length) {
      return out;
    } else {
      return "/*\nAdd typedefs and declarations\nby clicking on the types above\n*";
    }
  }
*/
}
