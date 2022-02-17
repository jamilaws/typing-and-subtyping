import { Component, OnInit } from '@angular/core';
import { TypeBubble } from '../../service/bubble-selection.service';
import { AbstractCreateTypeBubble } from '../abstract-create-type-bubble';

@Component({
  selector: 'app-create-function-type-bubble',
  templateUrl: './create-function-type-bubble.component.html',
  styleUrls: ['./create-function-type-bubble.component.css']
})
export class CreateFunctionTypeBubbleComponent extends AbstractCreateTypeBubble implements OnInit {
  
  ngOnInit(): void {
  }

  protected onTypeBubbleSelected(bubble: TypeBubble): void {
    //throw new Error('Method not implemented.');
  }

  protected applyCreation(): void {
    //throw new Error('Method not implemented.');
  }
  
}
