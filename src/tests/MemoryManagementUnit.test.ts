import { CPUCore } from "../simulator/execution_units/CPUCore";
import { MemoryManagementUnit } from "../simulator/execution_units/MemoryManagementUnit";
import { RAM } from "../simulator/functional_units/RAM";
import { Byte } from "../types/binary/Byte";
import { DoubleWord } from "../types/binary/DoubleWord";
import { DataSizes } from "../types/enumerations/DataSizes";
import { describe, expect, test } from '@jest/globals';

describe("Read from and write to main memory using MMU as proxy", () => {
    const mainMemory = new RAM(DoubleWord.SIZE);
    const cpu = new CPUCore(mainMemory, DataSizes.DOUBLEWORD, "./os_filesystem");
    const mmu = new MemoryManagementUnit(cpu);

    test("Write byte to main memory", () => {
        mainMemory.cells.clear();
        const virtualAddress = DoubleWord.fromNumber(0xFFFFFFFF);
        mmu.writeByteTo(virtualAddress, Byte.fromNumber(-128));

        expect(mainMemory.cells).toEqual(new Map<number, number>([
            [0xFFFFFFFF, Byte.fromNumber(-128)]
        ]));
    });

    test("Write doubleword to main memory", () => {
        mainMemory.cells.clear();
        const virtualAddress = DoubleWord.fromNumber(0x1000000);
        mmu.writeDoublewordTo(
            virtualAddress, 
            DoubleWord.fromNumber(0b01101100_10010111_01010000_10110000),
            false
        );
        expect(mainMemory.cells).toEqual(new Map<number, number>([
            [0x1000000, Byte.fromNumber(0b01101100)],
            [0x1000001, Byte.fromNumber(0b10010111)],
            [0x1000002, Byte.fromNumber(0b01010000)],
            [0x1000003, Byte.fromNumber(0b10110000)]
        ]));
    });

    test("Read single byte from memory address", () => {
        const virtualAddress: DoubleWord = DoubleWord.fromNumber(0x1000000);
        const result: Byte = mmu.readByteFrom(virtualAddress);
        expect(result).toBe(0b1101100);
    });

    test("Read single byte from a previously unused memory address", () => {
        const virtualAddress: DoubleWord = DoubleWord.fromNumber(0xFFFF);
        const result: Byte = mmu.readByteFrom(virtualAddress);
        expect(result).toBe(0b00000000);
    });

    test("Read doubleword from memory address", () => {
        mainMemory.cells.clear();
        let virtualAddress = DoubleWord.fromNumber(0);
        mmu.writeDoublewordTo(
            virtualAddress, 
            DoubleWord.fromNumber(0b01101100100101110101000010110000),
            false
        );
        virtualAddress = DoubleWord.fromNumber(0);
        const result: DoubleWord = mmu.readDoublewordFrom(virtualAddress, false);
        expect(result).toBe(0b01101100100101110101000010110000);
    });

    test("Read doubleword from a previously unused memory address", () => {
        const virtualAddress: DoubleWord = DoubleWord.fromNumber(0xFFFF);
        const result: DoubleWord = mmu.readDoublewordFrom(virtualAddress, false);
        expect(result).toBe(0);
    });

    test("Read doubleword from partially unused memory address", () => {
        const virtualAddress: DoubleWord = DoubleWord.fromNumber(0x3);
        const result: DoubleWord = mmu.readDoublewordFrom(virtualAddress, false);
        expect(result).toBe(0b10110000000000000000000000000000);
    });
});