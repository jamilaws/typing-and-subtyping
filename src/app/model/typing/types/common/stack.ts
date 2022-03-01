/**
 * Simple array based stack
 */
export class Stack<T> {

    private array: T[];

    constructor(initValues: Array<T> = []) {
        this.array = initValues;
    }

    public push(element: T): void {
        this.array.push(element);
    }

    public pop(): T {
        return this.array.pop();
    }

    public getTopElement(): T {
        return this.array[this.array.length - 1];
    }

    public toArray(): T[] {
        return this.array;
    }
}
