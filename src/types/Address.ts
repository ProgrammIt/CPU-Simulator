import { Bit } from "./Bit";
import { DataSizes } from "./DataSizes";
import { DoubleWord } from "./DoubleWord";

/**
 * This class represents a generic doubleword sized binary memory address.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class Address extends DoubleWord {
	public static readonly MAX_NUMBER_UNSIGNED_DEC: number = 4_294_967_295;

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
		if (newValue.length != DataSizes.DOUBLEWORD) {
			throw new Error(`A new value must have exactly ${this._value.length} bits.`);
		}
		this._value = newValue.slice();
	}

	/**
	 * Accessor for reading the binary value.
	 * @override
	 */
	public get value(): Array<Bit> {
		return this._value;
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

	/**
	 * This method creates an instance from the given number. Throws an error, if the given number is not an integer.
	 * It uses the second parameter as an indicator whether to convert the integer value into a signed or unsigned binary value.
	 * This parameter is needed, because not all values in the context of a CPU can be treated as signed binary values.
	 * For example a memory address can never be a negative value. Therefore, such a binary value should always be considered unsigned.
	 * Depending on the second parameter, the range of allowed values is slightly different. This method throws an error, if
	 * the value to be converted is too large or too small.
	 * @param integer The number to initialize the new instances value with.
	 * @returns A new instance.
	 * @override
	 */
	public static fromInteger(integer: number): Address {
		if (!Number.isInteger(integer)) {
			throw new Error("Given number is not an integer.");
		}

		if (integer < 0) {
			throw new Error("Minimal value for an address is a decimal zero, but the given integer is smaller than zero.");
		}

		if (integer > Address.MAX_NUMBER_UNSIGNED_DEC) {
			throw new Error(`The given number cannot be expressed with ${DataSizes.DOUBLEWORD} bits.`);
		}

		const address: Address = new Address();
		const binaryNumber = integer.toString(2).padStart(DataSizes.DOUBLEWORD, "0");

		binaryNumber.split("").forEach((bit, index) => {
			address._value[index] = (bit === "0") ? 0 : 1;
		});

		return address;
	}
};