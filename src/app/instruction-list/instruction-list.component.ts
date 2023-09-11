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
    details: "State the expression that you want to type check into the box under your environment"
  },
  {
    summary: "Select Rule",
    details: "Choose the correct rule for each leaf of the tree"
  },
  {
    summary: "Check Type",
    details: "Start from the leaves of the tree to get choose the type for each node"
  }]

  

}
