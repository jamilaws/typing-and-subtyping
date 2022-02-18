import { Component, Input, OnInit } from '@angular/core';
import { TypeDefinitionTable } from 'src/app/model/typing/type-definition-table';

@Component({
  selector: 'app-typedef-table',
  templateUrl: './typedef-table.component.html',
  styleUrls: ['./typedef-table.component.css']
})
export class TypedefTableComponent implements OnInit {

  @Input("typeDefs") typeDefs: TypeDefinitionTable = new Map();

  constructor() { }

  ngOnInit(): void {
  }

  getTypedefsAsTable(): string[][] {
    return Array.from(this.typeDefs.entries()).map(tup => [tup[0], tup[1].toString()]);
  }

}
