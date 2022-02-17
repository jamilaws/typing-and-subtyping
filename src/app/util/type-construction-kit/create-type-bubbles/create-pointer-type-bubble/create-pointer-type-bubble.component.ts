import { Component, OnInit } from '@angular/core';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { NoTypePlaceholder } from 'src/app/model/typing/types/common/no-type-placeholder';
import { PointerType } from 'src/app/model/typing/types/type-constructors/pointer-type';
import { TypeBubble } from '../../service/bubble-selection.service';
import { AbstractCreateTypeBubble } from '../abstract-create-type-bubble';

@Component({
  selector: 'app-create-pointer-type-bubble',
  templateUrl: './create-pointer-type-bubble.component.html',
  styleUrls: ['./create-pointer-type-bubble.component.css']
})
export class CreatePointerTypeBubbleComponent extends AbstractCreateTypeBubble implements OnInit {

  private currentTargetSelection: AbstractType;

  ngOnInit(): void {
    
  }

  public override setVisible(value: boolean): void {
    super.setVisible(value);
  }

  private isSelectionEmpty(): boolean {
    return this.currentTargetSelection instanceof NoTypePlaceholder;
  }
  
  getSelectionText(): string {
    return this.isSelectionEmpty() ? "_" : this.currentTargetSelection.toString();
  }

  protected override onTypeBubbleSelected(bubble: TypeBubble): void {
    this.currentTargetSelection = bubble.getType();
  }

  protected override applyCreation(): void {
    if (this.isSelectionEmpty()) {
      alert("Please select a bubble.");
      return;
    }

    this.outputTypeToCreate(new PointerType(this.currentTargetSelection));

    this.reset();
  }

}
