import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { Definition } from 'src/app/model/typing/types/common/definition';
import { PointerType } from 'src/app/model/typing/types/type-constructors/pointer-type';
import { StructType } from 'src/app/model/typing/types/type-constructors/struct-type';
import { Selectable } from 'src/app/util/dropdown/singleselect-dropdown/singleselect-dropdown.component';

export interface CreateStructDialogData {
  baseTypes: AbstractType[],
  constructedTypes: AbstractType[],
}

@Component({
  selector: 'app-create-struct-dialog',
  templateUrl: './create-struct-dialog.component.html',
  styleUrls: ['./create-struct-dialog.component.css']
})
export class CreateStructDialogComponent implements OnInit {

  members: Definition[] = new Array();

  selectableTargets: any[];

  constructor(
    public dialogRef: MatDialogRef<CreateStructDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateStructDialogData,
  ) {}

  ngOnInit(): void {
    this.selectableTargets = this.data.baseTypes.concat(this.data.constructedTypes).map(t => {
      return {name: t.toString(), obj: t};
    });
  }

  onClickAddMember(typeSelectable: any, name: string) {
    const type = typeSelectable.obj;

    this.members.push(new Definition(name, type));
    
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if(this.members.length === 0) alert("Please add at least one member.");
    const out = new StructType("TODO", this.members); // TODO COPY OF TARGET TYPE?
    this.dialogRef.close(out);
  }

}
