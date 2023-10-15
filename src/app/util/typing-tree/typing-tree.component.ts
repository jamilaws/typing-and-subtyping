import { Component, Input, OnInit } from '@angular/core';
import { StructuralSubtypingQuery } from 'src/app/model/typing/types/common/structural-subtyping/structural-subtyping-query';
import { TypeErrorPlaceholderType } from 'src/app/model/typing/types/placeholder-types/type-error-placeholder-type';
import { TypingTree } from 'src/app/model/typing/typing-tree/typing-tree';
import { TypingTreeNodeLabel } from 'src/app/model/typing/typing-tree/typing-tree-node-label';
import { ComponentInterconnectionService } from 'src/app/service/component-interconnection.service';
import { Labels } from './selectableLabels.interface';

@Component({
  selector: 'app-typing-tree',
  templateUrl: './typing-tree.component.html',
  styleUrls: ['./typing-tree.component.css']
})
export class TypingTreeComponent implements OnInit {

  @Input("typingTree") typingTree: TypingTree;

  //public _color: string;
  public _subtypingInfoTooltip: string = "Click to view structural subtype queries"

  public labels : Array<Labels> = [
    {valueLabel: TypingTreeNodeLabel.CONST, name: "CONST"},
    {valueLabel: TypingTreeNodeLabel.VAR, name: "VAR"},
    {valueLabel: TypingTreeNodeLabel.REF, name: "REF"},
    {valueLabel: TypingTreeNodeLabel.DEREF, name: "DEREF"},
    {valueLabel: TypingTreeNodeLabel.ARRAY, name: "ARRAY"},
    {valueLabel: TypingTreeNodeLabel.STRUCT, name: "STRUCT"},
    {valueLabel: TypingTreeNodeLabel.APP, name: "APP"},
    {valueLabel: TypingTreeNodeLabel.OP, name: "OP"},
    //{valueLabel: TypingTreeNodeLabel.OP_ASSIGN, name: "OP ="} -> not in use
  ]
  public selectedLabel : TypingTreeNodeLabel = TypingTreeNodeLabel.TEMP;
  public startingPoint : TypingTreeNodeLabel = TypingTreeNodeLabel.TEMP 

  constructor(private componentInterconnectionService: ComponentInterconnectionService) { }

  ngOnInit(): void {
    //this.initColor();
  }

  // private initColor(): void {
  //   if(this.typingTree.node.getType() instanceof TypeErrorPlaceholderType){
  //     this._color = "red";
  //   } else {
  //     this._color = "black";
  //   }
  // }

  public _onClickSubtypingQuery(query: StructuralSubtypingQuery): void {
    this.componentInterconnectionService.onClickSubtypingQuery(query);
  }

  public _getColor(): string {
    if(this.typingTree.node.getType() instanceof TypeErrorPlaceholderType){
      return "red";
    } else {
      return "black";
    }
  }

}
