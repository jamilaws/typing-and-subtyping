import { Component, Input, OnInit } from '@angular/core';
import { StructuralSubtypingQuery } from 'src/app/model/typing/types/common/structural-subtyping/structural-subtyping-query';
import { TypeErrorPlaceholderType } from 'src/app/model/typing/types/placeholder-types/type-error-placeholder-type';
import { TypingTree } from 'src/app/model/typing/typing-tree/typing-tree';
import { ComponentInterconnectionService } from 'src/app/service/component-interconnection.service';

@Component({
  selector: 'app-typing-tree',
  templateUrl: './typing-tree.component.html',
  styleUrls: ['./typing-tree.component.css']
})
export class TypingTreeComponent implements OnInit {

  @Input("typingTree") typingTree: TypingTree;

  public _color: string;

  constructor(private componentInterconnectionService: ComponentInterconnectionService) { }

  ngOnInit(): void {
    this.initColor();
    this.initSubtypingLink();
  }

  private initColor(): void {
    if(this.typingTree.node.getType() instanceof TypeErrorPlaceholderType){
      this._color = "red";
    } else {
      this._color = "black";
    }
  }

  private initSubtypingLink(): void {
    if(this.typingTree.structuralSubtypingQuery){

    }
  }

  public _onClickSubtypingQuery(query: StructuralSubtypingQuery): void {
    this.componentInterconnectionService.onClickSubtypingQuery(query);
  }

}
