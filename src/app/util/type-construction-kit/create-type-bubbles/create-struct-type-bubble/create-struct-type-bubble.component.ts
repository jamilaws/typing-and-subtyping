import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { Definition } from 'src/app/model/typing/types/common/definition';
import { NoTypePlaceholder } from 'src/app/model/typing/types/common/no-type-placeholder';
import { StructType } from 'src/app/model/typing/types/type-constructors/struct-type';
import { TypeBubble } from '../../service/bubble-selection.service';
import { AbstractCreateTypeBubble } from '../abstract-create-type-bubble';

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

  public override reset(): void {
      super.reset();
      this.members = new Array();
  }

  onClickAddMember(name: string) {
    if(this.isSelectionEmpty()){
      alert("Please select a type bubble.");
      return;
    }
    this.members.push(new Definition(name, this.currentTypeSelection));
    // Reset
    this.bubbleSelectionService.unselect();
    this.nameInput.nativeElement.value = "";
  }

  private isSelectionEmpty(): boolean {
    return this.currentTypeSelection instanceof NoTypePlaceholder;
  }

  getSelectionText(): string {
    return this.isSelectionEmpty() ? "_" : this.currentTypeSelection.toString();
  }

  protected override onTypeBubbleSelected(bubble: TypeBubble): void {
    this.currentTypeSelection = bubble.getType();
  }

  protected applyCreation(): void {
    if(this.members.length === 0) {
      alert("Please add a member to the struct.");
      return;
    }
    
    this.outputTypeToCreate(new StructType("TODO", this.members));
    this.reset();
  }

}
