/**
 * Error which gets thrown when a process (except from the operating system) runs out of memory.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class OutOfMemoryError extends Error {
	/**
	 * Constructs a new instance with the given message.
	 * @param description A short text describing the error and its cause.
	 */
    constructor(description: string) {
		super(description);
        // Set the prototype explicitly to enable typechecking.
        Object.setPrototypeOf(this, OutOfMemoryError.prototype);
    }
}