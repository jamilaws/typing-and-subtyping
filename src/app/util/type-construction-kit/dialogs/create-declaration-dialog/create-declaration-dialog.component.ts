import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';

export interface CreateDeclarationDialogData {
  identifier: string;
  type: AbstractType
}

@Component({
  selector: 'app-create-declaration-dialog',
  templateUrl: './create-declaration-dialog.component.html',
  styleUrls: ['./create-declaration-dialog.component.css']
})
export class CreateDeclarationDialogComponent implements OnInit {

  @ViewChild('nameInput') nameInput: ElementRef;

  public _prefix: string;
  public _suffix: string;

  constructor(
    public dialogRef: MatDialogRef<CreateDeclarationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateDeclarationDialogData,
  ) {}

  ngOnInit(): void {
    const split = this.data.type.toStringSplit();
    this._prefix = split.prefix;
    this._suffix = split.suffix;
  }

  onClickCancel(): void {
    this.dialogRef.close();
  }

  onClickCreate(identifier: string): void {
    if(!identifier) return;
    this.dialogRef.close({
      identifier: identifier,
      type: this.data.type
    });
  }

  updateInputWidth() {
    this.nameInput.nativeElement.style.width = (this.nameInput.nativeElement.value.length * 12) + 'px';
  }

}
