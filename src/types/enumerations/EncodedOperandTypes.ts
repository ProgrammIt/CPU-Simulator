/**
 * An enum representing the available operand types and their binary codes.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export enum EncodedOperandTypes {
	NO = 0b0000,
	PADDING = 0b1000,
	EMBEDDED_IMMEDIATE = 0b0001,
	IMMEDIATE = 0b1001,
	REGISTER_DIRECT = 0b0010,
	EXTERNAL_REGISTER_DIRECT = 0b1010,
	REGISTER_INDIRECT = 0b0011,
	EXTERNAL_REGISTER_INDIRECT = 0b1011,
	EMBEDDED_MEMORY_ADDRESS = 0b0100,
	MEMORY_ADDRESS = 0b1100
}