import { Injectable } from '@angular/core';
import { MonacoEditorComponent } from 'src/app/monaco-editor/monaco-editor.component'

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  public code: String;

  public parse(){
    var parser = require("src/assets/ansic")
    console.log(JSON.stringify(parser.parse(this.code)))

  }

  

  constructor() { }
}
