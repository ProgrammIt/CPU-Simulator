/**
 * Error which gets thrown when the user attempts to start execution of an
 * assembly programm but forgot to load one into the simulator beforehand.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export default class NoProgrammLoadedError extends Error {
	/**
	 * Constructs a new instance with the given message.
	 * @param description A short text describing the error and its cause.
	 */
    constructor(description: string) {
		super(description);
        // Set the prototype explicitly to enable typechecking.
        Object.setPrototypeOf(this, NoProgrammLoadedError.prototype);
    }
}