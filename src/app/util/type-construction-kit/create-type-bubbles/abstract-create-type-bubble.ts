import { Directive, EventEmitter, HostListener, Input, Output, ViewChild } from "@angular/core";
import { AbstractType } from "src/app/model/typing/types/abstract-type";
import { NoTypePlaceholder } from "src/app/model/typing/types/common/no-type-placeholder";
import { BubbleSelectionService, TypeBubble } from "../service/bubble-selection.service";

export class InvalidTypeCreationError extends Error {
    public userMessage: string;

    constructor(userMessage: string) {
        super();
        this.userMessage = userMessage;
    }
}

/**
 * TODO: Refactor 'creation' to 'construction'
 * 
 */


@Directive()
export abstract class AbstractCreateTypeBubble {

    @Output('onApplyCreation') onApplyCreation_extern = new EventEmitter<AbstractType>();
    @Output('onCancelCreation') onCancelCreation_extern = new EventEmitter<void>();

    protected static SELECTION_EMPTY_PLACEHOLDER: string = "?";

    private active: boolean = false;

    constructor(protected bubbleSelectionService: BubbleSelectionService) {
        this.bubbleSelectionService.selectedBubble.subscribe(bubble => {
            if (this.active) {
                this.onTypeBubbleSelected(bubble);
            }
        });
    }

    public activate(): void {
        this.active = true;
        // Use setTimeout to overcome changedetection. TODO Find more elegant solution for this!
        setTimeout(() => this.onCreationStarted(), 100);
    }

    public deactivate(): void {
        this.active = false;
        this.bubbleSelectionService.unselect();
    }

    private onPressedEnter(): void {
        let output: AbstractType;
        try {
            output = this.onApplyCreation(); // Lifecycle Callback
        } catch (e) {
            if (e instanceof InvalidTypeCreationError) {
                alert(e.userMessage); // TODO: Use better UI here.
                return;
            } else {
                throw e;
            }
        }

        this.onApplyCreation_extern.next(output);
        this.deactivate();

        this.onCreationStopped(); // Lifecycle Callback
    }

    private onPressedEscape(): void {
        this.onCancelCreation(); // Lifecycle Callback

        this.onCancelCreation_extern.next();
        this.deactivate();

        this.onCreationStopped(); // Lifecycle Callback
    }

    @HostListener('document:keydown.escape', ['$event'])
    @HostListener('document:keypress', ['$event'])
    private handleKeyboardEvent(event: KeyboardEvent) {
        if (!this.active) return;
        switch (event.key) {
            case "Enter":
                this.onPressedEnter();
                break;
            case "Escape":
                this.onPressedEscape();
                break;
            default:
        }
    }

    /*
    - Getters/Setters
    - Helper methods
    */

    public isVisible(): boolean {
        return this.active;
    }

    protected static isEmpty(type: AbstractType): boolean {
        return type instanceof NoTypePlaceholder || !type;
    }

    /*

    Lifecycle Callbacks

    */

    /**
     * Will be called automatically when the creation state had been entered. Use this lifecycle hook for initialization.
     */
    protected abstract onCreationStarted(): void;

    /**
     * Will be called automatically when user clicks a different bubble. Use this callback to store references to other types when composing a complex one.
     * @param bubble clicked (other) bubble holding an already existing type
     */
    protected abstract onTypeBubbleSelected(bubble: TypeBubble): void;

    /**
     * Will be called automatically when user tries to apply the composed type (i.e. pressing 'Enter').
     * Throw a InvalidTypeCreationError if creation is not possible to notify user and abort applying the creation.
     * 
     * @returns the created type
     */
    protected abstract onApplyCreation(): AbstractType;

    /**
     * Will be called automatically when user cancels the creation (i.e. by pressing 'Esc').
     * Note: Do not use this callback for cleanup. Use 'onCreationStopped' instead.
     * 
     * @returns 
     */
    protected abstract onCancelCreation(): void;

    /**
     * Will be called automatically when the creation state has been stopped, no matter if creation was applies or canceled.
     * Use this lifecycle hook for cleanup, so everything is ready for next 'onCreationStarted' callback.
     */
    protected abstract onCreationStopped(): void;
}

