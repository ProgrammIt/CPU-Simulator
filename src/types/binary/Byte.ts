import { Bit } from "./Bit";

export type Byte = number & { __brand: "Byte" };

export namespace Byte {

    export const SIZE: number = 2**8;
    export const MAX_POSITIVE_NUMBER: number = 2**8 - 1;
	export const MAX_NEGATIVE_NUMBER: number = -(2**7);
	export const NUMBER_OF_BITS: number = 8;

	export const ZERO: Byte = 0 as Byte;

    export type BitIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    export type BitCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

    /**
     * This method creates a Byte from a number.
     * @param number 
     * @returns
     */
    export function fromNumber(number: number): Byte {
        return (number & MAX_POSITIVE_NUMBER) as Byte;
    }

    /**
     * This method returns the least significant bit of this value.
     * @param byte 
     * @returns The least significant bit.
     */
    export function getLeastSignificantBit(byte: Byte): Bit {
        return (byte & 1) as Bit;
    }

    /**
     * This method returns the most significant bit of this value.
     * @param byte 
     * @returns The most significant bit.
     */
    export function getMostSignificantBit(byte: Byte): Bit {
        return ((byte >>> (NUMBER_OF_BITS - 1)) & 1) as Bit;
    }

    /**
     * This method returns the last bits of the binary value.
     * @param byte 
     * @param count Amount of bits to include
     * @returns 
     */
    export function getLeastSignificantBits(byte: Byte, count: BitCount): Byte {
        return (byte & ((1 << count) - 1)) as Byte;
    }

    /**
     * This method returns the first bits of the binary value.
     * @param byte 
     * @param count Amount of bits to include
     * @returns 
     */
    export function getMostSignificantBits(byte: Byte, count: BitCount): Byte {
        return ((byte >>> (NUMBER_OF_BITS - count)) & ((1 << count) - 1)) as Byte;
    }    

    /**
     * This method gets a bit at a specified index, were index 0 is MSB and Index size - 1 is LSB.
     * @param byte
     * @param index The position of the bit to get.
     * @returns 
     */
    export function getBit(byte: Byte, index: BitIndex): Bit {
        return ((byte >>> (NUMBER_OF_BITS - 1 - index)) & 1) as Bit;
    }

    /**
     * This method gets a range of bits from a specified start index
     * @param byte
     * @param start The zero-based index number indicating the beginning of the range.
     * @param end Zero-based index number indicating the end of the range. The range includes the bit up to, but not including, the bit indicated by end.
     * @returns 
     */
    export function getBitRange(byte: Byte, start: BitIndex, end: BitIndex | 8 = NUMBER_OF_BITS as 8): Byte {
        return ((byte >>> (NUMBER_OF_BITS - end)) & ((1 << (end - start)) - 1)) as Byte;
    }

    /**
     * This method gets a range of bits from a specified start index
     * @param byte
     * @param start The zero-based index number indicating the beginning of the range.
     * @param count Number of bits to include after start
     * @returns 
     */
    export function getBitsStartingAt(byte: Byte, start: BitIndex, count: BitCount = 1): Byte {
        const end = start + count;
        return ((byte >>> (NUMBER_OF_BITS - end)) & ((1 << (end - start)) - 1)) as Byte;
    }

    /**
     * This method sets the bit at a specified index to the passed bit value, were index 0 is MSB and Index size - 1 is LSB.
     * @param byte
     * @param index The position of the bit to set.
     * @param bit The binary value to set the bit to.
     * @returns 
     */
    export function setBit(byte: Byte, index: BitIndex, bit: Bit): Byte {
        const mask = 1 << (NUMBER_OF_BITS - 1 - index); 
        return (bit === 0 ? byte & ~mask : byte | mask) as Byte;
    }

    /**
     * This method performs a logical shift on the given Byte one bit to the right.
     * @param operand The operand to perform a right shift on.
     * @returns [result, shifted out bit]
     */
	export function logicalRightShift(operand: Byte): [Byte, Bit] {
		const removedBit: Bit = Byte.getLeastSignificantBit(operand);
        operand = operand >>> 1 as Byte;
		return [operand, removedBit];
	}

	/**
	 * This method performs an arithmetic shift on the given Byte one bit to the right.
	 * @param operand The operand to perform a right shift on.
	 * @returns [result, shifted out bit]
	 */
	export function arithmeticRightShift(operand: Byte): [Byte, Bit] {
		const removedBit: Bit = Byte.getLeastSignificantBit(operand);
		const msb: Bit = Byte.getMostSignificantBit(operand);
        // Arithmetic right shift by 1
        operand = operand >>> 1 as Byte;
        operand = Byte.setBit(operand, 0, msb);
		return [operand, removedBit];
    }

    /**
     * This method performs an logical shift on the given Byte one bit to the left.
     * @param operand The operand to perform a left shift on.
     * @returns [result, shifted out bit]
     */
    export function leftShift(operand: Byte): [Byte, Bit] {
		const removedBit: Bit = Byte.getMostSignificantBit(operand);
        operand = Byte.fromNumber(operand << 1);
		return [operand, removedBit];
    }
}


