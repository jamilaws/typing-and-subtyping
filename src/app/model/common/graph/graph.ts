import { Node } from "./node";
import { Edge } from "./edge";

/**
 * Simple graph holding arbitrary data of type T in nodes and optionally any data of type E in edges.
 */
export class Graph<T, E = void> {

    private nodes: Node<T>[];
    private edges: Edge<T, E>[];

    private root: Node<T>;

    constructor(nodes: Node<T>[] = [], edges: Edge<T, E>[] = [], root: Node<T> = null) {
        this.nodes = nodes;
        this.edges = edges;
        this.root = root;
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

    public setRoot(root: Node<T>){
        this.root = root;
    }

    public getRoot(): Node<T> {
        return this.root;
    }

    /**
     * Return new copy of a graph containg both this and the parameter
     * Preserves root of this (if present)
     * @param graph another graph
     */
    public merge(graph: Graph<T, E>): Graph<T, E> {
        const newNodes = [...new Set(this.nodes.concat(graph.nodes))];
        const newEdges = [...new Set(this.edges.concat(graph.edges))];

        const newGraph = new Graph(newNodes, newEdges);
        newGraph.setRoot(this.getRoot());

        return newGraph;
    }
}