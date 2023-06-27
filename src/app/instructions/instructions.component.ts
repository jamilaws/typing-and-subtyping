import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {

  title = "Instructions";

  constructor() { }

  ngOnInit(): void {
  }

  @Input() instruction: any;
}
