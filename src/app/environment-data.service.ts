import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentDataService {

  private map = new BehaviorSubject("");

  public sharedMap = this.map.asObservable();

  public updateMap(newMap : any) {
    console.log("used updateMap")
    this.map.next(newMap);
  }

  constructor() { }
}
