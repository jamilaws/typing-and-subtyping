import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { NoTypePlaceholder } from 'src/app/model/typing/types/common/no-type-placeholder';

export interface TypeBubble {
  getType(): AbstractType;
}

const NO_TYPE = new NoTypePlaceholder();
export const NO_SELECTION_PLACEHOLDER_BUBBLE: TypeBubble = {
  getType: () => { return NO_TYPE }
}

@Injectable({
  providedIn: 'root'
})
export class BubbleSelectionService {

  public selectedBubble: BehaviorSubject<TypeBubble>;

  constructor() {
    this.selectedBubble = new BehaviorSubject(NO_SELECTION_PLACEHOLDER_BUBBLE);
  }

  public selected(bubble: TypeBubble) {
    this.selectedBubble.next(bubble);
  }

  public unselect(): void {
    this.selectedBubble.next(NO_SELECTION_PLACEHOLDER_BUBBLE);
  }
}
