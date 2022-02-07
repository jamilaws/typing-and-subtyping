import { AbstractType } from "../abstract-type";
import { StructuralEquivalenceQuery } from "../structural-subtyping/structural-equivalence-query";

export class AliasPlaceholderType extends AbstractType {

    private alias: string;
    private target: AbstractType;

    constructor(alias: string, target: AbstractType) {
        super();
        this.alias = alias;
        this.target = target;
    }

    public getAlias(): string {
        return this.alias;
    }

    public getTarget(): AbstractType {
        return this.target;
    }

    public toString(): string {
        return this.alias;
    }

    /**
     * Delegates the call to target type after calling implementation in superclass.
     */
    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, queryHistory: StructuralEquivalenceQuery[]): boolean {
        if (super.isStrutcturalSubtypeOf_Impl(other, queryHistory)) return true;
        //alert("DEBUG");
        return this.target.isStrutcturalSubtypeOf_Impl(other, queryHistory);
    }
}