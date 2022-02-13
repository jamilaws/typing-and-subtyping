import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DisplayGraphEdge, DisplayGraphNode, generateDisplayedGraph } from 'src/app/model/common/graph/displayed-graph';
import { Graph, Node } from 'src/app/model/common/graph/_module';
import { AbstractType, AliasPlaceholderType } from 'src/app/model/typing/types/abstract-type';
import { CharType } from 'src/app/model/typing/types/base-types/char-type';
import { FloatType } from 'src/app/model/typing/types/base-types/float-type';
import { IntType } from 'src/app/model/typing/types/base-types/int-type';
import { Definition } from 'src/app/model/typing/types/common/definition';
import { StructuralSubtypingQuery } from 'src/app/model/typing/types/common/structural-subtyping/structural-subtyping-query';
import { StructuralSubtypingQueryResult } from 'src/app/model/typing/types/common/structural-subtyping/structural-subtyping-query-result';
import { ArrayType } from 'src/app/model/typing/types/type-constructors/array-type';
import { FunctionType } from 'src/app/model/typing/types/type-constructors/function-type';
import { PointerType } from 'src/app/model/typing/types/type-constructors/pointer-type';
import { StructType } from 'src/app/model/typing/types/type-constructors/struct-type';

const NODE_SIZE: number = 20;

interface DummyRow {
  t1: AbstractType;
  t2: AbstractType;
  input?: string;
  output?: StructuralSubtypingQueryResult;
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

  constructor() { }

  ngOnInit(): void {
    this.initDummyData();
  }

  public initDummyData(): void {

    const aliasTargetX = new IntType();

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
    this.typeDefinitions.set("X", aliasTargetX);
    this.typeDefinitions.set("A", aliasTargetA);
    this.typeDefinitions.set("B", aliasTargetB);
    
    this.dummyData = [
      {
        t1: new StructType("T1", [new Definition("x", new CharType()), new Definition("y", new IntType())]),
        t2: new StructType("T2", [new Definition("x", new CharType()), new Definition("y", new IntType())]),
      },
      /*
      {
        t1: new ArrayType(new IntType()),
        t2: new ArrayType(new FloatType())
      },
      {
        t1: new StructType("T1", [new Definition("x", new IntType()), new Definition("y", new CharType()), new Definition("z", new IntType())]),
        t2: new StructType("T2", [new Definition("x", new FloatType()), new Definition("y", new CharType())])
      },
      {
        t1: new FunctionType([new FloatType(), new CharType()], new IntType()),
        t2: new FunctionType([new IntType(), new CharType()], new FloatType())
      },
      {
        t1: new AliasPlaceholderType("X"),
        t2: new IntType()
      },
      {
        t1: new IntType(),
        t2: new AliasPlaceholderType("X")
      },
      {
        t1: new AliasPlaceholderType("A"),
        t2: new AliasPlaceholderType("B"),
      }
      */
    ];

    this.dummyData = this.dummyData.map(d => {

      const str = `${d.t1.toString()} <= ${d.t2.toString()}`;
      const result = d.t1.isStrutcturalSubtypeOf(d.t2, this.typeDefinitions);

      console.log(str);
      console.log(result);

      d.input = str;
      d.output = result;

      return d;
    });

    this.typeDefTable = Array.from(this.typeDefinitions.entries()).map(tup => [tup[0], tup[1].toString()]);
  }

  public clickDummyRow(row: DummyRow){
    this.updateGraph(row.output.queryGraph.getRoot(), row.output.queryGraph);
    this.updateGraphOptions();
  }

  /*

  Graph

  */

  private updateGraph(root: Node<StructuralSubtypingQuery>, graph: Graph<StructuralSubtypingQuery, string>): void {
    const gen = generateDisplayedGraph([root], graph, node => {
      return node.getData().a.toString() + '<=' + node.getData().b.toString();
    }, node => false, edge => edge.getData());
    this.graphNodes = gen.nodes;
    this.graphEdges = gen.edges;
  }

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
              label: {
                formatter: d => {
                  return edge.title;
                },
                show: true
              },
              source: edge.source,
              target: edge.target,
            }
          }),
        }
      ]
    };
  }

  public onClickGraph(event: any) {}

}
