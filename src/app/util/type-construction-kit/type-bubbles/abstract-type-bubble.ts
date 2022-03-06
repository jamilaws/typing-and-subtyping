import { Directive, EventEmitter, HostListener, Input, Output, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { AbstractType } from "src/app/model/typing/types/abstract-type";
import { CdeclService } from "src/app/service/cdecl.service";
import { BubbleSelectionService, TypeBubble } from "../service/bubble-selection.service";
import { TypeBubbleState } from "./type-bubble-state";

@Directive()
export abstract class AbstractTypeBubble {

    @Input("type") type: AbstractType;
    @Input("state") state: TypeBubbleState = TypeBubbleState.ACTION;

    @Output("onClickCreateTypedef") onClickCreateTypedef = new EventEmitter<AbstractType>();
    @Output("onClickCreateDeclaration") onClickCreateDeclaration = new EventEmitter<AbstractType>();

    @ViewChild("menuTrigger") menuTrigger: MatMenuTrigger;

    constructor(protected bubbleSelectionService: BubbleSelectionService, protected cdeclService: CdeclService) {}

    public onClick(): void {
        switch (this.state) {
            case TypeBubbleState.ACTION:
                this.menuTrigger.openMenu();
                break;
            case TypeBubbleState.SELECTION:
                this.bubbleSelectionService.select(this)
                break;
            default: throw new Error("Unexpected bubble state found.")
        }
    }

    public getType(): AbstractType {
        return this.type;
    }

    public onClickAddTypedef(): void {
        if (!(this.state === TypeBubbleState.ACTION)) throw new Error("Unexpectedly called onClickAddTypedef while being in state " + this.state);
        this.onClickCreateTypedef.emit(this.getType());
    }

    public onClickAddDeclaration(): void {
        if (!(this.state === TypeBubbleState.ACTION)) throw new Error("Unexpectedly called onClickAddDeclaration while being in state " + this.state);
        this.onClickCreateDeclaration.emit(this.getType());
    }

    public onClickTestCdecl(): void {
        alert(this.type.cdeclToString());
    }
}