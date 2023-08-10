import { Input, Component, OnInit } from '@angular/core';
import * as parser from '../../assets/ansic';

@Component({
  selector: 'app-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.css']
})

export class MonacoEditorComponent implements OnInit {

  @Input('code') code: string = "/*\nPlease enter your declarations\nand typedefs here \n/*";
  
  public editorOptions = {
    theme: 'vs-light',
    language: 'c',
    readOnly: false,
    minimap: {
      enabled: false
    }
  };
  

  constructor() { 
  }

  parseInput(){
    // TODO: Falsche Eingabe handlen --> es passiert nix bei falschen eingaben (endlosschleife?)
    let environmentMap = parser.parse(this.code);
    
  for (let i=0; i < environmentMap.length; i++){
    // parse individual statement
    switch (environmentMap[i]["kind"]){
      case "type": {

        break;
      }
      case "expr":{
        // Kann hier eigentlich nicht sein oder??
      }
    }
    
    //this.code= (environmentMap[i]["declarator"]["kind"] == null).toString();
    this.code = "This worked!";
  }
  }

  ngOnInit(): void {

    /*this.code = JSON.stringify(environmentMap[0],
      null,
      2)*/
    
    /*this.code = JSON.stringify(
      parser.parse("int main() { x = 25+x; } "),
      null, 
      2
  )*/
    
  }
 
  ngOnChange(){
    
  }

}
