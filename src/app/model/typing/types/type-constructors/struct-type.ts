import { AbstractType } from "../abstract-type";
import { Definition } from "../common/definition";

export class StructType extends AbstractType {

    private name: string;
    private members: Definition[];

    constructor(name: string, members: Definition[]){
        super();
        this.name = name;
        this.members = members;
    }

    public toString(): string {
        return "struct { " + this.members.map(m => m.toString()).concat(", ") + " }";
    }

    public getName(): string {
        return this.name;
    }

    public getMembers(): Definition[] {
        return this.members;
    }
}