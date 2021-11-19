export class Node {

    private static nodeCounter: number = 0;
    private id: number;
    private label: string;

    constructor(label: string) {
        this.id = Node.nodeCounter++;
        this.label = label;
    }

    public getId(): number {
        return this.id;
    }

    public getLabel(): string {
        return this.label;
    }
}

export class Edge {

    private from: Node;
    private to: Node;

    constructor(from: Node, to: Node) {
        this.from = from;
        this.to = to;
    }

    public getFrom(): Node {
        return this.from;
    }

    public getTo(): Node {
        return this.to;
    }
}

export class Graph {

    private nodes: Node[];
    private edges: Edge[];

    constructor(nodes: Node[], edges: Edge[]) {
        this.nodes = nodes;
        this.edges = edges;
    }
}