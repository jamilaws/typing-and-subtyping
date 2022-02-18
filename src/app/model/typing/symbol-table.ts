import { AbstractType } from "./types/abstract-type";

export interface ISymbolTable {
    insert(identifier: string, declaration: Declaration): void
    lookup(identifier: string): Declaration
    enterNewScope(): void
    leaveScope(): void
    toUiData(): SymbolTableUiData[]
}

export interface SymbolTableUiData {
    identifier: string;
    declarations: {
        type: string;
        line: number;
    }[];
}


/**
 * Interface for all of those ast nodes which represent any kind of declaration
 */
export interface Declaration {
    getDeclarationIdentifier(): string;
    getDeclarationType(): AbstractType;
    getCodeLine(): number;
}

/**
 * Simple array based stack
 */
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

    public getTopElement(): T {
        return this.array[this.array.length - 1];
    }

    public toArray(): T[] {
        return this.array;
    }
}

/**
 * Class for management of declarations during ast traversal.
 */
export class SymbolTable implements ISymbolTable{

    private declarationStacks: Map<string, Stack<Declaration>>;

    constructor(){
        this.declarationStacks = new Map<string, Stack<Declaration>>();
    }

    public insert(identifier: string, declaration: Declaration): void {
        const foundStack: Stack<Declaration> = this.declarationStacks.get(identifier);
        if(foundStack){
            // Shadowing existing declaration
            foundStack.push(declaration);
            // TODO: Throw error in double declaration after implementing scopes! 
        } else {
            // Found first occurence of a declaration
            const newStack = new Stack<Declaration>([declaration]);
            this.declarationStacks.set(identifier, newStack);
        }
    }

    public lookup(identifier: string): Declaration {
        const foundStack = this.declarationStacks.get(identifier);
        if(!foundStack) {
            const e = new Error(`Invalid use of undeclared identifier '${identifier}'`)
            console.log(e);
            
            throw e;
        }
        return foundStack.getTopElement();
    }

    public enterNewScope(): void {
        // TODO: Persistent tree approach --> snapshots
    }

    public leaveScope(): void {
        // TODO: Persistent tree approach --> snapshots
    }

    public toUiData(): SymbolTableUiData[] {
        let keys    =  Array.from(this.declarationStacks.keys());
        let values  =  Array.from(this.declarationStacks.values());

        return keys.map((key, index) => {
            return {
                identifier: key,
                declarations: values[index].toArray().map(d => {
                    return {
                        type: d.getDeclarationType().toString(),
                        line: d.getCodeLine()
                    };
                })
            };
        });
    }
}