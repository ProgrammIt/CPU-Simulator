/**
 * An enum representing the available operations and their binary codes.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export enum EncodedOperations {
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
	DEV = "0100111",
	NOP = "1111111"
}


export function encodedOperationNameByValue(value: string): string {
	for (const [key, val] of Object.entries(EncodedOperations)) {
		if (val === value) {
			return key;
		}
	}
	return "UNKNOWN"
}