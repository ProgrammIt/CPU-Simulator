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