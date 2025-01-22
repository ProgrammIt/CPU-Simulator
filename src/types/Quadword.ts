import { BinaryValue } from "./BinaryValue";
import { Bit } from "./Bit";
import { DataSizes } from "./DataSizes";

export class QuadWord extends BinaryValue {
	public static readonly MAX_POSITIVE_NUMBER_DEC: bigint = 9_223_372_036_854_775_807n;
	public static readonly MAX_NEGATIVE_NUMBER_DEC: bigint = -9_223_372_036_854_775_808n;

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
			0, 0, 0, 0,
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
		if (newValue.length != DataSizes.QUADWORD) {
			throw new Error(`A new value must have exactly ${DataSizes.QUADWORD} bits.`);
		}
		this._value = newValue.slice();
	}

	/**
	 * For comparison, both binary values are converted to strings.
	 * Conversion presarves the order of items, which is important for the comparison.
	 * @param quadword The binary value to compare to.
	 * @returns True, when both binary values are identical, false otherwise.
	 */
	public equal(quadword: QuadWord): boolean {
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
	 * @returns A new instance.
	 */
	public static fromInteger(integer: number): QuadWord {
		if (!Number.isInteger(integer)) {
			throw new Error("Given number is not an integer.");
		}

		if (integer < QuadWord.MAX_NEGATIVE_NUMBER_DEC || integer > QuadWord.MAX_POSITIVE_NUMBER_DEC) {
			throw new Error(`The given number cannot be expressed using ${DataSizes.QUADWORD} bits, if the most significant bit should be treated as the sign bit.`);
		}

		var quadword: QuadWord = new QuadWord();
		
		// A bit shift converts the given number to a signed 32-bit value, so we need to extend the result to 64 bit.
		var binaryNumber = (integer < 0) ? (integer >>> 0).toString(2).padStart(DataSizes.QUADWORD, "1") : integer.toString(2).padStart(DataSizes.QUADWORD, "0");

		binaryNumber.split("").forEach((bit, index) => {
			quadword._value[index] = (bit === "0") ? 0 : 1;
		});

		return quadword;
	}
}