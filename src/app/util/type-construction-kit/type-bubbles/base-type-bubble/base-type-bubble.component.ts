import { Component, Input, OnInit } from '@angular/core';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { BubbleSelectionService, TypeBubble } from '../../service/bubble-selection.service';

@Component({
  selector: 'app-base-type-bubble',
  templateUrl: './base-type-bubble.component.html',
  styleUrls: ['./base-type-bubble.component.css']
})
export class BaseTypeBubbleComponent implements OnInit, TypeBubble {

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
