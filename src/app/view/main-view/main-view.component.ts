import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { read } from 'fs';
import { AbstractSyntaxTree } from 'src/app/model/ast/abstract-syntax-tree';
import { Graph, Node } from 'src/app/model/ast/graph';
import { ParsingService } from 'src/app/service/parsing.service';

interface DisplayGraphNode {
  name: string;
  x:    number; // [0; 100] left->right
  y:    number; // [0; 100] top->bottom
}

/**
 * DisplayGraphNode array index based
 */
interface DisplayGraphEdge {
  source: number;
  target: number;
}

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {

  public initialCode: string = 'int main()\n{\n\treturn 0;\n}';

  private code: string = "";
  private ast: AbstractSyntaxTree = null;
  public isAstValid: boolean = true;

  private graphNodes: DisplayGraphNode[] = new Array<DisplayGraphNode>();

  private graphEdges: DisplayGraphEdge[] = new Array<DisplayGraphEdge>();

  constructor(private parsingService: ParsingService) { }

  ngOnInit(): void {
    this.code = this.initialCode;
    this.updateAst();
  }

  onCodeChange(code: string) {
    this.code = code;
    this.updateAst();
  }

  updateAst(): void {
    try {
      this.ast = this.parsingService.parse(this.code);
      this.isAstValid = true;
      try {
        const astGraph: Graph<string> = this.ast.getGraph();

        console.log(astGraph);
        

        this.updateDisplayedGraph(this.ast.getRoots().map(r => r.getGraphNode()), astGraph);
      } catch (e) {
        alert("Valid AST but building graph failed.");
        console.log(e);
        
      }
    } catch (e) {
      this.isAstValid = false;
      //console.log(e);
    }


  }

  getAstAsJSON() {
    return JSON.stringify(this.ast, undefined, 4);
  }

  getGraphOption(): EChartsOption {
    return {
      color: "#2469B3",
      tooltip: {},
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: "graph",
          layout: 'none',
          symbolSize: 60,
          roam: true,
          label: {
            // normal: {
            //   show: true
            // }
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
          data: this.graphNodes,
          links: this.graphEdges,
          lineStyle: {
            // normal: {
            //   opacity: 0.9,
            //   width: 2,
            //   curveness: 0
            // }
          }
        }
      ]
    };
  }

  private updateDisplayedGraph(roots: Node<string>[], graph: Graph<string>){
    let graphNodeToDisplayGraphNode = new Map<Node<string>, DisplayGraphNode>();
    // Init displayed nodes
    this.graphNodes = graph.getNodes().map((n, i) => { 
      const dNode = { name: n.getData(), x: i * 10, y: i * 10 }; // Set coordinates later
      graphNodeToDisplayGraphNode.set(n, dNode);
      return dNode;
    });
    // Init displayer edges
    this.graphEdges = graph.getEdges().map(e => {
      let s = this.graphNodes.indexOf(graphNodeToDisplayGraphNode.get(e.getFrom()));
      let t = this.graphNodes.indexOf(graphNodeToDisplayGraphNode.get(e.getTo()));
      return {source: s, target: t};
    });
    // Traverse displayed graph via breadth first search to set coorinates
    let levelIndex: number = 1;
    let currentLevel: DisplayGraphNode[] = roots.map(n => graphNodeToDisplayGraphNode.get(n));
    while(currentLevel.length > 0){

      currentLevel.forEach((n, col) => {
        n.x = col + 1;
        n.y = levelIndex;
        n.name = `${n.name} (${n.x};${n.y})`
      })

      // Update currentLevel with next one
      currentLevel = this.graphEdges.filter(e => currentLevel.includes(this.graphNodes[e.source])).map(e => this.graphNodes[e.target]);
      levelIndex++;
    }

    console.log(this.graphNodes);
    console.log(this.graphEdges);
    
    // Scale coordinates
    this.graphNodes.forEach(n => {
      n.x *= 100;
      n.y *= 100;
    })

  }

}