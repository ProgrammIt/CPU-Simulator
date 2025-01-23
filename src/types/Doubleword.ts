import { twosComplementToDecimal } from "../helper";
import { BinaryValue } from "./BinaryValue";
import { Bit } from "./Bit";
import { DataSizes } from "./DataSizes";

export class DoubleWord extends BinaryValue {
	public static readonly MAX_POSITIVE_NUMBER_DEC: number = 2_147_483_647;
	public static readonly MAX_NEGATIVE_NUMBER_DEC: number = -2_147_483_648;

	/**
	 * Instantiates a new object.
	 * @param value The initial value of the doubleword.
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
	 * Accessor for setting the binary value.
	 * @param newValue The new value.
	 * @override
	 */
	public set value(newValue: Array<Bit>) {
		if (newValue.length != DataSizes.DOUBLEWORD) {
			throw new Error(`A new value must have exactly ${DataSizes.DOUBLEWORD} bits: ${newValue.length} given.`);
		}
		this._value = newValue.slice();
	}

	/**
	 * This method checks whethter the current binary value is equal to the given one or not.
	 * For comparison, both binary values are converted to strings.
	 * Conversion presarves the order of items, which is important for the comparison.
	 * @param doubleword The binary value to compare to.
	 * @returns True, if both binary values are identical, false otherwise.
	 */
	public equal(doubleword: DoubleWord): boolean {
		return doubleword.toString() === this.toString();
	}

	/**
	 * This method checks whether the current binary value is smaller than the given one.
	 * @param other The binary value to compare to.
	 * @returns True, if this value is less than the one compared to, false otherwise.
	 */
    public isSmallerThan(other: DoubleWord): boolean {
		return twosComplementToDecimal(this) < twosComplementToDecimal(other);
    }

	/**
	 * This method checks whether the current binary value is greater than the given one.
	 * @param other The binary value to compare to.
	 * @returns True, if this value is greater than the one compared to, false otherwise.
	 */
	public isGreaterThan(other: DoubleWord): boolean {
		return twosComplementToDecimal(this) > twosComplementToDecimal(other);
	}

	/**
	 * This method checks whether the current binary value is a binary zero or not.
	 * @returns True, if the binary value is zero, false otherwise.
	 */
	public isZero(): boolean {
		return this.equal(new DoubleWord());
	}

	/**
	 * This method checks whether the current binary value is not a binary zero or not.
	 * @returns True, if the binary value is not zero, false otherwise.
	 */
	public isNotZero(): boolean {
		return !this.isZero();
	}

	/**
	 * This method checks whether this binary value represents a negative number.
	 * @returns True, if the most significant bit is set to 1, false otherwise.
	 */
	public isNegative(): boolean {
		return this._value[0] === 1;
	}

	/**
	 * This method checks whether this binary value represents a positive number.
	 * @returns True, if the most significant bit is set to 0, false otherwise.
	 */
	public isPositive(): boolean {
		return this._value[0] === 0;
	}

	/**
	 * Converts the binary value into a string representation.
	 * @param [groupBytes=false] If set to true, the string representation of the binary value is grouped into bytes.
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
	public static fromInteger(integer: number): DoubleWord {
		if (!Number.isInteger(integer)) {
			throw new Error("Given number is not an integer.");
		}

		if (integer < DoubleWord.MAX_NEGATIVE_NUMBER_DEC || integer > DoubleWord.MAX_POSITIVE_NUMBER_DEC) {
			throw new Error(`The given number cannot be expressed using ${DataSizes.DOUBLEWORD} bits, if the most significant bit should be treated as the sign bit.`);
		}

		var doubleword: DoubleWord = new DoubleWord();

		// A bit shift converts the given number to a signed 32-bit value.
		var binaryNumber: string = (integer < 0) ? 
			(integer >>> 0).toString(2) : 
			integer.toString(2).padStart(DataSizes.DOUBLEWORD, "0");

		binaryNumber.split("").forEach((bit, index) => {
			doubleword._value[index] = (bit === "0") ? 0 : 1;
		});

		return doubleword;
	}
}