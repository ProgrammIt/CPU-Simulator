import { Bit } from "./Bit";
import { DataSizes } from "../enumerations/DataSizes";

export class Word {
	protected static readonly MAX_POSITIVE_NUMBER_DEC: number = 32_767;
	protected static readonly MAX_NEGATIVE_NUMBER_DEC: number = -32_768;
	public static readonly NUMBER_OF_BITS_DEC: number = 16;

	/**
	 * The binary data this object holds.
	 */
	protected _value: Array<Bit>;

	/**
	 * Instantiates a new object.
	 * @param [value] The binary data to initialize the new object with.
	 * @constructor
	 */
	public constructor(value: Array<Bit> = new Array<Bit>(
		0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, 0,
		0, 0, 0, 0
	)){
		this._value = value;
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
	 * @param groupBytes When true, the bytes are grouped into two groups with 8 bits each.
	 * @returns 
	 */
	public toString(groupBytes: boolean): string {
		var result: string = "";
		if (groupBytes) {
			result = `${this.value[0]}${this.value[1]}${this._value[2]}${this._value[3]}${this.value[4]}${this.value[5]}${this._value[6]}${this._value[7]} `;
			result += `${this.value[8]}${this.value[9]}${this._value[10]}${this._value[11]}${this.value[12]}${this.value[13]}${this._value[14]}${this._value[15]}`;
		} else {
			result = this._value.join("");
		}
		return result;
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