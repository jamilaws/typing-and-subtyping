import { AbstractType } from "../abstract-type";
import { Definition } from "../common/definition";

export class FunctionType extends AbstractType {

    private parameterTypes: AbstractType[];
    private returnType: AbstractType;

    constructor(parameterTypes: AbstractType[], returnType: AbstractType){
        super();
        this.parameterTypes = parameterTypes;
        this.returnType = returnType;
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