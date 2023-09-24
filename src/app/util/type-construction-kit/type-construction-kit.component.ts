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
import { throwError } from 'rxjs';


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
    //this.mapToTypes();
    for (var i = 0; i < this.environmentMap.length; i++){
      let line = this.storeLineOfCode(this.environmentMap[i], false);
      switch (line.storeAs){
        case "decl" : {
          this.addDelaration(line.name, line.type);
          break;
        }
        case "struct" : {
          this.onApplyCreation(line.type);
          this.addDelaration(line.name, line.type);
          break;
        }
        case "typedef": {
          this.addTypedef(line.name, line.type);
          this.addDelaration(line.name, line.type);
          break;
        }
        default: {
          console.log("falscher storeAs: " + line.storeAs);
        }
      }
    }
  }

  // storeAs can be "struct", "decl", "typedef", "error"
  storeLineOfCode(mapEntry : any, forStruct : boolean): {name : string, type: AbstractType, storeAs: string} {
    console.log("line of code: ")
    console.log(mapEntry)
    try {

      switch (mapEntry["kind"]) {
        case "type": {
          switch (mapEntry["type"]) {
            case "declaration": {
              switch (mapEntry["base"][0]["type"]){
                case "struct": {
                  // struct
                  let name = mapEntry["declarator"]["name"];
                  let members = Array<Definition>();
                  for (var i = 0; i < mapEntry["base"][0]["body"].length; i++){
                    let member = this.storeLineOfCode(mapEntry["base"][0]["body"][i], true);
                    members.push(new Definition(member.name, member.type));
                  }
                  return {
                    name: name,
                    type: new StructType(name, members),
                    storeAs: "struct"
                  }
                }
                default: { // NULL 
                  switch (mapEntry["declarator"]["type"]) {
                    case "identifier": {
                      // base type not in struct
                      let name = mapEntry["declarator"]["name"];
                      let type = this.identifierBase(mapEntry["base"][0]);
                      return {
                        name: name,
                        type: type,
                        storeAs: "decl"
                      }
                    }
                    case "array": {
                      // array not in struct 
                      let name : string;
                      let type : AbstractType;

                      let arrEval = this.evalArray(mapEntry)
                      name = arrEval.arrName
                      type = arrEval.constructed
                      
                      return {
                        name: name,
                        type: type,
                        storeAs: "decl"
                      }
                    }
                    case "pointer": {
                      // pointer not in struct
                      let basetype = this.identifierBase(mapEntry["base"][0])
                      let type = new PointerType(this.evalPointer(basetype, mapEntry["declarator"]["base"]));
                      console.log("pointer type:")
                      console.log(type)
                      let name = this.evalPointerName(mapEntry["declarator"]["base"])
                      
                      return {
                        name: name,
                        type: type,
                        storeAs: "decl"
                      }
                    }
                    default: {
                      if (forStruct){
                        switch (mapEntry["declarator"][0]["type"]){
                          case "identifier": {
                            // base type in struct
                            let name = mapEntry["declarator"][0]["name"];
                            let type = this.identifierBase(mapEntry["base"][0]);
                            return {
                              name: name,
                              type: type,
                              storeAs: "decl"
                            }
                          }
                          case "array": {
                            // array in struct
                            let name = this.evalArrayForStruct(mapEntry).name
                            let type = this.evalArrayForStruct(mapEntry).basetype
                            
                            return {
                              name: name,
                              type: type,
                              storeAs: "decl"
                            }
                          }
                          case "pointer": {
                            // pointer in struct
                            return {
                              name:"pointer in struct",
                              type: new PointerType(new IntType()),
                              storeAs: "error"
                            }
                          }
                        }
                      }
                      return {
                        name:"id, poi, arr",
                        type: new PointerType(new IntType()),
                        storeAs: "error"
                      }
                    }
                  }
                }
              }
              
            }
            case "typedef": {
              // typedef
              let alias = mapEntry["declarator"]["name"];
              mapEntry["type"] = "declaration";
              let type = this.storeLineOfCode(mapEntry, false).type
              return {
                name: alias,
                type: type,
                storeAs: "typedef"
              }
            }
          }
          return {
            name:"temp",
            type: new PointerType(new IntType()),
            storeAs: "error"
          }
        }
        case "expr": {
          // expression
          console.log("This is an expression, but we need type definitions here");
          this.popUpError();
          return {
            name:"expr",
            type: new PointerType(new IntType()),
            storeAs: "error"
          }
        }
        default: {
          // lands here when typedef of basetype
          console.log("typedef of basetype")
          return {
            name:"none",
            type: this.identifierBase(mapEntry),
            storeAs: "typedefBaseType"
          }
        }

      }

    } catch (err) {
      this.popUpError();
      console.log("Error gefangen")
      console.error(err)
      return {
        name:"err",
        type: new PointerType(new IntType()),
        storeAs: "error"
      }
    }

  }

  identifierBase(base : string) {
    switch (base) {
      case "int" : return new IntType();
      case "float" : return new FloatType();
      case "char" : return new CharType();
      default: {
        // alias belongs to a type
        // it does not parse if the type is not a "real" type or typedef -> no need to check for existence 
        return this.typeDefinitions.get(base) 
      }
    }
  }

  

  popUpError() {
    this.dialogRef.open(PopUpErrorMessageComponent);
  }

  evalArray(arrayDefinition: any) {
    console.log("normal:")
    console.log(arrayDefinition);
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
  
    let constructedBaseType : AbstractType = this.identifierBase(arrayDefinition["base"][0]);

    let constructed = new ArrayType(constructedBaseType, dimension)

    return {arrName, constructed};
  }

  evalArrayForPointer(basetype : AbstractType, arrayBase : any) {
    let dim = 1
    while(arrayBase["type"] == "array"){
      dim = dim + 1
      arrayBase = arrayBase["base"]
    }
    return new ArrayType(basetype, dim);
      
  }

  evalPointerName(pointerBase : any) {
    while(pointerBase["type"] != "identifier"){
      pointerBase= pointerBase["base"]
    }
    return pointerBase["name"];

  }
  

  evalArrayForStruct(arrayDefinition:any) {
    let lookingForBase = true
    let dimension = 1
    let temp = arrayDefinition["declarator"][0]["base"];
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
  
    let constructedBaseType : AbstractType = this.identifierBase(arrayDefinition["base"][0]);
    let type = new ArrayType(constructedBaseType, dimension);

    return {name: arrName, basetype: type};

  }

  evalPointer(basetype : AbstractType , pointerSpec: any) : AbstractType {
   if (pointerSpec["type"] == "pointer") {
    return new PointerType(this.evalPointer(basetype, pointerSpec["base"]));
   } else if (pointerSpec["type"] == "array") {
    // array?
    return this.evalArrayForPointer(basetype, pointerSpec["base"]);
   } else {
    return basetype;
   }
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
