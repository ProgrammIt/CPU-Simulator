/**
 * Error which gets thrown when the virtual filesystem cant perform an action.
 * @author Laurin Gehlenborg <lauringehlenborg@gmail.com>
 */
export class FilesystemError extends Error {
    /**
	 * Constructs a new instance with the given message.
	 * @param description A short text describing the error and its cause.
	 */
    constructor(description: string) {
		super(description);
        // Set the prototype explicitly to enable typechecking.
        Object.setPrototypeOf(this, FilesystemError.prototype);
    }
}