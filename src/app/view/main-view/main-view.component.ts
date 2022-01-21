import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { AbstractSyntaxTree, AstNode } from 'src/app/model/ast/abstract-syntax-tree';
import { Graph, Node } from 'src/app/model/ast/graph';
import { SymbolTable, SymbolTableUiData } from 'src/app/model/typing/symbol-table';
import { TypeEnvironment } from 'src/app/model/typing/type-environment';
import { TypeError } from 'src/app/model/typing/type-error';
import { TypingTree } from 'src/app/model/typing/typing-tree/typing-tree';
import { IncompleteAstWrapperException, ParsingService } from 'src/app/service/parsing.service';
import { Position } from 'src/app/util/code-editor/code-editor.component';

const TYPE_STRING_PLACEHOLDER: string = "Please select an AST-Node.";

const GRAPH_SCALE_FACTOR_X: number = 1;
const GRAPH_SCALE_FACTOR_Y: number = 0.5;

interface DisplayGraphNode {
  name: string;
  x: number; // [0; 100] left->right
  y: number; // [0; 100] top->bottom
  highlighted: boolean;
  astNodeIndex: number;
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

  symbolTable: SymbolTableUiData[] = null;

  _graphOptions: EChartsOption;
  private displayedNodeToAstNode: Map<DisplayGraphNode, AstNode> = new Map();

  public initialCode: string = 'int main()\n{\n\treturn 0;\n}';
  private currentCodeEditorLine = -1;

  private code: string = "";
  private ast: AbstractSyntaxTree = null;
  public isAstValid: boolean = true;

  private graphNodes: DisplayGraphNode[] = new Array<DisplayGraphNode>();
  private graphEdges: DisplayGraphEdge[] = new Array<DisplayGraphEdge>();

  public typeErrorString: string = TYPE_STRING_PLACEHOLDER;
  public typingTree: TypingTree = null; //DUMMY_TYPING_TREE;

  constructor(private changeDetector: ChangeDetectorRef, private parsingService: ParsingService) { }

  ngOnInit(): void {
    this.code = this.initialCode;
    this.updateComponent();
  }

  /*
  Code editor event handlers
  */

  onCodeChange(code: string) {
    this.code = code;
    this.typeErrorString = TYPE_STRING_PLACEHOLDER;
    this.updateComponent();
  }

  onCodeEditorPositionChange(position: Position) {
    //return; // TODO Remove
    this.currentCodeEditorLine = position.lineNumber;
    this.updateComponent();
  }

  /*
  AST event handlers
  */

  onClickAST(event: any) {
    const index = event.data.astNodeIndex;
    const node = this.ast.getGraph().getNodes()[index].getData();

    this.typeErrorString = null;
    this.typingTree = node.getTypingTree();
  }

  /*

  */

  private updateComponent(): void {
    this.updateAst();
    this.performTypeCheck();
    this.updateGraphOptions();
    //this.changeDetector.detectChanges();
  }

  private updateAst(): void {
    try {
      this.ast = this.parsingService.parse(this.code);
      this.isAstValid = true;
      try {
        const astGraph: Graph<AstNode> = this.ast.getGraph();
        this.updateDisplayedGraph(this.ast.getRoots().map(r => r.getGraphNode()), astGraph);
      } catch (e) {
        alert("Valid AST but building graph failed.");
        console.log(e);
      }
    } catch (e) {
      if (e instanceof IncompleteAstWrapperException) {
        alert(e.message + " (see console)");
        console.log("IncompleteAstWrapperException on parsing:");
        console.log(e.rawParsedJson);
      }
      this.isAstValid = false;
      // Uncomment if error of underlying parser is needed.
      console.log(e);
    }
  }

  private performTypeCheck(): void {
    if (!this.isAstValid) {
      return;
    }
    try {
      const typeEnv = new TypeEnvironment();
      this.ast.performTypeCheck(typeEnv);
      this.typeErrorString = null;

      this.symbolTable = typeEnv.getSymbolTable().toUiData();

    } catch (e) {
      this.typeErrorString = (<Error>e).message;

      // if(e instanceof TypeError) {
      //   // Custom TypeError
      //   this.typeErrorString = (<Error>e).message;
      // } else {
      //   // Unexpected Error
      //   alert("Unexpected Error while performTypeCheck");
      //   throw e;
      // }
    }
  }

  private updateDisplayedGraph(roots: Node<AstNode>[], graph: Graph<AstNode>) {
    let graphNodeToDisplayGraphNode = new Map<Node<AstNode>, DisplayGraphNode>();
    // Init displayed nodes
    this.graphNodes = graph.getNodes().map((n, i) => {
      const dNode = {
        name: n.getData().getGraphNodeLabel(),
        x: i * 10,
        y: i * 10,
        highlighted: false,
        astNodeIndex: 0
      }; // Set coordinates later
      graphNodeToDisplayGraphNode.set(n, dNode);

      if (n.getData().getCodeLine() === this.currentCodeEditorLine) {
        dNode.highlighted = true;
      }

      // Remember link from displayed node to ast node for click callbacks
      this.displayedNodeToAstNode.set(dNode, n.getData());

      return dNode;
    });
    // Init displayed edges
    this.graphEdges = graph.getEdges().map(e => {
      let s = this.graphNodes.indexOf(graphNodeToDisplayGraphNode.get(e.getFrom()));
      let t = this.graphNodes.indexOf(graphNodeToDisplayGraphNode.get(e.getTo()));
      return { source: s, target: t };
    });
    // Traverse displayed graph via breadth first search to set coorinates
    let levelIndex: number = 1;
    let currentLevel: DisplayGraphNode[] = roots.map(n => graphNodeToDisplayGraphNode.get(n));
    while (currentLevel.length > 0) {

      currentLevel.forEach((n, col) => {
        n.x = col + 1;
        n.y = levelIndex;
      })

      // Update currentLevel with next one
      currentLevel = this.graphEdges.filter(e => currentLevel.includes(this.graphNodes[e.source])).map(e => this.graphNodes[e.target]);
      levelIndex++;
    }

    // Scale coordinates
    this.graphNodes.forEach(n => {
      n.x *= 100 * GRAPH_SCALE_FACTOR_X;
      n.y *= 100 * GRAPH_SCALE_FACTOR_Y;
    })

    // Handle node index
    this.graphNodes.forEach((n, index) => {
      n.name = n.name + ` [${index}]`;
      n.astNodeIndex = index;
    });

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
          symbolSize: 30,
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

}