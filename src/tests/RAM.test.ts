import {describe, expect, test} from '@jest/globals';
import { RAM } from '../simulator/functional_units/RAM';
import { Byte } from '../types/Byte';
import { Doubleword } from '../types/Doubleword';
import { PhysicalAddress } from '../types/PhysicalAddress';
import { Bit } from '../types/Bit';

describe("Read and write from or to main memory", () => {
    var mainMemory: RAM = RAM.getInstance(Math.pow(2, 32));

    test("Set byte", () => {
        mainMemory.setByte(PhysicalAddress.fromInteger(parseInt("0x0", 16)));
        const byteExpected: Byte = new Byte();
        byteExpected.value = new Array<Bit>(8).fill(1);
        expect(mainMemory.cells).toEqual(new Map<string, Byte>([
            ["0x0", byteExpected]
        ]));
    });

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
        var doubleword = new Doubleword([1,1,0,1,1,0,0,1,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]);
        mainMemory.writeDoublewordTo(PhysicalAddress.fromInteger(parseInt("0x0", 16)), doubleword);
        expect(mainMemory.cells).toEqual(new Map<string, Byte>([
            ["0x0", new Byte([1,1,0,1,1,0,0,1])],
            ["0x1", new Byte([0,0,1,0,1,1,1,0])],
            ["0x2", new Byte([1,0,1,0,0,0,0,1])],
            ["0x3", new Byte([0,1,1,0,0,0,0,0])]
        ]));
    });

    test("Write doubleword to high memory address, expecting an Error", () => {
        const doubleword = new Doubleword([1,1,0,1,1,0,0,1,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]);
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
        const result: Doubleword = mainMemory.readDoublewordFrom(PhysicalAddress.fromInteger(parseInt("0x0", 16)));
        const expectedDoubleword: Doubleword = new Doubleword([1,1,0,1,1,0,0,1,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]);
        expect(result).toEqual(expectedDoubleword);
    });

    test("Read doubleword from a previously unused memory address", () => {
        mainMemory.cells.clear();
        const result: Doubleword = mainMemory.readDoublewordFrom(PhysicalAddress.fromInteger(parseInt("0xFFFF", 16)));
        const expectedDoubleword: Doubleword = new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        expect(result).toEqual(expectedDoubleword);
    });

    test("Read doubleword from partially unused memory address", () => {
        mainMemory.cells.clear();
        var doubleword = new Doubleword([1,1,0,1,1,0,0,1,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]);
        mainMemory.writeDoublewordTo(PhysicalAddress.fromInteger(parseInt("0x0", 16)), doubleword);
        const result: Doubleword = mainMemory.readDoublewordFrom(PhysicalAddress.fromInteger(parseInt("0x3", 16)));
        const expectedDoubleword: Doubleword = new Doubleword([0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

        expect(result).toEqual(expectedDoubleword);
    });
});