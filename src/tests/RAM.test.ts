import {describe, expect, test} from '@jest/globals';
import { RAM } from '../main/simulator/functional_units/RAM';
import { Byte } from '../types/binary/Byte';
import { DoubleWord } from '../types/binary/DoubleWord';
import { PhysicalAddress } from '../types/binary/PhysicalAddress';

describe("Read and write from or to main memory", () => {
    const mainMemory: RAM = new RAM(Math.pow(2, 32));

    test("Clear byte", () => {
        mainMemory.clearByte(PhysicalAddress.fromInteger(parseInt("0x0", 16)));
        expect(mainMemory.cells).toEqual(new Map<string, Byte>());
    });
    
    test("Write byte to main memory", () => {
        mainMemory.cells.clear();
        mainMemory.writeByteTo(PhysicalAddress.fromInteger(parseInt("0x0", 16)), new Byte([1,0,0,1,1,0,0,0]));
        mainMemory.writeByteTo(PhysicalAddress.fromInteger(parseInt("0xFFFFFFFF", 16)), new Byte([1,1,1,1,1,1,1,1]));
        mainMemory.writeByteTo(PhysicalAddress.fromInteger(parseInt("0x1000000", 16)), new Byte([1,0,0,1,0,0,0,1]));
        expect(mainMemory.cells).toEqual(new Map<string, Byte>([
            ["0x0", new Byte([1,0,0,1,1,0,0,0])],
            ["0xFFFFFFFF", new Byte([1,1,1,1,1,1,1,1])],
            ["0x1000000", new Byte([1,0,0,1,0,0,0,1])]
        ]));
    });

    test("Write doubleword to main memory", () => {
        mainMemory.cells.clear();
        const doubleword = new DoubleWord([1,1,0,1,1,0,0,1,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]);
        mainMemory.writeDoublewordTo(PhysicalAddress.fromInteger(parseInt("0x0", 16)), doubleword);
        expect(mainMemory.cells).toEqual(new Map<string, Byte>([
            ["0x0", new Byte([1,1,0,1,1,0,0,1])],
            ["0x1", new Byte([0,0,1,0,1,1,1,0])],
            ["0x2", new Byte([1,0,1,0,0,0,0,1])],
            ["0x3", new Byte([0,1,1,0,0,0,0,0])]
        ]));
    });

    test("Write doubleword to high memory address, expecting an Error", () => {
        const doubleword = new DoubleWord([1,1,0,1,1,0,0,1,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]);
        const attemptToWrite = () => {
            mainMemory.writeDoublewordTo(PhysicalAddress.fromInteger(parseInt("0xFFFFFFFE", 16)), doubleword);
        }      
        expect(attemptToWrite).toThrow(Error);
    });

    test("Read single byte from memory address", () => {
        const result: Byte = mainMemory.readByteFrom(PhysicalAddress.fromInteger(parseInt("0x0", 16)));
        const byteExpected = new Byte([1,1,0,1,1,0,0,1]);
        expect(result).toEqual(byteExpected);
    });

    test("Read single byte from a previously unused memory address", () => {
        const result: Byte = mainMemory.readByteFrom(PhysicalAddress.fromInteger(parseInt("0xFFFF", 16)));
        const byteExpected = new Byte([0,0,0,0,0,0,0,0]);
        expect(result).toEqual(byteExpected);
    });

    test("Read doubleword from memory address", () => {
        const result: DoubleWord = mainMemory.readDoublewordFrom(PhysicalAddress.fromInteger(parseInt("0x0", 16)));
        const expectedDoubleword: DoubleWord = new DoubleWord([1,1,0,1,1,0,0,1,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]);
        expect(result).toEqual(expectedDoubleword);
    });

    test("Read doubleword from a previously unused memory address", () => {
        mainMemory.cells.clear();
        const result: DoubleWord = mainMemory.readDoublewordFrom(PhysicalAddress.fromInteger(parseInt("0xFFFF", 16)));
        const expectedDoubleword: DoubleWord = new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        expect(result).toEqual(expectedDoubleword);
    });

    test("Read doubleword from partially unused memory address", () => {
        mainMemory.cells.clear();
        const doubleword = new DoubleWord([1,1,0,1,1,0,0,1,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]);
        mainMemory.writeDoublewordTo(PhysicalAddress.fromInteger(parseInt("0x0", 16)), doubleword);
        const result: DoubleWord = mainMemory.readDoublewordFrom(PhysicalAddress.fromInteger(parseInt("0x3", 16)));
        const expectedDoubleword: DoubleWord = new DoubleWord([0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

        expect(result).toEqual(expectedDoubleword);
    });
});