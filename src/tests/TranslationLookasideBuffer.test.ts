import { TranslationLookasideBuffer } from "../simulator/functional_units/TranslationLookasideBuffer";
import { PhysicalAddress } from "../types/PhysicalAddress";
import { VirtualAddress } from "../types/VirtualAddress";

describe("Test TLB", () => {
    const translationLookasideBuffer: TranslationLookasideBuffer = new TranslationLookasideBuffer(2);
    test("Insert first entry", () => {
        translationLookasideBuffer.insert([VirtualAddress.fromInteger(100), PhysicalAddress.fromInteger(1)]);
        expect(translationLookasideBuffer.data).toEqual([
            [1, [VirtualAddress.fromInteger(100), PhysicalAddress.fromInteger(1)]]
        ]);
    });

    test("Get entry", () => {
        translationLookasideBuffer.get(VirtualAddress.fromInteger(100));
        expect(translationLookasideBuffer.data).toEqual([
            [2, [VirtualAddress.fromInteger(100), PhysicalAddress.fromInteger(1)]]
        ]);
    });

    test("Insert second entry", () => {
        translationLookasideBuffer.insert([VirtualAddress.fromInteger(200), PhysicalAddress.fromInteger(2)]);
        expect(translationLookasideBuffer.data).toEqual([
            [2, [VirtualAddress.fromInteger(100), PhysicalAddress.fromInteger(1)]], 
            [1, [VirtualAddress.fromInteger(200), PhysicalAddress.fromInteger(2)]]
        ]);
    });

    test("Get entry", () => {
        translationLookasideBuffer.get(VirtualAddress.fromInteger(100));
        expect(translationLookasideBuffer.data).toEqual([
            [3, [VirtualAddress.fromInteger(100), PhysicalAddress.fromInteger(1)]], 
            [1, [VirtualAddress.fromInteger(200), PhysicalAddress.fromInteger(2)]]
        ]);
    });

    test("Insert third entry", () => {
        translationLookasideBuffer.insert([VirtualAddress.fromInteger(300), PhysicalAddress.fromInteger(3)]);
        expect(translationLookasideBuffer.data)
            .toEqual([
                [3, [VirtualAddress.fromInteger(100), PhysicalAddress.fromInteger(1)]],
                [1, [VirtualAddress.fromInteger(300), PhysicalAddress.fromInteger(3)]]
            ]);
    });

    test("Get entry", () => {
        translationLookasideBuffer.get(VirtualAddress.fromInteger(100));
        expect(translationLookasideBuffer.data).toEqual([
            [4, [VirtualAddress.fromInteger(100), PhysicalAddress.fromInteger(1)]],
            [1, [VirtualAddress.fromInteger(300), PhysicalAddress.fromInteger(3)]]
        ]);
    });
});