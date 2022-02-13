import { Graph, Node, Edge } from 'src/app/model/common/graph/_module';
import { StructuralSubtypingQueryContext } from "./structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQuery } from "./structural-subtyping/structural-subtyping-query";
import { StructuralSubtypingQueryResult } from "./structural-subtyping/structural-subtyping-query-result";
//import { otherAliasReplaced } from "./structural-subtyping/decorators/replace-alias";

export const queryGraphUpdated = () => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (other: AbstractType, context: StructuralSubtypingQueryContext) {

            let newNode = new Node(new StructuralSubtypingQuery(<AbstractType> this, other));
            let newGraph = new Graph<StructuralSubtypingQuery, string>([newNode]);

            if(context.accumulator.queryGraphRoot) {
                // Query graph empty so far
                newGraph = context.accumulator.queryGraph.merge(newGraph);
                const newEdge = new Edge(context.accumulator.queryGraphRoot, newNode, "test");
                newGraph.addEdge(newEdge);        
            }
            
            context.accumulator.queryGraph = newGraph;

            // Update queryGraphRoot
            context.accumulator.queryGraphRoot = newNode;


            return originalMethod.apply(this, [other, context]);
        };
    };
}

export const queryLoopChecked = () => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (other: AbstractType, context: StructuralSubtypingQueryContext) {
            const newQuery = new StructuralSubtypingQuery(<AbstractType> this, other);
            if (context.queryHistory.some(q => q.equals(newQuery))) {
                // Query loop in history detected. Resolve structural subtyping query with true.

                // Add current query to history (Not relevant anymore, but for the sake of completeness)
                context.queryHistory.push(newQuery);

                console.log("Subtyping query results true due to query loop! History:");
                console.log(context.queryHistory);

                context.accumulator.value = true;
                return context.accumulator;

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
        descriptor.value = function (other: AbstractType, context: StructuralSubtypingQueryContext) {

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

    public isStrutcturalSubtypeOf(other: AbstractType, typeDefs: Map<string, AbstractType>): StructuralSubtypingQueryResult {
        const context: StructuralSubtypingQueryContext = {
            typeDefinitions: typeDefs,
            queryHistory: new Array(),
            accumulator: {
                value: false,
                queryGraphRoot: null,
                queryGraph: new Graph<StructuralSubtypingQuery, string>()
            }
        };
        return this.isStrutcturalSubtypeOf_Impl(other, context);
    }

    /**
     * Performs a basic subtyping check by:
     * - In case other is an AliasPlaceholderType, replace it by its target
     * - Check for loops in the query history
     * - Finally, check for equallity by calling equals method
     * 
     * Override this method if needed and call it to preserve basic subtyping check.
     */
    @queryGraphUpdated() @queryLoopChecked() @otherAliasReplaced()
    public isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        context.accumulator.value = this.equals(other);
        return context.accumulator;
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

    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        const basicCheckResult = super.isStrutcturalSubtypeOf_Impl(other, context);
        if (basicCheckResult.value) return basicCheckResult;

        const target = context.typeDefinitions.get(this.getAlias());
        if (!target) throw new Error("No type definition exists for " + this.getAlias());
        return target.isStrutcturalSubtypeOf_Impl(other, context);
    }
}


