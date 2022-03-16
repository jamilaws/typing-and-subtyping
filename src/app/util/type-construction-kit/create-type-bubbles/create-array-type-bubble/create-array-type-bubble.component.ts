import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { NoTypePlaceholder } from 'src/app/model/typing/types/common/no-type-placeholder';
import { ArrayType } from 'src/app/model/typing/types/type-constructors/array-type';
import { BubbleSelectionService, NO_SELECTION_PLACEHOLDER_BUBBLE, TypeBubble } from '../../service/bubble-selection.service';
import { AbstractCreateTypeBubble, InvalidTypeCreationError } from '../abstract-create-type-bubble';

@Component({
  selector: 'app-create-array-type-bubble',
  templateUrl: './create-array-type-bubble.component.html',
  styleUrls: ['./create-array-type-bubble.component.css']
})
export class CreateArrayTypeBubbleComponent extends AbstractCreateTypeBubble implements OnInit {

  private currentTargetSelection: AbstractType;

  ngOnInit(): void {}
  
  protected onCreationStarted(): void {
    // Intentionally left blank
  }

  protected onTypeBubbleSelected(bubble: TypeBubble): void {
    this.currentTargetSelection = bubble.getType();
  }

  protected onApplyCreation(): AbstractType {
    if (AbstractCreateTypeBubble.isEmpty(this.currentTargetSelection)) {
      throw new InvalidTypeCreationError("Please select a target type.");
    }

    return new ArrayType(this.currentTargetSelection);
  }

  protected onCancelCreation(): void {
    // Intentionally left blank
  }

  protected onCreationStopped(): void {
    this.currentTargetSelection = NO_SELECTION_PLACEHOLDER_BUBBLE.getType();
  }

  getSelectionText(): string {
    return AbstractCreateTypeBubble.isEmpty(this.currentTargetSelection) ? AbstractCreateTypeBubble.SELECTION_EMPTY_PLACEHOLDER + "[]" : new ArrayType(this.currentTargetSelection).toString();
  }

}