import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DisplayGraphEdge, DisplayGraphNode, generateDisplayedGraph } from 'src/app/model/common/graph/displayed-graph';
import { Graph, Node } from 'src/app/model/common/graph/_module';
import { TypeDefinitionTable } from 'src/app/model/typing/type-definition-table';
import { AbstractType, AliasPlaceholderType } from 'src/app/model/typing/types/abstract-type';
import { CharType } from 'src/app/model/typing/types/base-types/char-type';
import { FloatType } from 'src/app/model/typing/types/base-types/float-type';
import { IntType } from 'src/app/model/typing/types/base-types/int-type';
import { Definition } from 'src/app/model/typing/types/common/definition';
import { StructuralSubtypingQuery } from 'src/app/model/typing/types/common/structural-subtyping/structural-subtyping-query';
import { QueryGraphNodeData, StructuralSubtypingQueryGraph } from 'src/app/model/typing/types/common/structural-subtyping/structural-subtyping-query-graph';
import { StructuralSubtypingQueryResult } from 'src/app/model/typing/types/common/structural-subtyping/structural-subtyping-query-result';
import { ArrayType } from 'src/app/model/typing/types/type-constructors/array-type';
import { FunctionType } from 'src/app/model/typing/types/type-constructors/function-type';
import { PointerType } from 'src/app/model/typing/types/type-constructors/pointer-type';
import { StructType } from 'src/app/model/typing/types/type-constructors/struct-type';

const NODE_SIZE: number = 20;

@Component({
  selector: 'app-dummy-subtyping-test',
  templateUrl: './dummy-subtyping-test.component.html',
  styleUrls: ['./dummy-subtyping-test.component.css']
})
export class DummySubtypingTestComponent implements OnInit {

  public uxHint: string = "Scroll to zoom. Click and hold to move."

  private data: StructuralSubtypingQueryResult;

  @Input('structuralSubtypingQueryResult')
  public set structuralSubtypingQueryResult(value: StructuralSubtypingQueryResult) {
    this.data = value;
    this.update();
  }

  public _graphOptions: EChartsOption;
  private graphNodes: DisplayGraphNode[] = new Array<DisplayGraphNode>();
  private graphEdges: DisplayGraphEdge[] = new Array<DisplayGraphEdge>();

  constructor() { }

  ngOnInit(): void {
    this.update();
  }

  private update(): void {
    if(!this.data) return;
    this.updateGraph(this.data.queryGraph.getGraph().getRoot(), this.data.queryGraph);
    this.updateGraphOptions();
  }

  /*

  Graph

  */

  private updateGraph(root: Node<QueryGraphNodeData>, graph: StructuralSubtypingQueryGraph): void {
    const gen = generateDisplayedGraph([root], graph.getGraph(), node => {
      return node.getData().query.a.toString() + '  <=  ' + node.getData().query.b.toString();
    }, node => {
      return node.getData().highlight;
    }, edge => edge.getData());
    this.graphNodes = gen.nodes;
    this.graphEdges = gen.edges;
  }

  private updateGraphOptions(): void {
    this._graphOptions = {
      color: "lightgrey", //"#2469B3",
      //layout: "",
      // label: {
      //   show: true
      // },
      tooltip: {},
      animationDurationUpdate: 0,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          //itemStyle: {borderColor: "blue", borderWidth: 100, },
          type: "graph",
          layout: 'none',
          symbol: 'circle',
          symbolSize: NODE_SIZE,
          roam: true, // Graph position movable
          lineStyle: {
            //curveness: 0.1
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
                position: 'inside',
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

  public onClickGraph(event: any) { }
}
