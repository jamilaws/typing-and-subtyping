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

    public isStrutcturalSubtypeOf(other: AbstractType): boolean {
        return this.isStrutcturalSubtypeOf_Impl(other, new Array());
    }

    /**
     * Override this method if needed
     * 
     * TODO: add list of typedefs for that!
     * 
     * @param other Type to compare to
     * @param queryHistory as termination condition in recursive type definition case
     * @returns true if a query loop was detected or this is equal to other.
     */
    public isStrutcturalSubtypeOf_Impl(other: AbstractType, queryHistory: StructuralEquivalenceQuery[]): boolean {
                
        if(this.equals(other)){
            return true;
        }

        const newQuery = new StructuralEquivalenceQuery(this, other);
        
        if(queryHistory.some(q => q.equals(newQuery))) {
            return true;
        } else {
            queryHistory.push(newQuery);
            return false;
        }
    }
    
    //public abstract isStrutcturalSubtypeOf_Impl(other: AbstractType, queryHistory: StructuralEquivalenceQuery[]);
}