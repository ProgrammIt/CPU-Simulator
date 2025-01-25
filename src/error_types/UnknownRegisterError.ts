/**
 * Error which gets thrown whenever a process tries to access an unkown register.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export default class UnknownRegisterError extends Error {
    /**
	 * Constructs a new instance with the given message.
	 * @param description A short text describing the error and its cause.
	 */
    constructor(description: string) {
		super(description);
        // Set the prototype explicitly to enable typechecking.
        Object.setPrototypeOf(this, UnknownRegisterError.prototype);
    }
}