import { StructuralEquivalenceQuery } from "./structural-subtyping/structural-equivalence-query";
//import { replaceAlias } from "./structural-subtyping/decorators/replace-alias";

export const replaceAlias = () => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (other: AbstractType, context: SubtypingContext) {
            
            // TODO: Fix error with instanceof operator!!!
            if (other.constructor.name === "AliasPlaceholderType") {
                // Replace 'other' by its target type
                const alias = (<AliasPlaceholderType> other).getAlias();
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
    typeDefinitions:    Map<string, AbstractType>;
    queryHistory:       StructuralEquivalenceQuery[];
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
     * TODO: add list of typedefs for that!
     * 
     * @param other Type to compare to
     * @param queryHistory as termination condition in recursive type definition case
     * @returns true if a query loop was detected or this is equal to other.
     */

    @replaceAlias()
    public isStrutcturalSubtypeOf_Impl(other: AbstractType, context: SubtypingContext): boolean {

        if (this.equals(other)) {
            return true;
        }

        const newQuery = new StructuralEquivalenceQuery(this, other);

        if (context.queryHistory.some(q => q.equals(newQuery))) {
            
            console.log("Query loop found. History:");
            console.log(context.queryHistory);

            return true;
        } else {
            context.queryHistory.push(newQuery);
            return false;
        }
    }

    //public abstract isStrutcturalSubtypeOf_Impl(other: AbstractType, queryHistory: StructuralEquivalenceQuery[]);
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

    /**
     * Delegates the call to target type after calling implementation in superclass.
     */
    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: SubtypingContext): boolean {
        if (super.isStrutcturalSubtypeOf_Impl(other, context)) return true;
        const target = context.typeDefinitions.get(this.getAlias());
        if (!target) throw new Error("No type definition exists for " + this.getAlias());
        return target.isStrutcturalSubtypeOf_Impl(other, context);
    }
}


