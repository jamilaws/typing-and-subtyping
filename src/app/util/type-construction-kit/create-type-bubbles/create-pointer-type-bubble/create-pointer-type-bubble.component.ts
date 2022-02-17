import { Component, OnInit } from '@angular/core';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { PointerType } from 'src/app/model/typing/types/type-constructors/pointer-type';
import { NO_SELECTION_PLACEHOLDER_BUBBLE, TypeBubble } from '../../service/bubble-selection.service';
import { AbstractCreateTypeBubble, InvalidTypeCreationError } from '../abstract-create-type-bubble';

@Component({
  selector: 'app-create-pointer-type-bubble',
  templateUrl: './create-pointer-type-bubble.component.html',
  styleUrls: ['./create-pointer-type-bubble.component.css']
})
export class CreatePointerTypeBubbleComponent extends AbstractCreateTypeBubble implements OnInit {

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

    return new PointerType(this.currentTargetSelection);
  }

  protected onCancelCreation(): void {
    // Intentionally left blank
  }

  protected onCreationStopped(): void {
    this.currentTargetSelection = NO_SELECTION_PLACEHOLDER_BUBBLE.getType();
  }

  getSelectionText(): string {
    return AbstractCreateTypeBubble.isEmpty(this.currentTargetSelection) ? AbstractCreateTypeBubble.SELECTION_EMPTY_PLACEHOLDER : this.currentTargetSelection.toString();
  }

}
