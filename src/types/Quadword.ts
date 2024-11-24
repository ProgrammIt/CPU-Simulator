import { DataSize } from "../types";
import { Bit } from "./Bit";

export class Quadword {
	public static readonly MAX_POSITIVE_NUMBER_SIGNED: number = Math.pow(2, DataSize.QUADWORD - 1) - 1;
	public static readonly MAX_NEGATIVE_NUMBER_SIGNED: number = -1 * Math.pow(2, DataSize.QUADWORD - 1);
	public static readonly MAX_NUMBER_UNSIGNED: number = Math.pow(2, DataSize.QUADWORD);

	/**
	 * The binary data this object holds.
	 */
	protected _value: Array<Bit>;

	/**
	 * Indicates, whether this binary value should be treated as a signed value.
	 * If this gets set to true, the MSB should be treated as sign bit.
	 * This reduces the range of displayable values.
	 */
	public signed: boolean;

	/**
	 * Instantiates a new object.
	 * @param signed [signed=true] Indicates whether this binary value should be treated as a signed value.
	 * @constructor
	 */
	public constructor(signed: boolean = true) {
		this._value = new Array<Bit>(
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
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
		if (newValue.length != DataSize.QUADWORD) {
			throw new Error(`A new value must have exactly ${DataSize.QUADWORD} bits.`);
		}
		this._value = newValue;
	}

	/**
	 * For comparison, both binary values are converted to strings.
	 * Conversion presarves the order of items, which is important for the comparison.
	 * @param quadword The binary value to compare to.
	 * @returns True, when both binary values are identical, false otherwise.
	 */
	public equal(quadword: Quadword): boolean {
		return quadword._value.toString() === this._value.toString();
	}

	/**
	 * Converts the binary value into a string representation.
	 * @returns 
	 */
	public toString(): string {
		return this._value.join("");
	}

	/**
	 * This method creates an instance from the given number. Throws an error, if the given number is not an integer.
	 * It uses the second parameter as an indicator whether to convert the integer value into a signed or unsigned binary value.
	 * This parameter is needed, because not all values in the context of a CPU can be treated as signed binary values.
	 * For example a memory address can never be a negative value. Therefore, such a binary value should always be considered unsigned.
	 * Depending on the second parameter, the range of allowed values is slightly different. This method throws an error, if
	 * the value to be converted is too large or too small.
	 * @param integer The number to initialize the new instances value with.
	 * @param signed [signed=true] Indicates, whether this binary value should be treated as a signed value.
	 * @returns A new instance.
	 */
	public static fromInteger(integer: number, signed: boolean = true): Quadword {
		if (!Number.isInteger(integer)) {
			throw new Error("Given number is not an integer.");
		}

		if (signed && (integer < Quadword.MAX_NEGATIVE_NUMBER_SIGNED || integer > Quadword.MAX_POSITIVE_NUMBER_SIGNED)) {
			throw new Error(`The given number cannot be expressed using ${DataSize.QUADWORD} bits, if the most significant bit should be treated as the sign bit.`);
		}

		if (!signed && integer < 0) {
			/**
			 * A user can enter a negative number and still specify that this value should be treated as an unsigned binary value after conversion.
			 * This is fine, but the sign must be removed.
			 */
			integer *= -1;
		}

		if (!signed && integer > Quadword.MAX_NUMBER_UNSIGNED) {
			throw new Error(`The given number cannot be expressed with ${DataSize.QUADWORD - 1} bits.`);
		}

		var quadword: Quadword;
		var binaryNumber: string;
		
		if (signed && integer < 0) {
			quadword = new Quadword();
			// A bit shift converts the given number to a signed 32-bit value.
			binaryNumber = (integer >>> 0).toString(2).padStart(DataSize.QUADWORD, "1");
		} else {
			quadword = (signed) ? new Quadword() : new Quadword(false);
			binaryNumber = integer.toString(2).padStart(DataSize.QUADWORD, "0");
		}

		binaryNumber.split("").forEach((bit, index) => {
			quadword._value[index] = (bit === "0") ? 0 : 1;
		});

		return quadword;
	}
}