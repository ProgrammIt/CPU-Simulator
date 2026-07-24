import { Bit } from "./Bit";
import { Byte } from "./Byte";
import { Word } from "./Word";

export type DoubleWord = number & { __brand: "DoubleWord" & "VirtualAddress" & "PyhsicalAddress" & "PageTableEntry" };

export namespace DoubleWord {

	export const SIZE: number = 2**32;
	export const MAX_POSITIVE_NUMBER: number = 2**32 - 1;
	export const MAX_NEGATIVE_NUMBER: number = -(2**31);
	export const NUMBER_OF_BITS: number = 32;
	export const NUMBER_OF_WORDS: number = 2;
	export const NUMBER_OF_BYTES: number = 4;

	export const ZERO: DoubleWord = 0 as DoubleWord;

	export type BitIndex =
		| 0  | 1  | 2  | 3  | 4  | 5  | 6  | 7
		| 8  | 9  | 10 | 11 | 12 | 13 | 14 | 15
		| 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23
		| 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;

	export type BitCount =
	    | 1  | 2  | 3  | 4  | 5  | 6  | 7  | 8  
		| 9  | 10 | 11 | 12 | 13 | 14 | 15 | 16 
		| 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 
		| 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32;

	/**
	 * This method creates a DoubleWord from a number.
	 * @param number
	 * @returns
	 */
	export function fromNumber(number: number): DoubleWord {
		return (number & MAX_POSITIVE_NUMBER) >>> 0 as DoubleWord;
	}

	/**
	 * This method creates a DoubleWord from bytes.
	 * @param high the high word
	 * @param low the low word
	 * @returns
	 */
	export function fromWords(high: Word, low: Word): DoubleWord {
		return ((high << Word.NUMBER_OF_BITS) | low) >>> 0 as DoubleWord;   
	}

	/**
	 * This method creates a DoubleWord from bytes.
	 * @param firstByte Most Significant Byte
	 * @param secondByte 
	 * @param thirdByte 
	 * @param fourthByte Least Significant Byte
	 * @returns
	 */
	export function fromBytes(firstByte: Byte, secondByte : Byte, thirdByte : Byte, fourthByte : Byte): DoubleWord {
		return ((firstByte << (NUMBER_OF_BITS - Byte.NUMBER_OF_BITS)) | 
				(secondByte << Word.NUMBER_OF_BITS) |
				(thirdByte << Byte.NUMBER_OF_BITS) |
				fourthByte) >>> 0 as DoubleWord;   
	}

	/**
	 * This method returns the least significant bit of this value.
	 * @param doubleWord 
	 * @returns The least significant bit.
	 */
	export function getLeastSignificantBit(doubleWord: DoubleWord): Bit {
		return (doubleWord & 1) as Bit;
	}

	/**
	 * This method returns the most significant bit of this value.
	 * @param doubleWord 
	 * @returns The most significant bit.
	 */
	export function getMostSignificantBit(doubleWord: DoubleWord): Bit {
		return ((doubleWord >>> (NUMBER_OF_BITS - 1)) & 1) as Bit;
	}

	/**
	 * This method returns the last bits of the binary value.
	 * @param doubleWord 
	 * @param count Amount of bits to include
	 * @returns 
	 */
	export function getLeastSignificantBits(doubleWord: DoubleWord, count: BitCount): DoubleWord {
		return (doubleWord & (count === NUMBER_OF_BITS ? MAX_POSITIVE_NUMBER : (1 << count) - 1)) >>> 0 as DoubleWord;
	}

	/**
	 * This method returns the first bits of the binary value.
	 *  @param doubleWord 
	 * @param count Amount of bits to include
	 * @returns 
	 */
	export function getMostSignificantBits(doubleWord: DoubleWord, count: BitCount): DoubleWord {
		return ((doubleWord >>> (NUMBER_OF_BITS - count)) & (count === NUMBER_OF_BITS ? MAX_POSITIVE_NUMBER : (1 << count) - 1)) >>> 0 as DoubleWord;
	}    

	/**
	 * This method gets a bit at a specified index, were index 0 is MSB and Index size - 1 is LSB.
	 *  @param doubleWord 
	 * @param index The position of the bit to get.
	 * @returns 
	 */
	export function getBit(doubleWord: DoubleWord, index: BitIndex): Bit {
		return ((doubleWord >>> (NUMBER_OF_BITS - 1 - index)) & 1) as Bit;
	}

	/**
	 * This method gets a range of bits from a specified start index
	 *  @param doubleWord 
	 * @param start The zero-based index number indicating the beginning of the range.
	 * @param end Zero-based index number indicating the end of the range. The range includes the bit up to, but not including, the bit indicated by end.
	 * @returns 
	 */
	export function getBitRange(doubleWord: DoubleWord, start: BitIndex, end: BitIndex | 32 = NUMBER_OF_BITS as 32): DoubleWord {
		return ((doubleWord >>> (NUMBER_OF_BITS - end)) & ((end - start) === NUMBER_OF_BITS ? MAX_POSITIVE_NUMBER : (1 << (end - start)) - 1)) >>> 0 as DoubleWord;
	}

	/**
	 * This method gets a range of bits from a specified start index
	 * @param doubleWord 
	 * @param start The zero-based index number indicating the beginning of the range.
	 * @param count Number of bits to include after start
	 * @returns 
	 */
	export function getBitsStartingAt(doubleWord: DoubleWord, start: BitIndex, count: BitCount = 1): DoubleWord {
		const end = start + count;
		return ((doubleWord >>> (NUMBER_OF_BITS - end)) & ((end - start) === NUMBER_OF_BITS ? MAX_POSITIVE_NUMBER : (1 << (end - start)) - 1)) >>> 0 as DoubleWord;
	}

	/**
	 * This method sets the bit at a specified index to the passed bit value, were index 0 is MSB and Index size - 1 is LSB.
	 * @param doubleWord 
	 * @param index The position of the bit to set.
	 * @param bit The binary value to set the bit to.
	 * @returns 
	 */
	export function setBit(doubleWord: DoubleWord, index: BitIndex, bit: Bit): DoubleWord {
		const mask = 1 << (NUMBER_OF_BITS - 1 - index); 
		return (bit === 0 ? doubleWord & ~mask : doubleWord | mask) >>> 0 as DoubleWord;
	}

	/**
	 * This method gets the upper Word
	 * @param doubleWord 
	 * @returns 
	 */
	export function getUpperWord(doubleWord: DoubleWord): Word {
		return Word.fromNumber(doubleWord >>> Word.NUMBER_OF_BITS);
	} 

	/**
	 * This method gets the lower Word
	 * @param doubleWord 
	 * @returns 
	 */
	export function getLowerWord(doubleWord: DoubleWord): Word {
		return Word.fromNumber(doubleWord);
	} 



	/**
	 * This method gets the first Byte (Most Significant Byte)
	 * @param doubleWord 
	 * @returns 
	 */
	export function getFirstByte(doubleWord: DoubleWord): Byte {
		return Byte.fromNumber(doubleWord >>> (Word.NUMBER_OF_BITS + Byte.NUMBER_OF_BITS));
	} 

	/**
	 * This method gets the second Byte
	 * @param doubleWord 
	 * @returns 
	 */
	export function getSecondByte(doubleWord: DoubleWord): Byte {
		return Byte.fromNumber(doubleWord >>> Word.NUMBER_OF_BITS);
	} 

	/**
	 * This method gets the third Byte
	 * @param doubleWord 
	 * @returns 
	 */
	export function getThirdByte(doubleWord: DoubleWord): Byte {
		return Byte.fromNumber(doubleWord >>> Byte.NUMBER_OF_BITS);
	} 

	/**
	 * This method gets the fourth Byte (Least Significant Byte)
	 * @param doubleWord 
	 * @returns 
	 */
	export function getFourthByte(doubleWord: DoubleWord): Byte {
		return Byte.fromNumber(doubleWord);
	} 

	/**
     * This method performs a logical shift on the given DoubleWord one bit to the right.
     * @param operand The operand to perform a right shift on.
     * @returns [result, shifted out bit]
     */
	export function logicalRightShift(operand: DoubleWord): [DoubleWord, Bit] {
		const removedBit: Bit = (operand & 1) as Bit;
		return [(operand >>> 1) >>> 0 as DoubleWord, removedBit];
	}

	/**
	 * This method performs an arithmetic shift on the given DoubleWord one bit to the right.
	 * @param operand The operand to perform a right shift on.
	 * @returns [result, shifted out bit]
	 */
	export function arithmeticRightShift(operand: DoubleWord): [DoubleWord, Bit] {
		const removedBit: Bit = (operand & 1) as Bit;
		return [(operand >> 1) >>> 0 as DoubleWord, removedBit];
    }

    /**
     * This method performs an logical shift on the given DoubleWord one bit to the left.
     * @param operand The operand to perform a right left on.
     * @returns [result, shifted out bit]
     */
    export function leftShift(operand: DoubleWord): [DoubleWord, Bit] {
		const removedBit: Bit = DoubleWord.getMostSignificantBit(operand);
        operand = DoubleWord.fromNumber(operand << 1);
		return [operand, removedBit];
    }
}