import { Component, OnInit } from '@angular/core';
import { TypeBubble } from '../../service/bubble-selection.service';
import { AbstractTypeBubble } from '../abstract-type-bubble';

@Component({
  selector: 'app-constructed-type-bubble',
  templateUrl: './constructed-type-bubble.component.html',
  styleUrls: ['./constructed-type-bubble.component.css']
})
export class ConstructedTypeBubbleComponent extends AbstractTypeBubble implements OnInit, TypeBubble {

  public cdeclC: string;

  ngOnInit(): void {
    this.initCdeclC();
  }

  private initCdeclC(): void {
    this.cdeclService.englishToC(this.type.toCdeclEnglish()).then(c => {
      this.cdeclC = c;
    });
  }
}
