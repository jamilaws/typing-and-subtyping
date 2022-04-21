import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { NoTypePlaceholder } from 'src/app/model/typing/types/common/no-type-placeholder';
import { ArrayType } from 'src/app/model/typing/types/type-constructors/array-type';
import { BubbleSelectionService, NO_SELECTION_PLACEHOLDER_BUBBLE, TypeBubble } from '../../service/bubble-selection.service';
import { AbstractTypeConstructionBubble, InvalidTypeConstructionError } from '../abstract-type-construction-bubble';

@Component({
  selector: 'app-create-array-type-bubble',
  templateUrl: './create-array-type-bubble.component.html',
  styleUrls: ['./create-array-type-bubble.component.css']
})
export class CreateArrayTypeBubbleComponent extends AbstractTypeConstructionBubble implements OnInit {

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

    return new ArrayType(this.currentTargetSelection);
  }

  protected onCancelConstruction(): void {
    // Intentionally left blank
  }

  protected onConstructionStopped(): void {
    this.currentTargetSelection = NO_SELECTION_PLACEHOLDER_BUBBLE.getType();
  }

  getSelectionText(): string {
    return AbstractTypeConstructionBubble.isEmpty(this.currentTargetSelection) ? AbstractTypeConstructionBubble.SELECTION_EMPTY_PLACEHOLDER + "[]" : new ArrayType(this.currentTargetSelection).toString();
  }

}