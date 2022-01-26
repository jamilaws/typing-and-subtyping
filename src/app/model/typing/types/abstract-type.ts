export abstract class AbstractType {
    abstract toString(): string;

    /**
     * TODO: Implement subtyping!
     * 
     * e.g.: Compare NAMES when comparing structs
     * 
     * @param other 
     * @returns 
     */
    public equals(other: AbstractType): boolean{          
        return this.toString() === other.toString();
    }
}