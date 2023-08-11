import { Input, Component, OnInit } from '@angular/core';
import * as parser from '../../assets/ansic';
import { CombineLatestOperator } from 'rxjs/internal/observable/combineLatest';

@Component({
  selector: 'app-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.css']
})

export class MonacoEditorComponent implements OnInit {

  @Input('code') code: string = "/*\nPlease enter your declarations\nand typedefs here \n/*";
  
  public editorOptions = {
    theme: 'vs-light',
    language: 'c',
    readOnly: false,
    minimap: {
      enabled: false
    }
  };
  

  constructor() { 
  }

  parseInput(){
    // TODO: Falsche Eingabe handlen --> es passiert nix bei falschen eingaben (endlosschleife?)
    let environmentMap = parser.parse(this.code);
    
  for (let i=0; i < environmentMap.length; i++){
    // parse individual statement
    switch (environmentMap[i]["kind"]){
      case "type": {
        switch (environmentMap[i]["type"]){
          case "declaration": {
            switch(environmentMap[i]["declarator"]["type"]){
              case "identifier": {
                // the expression defines a base type
                let varName = environmentMap[i]["declarator"]["name"]
                this.evalBaseType(environmentMap[i], varName)
              break;
            }
            case "struct": {
              // struct
              this.code = this.code + "\nthis is a struct"
              break;
            }
            case "array":{
              // array (count depth with while?)
              this.evalArray(environmentMap[i])
              break;
            }
              
              default : this.code = "nay";
            }
            break;
          }
        }
        break;
      }
      case "expr":{
        // Kann hier eigentlich nicht sein oder??
        this.code = this.code + "\nThis is an expression, but we need type definitions here";
        break;
      }
      default: this.code = this.code + "\nthis is not parsable";
      // change deafult to pop up window saying the is a mistake in the provided code
    }
    
    //this.code= (environmentMap[i]["declarator"]["kind"] == null).toString();
    //this.code = JSON.stringify(environmentMap, null, 2);
  }
  }

  evalBaseType(typeDefinition: any, name: string){
    switch (typeDefinition["base"][0]){
      case "int": {
        // base type int 
        this.code = this.code + "\nyou entered a base type int with name " + name;
        break;
      }
      case "float": {
        // base type float
        this.code = this.code + "\nyou entered a base type float with name " + name
        break;
      }
      case "char":{
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

  evalArray(arrayDefinition:any){
    let lookingForBase = true
    let dimension = 1
    let temp = arrayDefinition["declarator"]["base"];
    let arrName = ""
    while(lookingForBase){
      if (temp["type"] == "identifier"){
        lookingForBase = false;
        arrName = temp["name"]
      } else {
        temp = temp["base"]
        dimension = dimension + 1
      }
    }
    this.code = this.code +
     "\nArray of dimension: " + dimension + " and base " + (arrayDefinition["base"][0]) + " and name " + arrName
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
 
  ngOnChange(){
    
  }

}
