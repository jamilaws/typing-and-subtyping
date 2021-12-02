import { AbstractType } from "../abstract-type";
import { Definition } from "../common/definition";

export class FunctionType extends AbstractType {

    private parameters: Definition[];
    private returnType: AbstractType;

    constructor(parameters: Definition[], returnType: AbstractType){
        super();
        this.parameters = parameters;
        this.returnType = returnType;
    }

    public toString(): string {
        return "(" + this.parameters.map(p => p.toString()).concat(",") + ") => " + this.returnType.toString(); 
    }
}