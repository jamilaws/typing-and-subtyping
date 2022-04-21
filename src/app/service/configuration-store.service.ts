import { Injectable } from '@angular/core';
import { Declaration } from '../model/typing/symbol-table';
import { TypeDefinitionTable } from '../model/typing/type-definition-table';
import { AbstractType, AliasPlaceholderType } from '../model/typing/types/abstract-type';
import { BaseType } from '../model/typing/types/base-type';
import { CharType } from '../model/typing/types/base-types/char-type';
import { FloatType } from '../model/typing/types/base-types/float-type';
import { IntType } from '../model/typing/types/base-types/int-type';
import { VoidType } from '../model/typing/types/base-types/void-type';
import { Definition } from '../model/typing/types/common/definition';
import { ArrayType } from '../model/typing/types/type-constructors/array-type';
import { FunctionType } from '../model/typing/types/type-constructors/function-type';
import { PointerType } from '../model/typing/types/type-constructors/pointer-type';
import { StructType } from '../model/typing/types/type-constructors/struct-type';

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

const typeA = new StructType("TODO", [new Definition("info", new IntType()), new Definition("next", new PointerType(new AliasPlaceholderType("A")))]);
const typeB = new StructType("TODO", [new Definition("info", new IntType()), new Definition("next", new PointerType(new StructType("TODO", [new Definition("info", new IntType()), new Definition("next", new PointerType(new AliasPlaceholderType("B")))])))]);

const typedefs = new Map();
// Test (1/3)
typedefs.set("A", typeA);
typedefs.set("B", typeB);

@Injectable({
  providedIn: 'root'
})
export class ConfigurationStoreService {

  private defaultConfig: Configuration = {
    // Types
    baseTypes: [
      new IntType(),
      new FloatType(),
      new CharType(),
      new VoidType()
    ],
    constructedTypes: [
      new ArrayType(new IntType()),
      new PointerType(new CharType()),

      // Test (2/3)
      typeA, typeB,
    ],
    aliasTypes: [

      // Test (3/3)
      new AliasPlaceholderType("A"),
      new AliasPlaceholderType("B"),
    
    ],
    // Typedefs
    typeDefinitions: typedefs,
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
