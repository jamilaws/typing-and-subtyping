import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DisplayGraphEdge, DisplayGraphNode } from 'src/app/model/common/graph/displayed-graph';
import { Graph } from 'src/app/model/common/graph/graph';
import { AbstractType, AliasPlaceholderType } from 'src/app/model/typing/types/abstract-type';
import { CharType } from 'src/app/model/typing/types/base-types/char-type';
import { FloatType } from 'src/app/model/typing/types/base-types/float-type';
import { IntType } from 'src/app/model/typing/types/base-types/int-type';
import { Definition } from 'src/app/model/typing/types/common/definition';
import { StructuralSubtypingQuery } from 'src/app/model/typing/types/structural-subtyping/structural-subtyping-query';
import { ArrayType } from 'src/app/model/typing/types/type-constructors/array-type';
import { FunctionType } from 'src/app/model/typing/types/type-constructors/function-type';
import { PointerType } from 'src/app/model/typing/types/type-constructors/pointer-type';
import { StructType } from 'src/app/model/typing/types/type-constructors/struct-type';

const NODE_SIZE: number = 20;

interface DummyRow {
  t1: AbstractType;
  t2: AbstractType;
  input?: string;
  output?: boolean;
  graph?: Graph<StructuralSubtypingQuery, string>;
}
@Component({
  selector: 'app-dummy-subtyping-test',
  templateUrl: './dummy-subtyping-test.component.html',
  styleUrls: ['./dummy-subtyping-test.component.css']
})
export class DummySubtypingTestComponent implements OnInit {

  public _graphOptions: EChartsOption;
  private graphNodes: DisplayGraphNode[] = new Array<DisplayGraphNode>();
  private graphEdges: DisplayGraphEdge[] = new Array<DisplayGraphEdge>();


  public dummyData: DummyRow[];
  public typeDefTable: string[][];
  private typeDefinitions: Map<string, AbstractType>;
  public selectedGraph: Graph<StructuralSubtypingQuery, string>;

  constructor() { }

  ngOnInit(): void {
    this.initDummyData();
    this.updateGraphOptions();
  }

  public initDummyData(): void {
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

      const str = `${d.t1.toString()} <= ${d.t2.toString()}`;
      const result = d.t1.isStrutcturalSubtypeOf(d.t2, this.typeDefinitions);

      console.log(str);
      console.log(result);

      d.input = str;
      d.output = result.value;
      d.graph = result.queryGraph;

      return d;
    });

    this.typeDefTable = Array.from(this.typeDefinitions.entries()).map(tup => [tup[0], tup[1].toString()]);
  }

  public clickDummyRow(row: DummyRow){
    this.selectedGraph = row.graph
  }

  /*

  Graph

  */

  private updateGraphOptions(): void {
    this._graphOptions = {
      color: "#2469B3",
      //layout: "",
      // label: {
      //   show: true
      // },
      tooltip: {},
      animationDurationUpdate: 0,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: "graph",
          layout: 'none',
          symbolSize: NODE_SIZE,
          roam: true, // Graph position movable
          lineStyle: {
            curveness: 0.1
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            // normal: {
            //   textStyle: {
            //     fontSize: 20
            //   }
            // }
          },
          data: this.graphNodes.map(node => {
            return {
              name: node.name,
              x: node.x,
              y: node.y,
              astNodeIndex: node.astNodeIndex,
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: node.highlighted ? "red" : "black",
                }
              },
              tooltip: {
                show: false,
              }
            }
          }),
          links: this.graphEdges.map(edge => {
            return {
              source: edge.source,
              target: edge.target,
              tooltip: {
                show: false,
              }
            }
          }),
        }
      ]
    };
  }

  public onClickAST(event: any) {}

}
