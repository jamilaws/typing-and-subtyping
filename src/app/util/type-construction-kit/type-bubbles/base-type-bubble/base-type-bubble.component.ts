import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { BubbleSelectionService, TypeBubble } from '../../service/bubble-selection.service';
import { AbstractTypeBubble } from '../abstract-type-bubble';

@Component({
  selector: 'app-base-type-bubble',
  templateUrl: './base-type-bubble.component.html',
  styleUrls: ['./base-type-bubble.component.css']
})
export class BaseTypeBubbleComponent extends AbstractTypeBubble implements OnInit, TypeBubble {

  ngOnInit(): void {
  }

  
}
