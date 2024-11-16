import {describe, expect, test} from '@jest/globals';
import { RAM } from '../simulator/functional_units/RAM';
import { Bit, Byte, Doubleword, PhysicalAddress } from '../types';

describe("Read and write from or to main memory", () => {
    var mainMemory: RAM = RAM.instance;

    test("Set byte", () => {
        mainMemory.setByte(PhysicalAddress.fromInteger(parseInt("0x0", 16)));
        const byteExpected: Byte = new Byte();
        byteExpected.value = new Array<Bit>(8).fill(new Bit(1));
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
        var byte = Byte.fromInteger(parseInt("10011000" ,2));
        mainMemory.writeByteTo(PhysicalAddress.fromInteger(parseInt("0x0", 16)), byte);

        byte = Byte.fromInteger(parseInt("11111111", 2));
        mainMemory.writeByteTo(PhysicalAddress.fromInteger(parseInt("0xFFFFFFFF", 16)), byte);

        byte = Byte.fromInteger(parseInt("10010001", 2));
        mainMemory.writeByteTo(PhysicalAddress.fromInteger(parseInt("0x1000000", 16)), byte);

        expect(mainMemory.cells).toEqual(new Map<string, Byte>([
            ["0x0", Byte.fromInteger(parseInt("10011000", 2))],
            ["0xFFFFFFFF", Byte.fromInteger(parseInt("11111111", 2))],
            ["0x1000000", Byte.fromInteger(parseInt("10010001", 2))]
        ]));
    });

    test("Write doubleword to main memory", () => {
        mainMemory.cells.clear();
        var doubleword = Doubleword.fromInteger(
            parseInt("11011001001011101010000101100000", 2)
        );
        mainMemory.writeDoublewordTo(PhysicalAddress.fromInteger(parseInt("0x0", 16)), doubleword);

        expect(mainMemory.cells).toEqual(new Map<string, Byte>([
            ["0x0", Byte.fromInteger(parseInt("11011001", 2))],
            ["0x1", Byte.fromInteger(parseInt("00101110", 2))],
            ["0x2", Byte.fromInteger(parseInt("10100001", 2))],
            ["0x3", Byte.fromInteger(parseInt("01100000", 2))]
        ]));
    });

    test("Write doubleword to high memory address, expecting an Error", () => {
        const doubleword = Doubleword.fromInteger(
            parseInt("11011001001011101010000101100000", 2)
        );
        const attemptToWrite = () => {
            mainMemory.writeDoublewordTo(PhysicalAddress.fromInteger(parseInt("0xFFFFFFFE", 16)), doubleword);
        }      
        expect(attemptToWrite).toThrow(Error);
    });

    test("Read single byte from memory address", () => {
        const result: Byte = mainMemory.readByteFrom(PhysicalAddress.fromInteger(parseInt("0x0", 16)));
        const byteExpected = Byte.fromInteger(
            parseInt("11011001", 2)
        );
        expect(result).toEqual(byteExpected);
    });

    test("Read single byte from a previously unused memory address", () => {
        const result: Byte = mainMemory.readByteFrom(PhysicalAddress.fromInteger(parseInt("0xFFFF", 16)));
        const byteExpected = Byte.fromInteger(parseInt("00000000", 2));
        expect(result).toEqual(byteExpected);
    });

    test("Read doubleword from memory address", () => {
        const result: Doubleword = mainMemory.readDoublewordFrom(PhysicalAddress.fromInteger(parseInt("0x0", 16)));
        const expectedDoubleword: Doubleword = Doubleword.fromInteger(
            parseInt("11011001001011101010000101100000", 2)
        );
        expect(result).toEqual(expectedDoubleword);
    });

    test("Read doubleword from a previously unused memory address", () => {
        mainMemory.cells.clear();
        const result: Doubleword = mainMemory.readDoublewordFrom(PhysicalAddress.fromInteger(parseInt("0xFFFF", 16)));
        const expectedDoubleword: Doubleword = Doubleword.fromInteger(
            parseInt("00000000000000000000000000000000", 2)
        );
        expect(result).toEqual(expectedDoubleword);
    });

    test("Read doubleword from partially unused memory address", () => {
        mainMemory.cells.clear();
        var doubleword = Doubleword.fromInteger(
            parseInt("11011001001011101010000101100000", 2)
        );
        mainMemory.writeDoublewordTo(PhysicalAddress.fromInteger(parseInt("0x0", 16)), doubleword);

        const result: Doubleword = mainMemory.readDoublewordFrom(PhysicalAddress.fromInteger(parseInt("0x3", 16)));      
        const expectedDoubleword: Doubleword = Doubleword.fromInteger(
            parseInt("01100000000000000000000000000000", 2)
        );

        expect(result).toEqual(expectedDoubleword);
    });
});