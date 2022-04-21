import { Component, OnInit } from '@angular/core';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { NoTypePlaceholder } from 'src/app/model/typing/types/common/no-type-placeholder';
import { FunctionType } from 'src/app/model/typing/types/type-constructors/function-type';
import { TypeBubble } from '../../service/bubble-selection.service';
import { AbstractTypeConstructionBubble, InvalidTypeConstructionError } from '../abstract-type-construction-bubble';

enum SelectionState {
  RETURN, // Idle state in which the return type has to be selected
  PARAMS  // Return type selected already. Now, an arbitrary amount of param types can be selected.
}

@Component({
  selector: 'app-create-function-type-bubble',
  templateUrl: './create-function-type-bubble.component.html',
  styleUrls: ['./create-function-type-bubble.component.css']
})
export class CreateFunctionTypeBubbleComponent extends AbstractTypeConstructionBubble implements OnInit {

  private state: SelectionState = SelectionState.RETURN;

  private returnType: AbstractType;
  paramTypes: AbstractType[] = new Array();

  ngOnInit(): void { }

  protected onConstructionStarted(): void {
    // Intentionally left blank
  }

  protected onTypeBubbleSelected(bubble: TypeBubble): void {
    if (AbstractTypeConstructionBubble.isEmpty(bubble.getType())) {
      return;
    }
    switch (this.state) {
      case SelectionState.RETURN:
        this.returnType = bubble.getType();
        this.state = SelectionState.PARAMS;
        break;
      case SelectionState.PARAMS:
        this.paramTypes.push(bubble.getType());
    }
  }

  protected onApplyConstruction(): AbstractType {
    if (AbstractTypeConstructionBubble.isEmpty(this.returnType)) {
      throw new InvalidTypeConstructionError("Please select at least a return type.");
    }
    return new FunctionType(this.paramTypes, this.returnType);
  }

  protected onCancelConstruction(): void {
    // Intentionally left blank
  }

  protected onConstructionStopped(): void {
    this.returnType = null;
    this.paramTypes = new Array();
    this.state = SelectionState.RETURN;
  }

  getReturnTypeText(): string {
    return AbstractTypeConstructionBubble.isEmpty(this.returnType) ? AbstractTypeConstructionBubble.SELECTION_EMPTY_PLACEHOLDER : this.returnType.toString();
  }

  getParamTypesText(): string {
    let xs = this.paramTypes.map(t => t.toString());
    switch (this.state) {
      case SelectionState.RETURN:
        // Intentionally left blank
        break;
      case SelectionState.PARAMS:
        xs.push(AbstractTypeConstructionBubble.SELECTION_EMPTY_PLACEHOLDER);
        break;
    }
    return xs.join(', ');
  }

}







