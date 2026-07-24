import { FrameNumber } from "./FrameNumber";
import { PageTableEntryFlags } from "./PageTableEntryFlags";


export type PageTableEntry = number & { __brand: "DoubleWord" & "PageTableEntry" };

export namespace PageTableEntry {

	export const NUMBER_OF_BITS: number = 32;

    /**
     * This method creates a PageTableEntry from flags and a frame number.
	 * @param flags
     * @param frameNumber  
     * @returns
     */
    export function fromFlagAndFrameNumber(flags: PageTableEntryFlags, frameNumber: FrameNumber): PageTableEntry {
        return ((flags << FrameNumber.NUMBER_OF_BITS) | frameNumber) >>> 0 as PageTableEntry;
    }

    /**
     * This method gets the flags 
     * @returns
     */
    export function getFlags(entry: PageTableEntry): PageTableEntryFlags {
        return PageTableEntryFlags.fromPageTableEntry(entry);
    }

    /**
     * This method gets the frame number 
     * @returns
     */
    export function getFrameNumber(entry: PageTableEntry): FrameNumber {
        return FrameNumber.fromPageTableEntry(entry);
    }
}