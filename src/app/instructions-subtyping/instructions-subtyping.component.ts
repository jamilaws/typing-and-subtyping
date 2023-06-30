import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instructions-subtyping',
  templateUrl: './instructions-subtyping.component.html',
  styleUrls: ['./instructions-subtyping.component.css']
})
export class InstructionsSubtypingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  instr = [{
    summary: "Define Environment",
    details: "Define your environment in the code box"
  },
  {
    summary: "State Expressions",
    details: "put bot or your expressions in the respective boxes"
  },
  {
    summary: "check types",
    details: "Check the types of both the expressions"
  }]

}
