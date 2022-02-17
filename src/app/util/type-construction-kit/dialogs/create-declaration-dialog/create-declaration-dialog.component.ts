import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';

export interface CreateDeclarationDialogData {
  type: AbstractType
}

@Component({
  selector: 'app-create-declaration-dialog',
  templateUrl: './create-declaration-dialog.component.html',
  styleUrls: ['./create-declaration-dialog.component.css']
})
export class CreateDeclarationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CreateDeclarationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateDeclarationDialogData,
  ) {}

  ngOnInit(): void {
  }

  onClickCancel(): void {
    this.dialogRef.close();
  }

  onClickCreate(name: string): void {
    if(!name) return;
    this.dialogRef.close({
      name: name,
      type: this.data.type
    });
  }

}
