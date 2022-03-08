import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface Position {
  lineNumber: number;
  column: number;
}

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {

  @Input('code') _code: string = "";
  @Input('readOnly') readOnly: boolean = false;
  @Output('onCodeChange') onCodeChange = new EventEmitter<string>();
  @Output('onPositionChange') onPositionChange = new EventEmitter<Position>();

  public editorOptions = {
    theme: 'vs-light',
    language: 'c',
    readOnly: true,
    minimap: {
      enabled: false
    }
  };

  private _editor: any;
  
  private _currentPosition: Position = { lineNumber: -1, column: -1};

  public get code() {    
    return this._code;
  }

  public set code(newValue: string) {
    this._code = newValue;
    this.onCodeChange.emit(this._code);
    this.invalidateCurrentPosition();
  }

  get currentPosition() {    
    return this._currentPosition;
  }

  private set currentPosition(newValue: Position) {
    this._currentPosition = newValue;
    this.onPositionChange.emit(newValue);
  }

  constructor() { }

  ngOnInit(): void {
    //this._code = this.initialCode;
  }

  onCodeEditorInit(editor: any): void {
    this._editor = editor;
    this.invalidateCurrentPosition();
  }

  onClick(event: any) {
    this.invalidateCurrentPosition();
  }

  private invalidateCurrentPosition(): void {
    const newPos: Position = this._editor.getPosition();
    if(!(this.currentPosition.lineNumber === newPos.lineNumber && this.currentPosition.column === newPos.column)){
      // Trigger update as position has changed
      this.currentPosition = newPos;
    }
  }

}
