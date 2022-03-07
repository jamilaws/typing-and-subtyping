import { Injectable } from '@angular/core';
import { Declaration } from '../model/typing/symbol-table';
import { TypeDefinitionTable } from '../model/typing/type-definition-table';
import { AbstractType, AliasPlaceholderType } from '../model/typing/types/abstract-type';
import { BaseType } from '../model/typing/types/base-type';
import { CharType } from '../model/typing/types/base-types/char-type';
import { FloatType } from '../model/typing/types/base-types/float-type';
import { IntType } from '../model/typing/types/base-types/int-type';
import { ArrayType } from '../model/typing/types/type-constructors/array-type';
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

@Injectable({
  providedIn: 'root'
})
export class ConfigurationStoreService {

  public DEFAULT_CONFIG_NAME: string = "DEFAULT";

  constructor() {
    const config: Configuration = {
      // Types
      baseTypes: [
        new IntType(),
        new FloatType(),
        new CharType()
      ],
      constructedTypes: [
        new ArrayType(new IntType()),
        new PointerType(new CharType())
      ],
      aliasTypes: [

      ],
      // Typedefs
      typeDefinitions: new Map(),
      // Declarations
      declarations: [

      ]
    }
    this.storeConfiguration(this.DEFAULT_CONFIG_NAME, config);
  }

  public storeConfiguration(name: string, configuration: Configuration): void {
    localStorage.setItem(name, JSON.stringify(configuration));
  }

  public loadConfiguration(name: string): Configuration {
    return <Configuration>JSON.parse(localStorage.getItem(name));
  }

  public getDefaultConfiguration(): Configuration {
    const out = this.loadConfiguration(this.DEFAULT_CONFIG_NAME);
    
    console.log("out:");
    console.log(out);

    return out;
  }
}
