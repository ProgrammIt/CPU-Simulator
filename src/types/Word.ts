import { Bit } from "./Bit";
import { DataSizes } from "./DataSizes";

export class Word {
	/**
	 * The binary data this object holds.
	 */
	protected _value: Array<Bit>;

	protected static readonly MAX_POSITIVE_NUMBER_DEC: number = 32_767;
	protected static readonly MAX_NEGATIVE_NUMBER_DEC: number = -32_768;
	public static readonly NUMBER_OF_BITS_DEC: number = 16;

	public signed: boolean;

	/**
	 * Instantiates a new object.
	 * @param signed [signed=false] Indicates whether this binary value should be treated as a signed value.
	 * @constructor
	 */
	public constructor(signed: boolean = false) {
		this._value = new Array<Bit>(
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0
		);
		this.signed = signed;
	}

	public get value(): Array<Bit> {
		return this._value;
	}

	public set value(newValue: Array<Bit>) {
		if (newValue.length != DataSizes.WORD) {
			throw new Error(`A new value must have exactly ${DataSizes.WORD} bits.`);
		}
		this._value = newValue;
	}

	/**
	 * For comparison, both binary values are converted to strings.
	 * Conversion presarves the order of items, which is important for the comparison.
	 * @param word The binary value to compare to.
	 * @returns True, when both binary values are identical, false otherwise.
	 */
	public equal(word: Word): boolean {
		return word._value.toString() === this._value.toString();
	}

	/**
	 * Converts the binary value into a string representation.
	 * @returns 
	 */
	public toString(): string {
		return this._value.join("");
	}

	/**
	 * This method creates an instance from the given number.
	 * Throws an error, if the given number is not an integer.
	 * @param integer The number to initialize the new instances value with.
	 * @returns A new instance.
	 */
	public static fromInteger(integer: number): Word {
		if (!Number.isInteger(integer)) {
			throw new Error("Given number is not an integer.");
		}

		if (integer < Word.MAX_NEGATIVE_NUMBER_DEC || integer > Word.MAX_POSITIVE_NUMBER_DEC) {
			throw new Error(`The given number cannot be expressed using ${Word.NUMBER_OF_BITS_DEC} bits, if the most significant bit should be treated as the sign bit.`);
		}

		var word: Word = new Word();

		// A bit shift converts the given number to a signed 32-bit value.
		var binaryNumber: string = (integer < 0) ? 
			(integer >>> 0).toString(2) : 
			integer.toString(2).padStart(Word.NUMBER_OF_BITS_DEC, "0");

		binaryNumber.split("").slice(-Word.NUMBER_OF_BITS_DEC).forEach((bit, index) => {
			word._value[index] = (bit === "0") ? 0 : 1;
		});

		return word;
	}
}