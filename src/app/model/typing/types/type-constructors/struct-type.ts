import { AbstractType, StructuralSubtypingBufferFrame } from "../abstract-type";
import { Definition } from "../common/definition";
import { StructuralSubtypingQueryContext } from "../common/structural-subtyping/structural-subtyping-query-context";
import { Graph, Node, Edge } from '../../../common/graph/_module';
import { StructuralSubtypingQueryGraph } from "../common/structural-subtyping/structural-subtyping-query-graph";
import { CdeclHalves } from "../common/cdecl-halves";

export class StructType extends AbstractType {

    private name: string;
    private members: Definition[];

    constructor(name: string, members: Definition[]) {
        super();
        this.name = name;
        this.members = members;
    }

    // DEPRECATED
    // public toString(): string {
    //     return "struct { " + this.members.map(m => m.toString() + "; ").join("") + "}";
    // }

    public override toCdeclCImpl(): CdeclHalves {
        return {
            left: "",
            right: "",
            // TODO: CHECK IF IT IS OK HOW MEMBER NAME IS INCLUDED!
            type: "struct { " + this.members.map(m => m.getType().toCdeclC(m.getName()) + "; ").join("") + "}"
        }
    }

    public toCdeclEnglish(): string {
        return "struct"; // TODO
    }

    public getName(): string {
        return this.name;
    }

    public getMembers(): Definition[] {
        return this.members;
    }

    /* Structural Subtyping */

    protected override performStructuralSubtypingCheck_step_checkRealSubtypingRelation(other: AbstractType, context: StructuralSubtypingQueryContext): boolean {
        const buffer = this.performStructuralSubtypingCheck_getBufferFrameForWriting();
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
            buffer.ruleNotApplicable = true;
            return false;
        }
    }
    protected buildQueryGraph_step_extendGraph(graph: StructuralSubtypingQueryGraph, bufferFrame: StructuralSubtypingBufferFrame): StructuralSubtypingQueryGraph {

        if (!bufferFrame.appendix.relevantMembers) throw new Error("Unexpected: Relevant memebers not found in cache.");

        const subgraphsWithNames: { subgraph: string, name: string }[] = bufferFrame.appendix.relevantMembers.map((m: Definition) => {
            return {
                subgraph: m.getType().buildQueryGraph(),
                name: m.getName()
            };
        });

        if (subgraphsWithNames.some(x => !x.subgraph)) return graph; // Cancel if any member type did not return a valid graph

            subgraphsWithNames.forEach((e: any) => {
                graph.merge(e.subgraph);
                graph.getGraph().addEdge(new Edge(graph.getGraph().getRoot(), e.subgraph.getGraph().getRoot(), e.name));
            });

        return graph;
    }

    /* --- */


}






