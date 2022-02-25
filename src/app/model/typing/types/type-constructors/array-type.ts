import { AbstractType, otherAliasReplaced } from "../abstract-type";
import { StructuralSubtypingQueryContext } from "../common/structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryGraph } from "../common/structural-subtyping/structural-subtyping-query-graph";
import { StructuralSubtypingQueryResult } from "../common/structural-subtyping/structural-subtyping-query-result";
import { Graph, Node, Edge } from '../../../common/graph/_module';
import { CdeclHalves } from "../common/cdecl-halves";


export class ArrayType extends AbstractType {

    private baseType: AbstractType;

    constructor(baseType: AbstractType){
        super();
        this.baseType = baseType;
    }

    public toString(): string {
        return this.baseType.toString() + "[ ]";
    }

    public getBaseType(): AbstractType {
        return this.baseType;
    }

    @otherAliasReplaced()
    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        const basicCheckResult = super.isStrutcturalSubtypeOf_Impl(other, context);
        if (basicCheckResult.value) return basicCheckResult;
        if(other instanceof ArrayType) {
            return this.baseType.isStrutcturalSubtypeOf_Impl(other.baseType, context);
        } else {
            return { value: false };
        }
    }

    public override buildQueryGraph(): StructuralSubtypingQueryGraph {
        let out = super.buildQueryGraph();
        const root = out.getGraph().getRoot();

        if(this.loopDetectedBuffer) return out;

        const targetOu = this.baseType.buildQueryGraph();
        const newEdge = new Edge(root, targetOu.getGraph().getRoot(), "");

        out.merge(targetOu);
        out.getGraph().addEdge(newEdge);

        return out;
    }

    /*

    | ARRAY adims OF adecl
			{
			if (prev == 'f')
				unsupp("Array of function",
				       "array of pointer to function");
			else if (prev == 'a')
				unsupp("Inner array of unspecified size",
				       "array of pointer");
			else if (prev == 'v')
				unsupp("Array of void",
				       "pointer to void");
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
   public override cdeclToStringImpl(context: { prev: string }): CdeclHalves {
       // Note: Ignore array dimension

       context.prev = 'A';

       return {
           left: this.getBaseType().cdeclToStringImpl(context).left,
           right: "[ ]" + this.getBaseType().cdeclToStringImpl(context).right,
           type: this.getBaseType().cdeclToStringImpl(context).type
       };
   }
}