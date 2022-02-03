import { AbstractType } from "../../typing/types/abstract-type";
import { AstNode } from "../ast-node";

export const storeError = () => {
    return (target: AstNode, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        
        // anonymous function, not arrow!
        descriptor.value = function (...args: any[]) {

            let object: AstNode = <AstNode> this;
            
            let result: AbstractType = null;
            try {
                result = originalMethod.apply(this, args);
            } catch(e){
                // set error by placeholder error instead of leaving null ?
                // TODO: Check for TypeError
                if(e instanceof TypeError) {
                    object.setTypeError(e);
                } else if(e instanceof Error){
                    object.setTypeError(e);
                    console.log(e);
                    throw e
                } else {
                    alert("UNEXPECTED");
                    throw e;
                }
            }
            // Note: null if error occured (or no type is applicable)
            return result;
        };
    };
};