export abstract class AbstractType {
    abstract toString(): string;

    /**
     * 
     * e.g.: Compare NAMES when comparing structs?
     * 
     * @param other 
     * @returns 
     */
    public equals(other: AbstractType): boolean {          
        return this.toString() === other.toString();
    }

    public abstract isSubtypeOf(other: AbstractType): boolean;
}