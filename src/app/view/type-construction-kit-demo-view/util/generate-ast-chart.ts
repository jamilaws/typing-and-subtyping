import { EChartsOption } from "echarts";
import { AbstractSyntaxTree } from "src/app/model/ast/abstract-syntax-tree";
import { AstNode } from "src/app/model/ast/ast-node";
import { DisplayedGraph, generateDisplayedGraph } from "src/app/model/common/graph/displayed-graph";
import { Graph } from "src/app/model/common/graph/_module";
import { IncompleteAstWrapperException } from "src/app/service/parsing.service";

const NODE_SIZE: number = 30;
const NODE_COLOR: string = "#2469B3";

const NODE_TEXT_COLOR_HIGHLIGHTED: string = "blue"
const NODE_TEXT_COLOR: string = "white"

const NODE_TEXT_POSITION = "inside";

const LINE_CURVENESS: number = 0; //0.1;

export function generateAstChart(ast: AbstractSyntaxTree): EChartsOption {
    try {
      try {
        const astGraph: Graph<AstNode> = ast.getGraph();
        
        const displayedGraph = generateDisplayedGraph(ast.getRoots().map(r => r.getGraphNode()), astGraph, (node) => {
          return node.getData().getGraphNodeLabel();
        }, (node) => {
          return false;
          //return node.getData().getCodeLine() === this.currentCodeEditorLine;
        });

        return updateGraphOptions(displayedGraph);

      } catch (e) {
        alert("Valid AST but building graph failed.");
        throw e;
      }
    } catch (e) {
      if (e instanceof IncompleteAstWrapperException) {
        alert(e.message + " (see console)");
       throw e
      }
      // Uncomment if error of underlying parser is needed.
      throw e;
    }
  }

function updateGraphOptions(displayedGraph: DisplayedGraph): EChartsOption {
    return {
      color: NODE_COLOR,
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
            curveness: LINE_CURVENESS
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
          data: displayedGraph.nodes.map(node => {
            return {
              name: node.name,
              x: node.x,
              y: node.y,
              astNodeIndex: node.astNodeIndex,
              label: {
                show: true,
                position: NODE_TEXT_POSITION,
                textStyle: {
                  color: node.highlighted ? NODE_TEXT_COLOR_HIGHLIGHTED : NODE_TEXT_COLOR,
                }
              },
              tooltip: {
                show: false,
              }
            }
          }),
          links: displayedGraph.edges.map(edge => {
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
