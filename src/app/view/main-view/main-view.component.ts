import { Component, OnInit } from '@angular/core';
import { ParsingService } from 'src/app/service/parsing.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {

  public initialCode: string = 'int main()\n{\nreturn 0;\n}';

  private code: string = "";
  public ast: any = "";
  public isAstValid: boolean = true;

  constructor(private parsingService: ParsingService) { }

  ngOnInit(): void {
    this.code = this.initialCode;
    this.updateAst();
  }

  onCodeChange(code: string) {
    this.code = code;
    this.updateAst();
  }

  updateAst(): void {
    try {
      this.ast = this.parsingService.parse(this.code);
      this.isAstValid = true;
    } catch (e) {
      this.isAstValid = false;
    }

    console.log("AST:");
    console.log(this.ast);
    
    
  }

  getAstAsJSON() {
    return JSON.stringify(this.ast, undefined, 4);
  }

}

// enum NodeType {
//   "FunctionDeclaration", "VariableDeclaration", "IfStatement", "Type", "StructDefinition"
// }

// interface AstNode {

//   //pos: { file: string, line: number };

//   type: NodeType;
//   defType: any; // ?
//   name: string;

//   arguments?: any[];
//   body?: 

// }

// class FunctionDeclaration implements AstNode {
//   type = NodeType.FunctionDeclaration;

// }