import { AbstractType } from "../abstract-type";

/**
 * Class representing function parameters, struct definition members or ...  TODO?
 */
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