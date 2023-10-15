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
    details: "Define your environment in the code box and click 'Ready!'"
  },
  {
    summary: "Type in Expression",
    details: "State the expression that you want to type check into the box under your environment"
  },
  {
    summary: "Select Rule",
    details: "Choose the correct rule for each leaf of the tree. If you don't know what rule to apply, click 'Remind me of the rules!'"
  },
  {
    summary: "Well done!",
    details: "You have applied the algorithm correctly when there is nothing to select left."
  }]

  

}
