import { Node } from './node';

/*
Optional type parameter E if Edge should hold any data.
*/
export class Edge<T, E = void> {

    private from: Node<T>;
    private to: Node<T>;

    private data: E;

    constructor(from: Node<T>, to: Node<T>, data: E = null) {
        this.from = from;
        this.to = to;
        this.data = data;
    }

    public getFrom(): Node<T> {
        return this.from;
    }

    public getTo(): Node<T> {
        return this.to;
    }

    public getData(): E {
        return this.data;
    }
}