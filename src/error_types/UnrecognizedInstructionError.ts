/**
 * Error which gets thrown whenever an instruction could not be recognized by the Assembler or the instruction decoder.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class UnrecognizedInstructionError extends Error {
	/**
	 * Constructs a new instance with the given message.
	 * @param description A short text describing the error and its cause.
	 */
    constructor(description: string) {
		super(description);
        // Set the prototype explicitly to enable typechecking.
        Object.setPrototypeOf(this, UnrecognizedInstructionError.prototype);
    }
}