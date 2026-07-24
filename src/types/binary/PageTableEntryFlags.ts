import { Bit } from "./Bit";
import { FrameNumber } from "./FrameNumber";
import { PageTableEntry } from "./PageTableEntry";

export type PageTableEntryFlags = number & { __brand: "PageTableEntryFlags" };

export namespace PageTableEntryFlags {

    export const MAX_POSITIVE_NUMBER: number = 2**12 - 1;
    export const MAX_NEGATIVE_NUMBER: number = -(2**11);
    export const NUMBER_OF_BITS: number = 12;

    export type PageTableEntryFlagsBitIndex =
		| 0 | 1 | 2  | 3  | 4  | 5  | 6  | 7
		| 8 | 9 | 10 | 11;


    export const enum FlagBits {
        
        PRESENT = 0,
        WRITABLE = 1,
        EXECUTABLE = 2,
        MODE = 3,
        PINNED = 4,
        CHANGED = 5
        
    }

    /**
     * This method creates the PageTableEntryFlags from a number.
	 * @param number 
     * @returns
     */
    export function fromNumber(number: number): PageTableEntryFlags {
        return (number & MAX_POSITIVE_NUMBER) as PageTableEntryFlags;
    }

	/**
     * This method creates the PageTableEntryFlags from a PageTableEntry.
	 * @param pageTableEntry 
     * @returns
     */
    export function fromPageTableEntry(pageTableEntry: PageTableEntry): PageTableEntryFlags {
        return ((pageTableEntry >>> FrameNumber.NUMBER_OF_BITS) & MAX_POSITIVE_NUMBER) as PageTableEntryFlags;
    }

    /**
     * This method gets a bit at a specified index, were index 0 is MSB and Index size - 1 is LSB.
     * @param flags
     * @param index The position of the bit to get.
     * @returns 
     */
    export function getBit(flags: PageTableEntryFlags, index: PageTableEntryFlagsBitIndex): Bit {
        return ((flags >>> (NUMBER_OF_BITS - 1 - index)) & 1) as Bit;
    }


	/**
	 * This method sets the bit at a specified index to the passed bit value, were index 0 is MSB and Index size - 1 is LSB.
	 * @param flags
	 * @param index The position of the bit to set.
	 * @param bit The binary value to set the bit to.
	 * @returns 
	 */
	export function setBit(flags: PageTableEntryFlags, index: PageTableEntryFlagsBitIndex, bit: Bit): PageTableEntryFlags {
		const mask = 1 << (NUMBER_OF_BITS - 1 - index); 
		return (bit === 0 ? flags & ~mask : flags | mask) as PageTableEntryFlags;
	}

	/**
	 * Retrun if Page Table is present
	 * @param flags 
	 * @returns 
	 */
    export function isPresent(flags: PageTableEntryFlags): boolean {
		return getBit(flags, FlagBits.PRESENT) === 1;
	}

	/**
	 * Retrun the present bit
	 * @param flags 
	 * @returns 
	 */
    export function getPresentFlagBit(flags: PageTableEntryFlags): Bit {
		return getBit(flags, FlagBits.PRESENT);
	}

	/**
	 * Sets the present bit
	 * @param flags 
	 * @param bit 
	 * @returns 
	 */
    export function setPresentFlagBit(flags: PageTableEntryFlags, bit: Bit): PageTableEntryFlags {
		return setBit(flags, FlagBits.PRESENT, bit);
	}

	/**
	 * Retrun if Page Table is writable
	 * @param flags 
	 * @returns 
	 */
    export function isWritable(flags: PageTableEntryFlags): boolean {
		return getBit(flags, FlagBits.WRITABLE) === 1;
	}

	/**
	 * Retrun the writable bit
	 * @param flags 
	 * @returns 
	 */
    export function getWritaleFlagBit(flags: PageTableEntryFlags): Bit {
		return getBit(flags, FlagBits.WRITABLE);
	}

	/**
	 * Sets the writable bit
	 * @param flags 
	 * @param bit 
	 * @returns 
	 */
    export function setWritableFlagBit(flags: PageTableEntryFlags, bit: Bit): PageTableEntryFlags {
		return setBit(flags, FlagBits.WRITABLE, bit);
	}

	/**
	 * Retrun if Page Table is executable
	 * @param flags 
	 * @returns 
	 */
    export function isExecutable(flags: PageTableEntryFlags): boolean {
		return getBit(flags, FlagBits.EXECUTABLE) === 1;
	}

	/**
	 * Retrun the executable bit
	 * @param flags 
	 * @returns 
	 */
    export function getExecutableFlagBit(flags: PageTableEntryFlags): Bit {
		return getBit(flags, FlagBits.EXECUTABLE);
	}

	/**
	 * Sets the executable bit
	 * @param flags 
	 * @param bit 
	 * @returns 
	 */
    export function setExecutableFlagBit(flags: PageTableEntryFlags, bit: Bit): PageTableEntryFlags {
		return setBit(flags, FlagBits.EXECUTABLE, bit);
	}

	/**
	 * Retrun if Page Table is only accesible in kernel mode
	 * @param flags 
	 * @returns 
	 */
    export function isKernelModeOnly(flags: PageTableEntryFlags): boolean {
		return getBit(flags, FlagBits.MODE) === 1;
	}
	
	/**
	 * Retrun the mode bit
	 * @param flags 
	 * @returns 
	 */
    export function getModeFlagBit(flags: PageTableEntryFlags): Bit {
		return getBit(flags, FlagBits.MODE);
	}

	/**
	 * Sets the mode bit
	 * @param flags 
	 * @param bit 
	 * @returns 
	 */
    export function setModeFlagBit(flags: PageTableEntryFlags, bit: Bit): PageTableEntryFlags {
		return setBit(flags, FlagBits.MODE, bit);
	}

	/**
	 * Retrun if Page Table is pinned
	 * @param flags 
	 * @returns 
	 */
    export function isPinned(flags: PageTableEntryFlags): boolean {
		return getBit(flags, FlagBits.PINNED) === 1;
	}

	/**
	 * Retrun the pinned bit
	 * @param flags 
	 * @returns 
	 */
    export function getPinnedFlagBit(flags: PageTableEntryFlags): Bit {
		return getBit(flags, FlagBits.PINNED);
	}

	/**
	 * Sets the pinned bit
	 * @param flags 
	 * @param bit 
	 * @returns 
	 */
    export function setPinnedFlagBit(flags: PageTableEntryFlags, bit: Bit): PageTableEntryFlags {
		return setBit(flags, FlagBits.PINNED, bit);
	}

	/**
	 * Retrun if Page Table has changed
	 * @param flags 
	 * @returns 
	 */
    export function hasChanged(flags: PageTableEntryFlags): boolean {
		return getBit(flags, FlagBits.CHANGED) === 1;
	}

	/**
	 * Retrun the changed bit
	 * @param flags 
	 * @returns 
	 */
    export function getChangedFlagBit(flags: PageTableEntryFlags): Bit {
		return getBit(flags, FlagBits.CHANGED);
	}

	/**
	 * Sets the changed bit
	 * @param flags 
	 * @param bit 
	 * @returns 
	 */
    export function setChangedFlagBit(flags: PageTableEntryFlags, bit: Bit): PageTableEntryFlags {
		return setBit(flags, FlagBits.CHANGED, bit);
	}
}