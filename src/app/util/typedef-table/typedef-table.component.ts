import { Component, DoCheck, Input, IterableDiffers, OnChanges, OnInit } from '@angular/core';
import { TypeDefinitionTable } from 'src/app/model/typing/type-definition-table';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { CdeclService } from 'src/app/service/cdecl.service';

@Component({
  selector: 'app-typedef-table',
  templateUrl: './typedef-table.component.html',
  styleUrls: ['./typedef-table.component.css']
})
export class TypedefTableComponent implements OnInit {

  @Input("typeDefs") typeDefs: TypeDefinitionTable = new Map();

  ngOnInit(): void {
  }

  getTypedefsAsTable(): string[][] {
    return Array.from(this.typeDefs.entries()).map(tup => [tup[0], tup[1].toString()]);
  }

}
