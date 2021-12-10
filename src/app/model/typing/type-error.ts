export class TypeError extends Error {
    constructor(message: string) {
        super("TypeError: " + message);
    }
}