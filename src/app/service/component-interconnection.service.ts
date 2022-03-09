import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StructuralSubtypingQuery } from '../model/typing/types/common/structural-subtyping/structural-subtyping-query';

@Injectable({
  providedIn: 'root'
})
export class ComponentInterconnectionService {

  constructor() { }

  /**
   * Subscribe to handle clicks on StructuralSubtypingQuery objects (e.g. in TypingTrees)
   */
  public clickedStructuralSubtypingQuery: Subject<StructuralSubtypingQuery> = new Subject<StructuralSubtypingQuery>();

  public onClickSubtypingQuery(query: StructuralSubtypingQuery) {
    this.clickedStructuralSubtypingQuery.next(query);
  }
}
