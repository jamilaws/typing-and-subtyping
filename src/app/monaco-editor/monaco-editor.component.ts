import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.css']
})
export class MonacoEditorComponent implements OnInit {

  public editorOptions = {
    theme: 'vs-light',
    language: 'c',
    minimap: {
      enabled: false
    }
  };

  code: String= "/*\nPlease enter your declarations\nand typedefs here \n*/";

  

  constructor() { }


  ngOnInit(): void {
  }

}
