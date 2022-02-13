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