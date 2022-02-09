import { AbstractType, SubtypingContext } from "../abstract-type";
import { Definition } from "../common/definition";
import { StructuralEquivalenceQuery } from "../structural-subtyping/structural-equivalence-query";

export class StructType extends AbstractType {

    private name: string;
    private members: Definition[];

    constructor(name: string, members: Definition[]){
        super();
        this.name = name;
        this.members = members;
    }

    public override isStrutcturalSubtypeOf_Impl(other: AbstractType, context: SubtypingContext): boolean {
        if (super.isStrutcturalSubtypeOf_Impl(other, context)) return true;
        if(other instanceof StructType) {
            return other.members.every(d2 => {
                return this.members.some(d1 => {
                    return d1.getName() === d2.getName() && d1.getType().isStrutcturalSubtypeOf_Impl(d2.getType(), context);
                });
            });
        } else {
            return false;
        }
    }

    public toString(): string {
        return "struct { " + this.members.map(m => m.toString()).join(", ") + " }";
    }

    public getName(): string {
        return this.name;
    }

    public getMembers(): Definition[] {
        return this.members;
    }
}