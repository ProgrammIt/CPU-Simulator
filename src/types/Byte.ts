import { DataSize } from "../types";
import { Bit } from "./Bit";

export class Byte {
	/**
	 * The binary data this object holds.
	 */
	protected _value: Array<Bit>;

	public static readonly MAX_POSITIVE_NUMBER_SIGNED: number = Math.pow(2, DataSize.BYTE - 1) - 1;
	public static readonly MAX_NEGATIVE_NUMBER_SIGNED: number = -1 * Math.pow(2, DataSize.BYTE - 1);
	public static readonly MAX_NUMBER_UNSIGNED: number = Math.pow(2, DataSize.BYTE);

	public signed: boolean;

	/**
	 * Instantiates a new object.
	 * @param [signed=false] Indicates, whether this binary value should be treated as a signed value.
	 * @constructor
	 */
	public constructor(signed: boolean = false) {
		this._value = new Array<Bit>(
			0, 0, 0, 0,
			0, 0, 0, 0
		);
		this.signed = signed;
	}

	public get value(): Array<Bit> {
		return this._value;
	}

	public set value(newValue: Array<Bit>) {        
        if (newValue.length > DataSize.BYTE) {
			throw new Error(`The given value consists out of more than ${DataSize.BYTE} bits.`);
		}

		this._value = new Array<Bit>();
		this._value = newValue;
	}

	/**
	 * For comparison, both binary values are converted to strings.
	 * Conversion presarves the order of items, which is important for the comparison.
	 * @param byte The binary value to compare to.
	 * @returns True, when both binary values are identical, false otherwise.
	 */
	public equal(byte: Byte): boolean {
		return byte._value.toString() === this._value.toString();
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
	 * @param signed [signed=false] Indicates, whether this binary value should be treated as a signed value.
	 * @returns A new instance.
	 */
	public static fromInteger(integer: number, signed: boolean = false): Byte {
		if (!Number.isInteger(integer)) {
			throw new Error("Given number is not an integer.");
		}

		if (signed && (integer < Byte.MAX_NEGATIVE_NUMBER_SIGNED || integer > Byte.MAX_POSITIVE_NUMBER_SIGNED)) {
			throw new Error(`The given number cannot be expressed using ${DataSize.BYTE} bits, if the most significant bit should be treated as the sign bit.`);
		}

		if (!signed && integer < 0) {
			/**
			 * A user can enter a negative number and still specify that this value should be treated as an unsigned binary value after conversion.
			 * This is fine, but the sign must be removed.
			 */
			integer *= -1;
		}

		if (!signed && integer > Byte.MAX_NUMBER_UNSIGNED) {
			throw new Error(`The given number cannot be expressed with ${DataSize.BYTE - 1} bits.`);
		}

		var byte: Byte;
		var binaryNumber: string;
		
		if (signed && integer < 0) {
			byte = new Byte(true);
			// A bit shift converts the given number to a signed 32-bit value.
			binaryNumber = (integer >>> 0).toString(2);
		} else {
			byte = (signed) ? new Byte(true) : new Byte(false);
			binaryNumber = integer.toString(2).padStart(DataSize.BYTE, "0");
		}

		binaryNumber.split("").forEach((bit, index) => {
			byte._value[index] = (bit === "0") ? 0 : 1;
		});

		return byte;
	}
}