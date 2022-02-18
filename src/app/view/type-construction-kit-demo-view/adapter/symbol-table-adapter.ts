import { Declaration, ISymbolTable, SymbolTableUiData } from "src/app/model/typing/symbol-table";
import { TypeError } from "src/app/model/typing/type-error";

/**
 * Simple ISymbolTable Adapter for expressions only!
 */
export class SymbolTableAdapter implements ISymbolTable {

    private declarations: Declaration[]

    constructor(declarations: Declaration[]){
        this.declarations = declarations;
    }

    // Not required for expressions
    insert(identifier: string, declaration: Declaration): void {
        throw new Error("Method not implemented.");
    }

    lookup(identifier: string): Declaration {
        const found = this.declarations.find(d => d.getDeclarationIdentifier() === identifier);
        if(!found) throw new TypeError("Identifier " + identifier + " not declared.");
        return found;
    }

    // Not required for expressions
    enterNewScope(): void {
        throw new Error("Method not implemented.");
    }
    
    // Not required for expressions
    leaveScope(): void {
        throw new Error("Method not implemented.");
    }

    toUiData(): SymbolTableUiData[] {
        throw new Error("Method not implemented.");
    }

}