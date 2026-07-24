import { VirtualAddress } from "./VirtualAddress";

export type PageOffset = number & { __brand: "PageOffset" & "FrameOffset" };

export namespace PageOffset {
    
    export const MAX_POSITIVE_NUMBER: number = 2**12 - 1;
    export const MAX_NEGATIVE_NUMBER: number = -(2**11);
    export const NUMBER_OF_BITS: number = 12;

    /**
     * This method gets the PageOffset from a number.
     * @param number 
     * @returns
     */
    export function fromNumber(number: number): PageOffset {
        return (number & MAX_POSITIVE_NUMBER) as PageOffset;
    }

    /**
     * This method gets the PageOffset from a virtual address.
     * @param virtualAddress 
     * @returns
     */
    export function fromVirtualAddress(virtualAddress: VirtualAddress): PageOffset {
        return (virtualAddress & MAX_POSITIVE_NUMBER) as PageOffset;
    }
}