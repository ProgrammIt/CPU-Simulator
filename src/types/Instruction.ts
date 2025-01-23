import { Bit } from "./Bit";
import { DoubleWord } from "./DoubleWord";

/**
 * This class represents an 32-bit instruction.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class Instruction extends DoubleWord {
	/**
	 * Instantiates a new object.
	 * @constructor
	 */
	public constructor(value: Array<Bit>) {
		super(value);
	}

	/**
	 * For comparison, both binary values are converted to strings.
	 * Conversion presarves the order of items, which is important for the comparison.
	 * @param instruction The instruction to compare to.
	 * @returns True, when both binary values are identical, false otherwise.
	 */
	public equal(instruction: Instruction): boolean {
		return instruction.value.toString() === this.value.toString();
	}

	/**
	 * Converts the binary value into a string representation.
	 * @returns 
	 */
	public toString(): string {
		return this.value.join("");
	}
}