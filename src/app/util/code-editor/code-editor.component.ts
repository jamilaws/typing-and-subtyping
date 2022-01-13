import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DiffEditorModel } from 'ngx-monaco-editor';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {

  @Input('initialCode')   initialCode: string = "";
  @Input('editorOptions') editorOptions = {theme: 'vs-light', language: 'c'};
  @Output('onCodeChange') onCodeChange = new EventEmitter<string>();
  
  _code: string= '';

  get code() {
    return this._code;
  }

  set code(newValue: string) {
    this._code = newValue;
    this.onCodeChange.emit(this._code);
  }

  constructor() { }

  ngOnInit(): void {
    this._code = this.initialCode;
  }

  onCodeEditorInit(editor: any): void {
    //let line = editor.getPosition();
    //console.log(line); 
  }

}
