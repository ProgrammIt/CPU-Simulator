import { Bit } from "./Bit";
import { DataSizes } from "../enumerations/DataSizes";
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
		super(new Array<Bit>(
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
			0, 0, 0, 0,
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
		if (newValue.length != DataSizes.DOUBLEWORD) {
			throw new Error(`A new value must have exactly ${this._value.length} bits.`);
		}
		this._value = newValue.slice();
	}

	/**
	 * This method creates an instance from the given number.
	 * Throws an error, if the given number is not an integer.
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
		for (let bit = 0; bit < this.NUMBER_OF_BITS_DEC; bit++) {
			const bitValue = Address.POWER_OF_N_LOOKUP_TABLE[this.NUMBER_OF_BITS_DEC - 1 - bit]
			if (integer >= bitValue) {
				address._value[bit] = 1;
				integer -= bitValue
			}
		}
		return address;
	}
	static POWER_OF_N_LOOKUP_TABLE: number[] = [1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072,262144,524288,1048576,2097152,4194304,8388608,16777216,33554432,67108864,134217728,268435456,536870912,1073741824,2147483648];
}