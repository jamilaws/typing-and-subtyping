import { AbstractType } from "./types/abstract-type";

export interface Declaration {
    getDeclarationIdentifier(): string;
    getDeclarationType(): AbstractType;
}

export class Stack<T> {

    private array: T[];

    constructor(initValues: Array<T> = []){
        this.array = initValues;
    }

    public push(element: T): void {
        this.array.push(element);
    }

    public pop(): T {
        return this.array.pop();
    }
}

export class SymbolTable {

    private declarationStacks: Map<string, Stack<Declaration>>;

    constructor(){
        this.declarationStacks = new Map<string, Stack<Declaration>>();
    }

    public insert(identifier: string, type: Declaration): void {
        const foundStack: Stack<Declaration> = this.declarationStacks.get(identifier);
        if(foundStack){
            // Shadowing existing declaration
            foundStack.push(type);
        } else {
            // Found first occurence of a declaration
            const newStack = new Stack<Declaration>([type]);
            this.declarationStacks.set(identifier, newStack);
        }
    }

    public lookup(identifier: string): Declaration {
        const foundStack = this.declarationStacks.get(identifier);
        if(!foundStack) throw new Error("Use of identifier without declaration.");
        return foundStack.pop();
    }

    public enterNewScope(): void {
        // TODO: Persistent tree approach --> snapshots
    }

    public leaveScope(): void {
        // TODO: Persistent tree approach --> snapshots
    }
}