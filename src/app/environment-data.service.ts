import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentDataService {

  private map = new BehaviorSubject(null);

  public sharedMap = this.map.asObservable();

  public updateMap(map : any) {
    this.map = map;
  }

  constructor() { }
}
