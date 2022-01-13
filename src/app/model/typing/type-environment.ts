import { Declaration, SymbolTable } from "./symbol-table";
import { AbstractType } from "./types/abstract-type";
import { CharType } from "./types/base-types/char-type";
import { FloatType } from "./types/base-types/float-type";
import { IntType } from "./types/base-types/int-type";
import { ArrayType } from "./types/type-constructors/array-type";
import { PointerType } from "./types/type-constructors/pointer-type";

/**
 * Maps constants/identifiers to their (declared) types
 * Reference: https://ttt.in.tum.de/videos/Compilerconstruction/CC-45-TypeSystems.mp4
 * 
 * Note: Typing rules (with preconditions) implemented in AST module
 * 
 */
export class TypeEnvironment {

    private symbolTable: SymbolTable;

    constructor() {
        this.symbolTable = new SymbolTable();
    }

    public declare(declaration: Declaration): void {
        this.symbolTable.insert(declaration.getDeclarationIdentifier(), declaration);
    }

    /**
     * Axioms --> Const
     * 
     * @param   {string} constant 
     * @returns {AbstractType}
     */
    public getTypeOfConstant(constant: string): AbstractType {
        if (!isNaN(Number(constant))) {
            /*
            int | float
            */
            if (Number.parseInt(constant) === Number(constant)) {
                return new IntType();
            } else {
                return new FloatType();
            }
        }

        /*
        char
        */

        if(constant.length === 1){
            // e.g. "c"
            return new CharType();
        } else if (constant.length > 1) {
            // e.g. "Hello world"
            return new PointerType(new CharType());
        }

        throw new Error("Failed mapping type to constant: " + constant);
    }

    /**
     * Axioms --> Var
     * 
     * Returns the type for an identifier name in the type environment.
     * Throws an error if identifier has not been declared before use/lookup.
     * 
     * @param {string} identifier 
     * @returns {AbstractType}
     */
    public getTypeOfIdentifier(identifier: string): AbstractType {
        return this.symbolTable.lookup(identifier).getDeclarationType();
    }

    /**
     * Needed to update and keep track of declarations during abstract-synthax-tree-traversal
     * @returns {SymbolTable}
     */
    public getSymbolTable(): SymbolTable {
        return this.symbolTable;
    }

}