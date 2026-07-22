import { TranslationLookasideBuffer } from "../simulator/functional_units/TranslationLookasideBuffer";
import { PageTableEntry } from "../types/binary/PageTableEntry";
import { PageNumber } from "../types/binary/PageNumber";
import { PageTableEntryFlags } from "../types/binary/PageTableEntryFlags";
import { FrameNumber } from "../types/binary/FrameNumber";
import { describe, expect, test } from '@jest/globals';

describe("Test TLB", () => {
    const translationLookasideBuffer: TranslationLookasideBuffer = new TranslationLookasideBuffer(2);

    const pageNbr1: PageNumber = PageNumber.fromNumber(10);
    const frameNbr1: FrameNumber = FrameNumber.fromNumber(1);
    const flagBits1: PageTableEntryFlags= PageTableEntryFlags.fromNumber(0b110010000000);
    const pageTableEntry1: PageTableEntry = PageTableEntry.fromFlagAndFrameNumber(flagBits1, frameNbr1);

    const pageNbr2: PageNumber = PageNumber.fromNumber(20);
    const frameNbr2: FrameNumber = FrameNumber.fromNumber(2);
    const flagBits2: PageTableEntryFlags= PageTableEntryFlags.fromNumber(0b101010000000);
    const pageTableEntry2: PageTableEntry = PageTableEntry.fromFlagAndFrameNumber(flagBits2, frameNbr2);

    const pageNbr3: PageNumber = PageNumber.fromNumber(30);
    const frameNbr3: FrameNumber = FrameNumber.fromNumber(3);
    const flagBits3: PageTableEntryFlags = PageTableEntryFlags.fromNumber(0b101010000000);
    const pageTableEntry3: PageTableEntry = PageTableEntry.fromFlagAndFrameNumber(flagBits3, frameNbr3);
    
    test("Insert first entry", () => {
        translationLookasideBuffer.insert([pageNbr1, pageTableEntry1]);

        expect(translationLookasideBuffer.toString()).toEqual([
            [pageNbr1, [pageTableEntry1, 1]],
        ].toString());
    });

    test("Get entry", () => {
        translationLookasideBuffer.get(pageNbr1);
        expect(translationLookasideBuffer.toString()).toEqual([
            [pageNbr1, [pageTableEntry1, 2]],
        ].toString());
    });

    test("Insert second entry", () => {
        translationLookasideBuffer.insert([pageNbr2, pageTableEntry2]);
        expect(translationLookasideBuffer.toString()).toEqual([
            [pageNbr1, [pageTableEntry1, 2]],
            [pageNbr2, [pageTableEntry2, 1]]
        ].toString());
    });

    test("Get entry", () => {
        translationLookasideBuffer.get(pageNbr1);
        expect(translationLookasideBuffer.toString()).toEqual([
            [pageNbr1, [pageTableEntry1, 3]],
            [pageNbr2, [pageTableEntry2, 1]]
        ].toString());
    });

    test("Insert third entry", () => {
        translationLookasideBuffer.insert([pageNbr3, pageTableEntry3]);
        expect(translationLookasideBuffer.toString()).toEqual([
            [pageNbr1, [pageTableEntry1, 3]],
            [pageNbr3, [pageTableEntry3, 1]]
            ].toString());
    });

    test("Get entry", () => {
        translationLookasideBuffer.get(pageNbr1);
        expect(translationLookasideBuffer.toString()).toEqual([
            [pageNbr1, [pageTableEntry1, 4]],
            [pageNbr3, [pageTableEntry3, 1]]
        ].toString());
    });
});