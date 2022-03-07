import { Component, OnInit } from '@angular/core';
import { TypeBubble } from '../../service/bubble-selection.service';
import { AbstractTypeBubble } from '../abstract-type-bubble';

@Component({
  selector: 'app-constructed-type-bubble',
  templateUrl: './constructed-type-bubble.component.html',
  styleUrls: ['./constructed-type-bubble.component.css']
})
export class ConstructedTypeBubbleComponent extends AbstractTypeBubble implements OnInit, TypeBubble {

  public cdecl_C: string = "loading...";
  public cdecl_English: string;

  ngOnInit(): void {
    this.initCdecl();
  }

  private initCdecl(): void {
    this.cdecl_English = this.type.toCdeclEnglish();
    this.cdeclService.typeToString(this.type).then(c => {
      this.cdecl_C = c;
    });
  }
}
