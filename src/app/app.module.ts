import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule, Routes } from '@angular/router';

import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CodeEditorComponent } from './util/code-editor/code-editor.component';
import { MainViewComponent } from './view/main-view/main-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxEchartsModule } from 'ngx-echarts';
import { TypingTreeComponent } from './util/typing-tree/typing-tree.component';
import { DummySubtypingTestComponent } from './util/dummy-subtyping-test/dummy-subtyping-test.component';
import { AppRoutingModule } from './app-routing.module';
import { TypeConstructionKitComponent } from './util/type-construction-kit/type-construction-kit.component';
import { TypeConstructionKitDemoViewComponent } from './view/type-construction-kit-demo-view/type-construction-kit-demo-view.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { SingleselectDropdownComponent } from './util/dropdown/singleselect-dropdown/singleselect-dropdown.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BaseTypeBubbleComponent } from './util/type-construction-kit/type-bubbles/base-type-bubble/base-type-bubble.component';
import { ConstructedTypeBubbleComponent } from './util/type-construction-kit/type-bubbles/constructed-type-bubble/constructed-type-bubble.component';
import { CreateArrayTypeBubbleComponent } from './util/type-construction-kit/create-type-bubbles/create-array-type-bubble/create-array-type-bubble.component';
import { StructTypeConstructionBubbleComponent } from './util/type-construction-kit/create-type-bubbles/create-struct-type-bubble/create-struct-type-bubble.component';
import { CreatePointerTypeBubbleComponent } from './util/type-construction-kit/create-type-bubbles/create-pointer-type-bubble/create-pointer-type-bubble.component';
import { CreateFunctionTypeBubbleComponent } from './util/type-construction-kit/create-type-bubbles/create-function-type-bubble/create-function-type-bubble.component';
import { CreateTypedefDialogComponent } from './util/type-construction-kit/dialogs/create-typedef-dialog/create-typedef-dialog.component';
import { CreateDeclarationDialogComponent } from './util/type-construction-kit/dialogs/create-declaration-dialog/create-declaration-dialog.component';
import { AliasTypeBubbleComponent } from './util/type-construction-kit/type-bubbles/alias-type-bubble/alias-type-bubble.component';
import { CreateAliasTypeBubbleComponent } from './util/type-construction-kit/create-type-bubbles/create-alias-type-bubble/create-alias-type-bubble.component';
import { TypedefTableComponent } from './util/typedef-table/typedef-table.component';
import { DeclarationsTableComponent } from './util/declarations-table/declarations-table.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';




const routes: Routes = [
  { path: '', component: TypeConstructionKitDemoViewComponent },
  //{ path: '', component: MainViewComponent },
  //{ path: 'subtyping-demo', component: DummySubtypingTestComponent },
  //{ path: 'type-construction-kit-demo', component: TypeConstructionKitDemoViewComponent },
]

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'app-name/assets', // configure base path cotaining monaco-editor directory after build default: './assets'
  defaultOptions: { 
    scrollBeyondLastLine: false,
   }, // pass default options to be used
  onMonacoLoad: () => { console.log((<any>window).monaco); } // here monaco object will be available as window.monaco use this function to extend monaco editor functionalities.
};

@NgModule({
  declarations: [
    AppComponent,
    CodeEditorComponent,
    MainViewComponent,
    TypingTreeComponent,
    DummySubtypingTestComponent,
    TypeConstructionKitComponent,
    TypeConstructionKitDemoViewComponent,
    SingleselectDropdownComponent,
    BaseTypeBubbleComponent,
    ConstructedTypeBubbleComponent,
    CreateArrayTypeBubbleComponent,
    StructTypeConstructionBubbleComponent,
    CreatePointerTypeBubbleComponent,
    CreateFunctionTypeBubbleComponent,
    CreateTypedefDialogComponent,
    CreateDeclarationDialogComponent,
    AliasTypeBubbleComponent,
    CreateAliasTypeBubbleComponent,
    TypedefTableComponent,
    DeclarationsTableComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    MonacoEditorModule.forRoot(),
    BrowserAnimationsModule,
    MatToolbarModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    AppRoutingModule,
    MatChipsModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatTabsModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
