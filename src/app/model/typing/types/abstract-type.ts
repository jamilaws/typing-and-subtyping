export abstract class AbstractType {
    abstract toString(): string;

    public equals(other: AbstractType): boolean{          
        return this.toString() === other.toString();
    }
}