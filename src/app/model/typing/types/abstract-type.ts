import { Graph, Node, Edge } from 'src/app/model/common/graph/_module';
import { StructuralSubtypingQueryContext } from "./common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQuery } from "./common/structural-subtyping/structural-subtyping-query";
import { StructuralSubtypingQueryResult } from "./common/structural-subtyping/structural-subtyping-query-result";
import { QueryGraphNodeData, StructuralSubtypingQueryGraph } from './common/structural-subtyping/structural-subtyping-query-graph';
import { CdeclHalves } from './common/cdecl-halves';


export class InvalidAliasException extends Error {
    public alias: string;
    constructor(alias: string) {
        super("No type definition exists for alias " + alias);
        this.alias = alias;
    }
}

export interface StructuralSubtypingBufferFrame {
    result: boolean;
    ruleNotApplicable: boolean;

    loopDetected: boolean;
    equalityDetected: boolean;

    currentQuery: StructuralSubtypingQuery;
    duplicateQuery: StructuralSubtypingQuery;

    didReplaceOtherAlias: boolean;

    appendix: any;
}

export class Queue<T> {
    private array: T[] = new Array<T>();

    public enqueue(e: T): void {
        this.array.push(e);
    }

    public dequeue(): T {
        if (this.array.length === 0) return null;
        return this.array.shift();
    }

    public getFirst(): T {
        if (this.array.length === 0) return null;
        return this.array[0];
    }

    public getLast(): T {
        if (this.array.length === 0) return null;
        return this.array[this.array.length - 1];
    }

    public toArray(): T[] {
        return this.array;
    }
}

/**
 * T is an optional type parameter for the appendix field with a StructuralSubtypingBufferFrame object
 */
export abstract class AbstractType {

    public static PURE_TYPE_IDENTIFIER_PLACEHOLDER: string = "_";

    /**
     * Buffer for chaching all necessary data needed for buildQueryGraph method during performStructuralSubtypingCheck() call.
     */
    private structuralSubtypingBuffer: Queue<StructuralSubtypingBufferFrame>;

    /**
     * Do not instanciate AbstractType with new keyword! Use TypeFactoryService instead!
     */
    constructor() {
        this.structuralSubtypingBuffer = new Queue();
    }

    public toString(): string {
        return this.toCdeclC();
    }

    public toStringSplit(): { prefix: string, suffix: string } {
        const split = this.toCdeclC().split(AbstractType.PURE_TYPE_IDENTIFIER_PLACEHOLDER);
        if (split.length !== 2) throw new Error("Unexpected: split cdecl by '" + AbstractType.PURE_TYPE_IDENTIFIER_PLACEHOLDER + "' into array with length unequal 2");
        return {
            prefix: split[0],
            suffix: split[1],
        };
    }


    /**
     * TODO:
     * - Implement Structural equality? 
     * - Compare NAMES when comparing structs?
     * @param other 
     * @returns 
     */
    public equals(other: AbstractType): boolean {

        // equality checks with wildcards always yield true
        if (this instanceof WildcardPlaceholderType || other instanceof WildcardPlaceholderType) return true;

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
        // logic of subtyping
        const context: StructuralSubtypingQueryContext = {
            typeDefinitions: typeDefs,
            queryHistory: new Array()
        };

        try {

            const check: boolean = this.performStructuralSubtypingCheck(other, context);
            var graph: StructuralSubtypingQueryGraph = this.buildQueryGraph();
            graph = this.buildQueryGraph_step_addEdgesForHistoryDuplicates(graph, context.queryHistory);

            return new StructuralSubtypingQueryResult(check, graph);

        } catch (e) {
            if (e instanceof InvalidAliasException) {
                alert("Please add a type definition for alias " + e.alias);
            } 
            throw e;
        }

    }

    /**
     * Override this method to add more complex structural subtyping checks.
     * 
     * @param other Type this gets compared to during isStrutcturalSubtypeOf_Impl call.
     * @returns if this is a structural subtype of other
     */
    public performStructuralSubtypingCheck(other: AbstractType, context: StructuralSubtypingQueryContext): boolean {

        this.performStructuralSubtypingCheck_step_openNewBufferFrame();
        const bufferFrame = this.performStructuralSubtypingCheck_getBufferFrameForWriting();

        const { loopDetected, newQuery } = this.performStructuralSubtypingCheck_step_manageQueryHistory(other, context.queryHistory, bufferFrame);

        bufferFrame.currentQuery = newQuery;

        if (loopDetected) {
            bufferFrame.loopDetected = true;
            bufferFrame.result = true;
            return true;
        }

        if (this.performStructuralSubtypingCheck_step_checkEquality(other, context)) {
            bufferFrame.equalityDetected = true;
            bufferFrame.result = true;
            return true;
        }

        if (other instanceof AliasPlaceholderType) {
            return this.performStructuralSubtypingCheck_step_delegateToAliasTarget(other, context);
        }

        const result = this.performStructuralSubtypingCheck_step_checkRealSubtypingRelation(other, context);

        bufferFrame.result = result;

        return result;
    }

    protected performStructuralSubtypingCheck_step_delegateToAliasTarget(other: AliasPlaceholderType, context: StructuralSubtypingQueryContext): boolean {
        const alias: string = other.getAlias();
        const target: AbstractType = context.typeDefinitions.get(alias);

        if (!target) {
            throw new InvalidAliasException(alias);
        }

        const bufferFrame = this.performStructuralSubtypingCheck_getBufferFrameForWriting();
        bufferFrame.didReplaceOtherAlias = true;

        // Repeat call with other replaced by its target
        return this.performStructuralSubtypingCheck(target, context);
    }

    /**
     * Creates new buffer frame for a performStructuralSubtypingCheck call and pushes it to the buffer queue.
     * Each opened frame should be closed when consumed.
     * @param graph 
     */
    protected performStructuralSubtypingCheck_step_openNewBufferFrame(): void {
        const frame: StructuralSubtypingBufferFrame = {
            result: false,
            ruleNotApplicable: false,
            loopDetected: false,
            equalityDetected: false,
            currentQuery: null,
            didReplaceOtherAlias: false,
            duplicateQuery: null,
            appendix: {}
        };
        this.structuralSubtypingBuffer.enqueue(frame);
    }

    /**
     * Creates new StructuralSubtypingQuery object an adds it to the history.
     * @param other Type this gets compared to during isStrutcturalSubtypeOf_Impl call.
     * @param history current list of queries that have already been performed
     * @returns if a query loop has been detected and the new query that has been added to the history
     */
    protected performStructuralSubtypingCheck_step_manageQueryHistory(other: AbstractType, history: StructuralSubtypingQuery[], bufferFrame: StructuralSubtypingBufferFrame): { loopDetected: boolean, newQuery: StructuralSubtypingQuery } {


        const newQuery = new StructuralSubtypingQuery(this, other);
        // Check for query loop
        const duplicate = history.find(q => q.equals(newQuery));
        // Update history
        history.push(newQuery);

        // If existing, cache duplicate
        bufferFrame.duplicateQuery = duplicate;

        return { loopDetected: !!duplicate, newQuery: newQuery };
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
    protected abstract performStructuralSubtypingCheck_step_checkRealSubtypingRelation(other: AbstractType, context: StructuralSubtypingQueryContext): boolean;

    protected performStructuralSubtypingCheck_getBufferFrameForWriting(): StructuralSubtypingBufferFrame {
        return this.structuralSubtypingBuffer.getLast();
    }

    /**
     * Builds a graph visualizing structural subtyping check cached in structuralSubtypingBuffer.
     * Precondition: performStructuralSubtypingCheck method has been called before
     * @returns complete graph
     */
    public buildQueryGraph(): StructuralSubtypingQueryGraph {
        const bufferFrame = this.buildQueryGraph_step_dequeueBufferFrame();

        if (!bufferFrame) return null;

        let graph = this.buildQueryGraph_step_buildBasicGraph(bufferFrame);
        const root = graph.getGraph().getRoot();

        //graph = this.buildQueryGraph_step_handleLoop(graph, bufferFrame);

        if (bufferFrame.didReplaceOtherAlias) {
            graph = this.buildQueryGraph_step_handleCaseOtherBeingAlias(graph);
        } else {
            if (!bufferFrame.loopDetected && !bufferFrame.equalityDetected) {
                graph = this.buildQueryGraph_step_extendGraph(graph, bufferFrame);
            }
        }

        return graph;
    }

    /**
     * This implementation returns a graph holding only one node representing the current query.
     * 
     * @param loopDetected if loop has been detected by previous step
     * @param currentQuery current query 
     * @returns basic graph
     */
    protected buildQueryGraph_step_buildBasicGraph(bufferFrame: StructuralSubtypingBufferFrame): StructuralSubtypingQueryGraph {
        if (!bufferFrame.currentQuery) throw new Error("Cannot build query graph with empty buffer.");

        // Build basic graph with single node representing query in this.structuralSubtypingBuffer
        let newNode = new Node({
            query: bufferFrame.currentQuery,
            highlight: this.isQueryGraphNodeHighlighted(bufferFrame)
        });

        let graph = new Graph<QueryGraphNodeData, string>([newNode]);
        graph.setRoot(newNode);

        return new StructuralSubtypingQueryGraph(graph, []);
    }

    protected buildQueryGraph_step_handleCaseOtherBeingAlias(graph: StructuralSubtypingQueryGraph): StructuralSubtypingQueryGraph {

        // Simply continue (deque buffer ...)
        const subgraph = this.buildQueryGraph();

        const newEdge = new Edge(graph.getGraph().getRoot(), subgraph.getGraph().getRoot(), "alias");

        graph.merge(subgraph);
        graph.getGraph().addEdge(newEdge);

        return graph;
    }

    /**
     * Override this method to build more complex query graphs, i.e. by making recursive calls to child types.
     * 
     * Preconditions: all previous steps have been performed already, i.e.:
     * - param graph holds a single node representing the current query cached in structuralSubtypingBuffer
     * - NO query loop has been detected
     * - NO type equality has been detected
     * 
     * @param graph in basic form, see buildQueryGraph_step_buildBasicGraph method
     * @returns extended graph
     */
    protected abstract buildQueryGraph_step_extendGraph(graph: StructuralSubtypingQueryGraph, bufferFrame: StructuralSubtypingBufferFrame): StructuralSubtypingQueryGraph;

    protected buildQueryGraph_step_dequeueBufferFrame(): StructuralSubtypingBufferFrame {
        return this.structuralSubtypingBuffer.dequeue();
    }

    private buildQueryGraph_step_addEdgesForHistoryDuplicates(graph: StructuralSubtypingQueryGraph, queryHistory: StructuralSubtypingQuery[]): StructuralSubtypingQueryGraph {
        const edges: Edge<QueryGraphNodeData, string>[] = new Array();

        const nodes = graph.getGraph().getNodes();
        nodes.forEach(node => {
            const query = node.getData().query;
            const laterDuplicate = nodes.find(target => target.getData().query.equals(query) && node.getId() < target.getId());

            if (laterDuplicate) {
                // Duplicate found --> add edge
                const e = new Edge(laterDuplicate, node, "duplicate");
                edges.push(e);
            }
        });

        graph.setLoopPairs(edges);

        return graph;
    }


    /**
     * Override this method if more complex decision is needed.
     * @returns 
     */
    protected isQueryGraphNodeHighlighted(bufferFrame: StructuralSubtypingBufferFrame): boolean {
        return bufferFrame.ruleNotApplicable; // E.g. compare pointer to struct
    }

    /* --- Cdecl --- */

    public abstract toCdeclEnglish(): string;

    /* 
    | NAME AS adecl
            {
            $$ = cat($3.type, ds(" "), $3.left, $1, $3.right, NullCP);
            }
    */

    public toCdeclC(identifier: string = AbstractType.PURE_TYPE_IDENTIFIER_PLACEHOLDER): string {
        const tuple = this.toCdeclCImpl();
        return tuple.type + " " + tuple.left + identifier + tuple.right;
    }

    public abstract toCdeclCImpl(): CdeclHalves;

    /* ------------- */

}


/* 
 *  TODO: Solve import (circular dependency) issue and move this class in separate file! 
 */

export class AliasPlaceholderType extends AbstractType {

    private alias: string;

    constructor(alias: string) {
        super();

        this.alias = alias;
    }

    public getAlias(): string {
        return this.alias;
    }

    // DEPRECATED
    //public toString(): string {
    //    return this.alias;
    //}

    public override toCdeclCImpl(): CdeclHalves {
        return {
            left: "",
            right: "",
            type: this.alias
        }
    }

    public toCdeclEnglish(): string {
        return this.alias;
    }

    /* Structural Subtyping */

    protected override performStructuralSubtypingCheck_step_checkRealSubtypingRelation(other: AbstractType, context: StructuralSubtypingQueryContext): boolean {
        const target = context.typeDefinitions.get(this.getAlias());
        if (!target) {
            throw new InvalidAliasException(this.alias);
        }
        // Add found target to cache so it can be used when building the query graph
        this.performStructuralSubtypingCheck_getBufferFrameForWriting().appendix.target = target;
        // Delegate
        return target.performStructuralSubtypingCheck(other, context);
    }

    protected override buildQueryGraph_step_extendGraph(graph: StructuralSubtypingQueryGraph, bufferFrame: StructuralSubtypingBufferFrame): StructuralSubtypingQueryGraph {
        const target = bufferFrame.appendix.target;
        if (!target) throw new Error("Unexpected: structuralSubtypingBuffer does not contain target.");

        const targetGraph = target.buildQueryGraph(); // Recursive call
        const newEdge = new Edge(graph.getGraph().getRoot(), targetGraph.getGraph().getRoot(), "alias");

        graph.merge(targetGraph);
        graph.getGraph().addEdge(newEdge);

        return graph;
    }

}

export abstract class AbstractPlaceholderType extends AbstractType {

    protected abstract token: string;

    public toCdeclCImpl(): CdeclHalves {
        return {
            left: "",
            right: "",
            type: this.token
        };
    }

    protected performStructuralSubtypingCheck_step_checkRealSubtypingRelation(other: AbstractType, context: StructuralSubtypingQueryContext): boolean {
        throw new Error("Unexpected method call on placeholder type.");
    }

    protected buildQueryGraph_step_extendGraph(graph: StructuralSubtypingQueryGraph, bufferFrame: StructuralSubtypingBufferFrame): StructuralSubtypingQueryGraph {
        throw new Error("Unexpected method call on placeholder type.");
    }

    public toCdeclEnglish(): string {
        return this.token;
    }
}

export class WildcardPlaceholderType extends AbstractPlaceholderType {
    protected token: string = "?";
}