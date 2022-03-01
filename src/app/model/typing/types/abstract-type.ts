import { Graph, Node, Edge } from 'src/app/model/common/graph/_module';
import { StructuralSubtypingQueryContext } from "./common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQuery } from "./common/structural-subtyping/structural-subtyping-query";
import { StructuralSubtypingQueryResult } from "./common/structural-subtyping/structural-subtyping-query-result";
import { QueryGraphNodeData, StructuralSubtypingQueryGraph } from './common/structural-subtyping/structural-subtyping-query-graph';
import { CdeclHalves } from './common/cdecl-halves';

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

export interface StructuralSubtypingBuffer {
    result: boolean;
    loopDetected: boolean,
    currentQuery: StructuralSubtypingQuery
}

export abstract class AbstractType {

    /**
     * Buffer for chaching all necessary data needed for buildQueryGraph method during performStructuralSubtypingCheck() call.
     */
    protected structuralSubtypingBuffer: StructuralSubtypingBuffer;

    constructor() {
        this.structuralSubtypingBuffer = {
            result: false,
            loopDetected: false,
            currentQuery: null
        };
    }

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

    /**
     * Performs a structural type check and builds a corresponding graph for visualization purpose.
     * 
     * @param other 
     * @param typeDefs 
     * @returns 
     */
    public isStrutcturalSubtypeOf(other: AbstractType, typeDefs: Map<string, AbstractType>): StructuralSubtypingQueryResult {

        const context: StructuralSubtypingQueryContext = {
            typeDefinitions: typeDefs,
            queryHistory: new Array()
        };

        const check: boolean = this.performStructuralSubtypingCheck(other, context);
        const graph: StructuralSubtypingQueryGraph = this.buildQueryGraph();


        const out: StructuralSubtypingQueryResult = {
            value: check,
            queryGraph: graph
        }

        return out;
    }

    /**
     * Override this method to add more complex structural subtyping checks.
     * 
     * @param other Type this gets compared to during isStrutcturalSubtypeOf_Impl call.
     * @returns if this is a structural subtype of other
     */
    public performStructuralSubtypingCheck(other: AbstractType, context: StructuralSubtypingQueryContext): boolean {
        const { loopDetected, newQuery } = this.performStructuralSubtypingCheck_step_manageQueryHistory(other, context.queryHistory);

        this.performStructuralSubtypingCheck_step_updateBuffer(false, loopDetected, newQuery);

        if (loopDetected) {
            this.performStructuralSubtypingCheck_step_updateBuffer(true, loopDetected, newQuery);
            return true;
        }

        if (this.performStructuralSubtypingCheck_step_checkEquality(other, context)) {
            this.performStructuralSubtypingCheck_step_updateBuffer(true, loopDetected, newQuery);
            return true;
        }

        // TODO: Handle case other instanceof AliasPlaceholderType

        const result = this.performStructuralSubtypingCheck_step_realSubtypingRelation(other, context);
        this.performStructuralSubtypingCheck_step_updateBuffer(result, loopDetected, newQuery);

        return result;
    }

    /**
     * Creates new StructuralSubtypingQuery object an adds it to the history.
     * @param other Type this gets compared to during isStrutcturalSubtypeOf_Impl call.
     * @param history current list of queries that have already been performed
     * @returns if a query loop has been detected and the new query that has been added to the history
     */
    protected performStructuralSubtypingCheck_step_manageQueryHistory(other: AbstractType, history: StructuralSubtypingQuery[]): { loopDetected: boolean, newQuery: StructuralSubtypingQuery } {
        const newQuery = new StructuralSubtypingQuery(<AbstractType>this, other);
        // Check for query loop
        const loopDetected = !!history.find(q => q.equals(newQuery))
        history.push(newQuery);

        return { loopDetected: loopDetected, newQuery: newQuery };
    }

    /**
     * Updates the structuralSubtypingBuffer so query graph can be built properly in an upcoming step.
     * @param result 
     * @param loopDetected 
     * @param currentQuery 
     */
    protected performStructuralSubtypingCheck_step_updateBuffer(result: boolean, loopDetected: boolean, currentQuery: StructuralSubtypingQuery): void {
        this.structuralSubtypingBuffer.result = result;
        this.structuralSubtypingBuffer.loopDetected = loopDetected;
        this.structuralSubtypingBuffer.currentQuery = currentQuery;
    }

    /**
     * Checks for structural equality as a subset of structural subtyping relation.
     * @param other 
     * @param context 
     */
    protected performStructuralSubtypingCheck_step_checkEquality(other: AbstractType, context: StructuralSubtypingQueryContext): boolean {
        return this.equals(other); // TODO: Check if this is ok.
    }

    /**
     * Override this method for more complex queries, i.e. by making recursive calls to child types.
     * 
     * Preconditions: all previous steps have been performed already, i.e.:
     * - query history has been extended; no loop has been detected
     * - structuralSubtypingBuffer has been updated
     * - type equality does NOT hold
     * 
     * @param other 
     * @param context 
     */
    protected abstract performStructuralSubtypingCheck_step_realSubtypingRelation(other: AbstractType, context: StructuralSubtypingQueryContext): boolean;

    /**
     * Builds a graph visualizing structural subtyping check cached in structuralSubtypingBuffer.
     * Precondition: performStructuralSubtypingCheck method has been called before
     * @returns complete graph
     */
    public buildQueryGraph(): StructuralSubtypingQueryGraph {
        let graph = this.buildQueryGraph_step_basicGraph();

        graph = this.buildQueryGraph_step_handleLoop(graph);
        graph = this.buildQueryGraph_step_extendGraph(graph);

        this.buildQueryGraph_step_resetBuffer();

        return graph;
    }

    /**
     * This implementation returns a graph holding only one node representing the current query.
     * 
     * @param loopDetected if loop has been detected by previous step
     * @param currentQuery current query 
     * @returns basic graph
     */
    protected buildQueryGraph_step_basicGraph(): StructuralSubtypingQueryGraph {
        if (!this.structuralSubtypingBuffer.currentQuery) throw new Error("Cannot build query graph with empty buffer.");

        // Build basic graph with single node representing query in this.structuralSubtypingBuffer
        let newNode = new Node({
            query: this.structuralSubtypingBuffer.currentQuery,
            highlight: this.isQueryGraphNodeHighlighted()
        });

        let graph = new Graph<QueryGraphNodeData, string>([newNode]);
        graph.setRoot(newNode);

        return new StructuralSubtypingQueryGraph(graph, []);
    }

    protected buildQueryGraph_step_handleLoop(graph: StructuralSubtypingQueryGraph): StructuralSubtypingQueryGraph {

        // Add loop edge if needed
        let loopPairs = new Array();
        if (this.structuralSubtypingBuffer.loopDetected) {
            // TODO: Implement adding edges representing query loops!
        }

        graph.setLoopPairs(loopPairs);

        return graph;
    }

    /**
     * Override this method to build more complex query graphs, i.e. by making recursive calls to child types.
     * 
     * Preconditions: all previous steps have been performed already, i.e.:
     * - param graph is representing the current query cached in structuralSubtypingBuffer
     * - NO query loop has been detected
     * 
     * @param graph in basic form, see buildQueryGraph_step_basicGraph method
     * @returns extended graph
     */
    protected abstract buildQueryGraph_step_extendGraph(graph: StructuralSubtypingQueryGraph): StructuralSubtypingQueryGraph;
    
    /**
     * Cleans up buffer. Override this method if this.structuralSubtypingBuffer has been overridden in order to extend it.
     * @param graph 
     */
    protected buildQueryGraph_step_resetBuffer(): void {
        this.structuralSubtypingBuffer.loopDetected = false;
        this.structuralSubtypingBuffer.currentQuery = null;
    }

    /**
     * Override this method if more complex decision is needed.
     * @returns 
     */
    protected isQueryGraphNodeHighlighted(): boolean {
        return false;
    }

    public cdeclToString(): string {
        const tuple = this.cdeclToStringImpl({ prev: null });
        return tuple.left + tuple.right + tuple.type;
    }

    public cdeclToStringImpl(context: { prev: string }): CdeclHalves {
        return {
            left: "",
            right: "",
            type: this.toString() // CHECK IF THIS IS OK!
        }
    }
}


/* 
 *  TODO: Solve import (circular dependency) issue and move this class in separate file! 
 */

export class AliasPlaceholderType extends AbstractType {

    // Specialization of structuralSubtypingBuffer holding an additional field for target
    protected override structuralSubtypingBuffer: StructuralSubtypingBuffer & { target: AbstractType };

    private alias: string;

    constructor(alias: string) {
        super();
        this.structuralSubtypingBuffer.target = null;

        this.alias = alias;
    }

    public getAlias(): string {
        return this.alias;
    }

    public toString(): string {
        return this.alias;
    }

    /* Structural Subtyping */

    protected override performStructuralSubtypingCheck_step_realSubtypingRelation(other: AbstractType, context: StructuralSubtypingQueryContext): boolean {
        const target = context.typeDefinitions.get(this.getAlias());
        if (!target) throw new Error("No type definition exists for " + this.getAlias());
        // Add found target to cache so it can be used when building the query graph
        this.structuralSubtypingBuffer.target = target;
        // Delegate
        return target.performStructuralSubtypingCheck(other, context);
    }

    protected override buildQueryGraph_step_extendGraph(graph: StructuralSubtypingQueryGraph): StructuralSubtypingQueryGraph {
        const target = this.structuralSubtypingBuffer.target;
        if (!target) throw new Error("Unexpected: structuralSubtypingBuffer does not contain target.");

        const targetGraph = target.buildQueryGraph(); // Recursive call
        const newEdge = new Edge(graph.getGraph().getRoot(), targetGraph.getGraph().getRoot(), "");

        graph.merge(targetGraph);
        graph.getGraph().addEdge(newEdge);

        return graph;
    }

    protected override buildQueryGraph_step_resetBuffer(): void {
        super.buildQueryGraph_step_resetBuffer();
        this.structuralSubtypingBuffer.target = null;
    }
    
}


