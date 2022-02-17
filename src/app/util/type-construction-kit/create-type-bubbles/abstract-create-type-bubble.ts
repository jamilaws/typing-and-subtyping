import { Directive, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { AbstractType } from "src/app/model/typing/types/abstract-type";
import { BubbleSelectionService, TypeBubble } from "../service/bubble-selection.service";

@Directive()
export abstract class AbstractCreateTypeBubble {

    public visible: boolean = false;

    @Output('onApplyCreation') onApplyCreation = new EventEmitter<AbstractType>();
    @Output('onCancelCreation') onCancelCreation = new EventEmitter<void>();

    constructor(protected bubbleSelectionService: BubbleSelectionService) {
        this.bubbleSelectionService = bubbleSelectionService;
        this.bubbleSelectionService.selectedBubble.subscribe(bubble => {
            this.onTypeBubbleSelected(bubble);
        });
    }

    public start(): void {
        this.setVisible(true);
    }

    public reset(): void {
        this.bubbleSelectionService.unselect();
        this.setVisible(false);
    }

    protected outputTypeToCreate(type: AbstractType): void {
        this.onApplyCreation.next(type);
    }

    public setVisible(value: boolean): void {
        this.visible = value;
    }

    @HostListener('document:keydown.escape', ['$event'])
    @HostListener('document:keypress', ['$event'])
    private handleKeyboardEvent(event: KeyboardEvent) {
        if(!this.visible) return;
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

    protected abstract onTypeBubbleSelected(bubble: TypeBubble): void;
    protected abstract applyCreation(): void;
    protected cancelCreation(): void {
        this.reset();
        this.onCancelCreation.next();
    };
}