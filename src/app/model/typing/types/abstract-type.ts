import { StructuralEquivalenceQuery } from "./structural-subtyping/structural-equivalence-query";
//import { otherAliasReplaced } from "./structural-subtyping/decorators/replace-alias";

export const queryLoopChecked = () => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (other: AbstractType, context: SubtypingContext) {
            const newQuery = new StructuralEquivalenceQuery(<AbstractType> this, other);
            if (context.queryHistory.some(q => q.equals(newQuery))) {
                // Query loop in history detected. Resolve structural subtyping query with true.

                // Add current query to history (Not relevant anymore, but for the sake of completeness)
                context.queryHistory.push(newQuery);

                console.log("Subtype due to query loop! History:");
                console.log(context.queryHistory);

                return true;
            } else {
                // Add current query to history
                context.queryHistory.push(newQuery);
                return originalMethod.apply(this, [other, context]);
            }
        };
    };
};

export const otherAliasReplaced = () => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (other: AbstractType, context: SubtypingContext) {

            // TODO: Fix error with instanceof operator!!!
            if (other.constructor.name === "AliasPlaceholderType") {
                // Replace 'other' by its target type
                const alias = (<AliasPlaceholderType>other).getAlias();
                const target = context.typeDefinitions.get(alias);
                if (!target) throw new Error("No type definition exists for " + alias);
                return originalMethod.apply(this, [target, context]);
            } else {
                // Simply delegate method call without any modification
                return originalMethod.apply(this, [other, context]);
            }
        };
    };
};

export interface SubtypingContext {
    typeDefinitions: Map<string, AbstractType>;
    queryHistory: StructuralEquivalenceQuery[];
}

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

    public isStrutcturalSubtypeOf(other: AbstractType, typeDefs: Map<string, AbstractType>): boolean {
        const context: SubtypingContext = {
            typeDefinitions: typeDefs,
            queryHistory: new Array()
        };
        return this.isStrutcturalSubtypeOf_Impl(other, context);
    }

    /**
     * Override this method if needed
     * 
     * @param other Type to compare to
     * @param queryHistory as termination condition in recursive type definition case
     * @returns true if a query loop was detected or this is equal to other.
     */
    @queryLoopChecked() @otherAliasReplaced()
    public isStrutcturalSubtypeOf_Impl(other: AbstractType, context: SubtypingContext): boolean {
        if (this.equals(other)){
            return true; // Equality as a subset of Subtype relation
        } else {
            return false; // For more complex subtyping querys override this method
        }
    }
}

export class AliasPlaceholderType extends AbstractType {

    private alias: string;

    constructor(alias: string) {
        super();

        this.alias = alias;
    }

    public getAlias(): string {
        return this.alias;
    }

    public toString(): string {
        return this.alias;
    }

    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: SubtypingContext): boolean {
        if (super.isStrutcturalSubtypeOf_Impl(other, context)) return true;
        const target = context.typeDefinitions.get(this.getAlias());
        if (!target) throw new Error("No type definition exists for " + this.getAlias());
        return target.isStrutcturalSubtypeOf_Impl(other, context);
    }
}


