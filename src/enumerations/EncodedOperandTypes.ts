/**
 * An enum representing the available operand types and their binary codes.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export const enum EncodedOperandTypes {
	NO = "0000000",
	IMMEDIATE = "1010000",
	REGISTER = "1100000",
	MEMORY_ADDRESS = "1110000"
}