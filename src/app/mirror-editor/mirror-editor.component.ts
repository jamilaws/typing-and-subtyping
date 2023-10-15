import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mirror-editor',
  templateUrl: './mirror-editor.component.html',
  styleUrls: ['./mirror-editor.component.css']
})
export class MirrorEditorComponent{

  
  @Input('code') code: string = "/*\nPlease enter your declarations\nand typedefs here \n/*";

  public editorOptions = {
    lineNumbers: true,
  }

}
