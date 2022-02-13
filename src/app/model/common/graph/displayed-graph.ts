import { Graph } from './graph';
import { Node } from './node';

export const GRAPH_SCALE_FACTOR_X: number = 1;
export const GRAPH_SCALE_FACTOR_Y: number = 0.8;

export interface DisplayGraphNode {
  name: string;
  x: number; // [0; 100] left->right
  y: number; // [0; 100] top->bottom
  highlighted: boolean;
  astNodeIndex: number;
}

/**
 * DisplayGraphNode array index based
 */
export interface DisplayGraphEdge {
  source: number;
  target: number;
}

export interface DisplayedGraph {
  nodes: DisplayGraphNode[];
  edges: DisplayGraphEdge[];
}

export const updateDisplayedGraph = function <T>
  (roots: Node<T>[],
    graph: Graph<T>,
    nodeToLabel: (n: Node<T>) => string = null,
    nodeIsHighlighted: (n: Node<T>) => boolean = null
  ): DisplayedGraph {

  if (!nodeToLabel) nodeToLabel = (n) => { return "" }; // TODO Solve node ID issue
  if (!nodeIsHighlighted) nodeIsHighlighted = (n) => { return false };

  let outGraphNodes: DisplayGraphNode[] = new Array<DisplayGraphNode>();
  let outGraphEdges: DisplayGraphEdge[] = new Array<DisplayGraphEdge>();

  let graphNodeToDisplayGraphNode = new Map<Node<T>, DisplayGraphNode>();
  // Init displayed nodes
  outGraphNodes = graph.getNodes().map((n, i) => {
    const dNode = {
      name: nodeToLabel(n),
      x: i * 10,
      y: i * 10,
      highlighted: false,
      astNodeIndex: 0
    }; // Set coordinates later
    graphNodeToDisplayGraphNode.set(n, dNode);

    dNode.highlighted = nodeIsHighlighted(n);

    return dNode;
  });
  // Init displayed edges
  outGraphEdges = graph.getEdges().map(e => {
    let s = outGraphNodes.indexOf(graphNodeToDisplayGraphNode.get(e.getFrom()));
    let t = outGraphNodes.indexOf(graphNodeToDisplayGraphNode.get(e.getTo()));
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
    currentLevel = outGraphEdges.filter(e => currentLevel.includes(outGraphNodes[e.source])).map(e => outGraphNodes[e.target]);
    levelIndex++;
  }

  // Scale coordinates
  outGraphNodes.forEach(n => {
    n.x *= 100 * GRAPH_SCALE_FACTOR_X;
    n.y *= 100 * GRAPH_SCALE_FACTOR_Y;
  })

  // Handle node index
  outGraphNodes.forEach((n, index) => {
    n.name = n.name + ` [${index}]`;
    n.astNodeIndex = index;
  });


  return {
    nodes: outGraphNodes,
    edges: outGraphEdges
  };
}