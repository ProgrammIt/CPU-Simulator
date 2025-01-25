import Bit from "./Bit";
import DoubleWord from "./DoubleWord";

/**
 * This class represents an 32-bit instruction.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export default class Instruction extends DoubleWord {
	/**
	 * Instantiates a new object.
	 * @constructor
	 */
	public constructor(value: Array<Bit>) {
		super(value);
	}

	/**
	 * Accessor for reading the binary value.
	 * @override
	 */
	public get value(): Array<Bit> {
		return this._value;
	}
	
	/**
	 * Accessor for setting the binary value.
	 * @param newValue The new value.
	 * @override
	 */
	public set value(newValue: Array<Bit>) {
		if (newValue.length != DoubleWord.NUMBER_OF_BITS_DEC) {
			throw new Error(`A new value must have exactly ${this._value.length} bits.`);
		}
		this._value = newValue.slice();
	}

	/**
	 * For comparison, both binary values are converted to strings.
	 * Conversion presarves the order of items, which is important for the comparison.
	 * @param other The instruction to compare to.
	 * @returns True, when both binary values are identical, false otherwise.
	 */
	public equal(other: Instruction): boolean {
		return other.value.toString() === this.value.toString();
	}

	/**
	 * Converts the binary value into a string representation.
	 * @returns The string representation of the binary value.
	 */
	public toString(groupBytes: boolean = false): string {
		var result: string = "";
		if (groupBytes) {
			result = `${this.value[0]}${this.value[1]}${this._value[2]}${this._value[3]}${this.value[4]}${this.value[5]}${this._value[6]}${this._value[7]} ${this.value[8]}${this.value[9]}${this._value[10]}${this._value[11]}${this.value[12]}${this.value[13]}${this._value[14]}${this._value[15]} ${this.value[16]}${this.value[17]}${this._value[18]}${this._value[19]}${this.value[20]}${this.value[21]}${this._value[22]}${this._value[23]} ${this.value[24]}${this.value[25]}${this._value[26]}${this._value[27]}${this.value[28]}${this.value[29]}${this._value[30]}${this._value[31]}`;
		} else {
			result = this._value.join("");
		}
		return result;
	}
}