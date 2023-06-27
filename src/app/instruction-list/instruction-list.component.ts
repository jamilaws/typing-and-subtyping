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



  instr1={
    summary :"Define Environment",
    details: "Define your environment in the code box"
  }

}
