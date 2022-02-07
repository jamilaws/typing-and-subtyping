import { Component, OnInit } from '@angular/core';
import { AbstractType } from 'src/app/model/typing/types/abstract-type';
import { CharType } from 'src/app/model/typing/types/base-types/char-type';
import { FloatType } from 'src/app/model/typing/types/base-types/float-type';
import { IntType } from 'src/app/model/typing/types/base-types/int-type';
import { Definition } from 'src/app/model/typing/types/common/definition';
import { AliasPlaceholderType } from 'src/app/model/typing/types/placeholder-types/alias-placeholder-type';
import { ArrayType } from 'src/app/model/typing/types/type-constructors/array-type';
import { FunctionType } from 'src/app/model/typing/types/type-constructors/function-type';
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

  constructor() { }

  ngOnInit(): void {

    const aliasTargetA = new IntType();
    const aliasA = new AliasPlaceholderType("A", aliasTargetA);

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

    const typeDefs = new Map();
    typeDefs.set("A", new IntType);
    
    this.dummyData = this.dummyData.map(d => {

      d.input = `${d.t1.toString()} <= ${d.t2.toString()}`;
      d.output = d.t1.isStrutcturalSubtypeOf(d.t2);

      return d;
    });
  }

}
