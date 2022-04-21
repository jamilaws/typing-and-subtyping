import { Edge } from "src/app/model/common/graph/_module";
import { AbstractType, StructuralSubtypingBufferFrame } from "../abstract-type";
import { CdeclHalves } from "../common/cdecl-halves";
import { StructuralSubtypingQuery } from "../common/structural-subtyping/structural-subtyping-query";
import { StructuralSubtypingQueryContext } from "../common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryGraph } from "../common/structural-subtyping/structural-subtyping-query-graph";
import { StructuralSubtypingQueryResult } from "../common/structural-subtyping/structural-subtyping-query-result";
import { ArrayType } from "./array-type";
import { FunctionType } from "./function-type";

export class PointerType extends AbstractType {

    private baseType: AbstractType;

    constructor(baseType: AbstractType) {
        super();
        this.baseType = baseType;
    }

    /* Structural Subtyping */

    protected override performStructuralSubtypingCheck_step_checkRealSubtypingRelation(other: AbstractType, context: StructuralSubtypingQueryContext): boolean {
        if(other instanceof PointerType) {
            return this.baseType.performStructuralSubtypingCheck(other.baseType, context);
        } else {
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

    // DEPRECATED
    // public toString(): string {
    //     return this.baseType.toString() + "*";
    // }

    public toCdeclEnglish(): string {
        return "pointer to " + this.baseType.toCdeclEnglish();
    }

    public getBaseType(): AbstractType {
        return this.baseType;
    }


    /*

    | opt_constvol_list POINTER TO adecl
            {
            char *op = "", *cp = "", *sp = "";

            if (prev=='a' || prev=='A' || prev=='f') {
                op = "(";
                cp = ")";
            }
            if (strlen($1) != 0)
                sp = " ";
            $$.left = cat($4.left,ds(op),ds("*"),
                       ds(sp),$1,ds(sp),NullCP);
            $$.right = cat(ds(cp),$4.right,NullCP);
            $$.type = $4.type;
            prev = 'p';
            }

    */
    public override toCdeclCImpl(): CdeclHalves {

        let opt_constvol_list_out = ""; // Note: Just listed for the sake of completeness. Not relevant for this project.

        let op: string = "";
        let cp: string = "";
        let sp: string = "";

        //if (context.prev === 'a' || context.prev === 'A' || context.prev === 'f') {
        if (this.baseType instanceof FunctionType || this.baseType instanceof ArrayType) {
            op = "(";
            cp = ")";
        }
        if (opt_constvol_list_out.length > 0) {
            sp = " ";
        }

        const baseTypeOut: CdeclHalves = this.getBaseType().toCdeclCImpl();

        return {
            left: baseTypeOut.left + op + "*" + sp + opt_constvol_list_out + sp,
            right: cp + baseTypeOut.right,
            type: baseTypeOut.type
        };
    }
}