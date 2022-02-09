import { Component, OnInit } from '@angular/core';
import { AbstractType, AliasPlaceholderType } from 'src/app/model/typing/types/abstract-type';
import { CharType } from 'src/app/model/typing/types/base-types/char-type';
import { FloatType } from 'src/app/model/typing/types/base-types/float-type';
import { IntType } from 'src/app/model/typing/types/base-types/int-type';
import { Definition } from 'src/app/model/typing/types/common/definition';
import { ArrayType } from 'src/app/model/typing/types/type-constructors/array-type';
import { FunctionType } from 'src/app/model/typing/types/type-constructors/function-type';
import { PointerType } from 'src/app/model/typing/types/type-constructors/pointer-type';
import { StructType } from 'src/app/model/typing/types/type-constructors/struct-type';

interface DummyRow {
  t1: AbstractType;
  t2: AbstractType;
  input?: string;
  output?: boolean;
}
@Component({
  selector: 'app-dummy-subtyping-test',
  templateUrl: './dummy-subtyping-test.component.html',
  styleUrls: ['./dummy-subtyping-test.component.css']
})
export class DummySubtypingTestComponent implements OnInit {


  public dummyData: DummyRow[];
  public typeDefTable: string[][];
  private typeDefinitions: Map<string, AbstractType>;

  constructor() { }

  ngOnInit(): void {


    /*
    this.dummyData = [
      {
        t1: new ArrayType(new IntType()),
        t2: new ArrayType(new FloatType())
      },
      {
        t1: new StructType("T1", [new Definition("x", new IntType()), new Definition("y", new CharType())]),
        t2: new StructType("T2", [new Definition("x", new FloatType())])
      },
      {
        t1: new FunctionType([new FloatType(), new CharType()], new IntType()),
        t2: new FunctionType([new IntType(), new CharType()], new FloatType())
      },
      {
        t1: aliasA,
        t2: new IntType()
      },
      {
        t1: new IntType(),
        t2: aliasA
      },
    ];
    */

    const aliasTargetA = new StructType(undefined, [
      new Definition("info", new IntType()),
      new Definition("next", new PointerType(new AliasPlaceholderType("A"))),
    ]);

    const aliasTargetB = new StructType(undefined, [
      new Definition("info", new IntType()),
      new Definition("next", new PointerType(new StructType(undefined, [
        new Definition("info", new IntType()),
        new Definition("next", new PointerType(new AliasPlaceholderType("B"))),
      ]))),
    ]);

    this.typeDefinitions = new Map();
    this.typeDefinitions.set("A", aliasTargetA);
    this.typeDefinitions.set("B", aliasTargetB);
    
    this.dummyData = [
      {
        t1: new AliasPlaceholderType("A"),
        t2: new AliasPlaceholderType("B"),
      }
    ];

    this.dummyData = this.dummyData.map(d => {

      d.input = `${d.t1.toString()} <= ${d.t2.toString()}`;
      d.output = d.t1.isStrutcturalSubtypeOf(d.t2, this.typeDefinitions);

      return d;
    });

    this.typeDefTable = Array.from(this.typeDefinitions.entries()).map(tup => [tup[0], tup[1].toString()]);
  }

}
