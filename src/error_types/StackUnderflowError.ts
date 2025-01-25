/**
 * Error which gets thrown whenever a process tries to pop from STACK but STACK is empty.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export default class StackUnderflowError extends Error {
    /**
	 * Constructs a new instance with the given message.
	 * @param description A short text describing the error and its cause.
	 */
    constructor(description: string) {
		super(description);
        // Set the prototype explicitly to enable typechecking.
        Object.setPrototypeOf(this, StackUnderflowError.prototype);
    }
}