import { DoubleWord } from "./DoubleWord";
import { VirtualAddress } from "./VirtualAddress";

export type PageNumber = number & { __brand: "PageNumber" & "FrameNumber" };

export namespace PageNumber {

    export const MAX_POSITIVE_NUMBER: number = 2**20 - 1;
    export const MAX_NEGATIVE_NUMBER: number = -(2**19);
    export const NUMBER_OF_BITS: number = 20;

    /**
     * This method gets the PageNumber from a number.
     * @param number 
     * @returns
     */
    export function fromNumber(number: number): PageNumber {
        return (number & MAX_POSITIVE_NUMBER) as PageNumber;
    }

    /**
     * This method gets the PageNumber from a virtualAddress.
     * @param virtualAddress 
     * @returns
     */
    export function fromVirtualAddress(virtualAddress: VirtualAddress): PageNumber {
        return ((virtualAddress >> (DoubleWord.NUMBER_OF_BITS - NUMBER_OF_BITS)) & MAX_POSITIVE_NUMBER) as PageNumber;
    }
}