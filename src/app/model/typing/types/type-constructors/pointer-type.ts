import { Edge } from "src/app/model/common/graph/_module";
import { AbstractType, otherAliasReplaced } from "../abstract-type";
import { CdeclHalves } from "../common/cdecl-halves";
import { StructuralSubtypingQuery } from "../common/structural-subtyping/structural-subtyping-query";
import { StructuralSubtypingQueryContext } from "../common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryGraph } from "../common/structural-subtyping/structural-subtyping-query-graph";
import { StructuralSubtypingQueryResult } from "../common/structural-subtyping/structural-subtyping-query-result";

export class PointerType extends AbstractType {

    private baseType: AbstractType;

    constructor(baseType: AbstractType) {
        super();
        this.baseType = baseType;
    }

    @otherAliasReplaced()
    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        const basicCheckResult = super.isStrutcturalSubtypeOf_Impl(other, context);
        if (basicCheckResult.value) return basicCheckResult;
        if(other instanceof PointerType) {
            return this.baseType.isStrutcturalSubtypeOf_Impl(other.baseType, context);
        } else {
            return { value: false };
        }
    }

    public override buildQueryGraph(): StructuralSubtypingQueryGraph {
        let out = super.buildQueryGraph();
        const root = out.getGraph().getRoot();

        if(this.loopDetectedBuffer) return out;

        const targetOut = this.baseType.buildQueryGraph();
        const newEdge = new Edge(root, targetOut.getGraph().getRoot(), "");

        out.merge(targetOut);
        out.getGraph().addEdge(newEdge);

        return out;
    }

    public toString(): string {
        return this.baseType.toString() + "*";
    }

    public getBaseType(): AbstractType {
        return this.baseType;
    }


    /*

    | opt_constvol_list POINTER TO adecl
			{
			char *op = "", *cp = "", *sp = "";

			if (prev == 'a')
				unsupp("Pointer to array of unspecified dimension",
				       "pointer to object");
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
    public override cdeclToStringImpl(context: { prev: string }): CdeclHalves {

        let opt_constvol_list_out = "WTF"; // WTF

        let op: string = "";
        let cp: string = "";
        let sp: string = "";

        // TODO!
        if (context.prev=='a' || context.prev=='A' || context.prev=='f') {
            op = "(";
            cp = ")";
        }
        if (opt_constvol_list_out) {
			sp = " ";
        }

        context.prev = 'p'; // Check if this is ok

        const baseTypeOut: CdeclHalves = this.getBaseType().cdeclToStringImpl(context);

        return {
            left: baseTypeOut.left + op + "*" + sp + opt_constvol_list_out + sp,
            right: cp + baseTypeOut.right,
            type: baseTypeOut.type
        };
    }
}