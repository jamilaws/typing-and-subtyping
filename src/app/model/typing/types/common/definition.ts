import { AbstractType } from "../../../ast/ast-nodes/type/abstract-type";

export class Definition {
    private name: string;
    private type: AbstractType;

    constructor(name: string, type: AbstractType) {
        this.name = name;
        this.type = type;
    }

    public getName(): string {
        return this.name;
    }

    public getType(): AbstractType {
        return this.type;
    }

    public toString(): string {
        return this.type.toString() + " " + this.name;
    }
}