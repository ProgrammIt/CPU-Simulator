import { FrameNumber } from "./FrameNumber";
import { FrameOffset } from "./FrameOffset";
import { PageOffset } from "./PageOffset";
import { PageTableEntry } from "./PageTableEntry";
import { VirtualAddress } from "./VirtualAddress";

export type PhysicalAddress = number & { __brand: "DoubleWord" & "VirtualAddress" & "PhysicalAddress" };

export namespace PhysicalAddress {
    
    export const MAX_POSITIVE_NUMBER: number = 2**32 - 1;
    export const MAX_NEGATIVE_NUMBER: number = -(2**31);
    export const NUMBER_OF_BITS: number = 32;

    export const ZERO: PhysicalAddress = 0 as PhysicalAddress;

    /**
	 * This method creates a PhysicalAddress from a number.
	 * @param number
	 * @returns
	 */
	export function fromNumber(number: number): PhysicalAddress {
		return (number & MAX_POSITIVE_NUMBER) >>> 0 as PhysicalAddress;
	}

    /**
	 * This method creates a PhysicalAddress from a number.
	 * @param number
	 * @returns
	 */
	export function fromPageTableEntryAndVirtualAddress(pageTableEntry: PageTableEntry, virtuallAddress: VirtualAddress): PhysicalAddress {
		return (FrameNumber.fromPageTableEntry(pageTableEntry) << FrameOffset.NUMBER_OF_BITS | PageOffset.fromVirtualAddress(virtuallAddress)) >>> 0 as PhysicalAddress;
	}

    /**
     * This method gets the FrameNumber from a number.
     * @param number 
     * @returns
     */
    export function getFrameNumber(physicalAddress: PhysicalAddress): FrameNumber {
        return FrameNumber.fromPhysicalAddress(physicalAddress);
    }

    /**
     * This method gets the FrameNumber from a pyhsical address.
     * @param physicalAddress 
     * @returns
     */
    export function getFrameOffset(physicalAddress: PhysicalAddress): FrameOffset {
        return FrameOffset.fromPhysicalAddress(physicalAddress);
    }
    
}