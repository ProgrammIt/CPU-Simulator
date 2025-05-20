import { BinaryValue } from "./BinaryValue";
import { Bit } from "./Bit";
import { DataSizes } from "../enumerations/DataSizes";

/**
 * This class represents a byte sized binary value.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class Byte extends BinaryValue {
	public static readonly MAX_POSITIVE_NUMBER_DEC: number = 127;
	public static readonly MAX_NEGATIVE_NUMBER_DEC: number = -128;
	public static readonly NUMBER_OF_BITS_DEC: number = 8;

	/**
	 * Instantiates a new object.
	 * @param value The initial value of the byte.
	 * @constructor
	 */
	public constructor(
		value: Array<Bit> = new Array<Bit>(
			0, 0, 0, 0,
			0, 0, 0, 0
		)
	) {
		super(new Array<Bit>(
			0, 0, 0, 0,
			0, 0, 0, 0
		));
		this.value = value;
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
        if (newValue.length > DataSizes.BYTE) {
			throw new Error(`The given value consists out of more than ${DataSizes.BYTE} bits.`);
		}
		this._value = newValue.slice();
	}

	/**
	 * For comparison, both binary values are converted to strings.
	 * Conversion presarves the order of items, which is important for the comparison.
	 * @param byte The binary value to compare to.
	 * @returns True, when both binary values are identical, false otherwise.
	 */
	public equal(byte: Byte): boolean {
		return byte.toUnsignedNumber() === this.toUnsignedNumber();
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
	 * @constructor
	 * @returns A new instance.
	 */
	public static fromInteger(integer: number): Byte {
		if (!Number.isInteger(integer)) {
			throw new Error("Given number is not an integer.");
		}

		if (integer < Byte.MAX_NEGATIVE_NUMBER_DEC || integer > Byte.MAX_POSITIVE_NUMBER_DEC) {
			throw new Error(`The given number cannot be expressed using ${DataSizes.BYTE} bits, if the most significant bit should be treated as the sign bit.`);
		}

		var byte: Byte = new Byte();
		// A bit shift converts the given number to a signed 32-bit value, therefore, we need to crop the result to 8 bit.
		var binaryNumber: string = (integer < 0) ? 
			(integer >>> 0).toString(2).slice(-DataSizes.BYTE) : 
			integer.toString(2).padStart(DataSizes.BYTE, "0");

		binaryNumber.split("").forEach((bit, index) => {
			byte._value[index] = (bit === "0") ? 0 : 1;
		});

		return byte;
	}

	public toUnsignedNumber(): number {
		let binaryString = this._value.join("");
		let decimalNumber = parseInt(binaryString, 2);
		return decimalNumber;
	}
}