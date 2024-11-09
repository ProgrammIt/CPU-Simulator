import { BINARY_DATA_REGEX, HEX_DATA_REGEX } from "./constants";

/**
 * This method converts a given memory address in hexadecimal, binary or decimal representation 
 * to an address in binary representation.
 * @param value A hexadecimal, binary or decimal value representing a memory address.
 * @returns The binary representation of the given memory address.
 */
export function convertToBinaryValue(value: string): string {
	var convertedValue: string = "";
	if (value.match(BINARY_DATA_REGEX)) {
		// New value gets interpreted as a binary value and passed on as is.
		convertedValue = value;
	} else if (value.match(HEX_DATA_REGEX)) {
		// New value gets interpreted as a hexadecimal value and parsed to a decimal value.
		convertedValue = parseInt(value, 16).toString(2);
	} else {
		// New value gets interpreted as a decimal value and parsed to a decimal value.
		convertedValue = parseInt(value, 10).toString(2);
	}
	return convertedValue;
}