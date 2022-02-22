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
import { DeclarationAdapter } from 'src/app/view/type-construction-kit-demo-view/adapter/declaration-adapter';
import { AbstractCreateTypeBubble } from './create-type-bubbles/abstract-create-type-bubble';
import { CreateArrayTypeBubbleComponent } from './create-type-bubbles/create-array-type-bubble/create-array-type-bubble.component';
import { CreateFunctionTypeBubbleComponent } from './create-type-bubbles/create-function-type-bubble/create-function-type-bubble.component';
import { CreatePointerTypeBubbleComponent } from './create-type-bubbles/create-pointer-type-bubble/create-pointer-type-bubble.component';
import { CreateStructTypeBubbleComponent } from './create-type-bubbles/create-struct-type-bubble/create-struct-type-bubble.component';
import { CreateDeclarationDialogComponent } from './dialogs/create-declaration-dialog/create-declaration-dialog.component';
import { CreateTypedefDialogComponent } from './dialogs/create-typedef-dialog/create-typedef-dialog.component';


@Component({
  selector: 'app-type-construction-kit',
  templateUrl: './type-construction-kit.component.html',
  styleUrls: ['./type-construction-kit.component.css']
})
export class TypeConstructionKitComponent implements OnInit {

  @ViewChild('createPointerBubble') createPointerBubble: CreatePointerTypeBubbleComponent;
  @ViewChild('createArrayBubble') createArrayBubble: CreateArrayTypeBubbleComponent;
  @ViewChild('createStructBubble') createStructBubble: CreateStructTypeBubbleComponent;
  @ViewChild('createFunctionBubble') createFunctionBubble: CreateFunctionTypeBubbleComponent;

  @Output('onTypesChange') types_extern = new EventEmitter<AbstractType[]>();
  @Output('onTypedefsChange') typeDefs_extern = new EventEmitter<TypeDefinitionTable>();
  @Output('onDeclarationsChange') declarations_extern = new EventEmitter<Declaration[]>();

  /*
  Type bubbles
  */

  baseTypes: BaseType[] = [new IntType(), new CharType(), new FloatType()];
  constructedTypes: AbstractType[] = [ // Predefined constructed types
    new ArrayType(new IntType()),
    new PointerType(new CharType()),
  ];
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

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.types_extern.next(this.getAllTypes());
  }

  public getAllTypes(): AbstractType[] {
    return (<AbstractType[]> this.baseTypes).concat(this.constructedTypes).concat(this.aliasTypes);
  }

  public onClickStartCreation(creationBubble: AbstractCreateTypeBubble) {
    creationBubble.activate();
    this.creationActive = true;
  }

  onApplyCreation(type: AbstractType) {
    if(type instanceof AliasPlaceholderType) {
      this.aliasTypes.unshift(type);
    } else {
      this.constructedTypes.push(type);
    }
    this.creationActive = false;

    this.types_extern.next(this.getAllTypes());
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
      if(!result) return;
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
      if(!result) return;
      //alert(result.type.toString() + " " + result.name + ";");
      this.addDelaration(result.identifier, result.type);
    });
  }

  private addTypedef(alias: string, type: AbstractType): void {
    this.typeDefinitions.set(alias, type);
    if(this.aliasTypes.some(at => at.getAlias() === alias)) {
      // AliasPlaceholderType has already been added without typdef
      alert("Info: Alias " + alias + " now covered by typedef.");
    } else {
      this.aliasTypes.push(new AliasPlaceholderType(alias));
    }
    this.typeDefs_extern.emit(this.typeDefinitions);
    this.types_extern.next(this.getAllTypes());

  }

  private addDelaration(identifier: string, type: AbstractType): void {
    const newDecl = new DeclarationAdapter(identifier, type);
    this.declarations.push(newDecl);
    this.declarations_extern.next(this.declarations);
  }

}
