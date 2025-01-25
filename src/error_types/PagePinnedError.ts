/**
 * Error which gets thrown when the operating system wants to move a pinned page
 * to a background memory.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export default class PagePinnedError extends Error {
	/**
	 * Constructs a new instance with the given message.
	 * @param description A short text describing the error and its cause.
	 */
    constructor(description: string) {
		super(description);
        // Set the prototype explicitly to enable typechecking.
        Object.setPrototypeOf(this, PagePinnedError.prototype);
    }
}