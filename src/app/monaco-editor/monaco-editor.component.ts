import { Input, Component, OnInit } from '@angular/core';
import * as parser from '../../assets/ansic';

@Component({
  selector: 'app-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.css']
})

export class MonacoEditorComponent implements OnInit {

  @Input('code') code: string = "/*\nPlease enter your declarations\nand typedefs here \n/*";
  environmentMap: any;
  
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
    this.environmentMap = JSON.stringify(
      parser.parse(this.code),
      null, 
      2
  )
  
  }

  ngOnInit(): void {

    /*let environmentMap = parser.parse("int i; int a;");
    this.code = JSON.stringify(environmentMap[0],
      null,
      2)*/
    
    /*this.code = JSON.stringify(
      parser.parse("int main() { x = 25+x; } "),
      null, 
      2
  )*/
    //parse(this.code);

    //var parser = require("../../assets/ansic.js").parser;
    //var parser = require("../../assets/js/cparse/cparse.js");

    
  }
 
  ngOnChange(){
    
  }

}
