import { ArithmeticLogicUnit } from "../simulator/execution_units/ArithmeticLogicUnit";
import { EFLAGS } from "../simulator/functional_units/EFLAGS";
import { TranslationLookasideBuffer } from "../simulator/functional_units/TranslationLookasideBuffer";
import { Bit } from "../binary_types/Bit";
import { PageTableEntry } from "../binary_types/PageTableEntry";
import { PhysicalAddress } from "../binary_types/PhysicalAddress";
import { VirtualAddress } from "../binary_types/VirtualAddress";

describe("Test TLB", () => {
    const translationLookasideBuffer: TranslationLookasideBuffer = new TranslationLookasideBuffer(2);
    const pageTableBaseAddress: PhysicalAddress = PhysicalAddress.fromInteger(10000);
    const alu: ArithmeticLogicUnit = new ArithmeticLogicUnit(new EFLAGS());

    const virtualAddress1: VirtualAddress = VirtualAddress.fromInteger(100);
    const pageFrameNbr1: Array<Bit> = PhysicalAddress.fromInteger(1).getMostSignificantBits(20);
    const pageFlagBits1: Array<Bit> = new Array<Bit>(1,1,0,0, 1,0,0,0, 0,0,0,0);
    const pageTableEntry1: PageTableEntry = new PageTableEntry(pageFlagBits1, pageFrameNbr1);

    const virtualAddress2: VirtualAddress = VirtualAddress.fromInteger(200);
    const pageFrameNbr2: Array<Bit> = PhysicalAddress.fromInteger(10).getMostSignificantBits(20);
    const pageFlagBits2: Array<Bit> = new Array<Bit>(1,0,1,0, 1,0,0,0, 0,0,0,0);
    const pageTableEntry2: PageTableEntry = new PageTableEntry(pageFlagBits2, pageFrameNbr2);

    const virtualAddress3: VirtualAddress = VirtualAddress.fromInteger(300);
    const pageFrameNbr3: Array<Bit> = PhysicalAddress.fromInteger(10).getMostSignificantBits(20);
    const pageFlagBits3: Array<Bit> = new Array<Bit>(1,0,1,0, 1,0,0,0, 0,0,0,0);
    const pageTableEntry3: PageTableEntry = new PageTableEntry(pageFlagBits3, pageFrameNbr3);
    
    test("Insert first entry", () => {
        translationLookasideBuffer.insert([virtualAddress1, pageTableEntry1]);

        expect(translationLookasideBuffer.data).toEqual([
            [1, [virtualAddress1, pageTableEntry1]]
        ]);
    });

    test("Get entry", () => {
        translationLookasideBuffer.get(VirtualAddress.fromInteger(100));
        expect(translationLookasideBuffer.data).toEqual([
            [2, [virtualAddress1, pageTableEntry1]]
        ]);
    });

    test("Insert second entry", () => {
        translationLookasideBuffer.insert([virtualAddress2, pageTableEntry2]);
        expect(translationLookasideBuffer.data).toEqual([
            [2, [virtualAddress1, pageTableEntry1]], 
            [1, [virtualAddress2, pageTableEntry2]]
        ]);
    });

    test("Get entry", () => {
        translationLookasideBuffer.get(VirtualAddress.fromInteger(100));
        expect(translationLookasideBuffer.data).toEqual([
            [3, [VirtualAddress.fromInteger(100), pageTableEntry1]], 
            [1, [VirtualAddress.fromInteger(200), pageTableEntry2]]
        ]);
    });

    test("Insert third entry", () => {
        translationLookasideBuffer.insert([virtualAddress3, pageTableEntry3]);
        expect(translationLookasideBuffer.data)
            .toEqual([
                [3, [virtualAddress1, pageTableEntry1]],
                [1, [virtualAddress3, pageTableEntry3]]
            ]);
    });

    test("Get entry", () => {
        translationLookasideBuffer.get(VirtualAddress.fromInteger(100));
        expect(translationLookasideBuffer.data).toEqual([
            [4, [virtualAddress1, pageTableEntry1]],
            [1, [VirtualAddress.fromInteger(300), pageTableEntry3]]
        ]);
    });
});