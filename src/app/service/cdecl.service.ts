import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TypeDefinitionTable } from '../model/typing/type-definition-table';
import { AbstractType } from '../model/typing/types/abstract-type';

@Injectable({
  providedIn: 'root'
})
export class CdeclService {

  private url: string = "https://xwd733f66f.execute-api.us-west-1.amazonaws.com/prod/cdecl_backend?q=";
  //private englishRequestPrefix: string = "declare+x+as+"

  private static DECLARATION_IDENTIFIER_PLACEHOLDER = "DECLARATION_IDENTIFIER_PLACEHOLDER";

  constructor(private http: HttpClient) { }

  private cdecl_englishToC(english: string): Promise<string> {
    const requestUrl = this.url + english.replace(' ', '+');
    return this.http.get(requestUrl).toPromise().then(o => o.toString());
  }

  public declarationToString(identifier: string, type: AbstractType): Promise<string> {
    return this.cdecl_englishToC("declare " + identifier + " as " + type.toCdeclEnglish());
  }

  /**
   * TODO: Clearify if this is correct!
   */
  public typeToString(type: AbstractType): Promise<string> {
    const placeholder: string = CdeclService.DECLARATION_IDENTIFIER_PLACEHOLDER;
    return this.declarationToString(placeholder, type).then(declarationString => {
      // Remove placeholder and empty spaces
      return declarationString.replace(placeholder, "").replace(/ /g, "")
    });
  }

  /**
   * TODO: Clearify if this is correct!
   */
  public typedefToString(alias: string, type: AbstractType): Promise<string> {
    return this.declarationToString(alias, type).then(declarationString => {
      // Add prefix
      return "typedef " + declarationString;
    })
  } 
}
