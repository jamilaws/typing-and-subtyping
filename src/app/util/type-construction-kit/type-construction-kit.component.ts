import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { BaseType } from 'src/app/model/typing/types/base-type';
import { CharType } from 'src/app/model/typing/types/base-types/char-type';
import { FloatType } from 'src/app/model/typing/types/base-types/float-type';
import { IntType } from 'src/app/model/typing/types/base-types/int-type';
import { ArrayType } from 'src/app/model/typing/types/type-constructors/array-type';
import { PointerType } from 'src/app/model/typing/types/type-constructors/pointer-type';
import { StructType } from 'src/app/model/typing/types/type-constructors/struct-type';
import { CreatePointerDialogComponent } from './create-dialogs/create-pointer-dialog/create-pointer-dialog.component';
import { CreateStructDialogComponent } from './create-dialogs/create-struct-dialog/create-struct-dialog.component';

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

  baseTypes: BaseType[] = [new IntType(), new CharType(), new FloatType()];
  constructedTypes: AbstractType[] = [new ArrayType(new IntType())];

  createArrayActive: boolean = false;

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

  ngOnInit(): void {
  }

  public onClickCreatePointer(): void {
    const dialogRef = this.dialog.open(CreatePointerDialogComponent, {
      width: '300px',
      data: {
        baseTypes: this.baseTypes,
        constructedTypes: this.constructedTypes
      },
    });

    dialogRef.afterClosed().subscribe((result: PointerType) => {
      if(result) this.constructedTypes.push(result);
    });
  }

  public onClickCreateArray(): void {
    this.createArrayActive = true;
  }

  public onClickCreateStruct(): void {
    const dialogRef = this.dialog.open(CreateStructDialogComponent, {
      width: '500px',
      data: {
        baseTypes: this.baseTypes,
        constructedTypes: this.constructedTypes
      },
    });

    dialogRef.afterClosed().subscribe((result: StructType) => {
      if(result) this.constructedTypes.push(result);
    });
  }

}
