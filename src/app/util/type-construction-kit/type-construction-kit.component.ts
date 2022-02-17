import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { BaseType } from 'src/app/model/typing/types/base-type';
import { CharType } from 'src/app/model/typing/types/base-types/char-type';
import { FloatType } from 'src/app/model/typing/types/base-types/float-type';
import { IntType } from 'src/app/model/typing/types/base-types/int-type';
import { ArrayType } from 'src/app/model/typing/types/type-constructors/array-type';
import { AbstractCreateTypeBubble } from './create-type-bubbles/abstract-create-type-bubble';
import { CreateArrayTypeBubbleComponent } from './create-type-bubbles/create-array-type-bubble/create-array-type-bubble.component';
import { CreateFunctionTypeBubbleComponent } from './create-type-bubbles/create-function-type-bubble/create-function-type-bubble.component';
import { CreatePointerTypeBubbleComponent } from './create-type-bubbles/create-pointer-type-bubble/create-pointer-type-bubble.component';
import { CreateStructTypeBubbleComponent } from './create-type-bubbles/create-struct-type-bubble/create-struct-type-bubble.component';

interface ConstructionOption {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-type-construction-kit',
  templateUrl: './type-construction-kit.component.html',
  styleUrls: ['./type-construction-kit.component.css']
})
export class TypeConstructionKitComponent implements OnInit {

  @ViewChild('createPointerBubble') createPointerBubble: CreatePointerTypeBubbleComponent;
  @ViewChild('createArrayBubble') createArrayBubble: CreateArrayTypeBubbleComponent;
  @ViewChild('createStructBubble') createStructBubble: CreateStructTypeBubbleComponent;
  @ViewChild('createFunctionBubble') createFunctionBubble: CreateFunctionTypeBubbleComponent;

  baseTypes: BaseType[] = [new IntType(), new CharType(), new FloatType()];
  constructedTypes: AbstractType[] = [new ArrayType(new IntType())];

  creationActive: boolean = false;

  constructionOptions: ConstructionOption[] = [
    {
      _id: "1",
      name: "struct"
    },
    {
      _id: "2",
      name: "array"
    },
  ];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void { }

  public onClickCreatePointer() {
    this.createPointerBubble.start();
    this.createArrayBubble.reset();
    this.createStructBubble.reset();
    this.createFunctionBubble.reset();

    this.creationActive = true;
  }

  public onClickStartCreation(creationBubble: AbstractCreateTypeBubble) {
    this.createPointerBubble.reset();
    this.createArrayBubble.reset();
    this.createStructBubble.reset();
    this.createFunctionBubble.reset();

    creationBubble.start();

    this.creationActive = true;
  }

  onApplyCreation(type: AbstractType) {
    this.constructedTypes.push(type);
    this.creationActive = false;
  }

  onCancelCreation(): void {
    this.creationActive = false;
  }

}
