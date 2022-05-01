import { AbstractType, StructuralSubtypingBufferFrame } from "../abstract-type";
import { StructuralSubtypingQueryContext } from "../common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryGraph } from "../common/structural-subtyping/structural-subtyping-query-graph";
import { StructuralSubtypingQueryResult } from "../common/structural-subtyping/structural-subtyping-query-result";
import { Graph, Node, Edge } from '../../../common/graph/_module';
import { CdeclHalves } from "../common/cdecl-halves";


export class ArrayType extends AbstractType {

    private baseType: AbstractType;
    private dimension: number;

    constructor(baseType: AbstractType, dimension: number = null) {
        super();
        this.baseType = baseType;
        this.dimension = dimension;
    }

    // DEPRECATED
    // public toString(): string {
    //     return this.baseType.toString() + "[ ]";
    // }

    public getBaseType(): AbstractType {
        return this.baseType;
    }

    /* Structural Subtyping */

    protected performStructuralSubtypingCheck_step_checkRealSubtypingRelation(other: AbstractType, context: StructuralSubtypingQueryContext): boolean {
        const buffer = this.performStructuralSubtypingCheck_getBufferFrameForWriting();

        if (other instanceof ArrayType) {
            return this.baseType.performStructuralSubtypingCheck(other.baseType, context);
        } else {
            buffer.ruleNotApplicable = true;

            return false;
        }
    }

    protected override buildQueryGraph_step_extendGraph(graph: StructuralSubtypingQueryGraph, bufferFrame: StructuralSubtypingBufferFrame): StructuralSubtypingQueryGraph {
        const targetOut = this.baseType.buildQueryGraph();
        if(!targetOut) return graph; 

        const newEdge = new Edge(graph.getGraph().getRoot(), targetOut.getGraph().getRoot(), "");

        graph.merge(targetOut);
        graph.getGraph().addEdge(newEdge);

        return graph;
    }

    /* --- */

    /*

    | ARRAY adims OF adecl
            {
            if (arbdims)
                prev = 'a';
            else
                prev = 'A';
            $$.left = $4.left;
            $$.right = cat($2,$4.right,NullCP);
            $$.type = $4.type;
            }
    adims		: //empty
            {
                arbdims = 1;
                $$ = ds("[]");
                }
    
            | NUMBER
                {
                arbdims = 0;
                $$ = cat(ds("["),$1,ds("]"),NullCP);
                }
            ;
    */
    public override toCdeclCImpl(): CdeclHalves {

        const baseCdecl = this.getBaseType().toCdeclCImpl();

        let arrayString;
        if (this.dimension){
            arrayString = "[" + this.dimension + "]";
        } else {
            arrayString = "[]";
        }

        return {
            left: baseCdecl.left,
            right: arrayString + baseCdecl.right,
            type: baseCdecl.type
        };
    }

    public toCdeclEnglish(): string {
        const dimTxt = this.dimension === null ? "" : this.dimension + " ";
        return "array " + dimTxt + "of " + this.baseType.toCdeclEnglish();
    }
}