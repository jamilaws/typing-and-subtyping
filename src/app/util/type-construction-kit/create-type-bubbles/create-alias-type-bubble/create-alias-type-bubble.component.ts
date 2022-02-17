import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractType, AliasPlaceholderType } from 'src/app/model/typing/types/abstract-type';
import { TypeBubble } from '../../service/bubble-selection.service';
import { AbstractCreateTypeBubble, InvalidTypeCreationError } from '../abstract-create-type-bubble';

@Component({
  selector: 'app-create-alias-type-bubble',
  templateUrl: './create-alias-type-bubble.component.html',
  styleUrls: ['./create-alias-type-bubble.component.css']
})
export class CreateAliasTypeBubbleComponent extends AbstractCreateTypeBubble implements OnInit {

  @ViewChild("aliasInput") aliasInput: ElementRef;

  ngOnInit(): void {}

  protected onCreationStarted(): void {
    this.aliasInput.nativeElement.focus();
  }

  protected onTypeBubbleSelected(bubble: TypeBubble): void {
    // Intentionally left blank
  }

  protected onApplyCreation(): AbstractType {
    const enteredAlias: string = this.aliasInput.nativeElement.value;
    if(!enteredAlias) throw new InvalidTypeCreationError("No valid alias has been entered");
    return new AliasPlaceholderType(enteredAlias);
  }

  protected onCancelCreation(): void {
    // Intentionally left blank
  }

  protected onCreationStopped(): void {
    this.aliasInput.nativeElement.value = "";
  }

}
