import { Bit } from "./Bit";
import { Byte } from "./Byte";

export type Word = number & { __brand: "Word" };

export namespace Word {

	export const SIZE: number = 2**16;
	export const MAX_POSITIVE_NUMBER: number = 2**16 - 1;
	export const MAX_NEGATIVE_NUMBER: number = -(2**15);
	export const NUMBER_OF_BITS: number = 16;
	export const NUMBER_OF_BYTES: number = 2;

	export const ZERO: Word = 0 as Word;

	export type BitIndex =
		| 0 | 1 | 2  | 3  | 4  | 5  | 6  | 7
		| 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
	export type BitCount =
	    | 1 | 2  | 3  | 4  | 5  | 6  | 7  | 8 
		| 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

	/**
	 * This method creates a Word from a number.
	 * @param number 
	 * @returns
	 */
	export function fromNumber(number: number): Word {
		return (number & MAX_POSITIVE_NUMBER) as Word;
	}

	/**
	 * This method creates a Word from bytes.
	 * @param high 
	 * @param low 
	 * @returns
	 */
	export function fromBytes(high: Byte, low: Byte): Word {
		return ((high << Byte.NUMBER_OF_BITS) | low) as Word;   
	}

	/**
	 * This method returns the least significant bit of this value.
	 * @param word 
	 * @returns The least significant bit.
	 */
	export function getLeastSignificantBit(word: Word): Bit {
		return (word & 1) as Bit;
	}

	/**
	 * This method returns the most significant bit of this value.
	 * @param word 
	 * @returns The most significant bit.
	 */
	export function getMostSignificantBit(word: Word): Bit {
		return ((word >>> (NUMBER_OF_BITS - 1)) & 1) as Bit;
	}

	/**
	 * This method returns the last bits of the binary value.
	 * @param word 
	 * @param count Amount of bits to include
	 * @returns 
	 */
	export function getLeastSignificantBits(word: Word, count: BitCount): Word {
		return (word & ((1 << count) - 1)) as Word;
	}

	/**
	 * This method returns the first bits of the binary value.
	 * @param word 
	 * @param count Amount of bits to include
	 * @returns 
	 */
	export function getMostSignificantBits(word: Word, count: BitCount): Word {
		return ((word >>> (NUMBER_OF_BITS - count)) & ((1 << count) - 1)) as Word;
	}    

	/**
	 * This method gets a bit at a specified index, were index 0 is MSB and Index size - 1 is LSB.
	 * @param word
	 * @param index The position of the bit to get.
	 * @returns 
	 */
	export function getBit(word: Word, index: BitIndex): Bit {
		return ((word >>> (NUMBER_OF_BITS - 1 - index)) & 1) as Bit;
	}

	/**
	 * This method gets a range of bits from a specified start index
	 * @param word
	 * @param start The zero-based index number indicating the beginning of the range.
	 * @param end Zero-based index number indicating the end of the range. The range includes the bit up to, but not including, the bit indicated by end.
	 * @returns 
	 */
	export function getBitRange(word: Word, start: BitIndex, end: BitIndex | 16 = NUMBER_OF_BITS as 16): Word {
		return ((word >>> (NUMBER_OF_BITS - end)) & ((1 << (end - start)) - 1)) as Word;
	}

	/**
	 * This method gets a range of bits from a specified start index
	 * @param word
	 * @param start The zero-based index number indicating the beginning of the range.
	 * @param count Number of bits to include after start
	 * @returns 
	 */
	export function getBitsStartingAt(word: Word, start: BitIndex, count: BitCount = 1): Word {
		const end = start + count;
		return ((word >>> (NUMBER_OF_BITS - end)) & ((1 << (end - start)) - 1)) as Word;
	}

	/**
	 * This method sets the bit at a specified index to the passed bit value, were index 0 is MSB and Index size - 1 is LSB.
	 * @param word
	 * @param index The position of the bit to set.
	 * @param bit The binary value to set the bit to.
	 * @returns 
	 */
	export function setBit(word: Word, index: BitIndex, bit: Bit): Word {
		const mask = 1 << (NUMBER_OF_BITS - 1 - index); 
		return (bit === 0 ? word & ~mask : word | mask) as Word;
	}

	/**
	 * This method gets the upper Byte
	 * @param word
	 * @returns 
	 */
	export function getUpperByte(word: Word): Byte {
		return Byte.fromNumber(word >>> Byte.NUMBER_OF_BITS);
	} 

	/**
	 * This method gets the lower Byte
	 * @param word
	 * @returns 
	 */
	export function getLowerByte(word: Word): Byte {
		return Byte.fromNumber(word);
	} 

	/**
     * This method performs a logical shift on the given Word one bit to the right.
     * @param operand The operand to perform a right shift on.
     * @returns [result, shifted out bit]
     */
	export function logicalRightShift(operand: Word): [Word, Bit] {
		const removedBit: Bit = Word.getLeastSignificantBit(operand);
        operand = operand >>> 1 as Word;
		return [operand, removedBit];
	}

	/**
	 * This method performs an arithmetic shift on the given Word one bit to the right.
	 * @param operand The operand to perform a right shift on.
	 * @returns [result, shifted out bit]
	 */
	export function arithmeticRightShift(operand: Word): [Word, Bit] {
		const removedBit: Bit = Word.getLeastSignificantBit(operand);
		const msb: Bit = Word.getMostSignificantBit(operand);
        // Arithmetic right shift by 1
        operand = operand >>> 1 as Word;
        operand = Word.setBit(operand, 0, msb);
		return [operand, removedBit];
    }

    /**
     * This method performs an logical shift on the given Word one bit to the left.
     * @param operand The operand to perform a left shift on.
     * @returns [result, shifted out bit]
     */
    export function leftShift(operand: Word): [Word, Bit] {
		const removedBit: Bit = Word.getMostSignificantBit(operand);
        operand = Word.fromNumber(operand << 1);
		return [operand, removedBit];
    }
}