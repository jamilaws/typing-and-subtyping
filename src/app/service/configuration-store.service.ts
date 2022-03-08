import { Injectable } from '@angular/core';
import { Declaration } from '../model/typing/symbol-table';
import { TypeDefinitionTable } from '../model/typing/type-definition-table';
import { AbstractType, AliasPlaceholderType } from '../model/typing/types/abstract-type';
import { BaseType } from '../model/typing/types/base-type';
import { CharType } from '../model/typing/types/base-types/char-type';
import { FloatType } from '../model/typing/types/base-types/float-type';
import { IntType } from '../model/typing/types/base-types/int-type';
import { ArrayType } from '../model/typing/types/type-constructors/array-type';
import { FunctionType } from '../model/typing/types/type-constructors/function-type';
import { PointerType } from '../model/typing/types/type-constructors/pointer-type';

export interface Configuration {
  // Types
  baseTypes: BaseType[];
  constructedTypes: AbstractType[];
  aliasTypes: AliasPlaceholderType[];
  // Typedefs
  typeDefinitions: TypeDefinitionTable;
  // Declarations
  declarations: Declaration[]
}

// char* (*(*x(int* (*(()[]))))[5])();

// declare x as function (function returning array of pointer to pointer to int)
const stressTest_Params = [new FunctionType([], new ArrayType(new PointerType(new PointerType(new IntType()))))];
// returning pointer to array 5 of pointer to function returning pointer to char
const stressTest_Return = new PointerType(new ArrayType(new PointerType(new FunctionType([], new PointerType(new CharType()))), 5));

const stressTestType = new FunctionType(stressTest_Params, stressTest_Return);

@Injectable({
  providedIn: 'root'
})
export class ConfigurationStoreService {

  private defaultConfig: Configuration = {
    // Types
    baseTypes: [
      new IntType(),
      new FloatType(),
      new CharType()
    ],
    constructedTypes: [
      new ArrayType(new IntType()),
      new PointerType(new CharType()),
      stressTestType
    ],
    aliasTypes: [

    ],
    // Typedefs
    typeDefinitions: new Map(),
    // Declarations
    declarations: [

    ]
  }

  constructor() {
  }

  // public storeConfiguration(name: string, configuration: Configuration): void {
  //   localStorage.setItem(name, JSON.stringify(configuration));
  // }

  // public loadConfiguration(name: string): Configuration {
  //   return <Configuration>JSON.parse(localStorage.getItem(name));
  // }

  public getDefaultConfiguration(): Configuration {
    return this.defaultConfig;
  }
}
