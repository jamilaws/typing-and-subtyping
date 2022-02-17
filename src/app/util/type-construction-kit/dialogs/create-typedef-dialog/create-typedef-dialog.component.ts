import { Component, Inject, OnInit } from '@angular/core';
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

  constructor(
    public dialogRef: MatDialogRef<CreateTypedefDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateTypedefDialogData,
  ) {}

  ngOnInit(): void {
  }

  onClickCancel(): void {
    this.dialogRef.close();
  }

  onClickCreate(alias: string): void {
    if(!alias) return;
    this.dialogRef.close({
      alias: alias,
      type: this.data.type
    });
  }

}
