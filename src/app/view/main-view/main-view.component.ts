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
  public ast: any = "huh";
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
    } catch(e) {
      this.isAstValid = false;
    }
  }

  getAstAsSJON(){
    return JSON.stringify(this.ast);
  }

}
