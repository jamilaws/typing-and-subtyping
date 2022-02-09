import { AbstractType, SubtypingContext } from "../abstract-type";
import { Definition } from "../common/definition";
import { StructuralEquivalenceQuery } from "../structural-subtyping/structural-equivalence-query";

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

    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: SubtypingContext): boolean {
        if (super.isStrutcturalSubtypeOf_Impl(other, context)) return true;
        if(other instanceof FunctionType) {
            if(this.parameterTypes.length !== other.parameterTypes.length) return false;
            const returnTypesCheck = this.returnType.isStrutcturalSubtypeOf_Impl(other.returnType, context);
            // co-/contra-variance
            const parameterTypesCheck = zip(this.parameterTypes, other.parameterTypes).every(tup2 => tup2[1].isStrutcturalSubtypeOf_Impl(tup2[0], context));
            return returnTypesCheck && parameterTypesCheck;
        } else {
            return false;
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