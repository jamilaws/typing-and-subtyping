import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Declaration } from 'src/app/model/typing/symbol-table';
import { TypeDefinitionTable } from 'src/app/model/typing/type-definition-table';
import { AbstractType, AliasPlaceholderType } from 'src/app/model/typing/types/abstract-type';
import { BaseType } from 'src/app/model/typing/types/base-type';
import { CharType } from 'src/app/model/typing/types/base-types/char-type';
import { FloatType } from 'src/app/model/typing/types/base-types/float-type';
import { IntType } from 'src/app/model/typing/types/base-types/int-type';
import { ArrayType } from 'src/app/model/typing/types/type-constructors/array-type';
import { PointerType } from 'src/app/model/typing/types/type-constructors/pointer-type';
import { ConfigurationStoreService } from 'src/app/service/configuration-store.service';
import { DeclarationAdapter } from 'src/app/view/type-construction-kit-demo-view/adapter/declaration-adapter';
import { AbstractTypeConstructionBubble } from './create-type-bubbles/abstract-type-construction-bubble';
import { CreateArrayTypeBubbleComponent } from './create-type-bubbles/create-array-type-bubble/create-array-type-bubble.component';
import { CreateFunctionTypeBubbleComponent } from './create-type-bubbles/create-function-type-bubble/create-function-type-bubble.component';
import { CreatePointerTypeBubbleComponent } from './create-type-bubbles/create-pointer-type-bubble/create-pointer-type-bubble.component';
import { StructTypeConstructionBubbleComponent } from './create-type-bubbles/create-struct-type-bubble/create-struct-type-bubble.component';
import { CreateDeclarationDialogComponent } from './dialogs/create-declaration-dialog/create-declaration-dialog.component';
import { CreateTypedefDialogComponent } from './dialogs/create-typedef-dialog/create-typedef-dialog.component';
import { EnvironmentDataService } from 'src/app/environment-data.service';
import { PopUpErrorMessageComponent } from 'src/app/pop-up-error-message/pop-up-error-message.component';
import { Definition } from 'src/app/model/typing/types/common/definition';
import { StructType } from 'src/app/model/typing/types/type-constructors/struct-type';


@Component({
  selector: 'app-type-construction-kit',
  templateUrl: './type-construction-kit.component.html',
  styleUrls: ['./type-construction-kit.component.css']
})
export class TypeConstructionKitComponent implements OnInit {

  @ViewChild('createPointerBubble') createPointerBubble: CreatePointerTypeBubbleComponent;
  @ViewChild('createArrayBubble') createArrayBubble: CreateArrayTypeBubbleComponent;
  @ViewChild('createStructBubble') createStructBubble: StructTypeConstructionBubbleComponent;
  @ViewChild('createFunctionBubble') createFunctionBubble: CreateFunctionTypeBubbleComponent;

  @Output('onTypesChange') types_extern = new EventEmitter<AbstractType[]>();
  @Output('onTypedefsChange') typeDefs_extern = new EventEmitter<TypeDefinitionTable>();
  @Output('onDeclarationsChange') declarations_extern = new EventEmitter<Declaration[]>();


  /*
  MapService
  */

  environmentMap: any;

  /*
  Type bubbles
  */
 
  baseTypes: BaseType[];
  constructedTypes: AbstractType[];
  aliasTypes: AliasPlaceholderType[] = new Array();

  creationActive: boolean = false;

  /*
  Typedefs
  */
  private typeDefinitions: TypeDefinitionTable = new Map();
  public isAliasAvailableCallback = (alias: string) => {
    const found = this.typeDefinitions.get(alias);
    return !found
  };

  /*
  Declarations
  */
  private declarations: Declaration[] = new Array();

  constructor(public dialog: MatDialog, private configurationStoreService: ConfigurationStoreService, 
    private mapService: EnvironmentDataService, private dialogRef: MatDialog) { }

  ngOnInit(): void {
    this.initConfiguration();
    this.mapService.sharedMap.subscribe(m => this.useMap(m));
  }

  useMap(map: any){
    this.environmentMap = map
    this.mapToTypes();
  }

  mapToTypes() {
    try {
      
      for (let i = 0; i < this.environmentMap.length; i++) {
        if (this.environmentMap == null) {
          this.popUpError;
        }
        // parse individual statement
        switch (this.environmentMap[i]["kind"]) {
          case "type": {
            switch (this.environmentMap[i]["type"]) {
              case "declaration": {
                switch (this.environmentMap[i]["base"][0]["type"]){
                  case "struct": {
                    // struct
                    this.evalStruct(this.environmentMap[i])
                    break;
                  }
                  default: { // wenn base nicht ein struct ist dann ist alles andere mit base ein base type 
                    switch (this.environmentMap[i]["declarator"]["type"]) {
                      case "identifier": {
                        // base type
                        let varName = this.environmentMap[i]["declarator"]["name"];
                        let type = this.evalBaseType(this.environmentMap[i]);
                        this.addDelaration(varName, type);
                        break;
                      }
                      case "array": {
                        // array (
                        this.evalArray(this.environmentMap[i])
                        break;
                      }
                      case "pointer": {
                        // pointer
                        let type = new PointerType(this.evalBaseType(this.environmentMap[i]));
                        console.log("type " + type)
                        let pointerName = this.environmentMap[i]["declarator"]["base"]["name"];
                        console.log("pointer name: " + pointerName)
                        this.addDelaration(pointerName, type);
                        this.onApplyCreation(type);
                        break;
                      }
                      default: console.log("parsable but not considered: " + JSON.stringify(this.environmentMap, null, 2));
                    }
                  }
                }
                break;
              }
            }
            break;
          }
          case "expr": {
            // Can't happen here
            console.log("This is an expression, but we need type definitions here");
            this.popUpError();
            break;
          }
          default: this.popUpError();
  
        }
      }
    } catch (err) {
      this.popUpError();
      console.log("Error gefangen")
      console.error(err)
    }
  }

  popUpError() {
    this.dialogRef.open(PopUpErrorMessageComponent);
  }

  evalBaseType(typeDefinition: any) : AbstractType {
    let constructedBaseType: AbstractType = new IntType();
    switch (typeDefinition["base"][0]) {
      case "int": {
        // base type int 
        constructedBaseType = new IntType();
        console.log("\nyou entered a base type int");
        break;
      }
      case "float": {
        // base type float
        constructedBaseType = new FloatType();
        console.log("\nyou entered a base type float");
        break;
      }
      case "char": {
        // base type char
        constructedBaseType = new CharType();
        console.log("\nyou entered a base type char");
        break;
      }

    }
    return constructedBaseType;
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
  
    let constructedBaseType : AbstractType = this.evalBaseType(arrayDefinition);

    let constructed = new ArrayType(constructedBaseType, dimension)
    console.log("Array of dimension: " + dimension + " and base " + (arrayDefinition["base"][0]) + " and name " + arrName);
    this.addDelaration(arrName, constructed);
    this.onApplyCreation(constructed);
  }

  evalArrayNameForStruct(arrayDefinition: any) : string {
    let lookingForBase = true
    let temp = arrayDefinition["declarator"][0]["base"];
    let arrName = ""
    while (lookingForBase) {
      if (temp["type"] == "identifier") {
        lookingForBase = false;
        arrName = temp["name"]
      } else {
        temp = temp["base"]
      }
    }
    return arrName;
  }
  
  evalArrayTypeForStruct(arrayDefinition:any) : ArrayType {
    let lookingForBase = true
    let dimension = 1
    let temp = arrayDefinition["declarator"][0]["base"];
    while (lookingForBase) {
      if (temp["type"] == "identifier") {
        lookingForBase = false;
      } else {
        temp = temp["base"]
        dimension = dimension + 1
      }
    }
  
    let constructedBaseType : AbstractType = this.evalBaseType(arrayDefinition);

    return new ArrayType(constructedBaseType, dimension);

  }

  evalStruct(structDefinition: any){
    console.log("you have entered a struct");
    console.log(structDefinition);
    let members = new Array<Definition>();
    // find name 
    let structName = structDefinition["declarator"]["name"];
    console.log(structName)
    // find all members
    for (let memberIndex = 0; memberIndex < structDefinition["base"][0]["body"].length; memberIndex++){
      console.log("index: " + memberIndex)
      // eval member
      console.log(structDefinition["base"][0]["body"][memberIndex]);
      switch (structDefinition["base"][0]["body"][memberIndex]["declarator"][0]["type"]) {
      
        // POINTER!!!
        case "identifier": {
          console.log("base type within the struct")
          let varName = structDefinition["base"][0]["body"][memberIndex]["declarator"][0]["name"];
          let type = this.evalBaseType(structDefinition["base"][0]["body"][memberIndex]);
          let definition : Definition = new Definition(varName, type);
          members.push(definition);
          break;
        }
        case "array": {
          console.log("array within the struct")
          console.log(structDefinition["base"][0]["body"][memberIndex])
          let arrName = this.evalArrayNameForStruct(structDefinition["base"][0]["body"][memberIndex]);
          console.log(1)
          let arrType = this.evalArrayTypeForStruct(structDefinition["base"][0]["body"][memberIndex]);
          console.log(2)
          members.push(new Definition(arrName, arrType));
          console.log(3)
          break;
        }
      }
    }
    // build structType
    let newStruct = new StructType(structName, members);
    // add to declarations and constructedTypes
    this.onApplyCreation(newStruct);
    this.addDelaration(structName, newStruct);
  }

  evalPointer() {
    
  }

  /*
    Davids code
  */

  private initConfiguration() {
    const config = this.configurationStoreService.getDefaultConfiguration();

    this.baseTypes = config.baseTypes;
    this.constructedTypes = config.constructedTypes;
    this.aliasTypes = config.aliasTypes;
    this.declarations = config.declarations;
    this.typeDefinitions = config.typeDefinitions;

    this.outputConfiguration();
  }

  public getAllTypes(): AbstractType[] {
    return (<AbstractType[]>this.baseTypes).concat(this.constructedTypes).concat(this.aliasTypes);
  }

  public onClickStartCreation(creationBubble: AbstractTypeConstructionBubble) {
    creationBubble.activate();
    this.creationActive = true;
  }

  onApplyCreation(type: AbstractType) {
    if (type instanceof AliasPlaceholderType) {
      this.aliasTypes.unshift(type);
    } else {
      this.constructedTypes.push(type);
    }
    this.creationActive = false;

    this.outputTypes();
  }

  onCancelCreation(): void {
    this.creationActive = false;
  }

  onClickCreateTypedef(type: AbstractType): void {
    const dialogRef = this.dialog.open(CreateTypedefDialogComponent, {
      width: '300px',
      data: {
        type: type
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.addTypedef(result.alias, result.type)
    });
  }

  onClickCreateDeclaration(type: AbstractType): void {
    const dialogRef = this.dialog.open(CreateDeclarationDialogComponent, {
      width: '300px',
      data: {
        type: type
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      //alert(result.type.toString() + " " + result.name + ";");
      this.addDelaration(result.identifier, result.type);
    });
  }

  private addTypedef(alias: string, type: AbstractType): void {
    this.typeDefinitions.set(alias, type);
    if (this.aliasTypes.some(at => at.getAlias() === alias)) {
      // AliasPlaceholderType has already been added without typdef
      alert("Info: Alias " + alias + " now covered by typedef.");
    } else {
      this.aliasTypes.push(new AliasPlaceholderType(alias));
    }
    this.typeDefs_extern.emit(this.typeDefinitions);
    this.outputTypes();
  }

  private addDelaration(identifier: string, type: AbstractType): void {
    const newDecl = new DeclarationAdapter(identifier, type);
    this.declarations.push(newDecl);
    this.outputDeclarations();
  }

  private outputTypes(): void {
    this.types_extern.emit(this.getAllTypes());
  }

  private outputTypedefs(): void {
    this.typeDefs_extern.emit(this.typeDefinitions);
  }
  private outputDeclarations(): void {
    this.declarations_extern.emit(this.declarations);
  }

  private outputConfiguration(): void {
    this.outputTypes();
    this.outputTypedefs();
    this.outputDeclarations();
  }

}
