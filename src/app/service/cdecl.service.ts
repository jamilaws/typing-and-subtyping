import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TypeDefinitionTable } from '../model/typing/type-definition-table';
import { AbstractType } from '../model/typing/types/abstract-type';
import { CharType } from '../model/typing/types/base-types/char-type';
import { FloatType } from '../model/typing/types/base-types/float-type';
import { IntType } from '../model/typing/types/base-types/int-type';
import { ArrayType } from '../model/typing/types/type-constructors/array-type';
import { FunctionType } from '../model/typing/types/type-constructors/function-type';
import { PointerType } from '../model/typing/types/type-constructors/pointer-type';

@Injectable({
  providedIn: 'root'
})
export class CdeclService {

  private url: string = "https://xwd733f66f.execute-api.us-west-1.amazonaws.com/prod/cdecl_backend?q=";
  //private englishRequestPrefix: string = "declare+x+as+"

  private static DECLARATION_IDENTIFIER_PLACEHOLDER = "_";

  constructor(private http: HttpClient) {
    // Uncomment the line below to run tests comparing cdecl implementation to web API.
    //this.runAllTests();
  }

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
      return declarationString;
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


  /*

  Testing

  */

  private runAllTests(): void {

    this.simplePointerTest();
    this.simpleArrayTest();
    this.simpleFunctionTestNoParams();
    this.simpleFunctionTestParams();
    this.pointerArrayTest();
    this.pointerFunctionTest();
    this.stressTest();

    // const tests = [
    //   this.simplePointerTest,
    //   this.simpleArrayTest,
    // ];

    // let successCounter = 0;
    // let errors = new Array();

    // tests.forEach(async test => {
    //   try {
    //     await test();
    //     successCounter++;
    //   } catch(e) {
    //     errors.push(e);
    //   };
    // });

    // console.log("%c Cdecl test result: " + successCounter + " of " + tests.length + " tests passed. Errors:", 'color: green');
    // console.log(errors);
  }

  private printSuccess(testName: string, txt: string): void {
    console.log("%c Test '" + testName + "' successful.\n" + txt, 'color: green');
  }

  private printFailure(testName: string, txt: string): void {
    console.log("%c Test '" + testName + "' failed.\n" + txt, 'color: red');
  }

  private printFailureWithError(testName: string, error: unknown) {
    this.printFailure(testName, "Error: " + error);
  }

  private assertEquals(testName: string, expected: string, actual: string): void {
    if (expected !== actual) {
      this.printFailure(testName, `Expected: ${expected}\nActual:   ${actual}`);
    } else {
      this.printSuccess(testName, "Output: " + actual);
    }
  }

  public toCdeclCTest(testName: string, type: AbstractType): void {
    let customC: string = null;
    try {
      customC = type.toCdeclC();
      this.typeToString(type).then(cdeclC => {
        this.assertEquals(testName, cdeclC, customC);
      });
    } catch (e) {
      this.printFailureWithError(testName, e);
    }
  }

  public simplePointerTest(): void {
    const testName = "simplePointerTest"
    let type = new PointerType(new IntType());

    this.toCdeclCTest(testName, type);
  }

  public simpleArrayTest(): void {
    const testName = "simpleArrayTest"
    let type = new ArrayType(new IntType());

    this.toCdeclCTest(testName, type);
  }

  public simpleFunctionTestNoParams(): void {
    const testName = "simpleFunctionTestNoParams"
    let type = new FunctionType([], new IntType());

    this.toCdeclCTest(testName, type);
  }

  public simpleFunctionTestParams(): void {
    const testName = "simpleFunctionTestParams"
    let type = new FunctionType([new IntType(), new FloatType], new CharType());

    this.toCdeclCTest(testName, type);
  }

  public pointerArrayTest(): void {
    const testName = "pointerArrayTest"
    let type = new PointerType(new ArrayType(new ArrayType(new PointerType(new ArrayType(new IntType())))));

    this.toCdeclCTest(testName, type);
  }

  public pointerFunctionTest(): void {
    const testName = "pointerFunctionTest"
    let type = new PointerType(new FunctionType([new PointerType(new IntType())], new PointerType(new FunctionType([], new PointerType(new PointerType(new IntType()))))));

    this.toCdeclCTest(testName, type);
  }

  public stressTest(): void {
    const testName = "stressTest"

    // declare x as function (function returning array of pointer to pointer to int)
    const stressTest_Params = [new FunctionType([], new ArrayType(new PointerType(new PointerType(new IntType()))))];
    // returning pointer to array 5 of pointer to function returning pointer to char
    const stressTest_Return = new PointerType(new ArrayType(new PointerType(new FunctionType([], new PointerType(new CharType()))), 5));
    
    // char* (*(*x(int* (*(()[]))))[5])();
    const type = new FunctionType(stressTest_Params, stressTest_Return);

    this.toCdeclCTest(testName, type);
  }
}
