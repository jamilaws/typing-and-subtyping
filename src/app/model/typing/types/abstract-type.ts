import { Graph, Node, Edge } from 'src/app/model/common/graph/_module';
import { StructuralSubtypingQueryContext } from "./common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQuery } from "./common/structural-subtyping/structural-subtyping-query";
import { StructuralSubtypingQueryResult } from "./common/structural-subtyping/structural-subtyping-query-result";
import { QueryGraphNodeData, StructuralSubtypingQueryGraph } from './common/structural-subtyping/structural-subtyping-query-graph';
//import { otherAliasReplaced } from "./structural-subtyping/decorators/replace-alias";

/*
export const DEPRECATED_queryGraphUpdated = () => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (other: AbstractType, context: StructuralSubtypingQueryContext) {

            let newNode = new Node(new StructuralSubtypingQuery(<AbstractType>this, other));
            let newGraph = new Graph<StructuralSubtypingQuery, string>([newNode]);

            if (context.accumulator.queryGraphRoot) {
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
*/

/*
export const queryLoopChecked = () => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (other: AbstractType, context: StructuralSubtypingQueryContext) {

            const newQuery = new StructuralSubtypingQuery(<AbstractType>this, other);

            if (context.queryHistory.some(q => q.equals(newQuery))) {
                // Query loop in history detected. Resolve structural subtyping query with true.

                // Add current query to history (Not relevant anymore, but for the sake of completeness)
                context.queryHistory.push(newQuery);

                console.log("Subtyping query results true due to query loop! History:");
                console.log(context.queryHistory);

                return { value: true };

            } else {
                // Add current query to history
                context.queryHistory.push(newQuery);
                return originalMethod.apply(this, [other, context]);
            }
        };
    };
};
*/

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

    protected subtypingQueryBuffer: StructuralSubtypingQuery = null;
    protected loopDetectedBuffer: boolean = false;
    protected loopPairBuffer: StructuralSubtypingQuery;

    abstract toString(): string;

    /**
     * TODO:
     * - Implement Structural equality? 
     * - Compare NAMES when comparing structs?
     * @param other 
     * @returns 
     */
    public equals(other: AbstractType): boolean {
        return this.toString() === other.toString();
    }

    public isStrutcturalSubtypeOf(other: AbstractType, typeDefs: Map<string, AbstractType>): StructuralSubtypingQueryResult {
        
        const context: StructuralSubtypingQueryContext = {
            typeDefinitions: typeDefs,
            queryHistory: new Array()
        };

        const out = this.isStrutcturalSubtypeOf_Impl(other, context);

        out.queryGraph = this.buildQueryGraph();

        return out;
    }

    /**
     * TODO: Return only boolean instead?
     * 
     * Performs a basic subtyping check by:
     * - In case other is an AliasPlaceholderType, replace it by its target
     * - Check for loops in the query history
     * - Finally, check for equallity by calling equals method
     * 
     * Override this method if needed and call it to preserve basic subtyping check.
     */
    //@queryGraphUpdated() @queryLoopChecked()
    @otherAliasReplaced()
    public isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        const newQuery = new StructuralSubtypingQuery(<AbstractType>this, other);
        // Check for query loop
        const found = context.queryHistory.find(q => q.equals(newQuery))
        if (found) {
            // Loop deteced
            this.loopDetectedBuffer = true;
            this.loopPairBuffer = found;

            // Add current query to history (Not relevant anymore, but for the sake of completeness)
            this.storeNewQuery(newQuery, context);

            return { 
                value: true
            };
        }
        // Add current query to history
        this.storeNewQuery(newQuery, context);
        return {
            value: this.equals(other)
        };
    }

    private storeNewQuery(query: StructuralSubtypingQuery, context: StructuralSubtypingQueryContext): void {
        context.queryHistory.push(query);
        this.subtypingQueryBuffer = query;
    }

    /**
     * Returns a graph holding only one node representing the current StructuralSubtypingQuery
     * Override this method for more complex query graph building
     * @param currentQuery 
     * @param context 
     */
    public buildQueryGraph(): StructuralSubtypingQueryGraph {
        if (!this.subtypingQueryBuffer) throw new Error("Must perform structural subtyping check before calling buildQueryGraph");
        
        // Build basic graph with node belonging to this
        let newNode = new Node({
            query: this.subtypingQueryBuffer,
            highlight: this.isQueryGraphNodeHighlighted()
        });

        let graph = new Graph<QueryGraphNodeData, string>([newNode]);
        graph.setRoot(newNode);

        // Add loop edge if needed
        let loopPairs = new Array();
        if(this.loopDetectedBuffer){
            const pair = {
                first: this.subtypingQueryBuffer,
                second: this.loopPairBuffer
            };
            loopPairs.push(pair);
        }

        return new StructuralSubtypingQueryGraph(graph, loopPairs);
    }

    /**
     * Override this method if more complex decision is needed.
     * @returns 
     */
    protected isQueryGraphNodeHighlighted(): boolean {
        return false;
    }
}

export class AliasPlaceholderType extends AbstractType {

    private alias: string;

    // FIFO
    private target_buffer: AbstractType[] = new Array();

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

    @otherAliasReplaced()
    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        const basicCheckResult = super.isStrutcturalSubtypeOf_Impl(other, context);
        if (basicCheckResult.value) return basicCheckResult;

        const target = context.typeDefinitions.get(this.getAlias());
        if (!target) throw new Error("No type definition exists for " + this.getAlias());

        this.target_buffer.push(target);

        return target.isStrutcturalSubtypeOf_Impl(other, context);
    }

    public override buildQueryGraph(): StructuralSubtypingQueryGraph {
        let out = super.buildQueryGraph();
        const root = out.getGraph().getRoot();

        if(this.loopDetectedBuffer) return out;
        
        const target = this.target_buffer.shift();
        if(!target) throw new Error("Must call isStrutcturalSubtypeOf_Impl before buildQueryGraph");

        const targetOut = target.buildQueryGraph();
        const newEdge = new Edge(root, targetOut.getGraph().getRoot(), "");

        out.merge(targetOut);
        out.getGraph().addEdge(newEdge);

        return out;
    }
}


