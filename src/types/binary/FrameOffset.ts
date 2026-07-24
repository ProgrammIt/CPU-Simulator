import { PhysicalAddress } from "./PhysicalAddress";

export type FrameOffset = number & { __brand: "PageOffset" & "FrameOffset" };

export namespace FrameOffset {
    
    export const MAX_POSITIVE_NUMBER: number = 2**12 - 1;
    export const MAX_NEGATIVE_NUMBER: number = -(2**11);
    export const NUMBER_OF_BITS: number = 12;

    /**
     * This method gets the FrameOffset from a number.
     * @param number 
     * @returns
     */
    export function fromNumber(number: number): FrameOffset {
        return (number & MAX_POSITIVE_NUMBER) as FrameOffset;
    }

    /**
     * This method gets the FrameOffset from a pyhsical address.
     * @param physicalAddress 
     * @returns
     */
    export function fromPhysicalAddress(physicalAddress: PhysicalAddress): FrameOffset {
        return (physicalAddress & MAX_POSITIVE_NUMBER) as FrameOffset;
    }
}