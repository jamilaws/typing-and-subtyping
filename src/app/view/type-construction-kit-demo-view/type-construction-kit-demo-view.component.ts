import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { TypeDefinitionTable } from 'src/app/model/typing/type-definition-table';
import { ParsingService } from 'src/app/service/parsing.service';
import { generateAstChart } from './util/generate-ast-chart';

@Component({
  selector: 'app-type-construction-kit-demo-view',
  templateUrl: './type-construction-kit-demo-view.component.html',
  styleUrls: ['./type-construction-kit-demo-view.component.css']
})
export class TypeConstructionKitDemoViewComponent implements OnInit {

  public typeDefs: TypeDefinitionTable = new Map();

  isAstValid: boolean = false;
  _graphOptions: EChartsOption;

  constructor(private parsingService: ParsingService) { }

  ngOnInit(): void {
  }

  public onClickParse(code: string): void {
    const ast = this.parsingService.parseExpression(code);
    try{
      this._graphOptions = generateAstChart(ast);
      this.isAstValid = true;
    } catch(e) {
      this.isAstValid = false;
    }
    
  }

  public onTypedefsChange(typeDefs: TypeDefinitionTable) {
    this.typeDefs = typeDefs;
  }
  
}
