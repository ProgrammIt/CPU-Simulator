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

	/**
	 * Instantiates a new object with the given binary value.
	 * @param b A binary value of 0 or 1.
	 * @constructor
	 */
	public constructor(b: 0|1) {
		this.value = b;
	}

	/**
	 * Converts the binary value into a string representation.
	 * @returns 
	 */
	public toString(): string {
		return this.value.toString();
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

	/**
	 * Instantiates a new object.
	 * @constructor
	 */
	public constructor() {
		this._value = new Array<Bit>(Byte.WIDTH).fill(new Bit(0));
	}

	public get value(): ReadonlyArray<Bit> {
		return this._value;
	}

	public set value(newValue: Array<Bit>) {
		if (newValue.length > Byte.WIDTH) {
			throw new Error(`The given value consists out of more than ${Byte.WIDTH} bits.`);
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
	 * This method creates an instance from the given number.
	 * Throws an error, if the given number is not an integer
	 * or can not be expressed with 32 bits.
	 * @param integer The number to initialize the new instances value with.
	 * @returns A new instance class.
	 * @override
	 */
	public static fromInteger(integer: number): Byte {
		const byte = new Byte();

		if (!Number.isInteger(integer)) {
			throw Error("Given number is not an integer.");
		}

		var binaryNumber: string = integer.toString(2);

		if (binaryNumber.length > Byte.WIDTH) {
			throw new Error(`The given number cannot be expressed with ${Byte.WIDTH} bits.`);
		}

		if (binaryNumber.length < Byte.WIDTH) {
			binaryNumber = binaryNumber.padStart(Byte.WIDTH, "0");
		}

		binaryNumber.split("").forEach((bit, index) => {
			byte._value[index] = (bit === "0") ? new Bit(0) : new Bit(1);
		});

		return byte;
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
	public static WIDTH: number = DataSize.WORD;

	/**
	 * Instantiates a new object.
	 * @constructor
	 */
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

	/**
	 * Converts the binary value into a string representation.
	 * @returns 
	 */
	public toString(): string {
		return this._value.join("");
	}

	/**
	 * This method creates an instance from the given number.
	 * Throws an error, if the given number is not an integer
	 * or can not be expressed with 32 bits.
	 * @param integer The number to initialize the new instances value with.
	 * @returns A new instance class.
	 * @override
	 */
	public static fromInteger(integer: number): Word {
		const word = new Word();

		if (!Number.isInteger(integer)) {
			throw Error("Given number is not an integer.");
		}

		var binaryNumber: string = integer.toString(2);

		if (binaryNumber.length > Word.WIDTH) {
			throw new Error(`The given number cannot be expressed with ${Word.WIDTH} bits.`);
		}

		if (binaryNumber.length < Word.WIDTH) {
			binaryNumber = binaryNumber.padStart(Word.WIDTH, "0");
		}

		binaryNumber.split("").forEach((bit, index) => {
			word._value[index] = (bit === "0") ? new Bit(0) : new Bit(1);
		});

		return word;
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

	/**
	 * Instantiates a new object.
	 * @constructor
	 */
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

	/**
	 * Converts the binary value into a string representation.
	 * @returns 
	 */
	public toString(): string {
		return this._value.join("");
	}

	/**
	 * This method creates an instance from the given number.
	 * Throws an error, if the given number is not an integer
	 * or can not be expressed with 32 bits.
	 * @param integer The number to initialize the new instances value with.
	 * @returns A new instance.
	 */
	public static fromInteger(integer: number): Doubleword {
		const doubleword = new Doubleword();

		if (!Number.isInteger(integer)) {
			throw Error("Given number is not an integer.");
		}

		var binaryNumber: string = integer.toString(2);

		if (binaryNumber.length > Doubleword.WIDTH) {
			throw new Error(`The given number cannot be expressed with ${Doubleword.WIDTH} bits.`);
		}

		if (binaryNumber.length < Doubleword.WIDTH) {
			binaryNumber = binaryNumber.padStart(Doubleword.WIDTH, "0");
		}

		binaryNumber.split("").forEach((bit, index) => {
			doubleword._value[index] = (bit === "0") ? new Bit(0) : new Bit(1);
		});

		return doubleword;
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
		const address = new Address();

		if (!Number.isInteger(integer)) {
			throw Error("Given number is not an integer.");
		}

		var binaryNumber: string = integer.toString(2);

		if (binaryNumber.length > Address.WIDTH) {
			throw new Error(`The given number cannot be expressed with ${Address.WIDTH} bits.`);
		}

		if (binaryNumber.length < Address.WIDTH) {
			binaryNumber = binaryNumber.padStart(Address.WIDTH, "0");
		}

		binaryNumber.split("").forEach((bit, index) => {
			address._value[index] = (bit === "0") ? new Bit(0) : new Bit(1);
		});

		return address;
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

/**
 * An enum representing the available and binary encoded registers.
 */
export const enum Registers {
	EAX = "00000000000000000000000000000000",
	EBX = "00000000000000000000000000000001",
	EIP = "00000000000000000000000000000010",
	EIR = "00000000000000000000000000000011",
	NPTP = "00000000000000000000000000000100",
	VMPTR = "00000000000000000000000000000101",
	ESP = "00000000000000000000000000000110",
	ITP = "00000000000000000000000000000111",
	GPTP = "00000000000000000000000000001000"
}

/**
 * An enum representing the available and binary encoded addressing modes of operands.
 */
export const enum AddressingModes {
	DIRECT = "10",
	INDIRECT = "11"
}

/**
 * An enum representing the available and binary encoded operand types.
 */
export const enum OperandTypes {
	NO = "0000000",
	CONSTANT = "1010000",
	REGISTER = "1100000",
	MEMORY_ADDRESS = "1110000"
}

/**
 * An enum representing the available and binary encoded instruction types.
 */
export const enum InstructionTypes {
	R = "100",
	I = "110",
	J = "111"
}

/**
 * An enum representing the available and binary encoded operations.
 */
export const enum Operations {
	ADD = "0000000",
	ADC = "0000001",
	SUB = "0000010",
	SBB = "0000011",
	MUL = "0000100",
	DIV = "0000101",
	NEG = "0000110",
	CMP = "0000111",
	TEST = "0001000",
	JMP = "0001001",
	JZ = "0001010",
	JE = "0001011",
	JNZ = "0001100",
	JNE = "0001101",
	JG = "0001110",
	JGE = "0001111",
	JL = "0010000",
	JLE = "0010001",
	MOV = "0010010",
	LEA = "0010011",
	POPF = "0010100",
	PUSHF = "0010101",
	CLC = "0010110",
	CMC = "0010111",
	STC = "0011000",
	CLI = "0011001",
	STI = "0011010",
	INT = "0011011",
	IRET = "0011100",
	AND = "0011101",
	OR = "0011110",
	XOR = "0011111",
	NOT = "0100000",
	CALL = "0100001",
	RET = "0100010",
	POP = "0100011",
	PUSH = "0100100",
	SYSENTER = "0100101",
	SYSEXIT = "0100110",
	NOP = "1111111"
}

/**
 * A class representing a decoded (non-binary) operand of an instruction.
 */
export class InstructionOperand {
	/**
	 * The operands addressing mode. Can be either direct or indirect. Indirect mode is only valid for registers.
	 * @readonly
	 */
	public readonly addressingMode: AddressingModes;

	/**
	 * The operands type. Can be either a constant/immediate, a memory address or a register.
	 * @readonly
	 */
	public readonly type: OperandTypes;

	/**
	 * The operands value in decimal, hexadecimal and binary representation.
	 * @readonly
	 */
	public readonly value: {
		binary: string,
		hex: string,
		dec: number
	};

	/**
	 * Creates a new instance from the given arguments.
	 * @param addressingMode The operands addressing mode.
	 * @param type The operands type.
	 * @param value The operands value in decimal, hexadecimal and binary representation.
	 * @constructor
	 */
    public constructor(addressingMode: AddressingModes, type: OperandTypes, value: {binary: string, hex: string, dec: number}) {
        this.addressingMode = addressingMode;
        this.type = type;
        this.value = value;
    }
}