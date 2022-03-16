import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { Definition } from 'src/app/model/typing/types/common/definition';
import { NoTypePlaceholder } from 'src/app/model/typing/types/common/no-type-placeholder';
import { StructType } from 'src/app/model/typing/types/type-constructors/struct-type';
import { NO_SELECTION_PLACEHOLDER_BUBBLE, TypeBubble } from '../../service/bubble-selection.service';
import { AbstractCreateTypeBubble, InvalidTypeCreationError } from '../abstract-create-type-bubble';

@Component({
  selector: 'app-create-struct-type-bubble',
  templateUrl: './create-struct-type-bubble.component.html',
  styleUrls: ['./create-struct-type-bubble.component.css']
})
export class CreateStructTypeBubbleComponent extends AbstractCreateTypeBubble implements OnInit {

  @ViewChild('nameInput') nameInput: ElementRef;

  currentTypeSelection: AbstractType;
  members: Definition[] = new Array();

  ngOnInit(): void { }

  protected onCreationStarted(): void {
    // Intentionally left blank
  }

  protected onTypeBubbleSelected(bubble: TypeBubble): void {
    this.currentTypeSelection = bubble.getType();
    this.nameInput.nativeElement.focus();
  }

  protected onApplyCreation(): AbstractType {
    if (this.members.length === 0) {
      throw new InvalidTypeCreationError("Please add a member to the struct.");
    }

    return new StructType("TODO", this.members);
  }

  protected onCancelCreation(): void {
    // Intentionally left blank
  }

  protected onCreationStopped(): void {
    this.members = new Array();
    this.currentTypeSelection = NO_SELECTION_PLACEHOLDER_BUBBLE.getType();
    this.resetAddRow();
  }


  private resetAddRow(): void {
    // Reset
    this.bubbleSelectionService.unselect();
    this.nameInput.nativeElement.value = "";
    this.nameInput.nativeElement.focus();
  }


  onClickAddMember(name: string) {
    if (!name) {
      alert("Please enter a member name");
      return;
    }

    if (AbstractCreateTypeBubble.isEmpty(this.currentTypeSelection)) {
      alert("Please select a member type");
      return;
    }
    this.members.push(new Definition(name, this.currentTypeSelection));

    this.resetAddRow();
  }

  getSelectionText(): { prefix: string, suffix: string } {
    return AbstractCreateTypeBubble.isEmpty(this.currentTypeSelection) ? { prefix: AbstractCreateTypeBubble.SELECTION_EMPTY_PLACEHOLDER, suffix: ""} : this.currentTypeSelection.toStringSplit();
  }

  getInputPrefix(): string {
    const semicolon = this.members.length > 0 ? ";" : "";
    return "struct { " + this.members.map(m => m.getType().toCdeclC(m.getName())).join("; ") + semicolon;
  }

  getInputSuffix(): string {
    return " }";
  }

}