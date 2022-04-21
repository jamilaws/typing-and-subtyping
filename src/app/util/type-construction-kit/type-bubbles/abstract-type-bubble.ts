import { Directive, EventEmitter, HostListener, Input, Output, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { AbstractType } from "src/app/model/typing/types/abstract-type";
import { CdeclService } from "src/app/service/cdecl.service";
import { BubbleSelectionService, TypeBubble as ITypeBubble } from "../service/bubble-selection.service";
import { TypeBubbleState } from "./type-bubble-state";

@Directive()
export abstract class AbstractTypeBubble implements ITypeBubble {

    @Input("type") type: AbstractType;
    @Input("state") state: TypeBubbleState = TypeBubbleState.CREATION;

    @Output("onClickCreateTypedef") onClickCreateTypedef_extern = new EventEmitter<AbstractType>();
    @Output("onClickCreateDeclaration") onClickCreateDeclaration_extern = new EventEmitter<AbstractType>();

    @ViewChild("menuTrigger") menuTrigger: MatMenuTrigger;

    public menuAddTypedefLabel: string = "add typedef";
    public menuAddDeclarationLabel: string = "declare";

    constructor(protected bubbleSelectionService: BubbleSelectionService, protected cdeclService: CdeclService) {}

    public onClick(): void {
        // TODO: Find mistake!!!
        switch (this.state) {
            case TypeBubbleState.CREATION:
                this.menuTrigger.openMenu();
                break;
            case TypeBubbleState.IDLE:
                this.bubbleSelectionService.select(this)
                break;
            default: throw new Error("Unexpected bubble state found.")
        }
    }

    public getType(): AbstractType {
        return this.type;
    }

    public onClickAddTypedef(): void {
        if (!(this.state === TypeBubbleState.CREATION)) throw new Error("Unexpectedly called onClickAddTypedef while being in state " + this.state);
        this.onClickCreateTypedef_extern.emit(this.getType());
    }

    public onClickAddDeclaration(): void {
        if (!(this.state === TypeBubbleState.CREATION)) throw new Error("Unexpectedly called onClickAddDeclaration while being in state " + this.state);
        this.onClickCreateDeclaration_extern.emit(this.getType());
    }
}