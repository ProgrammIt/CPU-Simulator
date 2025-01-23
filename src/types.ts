export enum OperandTypes {
	IMMEDIATE = "IMMEDIATE",
	REGISTER = "REGISTER",
	MEMORY_ADDRESS = "MEMORY_ADDRESS"
}

/**
 * An enum representing the accessable and binary encoded registers.
 */
export const enum EncodedAccessableRegisters {
	EAX = "00000000000000000000000000000000",
	EBX = "00000000000000000000000000000001",
	EDX = "00000000000000000000000000000010",
	EIP = "00000000000000000000000000000011",
	EIR = "00000000000000000000000000000100",
	NPTP = "00000000000000000000000000000101",
	VMPTR = "00000000000000000000000000000110",
	ESP = "00000000000000000000000000000111",
	ITP = "00000000000000000000000000001000",
	GPTP = "00000000000000000000000000001001"
}

/**
 * An enum representing the writable and binary encoded registers.
 */
export const enum EncodedWritableRegisters {
	EAX = "00000000000000000000000000000000",
	EBX = "00000000000000000000000000000001",
	EDX = "00000000000000000000000000000010",
	EIP = "00000000000000000000000000000011",
	NPTP = "00000000000000000000000000000101",
	VMPTR = "00000000000000000000000000000110",
	ESP = "00000000000000000000000000000111",
	ITP = "00000000000000000000000000001000",
	GPTP = "00000000000000000000000000001001"
}

/**
 * An enum representing the available and binary encoded addressing modes of operands.
 */
export const enum EncodedAddressingModes {
	DIRECT = "10",
	INDIRECT = "11"
}

/**
 * An enum representing the available and binary encoded operand types.
 */
export const enum EncodedOperandTypes {
	NO = "0000000",
	IMMEDIATE = "1010000",
	REGISTER = "1100000",
	MEMORY_ADDRESS = "1110000"
}

/**
 * An enum representing the available and binary encoded instruction types.
 */
export const enum EncodedInstructionTypes {
	R = "100",
	I = "110",
	J = "111"
}

/**
 * An enum representing the available and binary encoded operations.
 */
export const enum EncodedOperations {
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