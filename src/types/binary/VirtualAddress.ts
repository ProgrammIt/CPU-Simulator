import { PageNumber } from "./PageNumber";
import { PageOffset } from "./PageOffset";

export type VirtualAddress = number & { __brand: "DoubleWord" & "VirtualAddress" & "PhysicalAddress" };

export namespace VirtualAddress {
    
    export const MAX_POSITIVE_NUMBER: number = 2**32 - 1;
    export const MAX_NEGATIVE_NUMBER: number = -(2**31);
    export const NUMBER_OF_BITS: number = 32;

    export const ZERO: VirtualAddress = 0 as VirtualAddress;

    /**
	 * This method creates a VirtualAddress from a number.
	 * @param number
	 * @returns
	 */
	export function fromNumber(number: number): VirtualAddress {
		return (number & MAX_POSITIVE_NUMBER) >>> 0 as VirtualAddress;
	}

    /**
     * This method gets the PageNumber from a number.
     * @param number 
     * @returns
     */
    export function getPageNumber(virtualAddress: VirtualAddress): PageNumber {
        return PageNumber.fromVirtualAddress(virtualAddress);
    }

    /**
     * This method gets the PageNumber from a virtual address.
     * @param virtualAddress 
     * @returns
     */
    export function getPageOffset(virtualAddress: VirtualAddress): PageOffset {
        return PageOffset.fromVirtualAddress(virtualAddress);
    }
    
}