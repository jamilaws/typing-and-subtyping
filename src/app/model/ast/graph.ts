export class Node<T> {

    private static nodeCounter: number = 0;
    private id: number;
    private data: T;

    constructor(data: T) {
        this.id = Node.nodeCounter++;
        this.data = data;
    }

    public getId(): number {
        return this.id;
    }

    public getData(): T {
        return this.data;
    }
}

export class Edge<T> {

    private from: Node<T>;
    private to: Node<T>;

    constructor(from: Node<T>, to: Node<T>) {
        this.from = from;
        this.to = to;
    }

    public getFrom(): Node<T> {
        return this.from;
    }

    public getTo(): Node<T> {
        return this.to;
    }
}

/**
 * Simple graph holding arbitrary data with type T in nodes
 */
export class Graph<T> {

    private nodes: Node<T>[];
    private edges: Edge<T>[];

    constructor(nodes: Node<T>[], edges: Edge<T>[]) {
        this.nodes = nodes;
        this.edges = edges;
    }

    public getNodes(): Node<T>[] {
        return this.nodes;
    }

    public getEdges(): Edge<T>[] {
        return this.edges;
    }

    public addNode(node: Node<T>) {
        this.nodes.push(node);
    }

    public addEdge(edge: Edge<T>) {
        this.edges.push(edge)
    }

    /**
     * Return new copy of a graph containg both this and the parameter
     * Utility method, e.g. for recursive graph generation
     * @param graph another graph
     */
    public merge(graph: Graph<T>): Graph<T> {
        const newNodes = [...new Set(this.nodes.concat(graph.nodes))];
        const newEdges = [...new Set(this.edges.concat(graph.edges))];

        return new Graph(newNodes, newEdges);
    }
}