/**
 * Error which gets thrown whenever a process tries to write a page frame markes as read-only.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class PageFrameNotWritableError extends Error {
    /**
	 * Constructs a new instance with the given message.
	 * @param description A short text describing the error and its cause.
	 */
    constructor(description: string) {
		super(description);
        // Set the prototype explicitly to enable typechecking.
        Object.setPrototypeOf(this, PageFrameNotWritableError.prototype);
    }
}