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

    private subtypingRelevantMembers_buffer: Definition[];

    constructor(name: string, members: Definition[]) {
        super();
        this.name = name;
        this.members = members;
        this.resetSubtypingBuffer();
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

    private resetSubtypingBuffer() {
        this.subtypingRelevantMembers_buffer = new Array();
    }

    @otherAliasReplaced()
    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        const basicCheckResult = super.isStrutcturalSubtypeOf_Impl(other, context);
        if (basicCheckResult.value) { return basicCheckResult; };

        // Cleanup
        this.resetSubtypingBuffer();

        if (other instanceof StructType) {
            const isSubtype = other.members.every(d2 => {
                return this.members.some(d1 => {
                    if (d1.getName() === d2.getName()) {
                        // Name match...
                        this.subtypingRelevantMembers_buffer.push(d1);
                        
                        if (d1.getType().isStrutcturalSubtypeOf_Impl(d2.getType(), context).value) {
                            // ...and type match
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
        let root = out.getGraph().getRoot();

        if(this.loopDetectedBuffer) return out;

        this.subtypingRelevantMembers_buffer.map(m => {
            return {
                out: m.getType().buildQueryGraph(),
                name: m.getName()
            };
        }).forEach(e => {
            out.merge(e.out);
            out.getGraph().addEdge(new Edge(root, e.out.getGraph().getRoot(), e.name));
        });

        return out;
    }

    protected override isQueryGraphNodeHighlighted(): boolean {
        return this.loopDetectedBuffer;
    }
}