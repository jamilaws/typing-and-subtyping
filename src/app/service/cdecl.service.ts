import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CdeclService {

  private url: string = "https://xwd733f66f.execute-api.us-west-1.amazonaws.com/prod/cdecl_backend?q=";
  private englishRequestPrefix: string = "declare+x+as+"

  constructor(private http: HttpClient) { }

  public englishToC(english: string): Promise<string> {
    const englishPlusSeparated = english.replace(' ', '+');
    const requestUrl = this.url + this.englishRequestPrefix + englishPlusSeparated;
    return this.http.get(requestUrl).toPromise().then(o => o.toString());
  }

}
