import { Component, Input, OnInit } from '@angular/core';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { BubbleSelectionService, TypeBubble } from '../../service/bubble-selection.service';

@Component({
  selector: 'app-constructed-type-bubble',
  templateUrl: './constructed-type-bubble.component.html',
  styleUrls: ['./constructed-type-bubble.component.css']
})
export class ConstructedTypeBubbleComponent implements OnInit, TypeBubble {

  @Input("type") type: AbstractType;

  constructor(private bubbleSelectionService: BubbleSelectionService) { }

  ngOnInit(): void {
  }

  public getType(): AbstractType {
    return this.type;
  }

  public onClick(): void {
    this.bubbleSelectionService.selected(this)
  }

}
