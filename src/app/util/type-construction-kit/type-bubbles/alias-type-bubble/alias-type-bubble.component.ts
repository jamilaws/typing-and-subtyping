import { Component, OnInit } from '@angular/core';
import { AbstractTypeBubble } from '../abstract-type-bubble';

@Component({
  selector: 'app-alias-type-bubble',
  templateUrl: './alias-type-bubble.component.html',
  styleUrls: ['./alias-type-bubble.component.css']
})
export class AliasTypeBubbleComponent extends AbstractTypeBubble implements OnInit {

  ngOnInit(): void {
  }

}
