export class OverflowError extends Error {
	/**
	 * Constructs a new instance of the OverflowError with the given message text.
	 * @param msg A message text.
	 */
	constructor(msg: string) {
		super(msg);
        // Set the prototype explicitly to enable typechecking.
        Object.setPrototypeOf(this, OverflowError.prototype);
    }
}

export class DivisionByZeroError extends Error {
	/**
	 * Constructs a new instance of the OverflowError with the given message text.
	 * @param msg A message text.
	 */
	constructor(msg: string) {
		super(msg);
        // Set the prototype explicitly to enable typechecking.
        Object.setPrototypeOf(this, OverflowError.prototype);
    }
}