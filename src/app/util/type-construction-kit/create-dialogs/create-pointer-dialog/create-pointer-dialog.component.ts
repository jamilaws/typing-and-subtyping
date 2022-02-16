import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { PointerType } from 'src/app/model/typing/types/type-constructors/pointer-type';
import { Selectable } from 'src/app/util/dropdown/singleselect-dropdown/singleselect-dropdown.component';

export interface CreatePointerDialogData {
  baseTypes: AbstractType[],
  constructedTypes: AbstractType[],
}

@Component({
  selector: 'app-create-pointer-dialog',
  templateUrl: './create-pointer-dialog.component.html',
  styleUrls: ['./create-pointer-dialog.component.css']
})
export class CreatePointerDialogComponent implements OnInit {

  selectableTargets: any[];
  selectedTarget: AbstractType;

  constructor(
    public dialogRef: MatDialogRef<CreatePointerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreatePointerDialogData,
  ) {}

  ngOnInit(): void {
    this.selectableTargets = this.data.baseTypes.concat(this.data.constructedTypes).map(t => {
      return {name: t.toString(), obj: t};
    });
    this.selectedTarget = this.selectableTargets[0].obj;
  }

  onSelectOption(selectable: any): void {
    this.selectedTarget = selectable.obj;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    const out = new PointerType(this.selectedTarget); // TODO COPY OF TARGET TYPE?
    this.dialogRef.close(out);
  }

}
