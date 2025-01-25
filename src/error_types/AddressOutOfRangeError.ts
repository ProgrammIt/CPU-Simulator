/**
 * Error which gets thrown whenever a given physical memory address is out of the allowed range.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export default class AddressOutOfRangeError extends Error {
    /**
	 * Constructs a new instance with the given message.
	 * @param description A short text describing the error and its cause.
	 */
    constructor(description: string) {
        super(description);
        // Set the prototype explicitly to enable typechecking.
        Object.setPrototypeOf(this, AddressOutOfRangeError.prototype);
    }
}