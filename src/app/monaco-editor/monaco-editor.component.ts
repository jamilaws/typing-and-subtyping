import { Input, Component, OnInit } from '@angular/core';
//import * as parser from "../../assets/ansic";

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


  ngOnInit(): void {
    //parser.parse(this.code);
    //var parser = require("../../assets/ansic.js").parser;
    //var parser = require("../../assets/js/cparse/cparse.js");

    
  }
 
  ngOnChange(){
    
  }

}
