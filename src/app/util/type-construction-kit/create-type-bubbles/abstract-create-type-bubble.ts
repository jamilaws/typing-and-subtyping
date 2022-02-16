import { Directive, HostListener, Input, Output } from "@angular/core";
import { BubbleSelectionService, TypeBubble } from "../service/bubble-selection.service";

@Directive()
export abstract class AbstractCreateTypeBubble {

    @Input('visible') visible: boolean = false;
    //@Output('onTypeCreate') onTypeCreate = new E

    constructor(protected bubbleSelectionService: BubbleSelectionService) {
        this.bubbleSelectionService = bubbleSelectionService;
        this.bubbleSelectionService.selectedBubble.subscribe(bubble => {
            this.onTypeBubbleSelected(bubble);
        });
    }

    protected abstract onTypeBubbleSelected(bubble: TypeBubble): void;
    protected abstract applyCreation(): void;
    protected abstract cancelCreation(): void;

    @HostListener('document:keydown.escape', ['$event'])
    @HostListener('document:keypress', ['$event'])
    private handleKeyboardEvent(event: KeyboardEvent) {
        switch (event.key) {
            case "Enter":
                this.applyCreation();
                break;
            case "Escape":
                this.cancelCreation();
                break;
            default:
        }
    }
}