/**
 * Error which gets thrown whenever an instructions operand is missing.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export default class MissingOperandError extends Error {
    /**
	 * Constructs a new instance with the given message.
	 * @param description A short text describing the error and its cause.
	 */
    constructor(description: string) {
		super(description);
        // Set the prototype explicitly to enable typechecking.
        Object.setPrototypeOf(this, MissingOperandError.prototype);
    }
}