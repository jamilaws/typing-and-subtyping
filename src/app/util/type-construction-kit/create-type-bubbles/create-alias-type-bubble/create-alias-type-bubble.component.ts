import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractType, AliasPlaceholderType } from 'src/app/model/typing/types/abstract-type';
import { TypeBubble } from '../../service/bubble-selection.service';
import { AbstractTypeConstructionBubble, InvalidTypeConstructionError } from '../abstract-type-construction-bubble';

@Component({
  selector: 'app-create-alias-type-bubble',
  templateUrl: './create-alias-type-bubble.component.html',
  styleUrls: ['./create-alias-type-bubble.component.css']
})
export class CreateAliasTypeBubbleComponent extends AbstractTypeConstructionBubble implements OnInit {

  @Input("isAliasAvailableCallback") isAliasAvailableCallback: (alias: string) => boolean;

  @ViewChild("aliasInput") aliasInput: ElementRef;

  ngOnInit(): void {}

  protected onConstructionStarted(): void {
    this.aliasInput.nativeElement.focus();
  }

  protected onTypeBubbleSelected(bubble: TypeBubble): void {
    // Intentionally left blank
  }

  protected onApplyConstruction(): AbstractType {
    const enteredAlias: string = this.aliasInput.nativeElement.value;
    if(!enteredAlias) throw new InvalidTypeConstructionError("Please enter a valid alias name");
    if(!this.isAliasAvailableCallback(enteredAlias)) throw new InvalidTypeConstructionError("Please enter an available alias name");
    return new AliasPlaceholderType(enteredAlias);
  }

  protected onCancelConstruction(): void {
    // Intentionally left blank
  }

  protected onConstructionStopped(): void {
    this.aliasInput.nativeElement.value = "";
  }

}
