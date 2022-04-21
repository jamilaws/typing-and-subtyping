import { Directive, EventEmitter, HostListener, Input, Output, ViewChild } from "@angular/core";
import { AbstractType } from "src/app/model/typing/types/abstract-type";
import { NoTypePlaceholder } from "src/app/model/typing/types/common/no-type-placeholder";
import { BubbleSelectionService, TypeBubble } from "../service/bubble-selection.service";

export class InvalidTypeConstructionError extends Error {
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
export abstract class AbstractTypeConstructionBubble {

    @Output('onApplyCreation') onApplyCreation_extern = new EventEmitter<AbstractType>();
    @Output('onCancelCreation') onCancelCreation_extern = new EventEmitter<void>();

    protected static SELECTION_EMPTY_PLACEHOLDER: string = "?";


    private active: boolean = false;

    constructor(private bubbleSelectionService: BubbleSelectionService) {
        this.bubbleSelectionService.selectedBubble.subscribe(bubble => {
            if (this.active) {
                this.onTypeBubbleSelected(bubble);
            }
        });
    }

    public activate(): void {
        this.active = true;
        // Use setTimeout to overcome changedetection. TODO Find more elegant solution for this!
        setTimeout(() => this.onConstructionStarted(), 100);
    }

    public deactivate(): void {
        this.active = false;
        this.bubbleSelectionService.unselect();
    }

    private onPressedEnter(): void {
        let output: AbstractType;
        try {
            output = this.onApplyConstruction(); // Lifecycle Callback
        } catch (e) {
            if (e instanceof InvalidTypeConstructionError) {
                alert(e.userMessage); // TODO: Use better UI here.
                return;
            } else {
                throw e;
            }
        }

        this.onApplyCreation_extern.next(output);
        this.deactivate();

        this.onConstructionStopped(); // Lifecycle Callback
    }

    private onPressedEscape(): void {
        this.onCancelConstruction(); // Lifecycle Callback

        this.onCancelCreation_extern.next();
        this.deactivate();

        this.onConstructionStopped(); // Lifecycle Callback
    }

    @HostListener('document:keydown.escape', ['$event'])
    @HostListener('document:keypress', ['$event'])
    private handleKeyboardEvent(event: KeyboardEvent): void {
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
     * Called after activation. Use this hook for set-up purpose.
     */
    protected abstract onConstructionStarted(): void;

    /**
     * Called when user clicks a different bubble. Use this callback to store references to other types when composing a complex one.
     * @param bubble clicked (other) bubble holding an already existing type
     */
    protected abstract onTypeBubbleSelected(bubble: TypeBubble): void;

    /**
     * Called when user tries to apply the composed type (by pressing 'Enter').
     * Throw an InvalidTypeConstructionError if construction is not possible to notify the user and ignore the keypress.
     * 
     * Note: Do not use this callback for cleanup. Use 'onCreationStopped' instead.
     * 
     * @returns the created type
     */
    protected abstract onApplyConstruction(): AbstractType;

    /**
     * Called when user cancels the construction (by pressing 'Esc').
     * 
     * Note: Do not use this callback for cleanup. Use 'onCreationStopped' instead.
     * 
     * @returns 
     */
    protected abstract onCancelConstruction(): void;

    /**
     * Called when the construction has finished, no matter if it was applied or canceled.
     * Use this hook for clean-up purpose, so the component remains in a well defined state 
     * for upcoming 'onCreationStarted' hook calls.
     */
    protected abstract onConstructionStopped(): void;
}

