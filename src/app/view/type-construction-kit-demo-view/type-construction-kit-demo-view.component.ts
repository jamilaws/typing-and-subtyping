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
import { StructuralSubtypingQueryResult } from 'src/app/model/typing/types/common/structural-subtyping/structural-subtyping-query-result';
import { SingleselectDropdownComponent } from 'src/app/util/dropdown/singleselect-dropdown/singleselect-dropdown.component';


@Component({
  selector: 'app-type-construction-kit-demo-view',
  templateUrl: './type-construction-kit-demo-view.component.html',
  styleUrls: ['./type-construction-kit-demo-view.component.css']
})
export class TypeConstructionKitDemoViewComponent implements OnInit {

  @ViewChild("inputExpression") inputExpression: ElementRef;
  
  @ViewChild("typeOneDropdown") typeOneDropdown: SingleselectDropdownComponent;
  @ViewChild("typeTwoDropdown") typeTwoDropdown: SingleselectDropdownComponent;

  public availableTypes: AbstractType[] = new Array();
  public typeDefs: TypeDefinitionTable = new Map();
  public declarations: Declaration[] = new Array();

  isAstValid: boolean = false;
  _graphOptions: EChartsOption;

  typingTree: TypingTree = null;
  typingErrorMessage: string = null;

  /*
  Tab 'Structural Subtyping'
  */

  public structuralSubtypingQueryResult: StructuralSubtypingQueryResult;

  constructor(private parsingService: ParsingService) { }

  ngOnInit(): void {
  }

  public onChangeExpression(): void {

    const code = this.inputExpression.nativeElement.value;

    if(!code) {
      // Reset
      this._graphOptions = null;
      this.isAstValid = false;
      
      return;
    }
    
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
    this.availableTypes = types;
    this.updateTrees();
  }
  public onTypedefsChange(typeDefs: TypeDefinitionTable) {
    this.typeDefs = typeDefs;
    this.updateTrees();
  }

  public onDeclarationsChange(declarations: Declaration[]) {
    this.declarations = declarations;
    this.updateTrees();
  }

  private updateTrees(): void {
    if(this.inputExpression) this.onChangeExpression();
    //if(this.typeOneDropdown && this.typeTwoDropdown) this.onClickCheckSubtyping(); //TODO: Uncomment!
  }

  /*
   * Helpers 
   */

  public typeToName(type: AbstractType){

    return type.toString();
  }
  
}
