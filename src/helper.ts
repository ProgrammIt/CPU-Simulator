import { BINARY_DATA_REGEX, HEX_DATA_REGEX } from "./constants";

/**
 * This method converts a given memory address in hexadecimal, binary or decimal representation 
 * to an address in binary representation.
 * @param address A hexadecimal, binary or decimal value representing a memory address.
 * @returns The binary representation of the given memory address.
 */
export function convertToBinaryAddress(address: string): string {
	var convertedValue: string = "";
	if (address.match(BINARY_DATA_REGEX)) {
		// New value gets interpreted as a binary value and passed on as is.
		convertedValue = address;
	} else if (address.match(HEX_DATA_REGEX)) {
		// New value gets interpreted as a hexadecimal value and parsed to a decimal value.
		convertedValue = parseInt(address, 16).toString(2);
	} else {
		// New value gets interpreted as a decimal value and parsed to a decimal value.
		convertedValue = parseInt(address, 10).toString(2);
	}
	return convertedValue;
}