import { Edge, Graph } from "src/app/model/common/graph/_module";
import { StructuralSubtypingQuery } from "./structural-subtyping-query";


export interface QueryGraphNodeData {
    query: StructuralSubtypingQuery;
    highlight: boolean;
};

export interface LoopPair{
    first: StructuralSubtypingQuery;
    second: StructuralSubtypingQuery;
}

export class StructuralSubtypingQueryGraph {
    private graph: Graph<QueryGraphNodeData, string>;
    private loopPairs: LoopPair[];

    constructor(graph: Graph<QueryGraphNodeData, string>, loopPairs: LoopPair[] = []){
        this.graph = graph;
        this.loopPairs = loopPairs;
    }

    public merge(other: StructuralSubtypingQueryGraph): void {
        this.graph = this.graph.merge(other.graph);
        this.loopPairs = this.loopPairs.concat(other.loopPairs);
    }

    /**
     * getGraph
     */
    public getGraph(): Graph<QueryGraphNodeData, string>{
        return this.graph;
    }

    /**
     * getLoopPairs
     */
    public getLoopPairs() {
        return this.loopPairs;
    }
}