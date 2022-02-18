import { Component, Input, OnInit } from '@angular/core';
import { Declaration } from 'src/app/model/typing/symbol-table';

@Component({
  selector: 'app-declarations-table',
  templateUrl: './declarations-table.component.html',
  styleUrls: ['./declarations-table.component.css']
})
export class DeclarationsTableComponent implements OnInit {
  
  @Input("declarations") declarations: Declaration[];

  constructor() { }

  ngOnInit(): void {
  }

}
