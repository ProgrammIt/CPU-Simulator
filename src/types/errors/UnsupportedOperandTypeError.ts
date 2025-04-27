/**
 * Error which gets thrown whenever the type of an instructions operand is unsupported.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class UnsupportedOperandTypeError extends Error {
    /**
	 * Constructs a new instance with the given message.
	 * @param description A short text describing the error and its cause.
	 */
    constructor(description: string) {
		super(description);
        // Set the prototype explicitly to enable typechecking.
        Object.setPrototypeOf(this, UnsupportedOperandTypeError.prototype);
    }
}