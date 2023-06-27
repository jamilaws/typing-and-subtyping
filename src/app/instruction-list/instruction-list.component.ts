import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-instruction-list',
  templateUrl: './instruction-list.component.html',
  styleUrls: ['./instruction-list.component.css']
})
export class InstructionListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }



  instr = [{
    summary :"Define Environment",
    details: "Define your environment in the code box"
  },
  {
    summary: "Type in Expresseion",
    details: "State the expression that you want to type check into the box on the right"
  },
  {
    summary: "Select devider",
    details: "Choose the correct devider for each leaf of the tree"
  },
  {
    summary: "Check type",
    details: "Start from the top to get the correct type for each step of the tree"
  }]

}
