export interface LanguageDefinition {
	instructions: Instruction[];
	addressable_registers: Register[];
}

export interface Instruction {
	mnemonic: string;
	opcode: string;
	type: string;
	regexes: string[];
}

export interface Register {
	name: string;
	aliases: string[];
	code: string;
}

export enum NumberSystem {
	HEX = 16,
	DEC = 10,
	BIN = 2
}

export enum DataSize {
	BYTE = 8,
	WORD = 16,
	DOUBLEWORD = 32,
	QUADWORD = 64
}

// export type Bit = 0 | 1;

// export type Byte = [
// 	Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit
// ];

// export type Word = [
// 	Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, 
// 	Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit
// ];

// export type Doubleword = [
// 	Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, 
// 	Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit,
// 	Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, 
// 	Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit
// ];

// export type Quadword = [
// 	Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, 
// 	Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit,
// 	Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, 
// 	Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit,
// 	Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, 
// 	Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit,
// 	Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, 
// 	Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit
// ];

// export type PhysicalAddress = Doubleword;

// export type VirtualAddress = Doubleword;

export class Bit {
	/**
	 * The binary data this object holds.
	 */
	public value: 0|1;

	/**
	 * The number of a bits the value consists of.
	 */
	public static WIDTH: number = DataSize.BYTE;

	public constructor(b: 0|1) {
		this.value = b;
	}

	/**
	 * For comparison, both binary values are converted to strings.
	 * Conversion presarves the order of items, which is important for the comparison.
	 * @param bit The binary value to compare to.
	 * @returns True, when both binary values are identical, false otherwise.
	 */
	public equal(bit: Bit): boolean {
		return bit.value.toString() === this.value.toString();
	}
}

export class Byte {
	/**
	 * The binary data this object holds.
	 */
	protected _value: Array<Bit>;

	/**
	 * The number of a bits the value consists of.
	 */
	public static WIDTH: number = DataSize.BYTE;

	public constructor() {
		this._value = new Array<Bit>(Byte.WIDTH).fill(new Bit(0));
	}

	public get value(): ReadonlyArray<Bit> {
		return this._value;
	}

	public set value(newValue: Array<Bit>) {
		if (newValue.length > DataSize.BYTE) {
			throw new Error(`The given value consists out of more than ${Byte.WIDTH} bits.`);
		}
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
}

export class Word {
	/**
	 * The binary data this object holds.
	 */
	protected _value: Array<Bit>;

	/**
	 * The number of a bits the value consists of.
	 */
	public static WIDTH: number;

	public constructor() {
		this._value = new Array<Bit>(Word.WIDTH).fill(new Bit(0));
	}

	public get value(): ReadonlyArray<Bit> {
		return this._value;
	}

	public set value(newValue: Array<Bit>) {
		if (newValue.length != DataSize.WORD) {
			throw new Error(`A new value must have exactly ${Word.WIDTH} bits.`);
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
}

export class Doubleword {
	/**
	 * The binary data this object holds.
	 */
	protected _value: Array<Bit>;

	/**
	 * The number of a bits the value consists of.
	 */
	public static WIDTH: number = DataSize.DOUBLEWORD;

	public constructor() {
		this._value = new Array<Bit>(Doubleword.WIDTH).fill(new Bit(0));		
	}

	public get value(): ReadonlyArray<Bit> {
		return this._value;
	}

	public set value(newValue: Array<Bit>) {
		if (newValue.length != DataSize.DOUBLEWORD) {
			throw new Error(`A new value must have exactly ${Doubleword.WIDTH} bits.`);
		}
		this._value = newValue;
	}

	/**
	 * For comparison, both binary values are converted to strings.
	 * Conversion presarves the order of items, which is important for the comparison.
	 * @param doubleword The binary value to compare to.
	 * @returns True, when both binary values are identical, false otherwise.
	 */
	public equal(doubleword: Doubleword): boolean {
		return doubleword._value.toString() === this._value.toString();
	}
}

/**
 * This class represents doubleword (4 byte) sized binary data.
 */
export class Address extends Doubleword {
	/**
	 * Constructs a new instance.
	 */
	public constructor() {
		super();
		this._value = new Array<Bit>(Doubleword.WIDTH);
	}

	/**
	 * This method creates an instance from the given number.
	 * Throws an error, if the given number is not an integer
	 * or can not be expressed with 32 bits.
	 * @param integer The number to initialize the new instances value with.
	 * @returns A new instance class.
	 */
	public static fromInteger(integer: number): Address {
		const doubleword = new Address();

		if (!Number.isInteger(integer)) {
			throw Error("Given number is not an integer.");
		}

		const binaryNumber: string = integer.toString(2);

		if (binaryNumber.length > DataSize.DOUBLEWORD) {
			throw new Error(`The given number cannot be expressed with ${Address.WIDTH} bits.`);
		}

		binaryNumber.split("").forEach((bit, index) => {
			doubleword._value[index] = (bit === "0") ? new Bit(0) : new Bit(1);
		});

		return doubleword;
	}

	/**
	 * Sets the address value to the given one.
	 * @param value The new value for the address.
	 */
	public set value(newValue: Array<Bit>) {
		if (newValue.length != DataSize.DOUBLEWORD) {
			throw new Error(`A new value must have exactly ${this._value} bits.`);
		}
		this._value = newValue;
	}

	/**
	 * Getter for the address value.
	 */
	public get value(): ReadonlyArray<Bit> {
		return this._value;
	}

	/**
	 * Converts the binary address value into a string representation.
	 * @returns The string representation of the binary value.
	 */
	public toString(): string {
		return this._value.join("");
	}
};

/**
 * This class represents a virtual memory address.
 */
export class VirtualAddress extends Address {
	/**
	 * Constructs a new instance.
	 */
	public constructor() {
		super();
	}
}

/**
 * This class represents a physical memory address.
 */
export class PhysicalAddress extends Address {
	/**
	 * Constructs a new instance.
	 */
	public constructor() {
		super();
	}
}