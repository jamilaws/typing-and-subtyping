import { AbstractType, otherAliasReplaced } from "../abstract-type";
import { Definition } from "../common/definition";
import { StructuralSubtypingQuery } from "../structural-subtyping/structural-subtyping-query";
import { StructuralSubtypingQueryContext } from "../structural-subtyping/structural-subtyping-query-context";
import { StructuralSubtypingQueryResult } from "../structural-subtyping/structural-subtyping-query-result";

function zip<X, Y>(xs: X[], ys: Y[]): [X, Y][] {
    if (xs.length !== ys.length) throw new Error("Cannot zip arrays of unequal length");
    return xs.map((x, i) => [x, ys[i]]);
}

export class FunctionType extends AbstractType {

    private parameterTypes: AbstractType[];
    private returnType: AbstractType;

    constructor(parameterTypes: AbstractType[], returnType: AbstractType){
        super();
        this.parameterTypes = parameterTypes;
        this.returnType = returnType;
    }

    @otherAliasReplaced()
    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: StructuralSubtypingQueryContext): StructuralSubtypingQueryResult {
        const basicCheckResult = super.isStrutcturalSubtypeOf_Impl(other, context);
        if (basicCheckResult.value) return basicCheckResult;
        if(other instanceof FunctionType) {
            if(this.parameterTypes.length !== other.parameterTypes.length) {
                context.accumulator.value = false;
                return context.accumulator;
            }
            const returnTypesCheck = this.returnType.isStrutcturalSubtypeOf_Impl(other.returnType, context);
            // co-/contra-variance
            const parameterTypesCheck = zip(this.parameterTypes, other.parameterTypes).every(tup2 => tup2[1].isStrutcturalSubtypeOf_Impl(tup2[0], context));
            
            // TODO Check if this is ok !!!
            context.accumulator.value = returnTypesCheck && parameterTypesCheck;
            return context.accumulator;
        } else {
            context.accumulator.value = false;
            return context.accumulator;
        }
    }

    public toString(): string {        
        return `${this.returnType.toString()}(${this.parameterTypes.map(p => p.toString()).join(", ")})`;
    }

    public getParameters(): AbstractType[] {
        return this.parameterTypes;
    }

    public getReturnType(): AbstractType {
        return this.returnType;
    }
}