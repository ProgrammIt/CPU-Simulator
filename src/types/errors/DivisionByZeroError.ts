/**
 * Error which gets thrown whenever a process tries to divide an integer by binary zero.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class DivisionByZeroError extends Error {
    /**
	 * Constructs a new instance with the given message.
	 * @param description A short text describing the error and its cause.
	 */
    constructor(description: string) {
        super(description);
        // Set the prototype explicitly to enable typechecking.
        Object.setPrototypeOf(this, DivisionByZeroError.prototype);
    }
}