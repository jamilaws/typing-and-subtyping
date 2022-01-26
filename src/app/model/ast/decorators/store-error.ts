import { AbstractType } from "../../typing/types/abstract-type";
import { AstNode } from "../abstract-syntax-tree";

//export const storeError = (argPassed: any) => {
export const storeError = () => {
    return (target: AstNode, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        // console.log("target:");
        // console.log(target);
        // console.log("propertyKey:");
        // console.log(propertyKey);
        // console.log("descriptor:");
        // console.log(descriptor);
        
        // anonymous function, not arrow
        descriptor.value = function (...args: any[]) {

            // alert("Fun called!");
            // console.log("CALLED:");
            // console.log(args);

            let obj: AstNode = <AstNode> this;
            
            let result: AbstractType = null;
            try {
                result = originalMethod.apply(this, args);
            } catch(e){
                // set error by placeholder error instead of leaving null ?
                // TODO: Check for TypeError
                if(e instanceof TypeError) {
                    //alert("TypeError");
                    obj.setTypeError(e);
                } else if(e instanceof Error){
                    //alert("Error");
                    obj.setTypeError(e);
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