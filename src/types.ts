import { Doubleword } from "./types/Doubleword";
import { VirtualAddress } from "./types/VirtualAddress";

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
 * This class represents a decoded (non-binary) instruction, ready for execution.
 */
export class DecodedInstruction {
	/**
	 * The instructions type.
	 */
	public type: InstructionTypes;
	
	/**
	 * The instructions operation.
	 */
	public operation: Operations;

	/**
	 * A list of the operations operands or undefined, if no operand is present.
	 */
	public operands: [InstructionOperand, InstructionOperand | undefined] | undefined;

	/**
	 * The operations target. Or in other words: where to put the result.
	 * This member holds either a register, an virtual memory address or a undefined value, if there
	 * is no target defined.
	 */
	public target: Registers | VirtualAddress | undefined;

	/**
	 * Constructs a new instance from the given arguments.
	 * @param type The instructions type.
	 * @param operation The instructions operation.
	 */
    public constructor(type: InstructionTypes, operation: Operations) {
        this.type = type;
        this.operation = operation;
        this.operands = undefined;
        this.target = undefined;
    }
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
	public readonly value: Doubleword;

	/**
	 * Creates a new instance from the given arguments.
	 * @param addressingMode The operands addressing mode.
	 * @param type The operands type.
	 * @param value The operands value in binary representation.
	 * @constructor
	 */
    public constructor(addressingMode: AddressingModes, type: OperandTypes, value: Doubleword) {
        this.addressingMode = addressingMode;
        this.type = type;
        this.value = value;
    }
}