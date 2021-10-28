import { Injectable } from '@angular/core';
const parse = require('../../../cparse/cparse');

//declare var Parser: any;

@Injectable({
  providedIn: 'root'
})
export class ParsingService {

  constructor() {
    
  }

  // TODO implement interface
  public parse(code: string): any {
    return parse(code);
  }
}
