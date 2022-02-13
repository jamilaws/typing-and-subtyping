import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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


const routes: Routes = [
  { path: '', component: MainViewComponent },
  { path: 'subtyping-dummy', component: DummySubtypingTestComponent },
]

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'app-name/assets', // configure base path cotaining monaco-editor directory after build default: './assets'
  defaultOptions: { scrollBeyondLastLine: false }, // pass default options to be used
  onMonacoLoad: () => { console.log((<any>window).monaco); } // here monaco object will be available as window.monaco use this function to extend monaco editor functionalities.
};

@NgModule({
  declarations: [
    AppComponent,
    CodeEditorComponent,
    MainViewComponent,
    TypingTreeComponent,
    DummySubtypingTestComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    MonacoEditorModule.forRoot(),
    BrowserAnimationsModule,
    MatToolbarModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
