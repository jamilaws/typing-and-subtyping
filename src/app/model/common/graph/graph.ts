import { Node } from "./node";
import { Edge } from "./edge";

/**
 * Simple graph holding arbitrary data of type T in nodes and optionally any data of type E in edges.
 */
export class Graph<T, E = void> {

    private nodes: Node<T>[];
    private edges: Edge<T, E>[];

    constructor(nodes: Node<T>[] = [], edges: Edge<T, E>[] = []) {
        this.nodes = nodes;
        this.edges = edges;
    }

    public getNodes(): Node<T>[] {
        return this.nodes;
    }

    public getEdges(): Edge<T, E>[] {
        return this.edges;
    }

    public addNode(node: Node<T>) {
        this.nodes.push(node);
    }

    public addEdge(edge: Edge<T, E>) {
        this.edges.push(edge)
    }

    /**
     * Return new copy of a graph containg both this and the parameter
     * Utility method, e.g. for recursive graph generation
     * @param graph another graph
     */
    public merge(graph: Graph<T, E>): Graph<T, E> {
        const newNodes = [...new Set(this.nodes.concat(graph.nodes))];
        const newEdges = [...new Set(this.edges.concat(graph.edges))];

        return new Graph(newNodes, newEdges);
    }
}