import { AbstractType } from "../../abstract-type";
import { StructuralEquivalenceQuery } from "../structural-equivalence-query";

export const queryLoopChecked = () => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        // anonymous function, not arrow!
        descriptor.value = function (a: AbstractType, b: AbstractType, queryHistory: StructuralEquivalenceQuery[]) {

            const newQuery = new StructuralEquivalenceQuery(a, b);

            let loopFound = queryHistory.some(q => q.equals(newQuery));
            if(loopFound) {
                return true;
            } else {
                queryHistory.push(newQuery);
                return originalMethod.apply(a, b, queryHistory);
            }
        };
    };
};