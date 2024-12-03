import { Bit } from "./Bit";
import { Doubleword } from "./Doubleword";

/**
 * This class represents an 32-bit instruction.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class Instruction extends Doubleword {
	/**
	 * Instantiates a new object.
	 * @constructor
	 */
	public constructor(
		value: Array<Bit> = new Array<Bit>(
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0
		)
	) {
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