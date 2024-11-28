import { DataSize } from "../types";
import { Bit } from "./Bit";
import { Doubleword } from "./Doubleword";

/**
 * This class represents doubleword (4 byte) sized binary data.
 */
export class Address extends Doubleword {
	/**
	 * Constructs a new instance.
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
		if (newValue.length != DataSize.DOUBLEWORD) {
			throw new Error(`A new value must have exactly ${this._value} bits.`);
		}
		this._value = newValue;
	}

	/**
	 * Accessor for reading the binary value.
	 * @override
	 */
	public get value(): Array<Bit> {
		return this._value;
	}

	/**
	 * Converts the binary address value into a string representation.
	 * @returns The string representation of the binary value.
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
	public static fromInteger(integer: number): Address {
		if (!Number.isInteger(integer)) {
			throw new Error("Given number is not an integer.");
		}

		if (integer < 0) {
			throw new Error("Minimal value for an address is a decimal zero, but the given integer is smaller than zero.");
		}

		if (integer > Doubleword.MAX_NUMBER_UNSIGNED) {
			throw new Error(`The given number cannot be expressed with ${DataSize.DOUBLEWORD - 1} bits.`);
		}

		const address: Address = new Address();
		const binaryNumber = integer.toString(2).padStart(DataSize.DOUBLEWORD, "0");

		binaryNumber.split("").forEach((bit, index) => {
			address._value[index] = (bit === "0") ? 0 : 1;
		});

		return address;
	}
};