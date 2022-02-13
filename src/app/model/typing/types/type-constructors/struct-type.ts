import { AbstractType, otherAliasReplaced } from "../abstract-type";
import { Definition } from "../common/definition";
import { StructuralSubtypingQuery } from "../structural-subtyping/structural-subtyping-query";
import { StructuralSubtypingQueryContext } from "../structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryResult } from "../structural-subtyping/structural-subtyping-query-result";

export class StructType extends AbstractType {

    private name: string;
    private members: Definition[];

    constructor(name: string, members: Definition[]){
        super();
        this.name = name;
        this.members = members;
    }

    @otherAliasReplaced()
    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        const basicCheckResult = super.isStrutcturalSubtypeOf_Impl(other, context);
        if (basicCheckResult.value) return basicCheckResult;

        if(other instanceof StructType) {
            context.accumulator.value = other.members.every(d2 => {
                return this.members.some(d1 => {
                    return d1.getName() === d2.getName() && d1.getType().isStrutcturalSubtypeOf_Impl(d2.getType(), context).value;
                });
            });
            // TODO: Check if this is ok!!!
            return context.accumulator;
        } else {
            context.accumulator.value = false;
            return context.accumulator;
        }
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