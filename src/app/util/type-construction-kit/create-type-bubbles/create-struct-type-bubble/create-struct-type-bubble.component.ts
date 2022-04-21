import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { Definition } from 'src/app/model/typing/types/common/definition';
import { NoTypePlaceholder } from 'src/app/model/typing/types/common/no-type-placeholder';
import { StructType } from 'src/app/model/typing/types/type-constructors/struct-type';
import { NO_SELECTION_PLACEHOLDER_BUBBLE, TypeBubble } from '../../service/bubble-selection.service';
import { AbstractTypeConstructionBubble, InvalidTypeConstructionError } from '../abstract-type-construction-bubble';


@Component({
  selector: 'app-create-struct-type-bubble',
  templateUrl: './create-struct-type-bubble.component.html',
  styleUrls: ['./create-struct-type-bubble.component.css']
})
export class StructTypeConstructionBubbleComponent extends AbstractTypeConstructionBubble implements OnInit {

  @ViewChild('nameInput') nameInput: ElementRef;

  currentTypeSelection: AbstractType;
  addedMembers: Definition[] = new Array();

  ngOnInit(): void { }

  protected onConstructionStarted(): void {
  }

  protected onTypeBubbleSelected(bubble: TypeBubble): void {
    this.currentTypeSelection = bubble.getType();
    this.nameInput.nativeElement.focus();
  }

  protected onApplyConstruction(): AbstractType {
    // if (this.addedMembers.length === 0) {
    //   throw new InvalidTypeConstructionError("Please add a member to the struct.");
    // }

    return new StructType("TODO", this.addedMembers);
  }

  protected onCancelConstruction(): void {
    // Intentionally left blank
  }

  protected onConstructionStopped(): void {
    this.addedMembers = new Array();
    this.currentTypeSelection = NO_SELECTION_PLACEHOLDER_BUBBLE.getType();
    this.resetAddRow();
  }


  private resetAddRow(): void {
    // Reset
    this.nameInput.nativeElement.value = "";
    this.nameInput.nativeElement.focus();
  }


  onClickAddMember(name: string) {
    if (!name) {
      alert("Please enter a member name");
      return;
    }

    if (AbstractTypeConstructionBubble.isEmpty(this.currentTypeSelection)) {
      alert("Please select a member type");
      return;
    }
    this.addedMembers.push(new Definition(name, this.currentTypeSelection));

    this.resetAddRow();
  }

  /*
  
  Helper methods

  */

  getSelectionText(): { prefix: string, suffix: string } {
    return AbstractTypeConstructionBubble.isEmpty(this.currentTypeSelection) ? { prefix: AbstractTypeConstructionBubble.SELECTION_EMPTY_PLACEHOLDER, suffix: ""} : this.currentTypeSelection.toStringSplit();
  }

  getInputPrefix(): string {
    const semicolon = this.addedMembers.length > 0 ? ";" : "";
    return "struct { " + this.addedMembers.map(m => m.getType().toCdeclC(m.getName())).join("; ") + semicolon;
  }

  getInputSuffix(): string {
    return " }";
  }

}