import { StructuralEquivalenceQuery } from "./structural-subtyping/structural-equivalence-query";

export abstract class AbstractType {
    abstract toString(): string;

    /**
     * TODO: e.g.: Compare NAMES when comparing structs?)
     * @param other 
     * @returns 
     */
    public equals(other: AbstractType): boolean {          
        return this.toString() === other.toString();
    }

    public isStrutcturallyEqual(other: AbstractType): boolean {
        return this.isStrutcturallyEqual_Impl(other, new Array());
    }

    /**
     * TODO Implement properly by "rules for well typedness"
     * - Also: add list of typedefs for that!
     * 
     * @param other Type to compare to
     * @param queryHistory as termination condition in recursive type definition case
     */
    protected abstract isStrutcturallyEqual_Impl(other: AbstractType, queryHistory: StructuralEquivalenceQuery[]): boolean;
    public abstract isSubtypeOf(other: AbstractType): boolean;
}