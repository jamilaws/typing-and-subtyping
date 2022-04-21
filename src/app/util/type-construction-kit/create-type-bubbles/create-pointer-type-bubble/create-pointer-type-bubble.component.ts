import { Component, OnInit } from '@angular/core';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { PointerType } from 'src/app/model/typing/types/type-constructors/pointer-type';
import { NO_SELECTION_PLACEHOLDER_BUBBLE, TypeBubble } from '../../service/bubble-selection.service';
import { AbstractTypeConstructionBubble, InvalidTypeConstructionError } from '../abstract-type-construction-bubble';

@Component({
  selector: 'app-create-pointer-type-bubble',
  templateUrl: './create-pointer-type-bubble.component.html',
  styleUrls: ['./create-pointer-type-bubble.component.css']
})
export class CreatePointerTypeBubbleComponent extends AbstractTypeConstructionBubble implements OnInit {

  private currentTargetSelection: AbstractType;

  ngOnInit(): void {}
  
  protected onConstructionStarted(): void {
    // Intentionally left blank
  }

  protected onTypeBubbleSelected(bubble: TypeBubble): void {
    this.currentTargetSelection = bubble.getType();
  }

  protected onApplyConstruction(): AbstractType {
    if (AbstractTypeConstructionBubble.isEmpty(this.currentTargetSelection)) {
      throw new InvalidTypeConstructionError("Please select a target type.");
    }

    return new PointerType(this.currentTargetSelection);
  }

  protected onCancelConstruction(): void {
    // Intentionally left blank
  }

  protected onConstructionStopped(): void {
    this.currentTargetSelection = NO_SELECTION_PLACEHOLDER_BUBBLE.getType();
  }

  getSelectionText(): string {
    return AbstractTypeConstructionBubble.isEmpty(this.currentTargetSelection) ? AbstractTypeConstructionBubble.SELECTION_EMPTY_PLACEHOLDER + "*" : new PointerType(this.currentTargetSelection).toString();
  }

}
