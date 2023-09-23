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
    details: "Define your environment in the code box and click 'Ready!'" 
  },
  {
    summary: "Select Types",
    details: "Select from the dropdown the supertype and the subtype"
  },
  {
    summary: "Subtyping Relation",
    details: "You will find the solution beneath the two types you have selected. Try and comprehend the subtypingtree on the right!"
  }]

}
