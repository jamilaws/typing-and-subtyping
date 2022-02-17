import { Directive, EventEmitter, HostListener, Input, Output, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { AbstractType } from "src/app/model/typing/types/abstract-type";
import { BubbleSelectionService, TypeBubble } from "../service/bubble-selection.service";
import { TypeBubbleState } from "./type-bubble-state";

@Directive()
export abstract class AbstractTypeBubble {

    @Input("type") type: AbstractType;
    @Input("state") state: TypeBubbleState = TypeBubbleState.ACTION;

    @Output("onClickCreateTypedef") onClickCreateTypedef = new EventEmitter<AbstractType>();
    @Output("onClickCreateDeclaration") onClickCreateDeclaration = new EventEmitter<AbstractType>();

    @ViewChild("menuTrigger") menuTrigger: MatMenuTrigger;

    constructor(protected bubbleSelectionService: BubbleSelectionService) {
    }

    public onClick(): void {
        switch (this.state) {
            case TypeBubbleState.ACTION:
                this.menuTrigger.openMenu();
                break;
            case TypeBubbleState.SELECTION:
                this.bubbleSelectionService.selected(this)
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

}