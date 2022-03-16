import { TypeError } from "../../type-error";
import { AbstractPlaceholderType } from "../abstract-type";
import { CdeclHalves } from "../common/cdecl-halves";

export class TypeErrorPlaceholderType extends AbstractPlaceholderType {

    protected token: string;

    private error: TypeError;
    
    constructor(error: TypeError) {
        super();

        this.error = error;
        this.token = error.message;
    }
}