/**
 * Error which gets thrown whenever an Breakpoint is triggert .
 */
export class BreakpointError extends Error {

    /**
     * Constructs a new instance with the given message.
     */
    constructor() {
        super();
        this.name = "BreakpointError";
        // Set the prototype explicitly to enable typechecking.
        Object.setPrototypeOf(this, BreakpointError.prototype);
    }
}