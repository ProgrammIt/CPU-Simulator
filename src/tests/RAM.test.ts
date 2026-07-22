import {describe, expect, test} from '@jest/globals';
import { RAM } from '../simulator/functional_units/RAM';
import { Byte } from '../types/binary/Byte';
import { DoubleWord } from '../types/binary/DoubleWord';

describe("Read and write from or to main memory", () => {
    const mainMemory: RAM = new RAM(DoubleWord.SIZE);

    test("Clear byte", () => {
        mainMemory.clearByte(DoubleWord.fromNumber(0x0));
        expect(mainMemory.cells).toEqual(new Map<DoubleWord, Byte>());
    });
    
    test("Write byte to main memory", () => {
        mainMemory.cells.clear();
        mainMemory.writeByteTo(DoubleWord.fromNumber(0x0), Byte.fromNumber(0b10011000));
        mainMemory.writeByteTo(DoubleWord.fromNumber(0xFFFFFFFF), Byte.fromNumber(0b11111111));
        mainMemory.writeByteTo(DoubleWord.fromNumber(0x1000000), Byte.fromNumber(0b10010001));
        expect(mainMemory.cells).toEqual(new Map<DoubleWord, number>([
            [DoubleWord.fromNumber(0x0), Byte.fromNumber(0b10011000)],
            [DoubleWord.fromNumber(0xFFFFFFFF), Byte.fromNumber(0b11111111)],
            [DoubleWord.fromNumber(0x1000000), Byte.fromNumber(0b10010001)]
        ]));
    });

    test("Write doubleword to main memory", () => {
        mainMemory.cells.clear();
        const doubleword = DoubleWord.fromNumber(0b11011001001011101010000101100000);
        mainMemory.writeDoubleWordTo(DoubleWord.fromNumber(0x0), doubleword);
        expect(mainMemory.cells).toEqual(new Map<DoubleWord, number>([
            [DoubleWord.fromNumber(0x0), Byte.fromNumber(0b11011001)],
            [DoubleWord.fromNumber(0x1), Byte.fromNumber(0b00101110)],
            [DoubleWord.fromNumber(0x2), Byte.fromNumber(0b10100001)],
            [DoubleWord.fromNumber(0x3), Byte.fromNumber(0b01100000)]
        ]));
    });

    test("Read single byte from memory address", () => {
        const result: Byte = mainMemory.readByteFrom(DoubleWord.fromNumber(0x0));
        const byteExpected = Byte.fromNumber(0b11011001);
        expect(result).toEqual(byteExpected);
    });

    test("Read single byte from a previously unused memory address", () => {
        const result: Byte = mainMemory.readByteFrom(DoubleWord.fromNumber(0xFFFF));
        const byteExpected = Byte.fromNumber(0);
        expect(result).toEqual(byteExpected);
    });

    test("Read doubleword from memory address", () => {
        const result: DoubleWord = mainMemory.readDoublewordFrom(DoubleWord.fromNumber(0x0));
        const expectedDoubleword: DoubleWord = DoubleWord.fromNumber(0b11011001001011101010000101100000);
        expect(result).toEqual(expectedDoubleword);
    });

    test("Read doubleword from a previously unused memory address", () => {
        mainMemory.cells.clear();
        const result: DoubleWord = mainMemory.readDoublewordFrom(DoubleWord.fromNumber(0xFFFF));
        const expectedDoubleword: DoubleWord = DoubleWord.fromNumber(0);
        expect(result).toEqual(expectedDoubleword);
    });

    test("Read doubleword from partially unused memory address", () => {
        mainMemory.cells.clear();
        const doubleword = DoubleWord.fromNumber(0b11011001001011101010000101100000);
        mainMemory.writeDoubleWordTo(DoubleWord.fromNumber(0x0), doubleword);
        const result: DoubleWord = mainMemory.readDoublewordFrom(DoubleWord.fromNumber(0x3));
        const expectedDoubleword: DoubleWord = DoubleWord.fromNumber(0b01100000000000000000000000000000);

        expect(result).toEqual(expectedDoubleword);
    });
});