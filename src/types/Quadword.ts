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
	 * This method checks whethter the current binary value is equal to the given one or not.
	 * For comparison, both binary values are converted to strings.
	 * Conversion presarves the order of items, which is important for the comparison.
	 * @param other The binary value to compare to.
	 * @returns True, if both binary values are identical, false otherwise.
	 */
	public equal(other: QuadWord): boolean {
		return other.toString() === this.toString();
	}
	
	/**
	 * This method checks whether the current binary value is a binary zero or not.
	 * @returns True, if the binary value is zero, false otherwise.
	 */
	public isZero(): boolean {
		return this.equal(new QuadWord());
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
			result = `${this.value[0]}${this.value[1]}${this._value[2]}${this._value[3]}${this.value[4]}${this.value[5]}${this._value[6]}${this._value[7]} `;
			result += `${this.value[8]}${this.value[9]}${this._value[10]}${this._value[11]}${this.value[12]}${this.value[13]}${this._value[14]}${this._value[15]} `;
			result += `${this.value[16]}${this.value[17]}${this._value[18]}${this._value[19]}${this.value[20]}${this.value[21]}${this._value[22]}${this._value[23]} `;
			result += `${this.value[24]}${this.value[25]}${this._value[26]}${this._value[27]}${this.value[28]}${this.value[29]}${this._value[30]}${this._value[31]} `;
			result += `${this.value[32]}${this.value[33]}${this._value[34]}${this._value[35]}${this.value[36]}${this.value[37]}${this._value[38]}${this._value[39]} `;
			result += `${this.value[40]}${this.value[41]}${this._value[42]}${this._value[43]}${this.value[44]}${this.value[45]}${this._value[46]}${this._value[47]} `;
			result += `${this.value[48]}${this.value[49]}${this._value[50]}${this._value[51]}${this.value[52]}${this.value[53]}${this._value[54]}${this._value[55]} `;
			result += `${this.value[56]}${this.value[57]}${this._value[58]}${this._value[59]}${this.value[60]}${this.value[61]}${this._value[62]}${this._value[63]}`;
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