import { Input, Component, OnInit } from '@angular/core';
import * as parser from '../../assets/ansic';
import { CombineLatestOperator } from 'rxjs/internal/observable/combineLatest';
import { MatDialog } from "@angular/material/dialog";
import { PopUpErrorMessageComponent } from '../pop-up-error-message/pop-up-error-message.component';
import { ArrayType } from '../model/typing/types/type-constructors/array-type';
import { BaseType } from '../model/typing/types/base-type';
import { IntType } from '../model/typing/types/base-types/int-type';
import { AbstractType } from '../model/typing/types/abstract-type';
import { FloatType } from '../model/typing/types/base-types/float-type';
import { CharType } from '../model/typing/types/base-types/char-type';
import { VoidType } from '../model/typing/types/base-types/void-type';
import { EnvironmentDataService } from '.././environment-data.service';

@Component({
  selector: 'app-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.css']
})

export class MonacoEditorComponent implements OnInit {

  @Input('code') code: string = "/*\nPlease enter your declarations\nand typedefs here \n*/";

  public editorOptions = {
    theme: 'vs-light',
    language: 'c',
    readOnly: false,
    minimap: {
      enabled: false
    }
  };
  
  constructor(private dialogRef: MatDialog, private mapService: EnvironmentDataService) {
  }

  updateMap(environmentMap: any) {
    this.mapService.updateMap(environmentMap)
  }

  parseInput() {
    // TODO: Falsche Ausgabe --> pointer
    try {
      
    let environmentMap = parser.parse(this.code);

    console.log("parsed scuccesfully")
    console.log(environmentMap)
    
    this.updateMap(environmentMap)
    
  } catch (err) {
    this.popUpError();
    console.log("Error gefangen")
    console.error(err)
  }
  }

  popUpError() {
    this.dialogRef.open(PopUpErrorMessageComponent);
  }

  evalBaseType(typeDefinition: any, name: string) {
    switch (typeDefinition["base"][0]) {
      case "int": {
        // base type int 
        let intType = new IntType();
        this.code = this.code + "\nyou entered a base type int with name " + name;
        break;
      }
      case "float": {
        // base type float
        this.code = this.code + "\nyou entered a base type float with name " + name
        break;
      }
      case "char": {
        // base type char
        this.code = this.code + "\nyou entered a base type char with name " + name
        break;
      }
      case "double": {
        // base type double 
        this.code = this.code + "\nyou entered  base case double with name " + name
        break;
      }

    }
  }

  evalArray(arrayDefinition: any) {
    let lookingForBase = true
    let dimension = 1
    let temp = arrayDefinition["declarator"]["base"];
    let arrName = ""
    while (lookingForBase) {
      if (temp["type"] == "identifier") {
        lookingForBase = false;
        arrName = temp["name"]
      } else {
        temp = temp["base"]
        dimension = dimension + 1
      }
    }
    let arrayBaseType : string = arrayDefinition["base"][0];
    let constructedBaseType : AbstractType;
      switch (arrayBaseType) {
        case "int":
          constructedBaseType = new IntType
          break;
        case "float": 
          constructedBaseType = new FloatType
          break;
        case "char":
          constructedBaseType = new CharType
          break;
        default: 
          constructedBaseType = new VoidType
      }
    let constructed = new ArrayType(constructedBaseType, dimension)
    this.code = this.code +
      "\nArray of dimension: " + dimension + " and base " + (arrayDefinition["base"][0]) + " and name " + arrName
  }

  evalStruct(structDefinition: any){
    this.code = this.code + "\nyou have entered a struct"
  }

  ngOnInit(): void {

    /*this.code = JSON.stringify(environmentMap[0],
      null,
      2)*/

    /*this.code = JSON.stringify(
      parser.parse("int main() { x = 25+x; } "),
      null, 
      2
  )*/

  }


  ngOnChange() {

  }

}
