import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { NoTypePlaceholder } from 'src/app/model/typing/types/common/no-type-placeholder';
import { BubbleSelectionService, NO_SELECTION_PLACEHOLDER_BUBBLE, TypeBubble } from '../../service/bubble-selection.service';
import { AbstractCreateTypeBubble } from '../abstract-create-type-bubble';

@Component({
  selector: 'app-create-array-type-bubble',
  templateUrl: './create-array-type-bubble.component.html',
  styleUrls: ['./create-array-type-bubble.component.css']
})
export class CreateArrayTypeBubbleComponent extends AbstractCreateTypeBubble implements OnInit {

  private currentTargetSelection: AbstractType;

  ngOnInit(): void {
    
  }

  private isSelectionEmpty(): boolean {
    return this.currentTargetSelection instanceof NoTypePlaceholder;
  }
  getSelectionText(): string {
    return this.isSelectionEmpty() ? "?" : this.currentTargetSelection.toString();
  }

  protected override onTypeBubbleSelected(bubble: TypeBubble): void {
    this.currentTargetSelection = bubble.getType();
  }

  protected override applyCreation(): void {
    if (this.isSelectionEmpty()) {
      alert("Please select a bubble.");
      return;
    }
    this.visible = false;
  }

  protected override cancelCreation(): void {
    this.visible = false;
  }

}
