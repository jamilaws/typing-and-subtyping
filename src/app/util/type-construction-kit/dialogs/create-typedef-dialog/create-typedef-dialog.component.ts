import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';

export interface CreateTypedefDialogData {
  type: AbstractType
}

@Component({
  selector: 'app-create-typedef-dialog',
  templateUrl: './create-typedef-dialog.component.html',
  styleUrls: ['./create-typedef-dialog.component.css']
})
export class CreateTypedefDialogComponent implements OnInit {

  @ViewChild('nameInput') nameInput: ElementRef;

  public _prefix: string;
  public _suffix: string;

  constructor(
    public dialogRef: MatDialogRef<CreateTypedefDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateTypedefDialogData,
  ) { }

  ngOnInit(): void {
    const split = this.data.type.toStringSplit();
    this._prefix = "typedef " + split.prefix;
    this._suffix = split.suffix;
  }

  onClickCancel(): void {
    this.dialogRef.close();
  }

  onClickCreate(alias: string): void {
    if (!alias) return;
    this.dialogRef.close({
      alias: alias,
      type: this.data.type
    });
  }

  updateInputWidth() {
    this.nameInput.nativeElement.style.width = (this.nameInput.nativeElement.value.length * 12) + 'px';
  }

}
