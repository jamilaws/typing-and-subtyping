import { Declaration } from "src/app/model/typing/symbol-table";
import { AbstractType } from "src/app/model/typing/types/abstract-type";

export class DeclarationAdapter implements Declaration {

    private identifier: string;
    private type: AbstractType;

    constructor(identifier: string, type: AbstractType) {
        this.identifier = identifier;
        this.type = type;
    }

    getDeclarationIdentifier(): string {
        return this.identifier;
    }
    getDeclarationType(): AbstractType {
        return this.type;
    }
    getCodeLine(): number {
        return 0; // Dummy 
    }
}