import { AbstractType } from "../abstract-type";
import { FloatType } from "./float-type";

export class IntType extends AbstractType {

    private superTypes: string[] = [ FloatType.name ];

    public toString(): string {
        return "int";
    }

    public isSubtypeOf(other: AbstractType): boolean {
        return this.equals(other) || this.superTypes.includes(typeof other);
    }
}