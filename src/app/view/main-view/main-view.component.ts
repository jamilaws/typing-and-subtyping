import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { AbstractSyntaxTree } from 'src/app/model/ast/abstract-syntax-tree';
import { AstNode } from 'src/app/model/ast/ast-node';
import { DisplayGraphEdge, DisplayGraphNode, GRAPH_SCALE_FACTOR_X, GRAPH_SCALE_FACTOR_Y, generateDisplayedGraph } from 'src/app/model/common/graph/displayed-graph';
import { Graph, Node, Edge } from 'src/app/model/common/graph/_module';
import { SymbolTable, SymbolTableUiData } from 'src/app/model/typing/symbol-table';
import { TypeEnvironment } from 'src/app/model/typing/type-environment';
import { TypeError } from 'src/app/model/typing/type-error';
import { TypingTree } from 'src/app/model/typing/typing-tree/typing-tree';
import { IncompleteAstWrapperException, ParsingService } from 'src/app/service/parsing.service';
import { Position } from 'src/app/util/code-editor/code-editor.component';

const TYPE_STRING_PLACEHOLDER: string = "Please select an AST-Node.";

const NODE_SIZE: number = 20;

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {

  symbolTable: SymbolTableUiData[] = null;

  _graphOptions: EChartsOption;

  public initialCode: string = 'int main()\n{\n\treturn 0;\n}';
  private currentCodeEditorLine = -1;

  private code: string = "";
  private ast: AbstractSyntaxTree = null;
  public isAstValid: boolean = true;

  private graphNodes: DisplayGraphNode[] = new Array<DisplayGraphNode>();
  private graphEdges: DisplayGraphEdge[] = new Array<DisplayGraphEdge>();

  public typeErrorString: string = TYPE_STRING_PLACEHOLDER;
  public typingTree: TypingTree = null; //DUMMY_TYPING_TREE;

  constructor(private parsingService: ParsingService) { }

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

    //console.log("Clicked AST-Node:");
    //console.log(node);
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
        
        const displayedGraph = generateDisplayedGraph(this.ast.getRoots().map(r => r.getGraphNode()), astGraph, (node) => {
          return node.getData().getGraphNodeLabel();
        }, (node) => {
          return node.getData().getCodeLine() === this.currentCodeEditorLine;
        });

        this.graphNodes = displayedGraph.nodes;
        this.graphEdges = displayedGraph.edges;

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

}