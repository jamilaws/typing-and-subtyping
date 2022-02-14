import { AbstractType, otherAliasReplaced } from "../abstract-type";
import { Definition } from "../common/definition";
import { StructuralSubtypingQuery } from "../common/structural-subtyping/structural-subtyping-query";
import { StructuralSubtypingQueryContext } from "../common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryResult } from "../common/structural-subtyping/structural-subtyping-query-result";
import { Graph, Node, Edge } from '../../../common/graph/_module';
import { StructuralSubtypingQueryGraph } from "../common/structural-subtyping/structural-subtyping-query-graph";

export class StructType extends AbstractType {

    private name: string;
    private members: Definition[];

    private relevantMembers_SubtypingBuffer: Definition[];

    constructor(name: string, members: Definition[]) {
        super();
        this.name = name;
        this.members = members;
        this.resetSubtypingBuffer();
    }

    private resetSubtypingBuffer() {
        this.relevantMembers_SubtypingBuffer = new Array();
    }

    @otherAliasReplaced()
    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        const basicCheckResult = super.isStrutcturalSubtypeOf_Impl(other, context);
        if (basicCheckResult.value) { return basicCheckResult; };

        if (other instanceof StructType) {
            const isSubtype = other.members.every(d2 => {
                return this.members.some(d1 => {
                    if (d1.getName() === d2.getName()) {
                        // Name match...
                        if (d1.getType().isStrutcturalSubtypeOf_Impl(d2.getType(), context).value) {
                            // ...and type match
                            this.relevantMembers_SubtypingBuffer.push(d1);
                            return true;
                        }
                        return false;
                    } else {
                        return false;
                    }
                });
            });
            // TODO: Check if this is ok!!!
            return { value: isSubtype };
        } else {
            return {
                value: false
            };
        }
    }

    /**
     * Forks graph into branches for each member.
     * @param currentQuery 
     * @param context 
     */
    public override buildQueryGraph(): StructuralSubtypingQueryGraph {
        let out = super.buildQueryGraph();
        let root = out.getRoot();

        console.log("relevantMembers_SubtypingBuffer");
        console.log(this.relevantMembers_SubtypingBuffer);
        
        this.relevantMembers_SubtypingBuffer.map(m => {
            return {
                subgraph: m.getType().buildQueryGraph(),
                name: m.getName()
            };
        }).forEach(e => {
            if (!e.subgraph) alert("No subgraph for " + e.name + "?!");
            out = out.merge(e.subgraph);
            out.addEdge(new Edge(root, e.subgraph.getRoot(), e.name));
        });

        // Cleanup
        this.resetSubtypingBuffer();

        return out;
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
}