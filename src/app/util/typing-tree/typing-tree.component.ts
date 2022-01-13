import { Component, Input, OnInit } from '@angular/core';
import { TypingTree } from 'src/app/model/typing/typing-tree/typing-tree';

@Component({
  selector: 'app-typing-tree',
  templateUrl: './typing-tree.component.html',
  styleUrls: ['./typing-tree.component.css']
})
export class TypingTreeComponent implements OnInit {

  @Input("typingTree") typingTree: TypingTree;

  constructor() { }

  ngOnInit(): void {
    console.log(this.typingTree);
  }

}
