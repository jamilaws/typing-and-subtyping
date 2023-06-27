import { Input, Component, OnInit } from '@angular/core';

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
    //var parser = require('../../assets/ansic').parser
    //console.log(JSON.stringify(parser.parse(this.code)))
  }
 
  ngOnChange(){
    
    //console.log(JSON.stringify(parser.parse(this.code)))
  
    
  }

}
