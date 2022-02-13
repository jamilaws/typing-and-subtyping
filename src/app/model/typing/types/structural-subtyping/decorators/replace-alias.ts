// import { AbstractType } from "../../abstract-type";
// import { AliasPlaceholderType } from "../../placeholder-types/alias-placeholder-type";
// import { StructuralSubtypingQuery } from "../structural-equivalence-query";

// export const otherAliasReplaced = () => {
//     return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
//         const originalMethod = descriptor.value;
//         descriptor.value = function (other: AbstractType, queryHistory: StructuralSubtypingQuery[]) {
//             if(other instanceof AliasPlaceholderType){
//                 return originalMethod.apply(this, other.getTarget(), queryHistory);
//             } else {
//                 return originalMethod.apply(this, other, queryHistory);
//             }
//         };
//         return descriptor;
//     };
// };


