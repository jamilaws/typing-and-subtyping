import { TypeDefStatement } from "../ast/ast-nodes/type-def-statement";
import { Declaration, SymbolTable } from "./symbol-table";
import { AbstractType } from "./types/abstract-type";
import { CharType } from "./types/base-types/char-type";
import { FloatType } from "./types/base-types/float-type";
import { IntType } from "./types/base-types/int-type";
import { ArrayType } from "./types/type-constructors/array-type";
import { PointerType } from "./types/type-constructors/pointer-type";

/**
 * Context entity for AST traversal during performTypeCheck execution
 * Maps constants/identifiers to their (declared) types
 * Reference: https://ttt.in.tum.de/videos/Compilerconstruction/CC-45-TypeSystems.mp4
 * 
 * Note: Typing rules (with preconditions) implemented in AST module
 * 
 */
export class TypeEnvironment {

    private symbolTable: SymbolTable;
    private typeDefs: Map<string, AbstractType>; // better than storing TypeDefStatement array for lower cohesion

    constructor() {
        this.symbolTable = new SymbolTable();
        this.typeDefs = new Map();
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

        if (constant.length === 1) {
            // e.g. "c"
            return new CharType();
        } else if (constant.length > 1) {
            // e.g. "Hello world"
            return new PointerType(new CharType());
        }

        throw new Error("Failed mapping type to constant: " + constant);
    }

    /*

    Symbol Table related methods

    */

    public declare(declaration: Declaration): void {
        this.symbolTable.insert(declaration.getDeclarationIdentifier(), declaration);
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


    /*
    
    Typedef related methods
    
    */

    /**
     * Stores the passed type definition. When trying to define any type for an already defined alias, an error is thrown.
     * @param alias key
     * @param type value
     */
    public addTypeDefinition(alias: string, type: AbstractType): void {
        if(this.typeDefs.get(alias)) throw new Error("Cannot use same type alias (" + alias + ") multiple times.");
        this.typeDefs.set(alias, type);
    }

    /**
     * Returns the type for the passed alias. If none has been declares before, an error is thrown.
     * @param alias 
     * @returns 
     */
    public getTypeForAlias(alias: string): AbstractType {
        const type = this.typeDefs.get(alias);
        if(!type) throw new Error("Type alias " + alias + " not found. Define it before usage.");
        return type;
    }

    public getTypeDefinitions():  Map<string, AbstractType> {
        return this.typeDefs;
    }

}