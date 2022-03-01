import { AbstractType } from "../abstract-type";
import { Definition } from "../common/definition";
import { StructuralSubtypingQueryContext } from "../common/structural-subtyping/structural-subtyping-query-context";
import { Graph, Node, Edge } from '../../../common/graph/_module';
import { StructuralSubtypingQueryGraph } from "../common/structural-subtyping/structural-subtyping-query-graph";

export class StructType extends AbstractType {

    private name: string;
    private members: Definition[];
    
    constructor(name: string, members: Definition[]) {
        super();
        this.name = name;
        this.members = members;
    }

    public toString(): string {
        return "struct { " + this.members.map(m => m.toString() + "; ").join("") + "}";
    }

    public getName(): string {
        return this.name;
    }

    public getMembers(): Definition[] {
        return this.members;
    }

    /* Structural Subtyping */

    protected performStructuralSubtypingCheck_step_realSubtypingRelation(other: AbstractType, context: StructuralSubtypingQueryContext): boolean {
        const buffer = this.getCurrentStructuralSubtypingBufferFrame();
        buffer.appendix.relevantMembers = new Array<Definition>();

        if (other instanceof StructType) {
            return other.members.every(d2 => {
                return this.members.some(d1 => {
                    if (d1.getName() === d2.getName()) {
                        // Name match...
                        buffer.appendix.relevantMembers.push(d1);
                        
                        if (d1.getType().performStructuralSubtypingCheck(d2.getType(), context)) {
                            // ...and type match
                            return true;
                        }
                        return false;
                    } else {
                        return false;
                    }
                });
            });
        } else {
            return false;
        }
    }
    protected buildQueryGraph_step_extendGraph(graph: StructuralSubtypingQueryGraph): StructuralSubtypingQueryGraph {
        const buffer = this.getCurrentStructuralSubtypingBufferFrame();

        buffer.appendix.relevantMembers.map((m: Definition) => {
            return {
                subgraph: m.getType().buildQueryGraph(),
                name: m.getName()
            };
        }).forEach((e: any) => {
            graph.merge(e.subgraph);
            graph.getGraph().addEdge(new Edge(graph.getGraph().getRoot(), e.subgraph.getGraph().getRoot(), e.name));
        });

        return graph;
    }

    /* --- */

}