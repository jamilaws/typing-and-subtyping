import { Injectable } from '@angular/core';
import {MonacoEditorComponent} from 'src/app/monaco-editor/monaco-editor.component'
/*import { Parser } from 'src/assets/ansic'*/

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  code = MonacoEditorComponent._code;

  /*const parser = new Parser();*/

  constructor() { }
}
