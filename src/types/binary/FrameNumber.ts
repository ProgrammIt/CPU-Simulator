import { DoubleWord } from "./DoubleWord";
import { PageTableEntry } from "./PageTableEntry";
import { PhysicalAddress } from "./PhysicalAddress";

export type FrameNumber = number & { __brand: "PageNumber" & "FrameNumber" };

export namespace FrameNumber {
    
    export const MAX_POSITIVE_NUMBER: number = 2**20 - 1;
    export const MAX_NEGATIVE_NUMBER: number = -(2**19);
    export const NUMBER_OF_BITS: number = 20;

    /**
     * This method gets the FrameNumber from a number.
     * @param number 
     * @returns
     */
    export function fromNumber(number: number): FrameNumber {
        return (number & MAX_POSITIVE_NUMBER) as FrameNumber;
    }

    /**
     * This method gets the FrameNumber from a pyhsical address.
     * @param physicalAddress 
     * @returns
     */
    export function fromPhysicalAddress(physicalAddress: PhysicalAddress): FrameNumber {
        return ((physicalAddress >> (DoubleWord.NUMBER_OF_BITS - NUMBER_OF_BITS)) & MAX_POSITIVE_NUMBER) as FrameNumber;
    }

    /**
     * This method gets the FrameNumber from a PageTableEntry.
     * @param pageTableEntry 
     * @returns
     */
    export function fromPageTableEntry(pageTableEntry: PageTableEntry): FrameNumber {
        return (pageTableEntry & MAX_POSITIVE_NUMBER) as FrameNumber;
    }
}