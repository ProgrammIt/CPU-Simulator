/**
 * An enum representing the available operand types and their binary codes.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export enum EncodedOperandTypes {
	NO = "0000000",
	IMMEDIATE = "1010000",
	REGISTER = "1100000",
	MEMORY_ADDRESS = "1110000"
}

export function encodedOperandTypesNameByValue(value: string): string {
	for (const [key, val] of Object.entries(EncodedOperandTypes)) {
		if (val === value) {
			return key;
		}
	}
	return "UNKNOWN"
}