import {describe, expect, test} from '@jest/globals';
import { RAM } from '../simulator/functional_units/RAM';
import { Byte } from '../types/binary/Byte';
import { DoubleWord } from '../types/binary/DoubleWord';
import { FrameNumber } from '../types/binary/FrameNumber';
import { PhysicalAddress } from '../types/binary/PhysicalAddress';
import { FrameOffset } from '../types/binary/FrameOffset';

describe("Read and write from or to main memory", () => {
    const mainMemory: RAM = new RAM(DoubleWord.SIZE);

    test("Clear byte", () => {
        mainMemory.writeByteTo(DoubleWord.ZERO, Byte.ZERO);
        expect(mainMemory.cells).toEqual(new Map<FrameNumber, DataView>());
    });
    
    test("Write byte to main memory", () => {

        const pyhsicalAddress1 = PhysicalAddress.ZERO;
        const pyhsicalAddress2 = PhysicalAddress.fromNumber(0xFFFFFFFF);
        const pyhsicalAddress3 = PhysicalAddress.fromNumber(0x1000000);

        const byte1 = Byte.fromNumber(0b10011000);
        const byte2 = Byte.fromNumber(0b11111111);
        const byte3 = Byte.fromNumber(0b10010001);

        mainMemory.cells.clear();
        mainMemory.writeByteTo(pyhsicalAddress1, byte1);
        mainMemory.writeByteTo(pyhsicalAddress2, byte2);
        mainMemory.writeByteTo(pyhsicalAddress3, byte3);

        expect(mainMemory.cells.get(FrameNumber.fromPhysicalAddress(pyhsicalAddress1))?.getUint8(FrameOffset.fromPhysicalAddress(pyhsicalAddress1))).toEqual(byte1);
        expect(mainMemory.cells.get(FrameNumber.fromPhysicalAddress(pyhsicalAddress2))?.getUint8(FrameOffset.fromPhysicalAddress(pyhsicalAddress2))).toEqual(byte2);
        expect(mainMemory.cells.get(FrameNumber.fromPhysicalAddress(pyhsicalAddress3))?.getUint8(FrameOffset.fromPhysicalAddress(pyhsicalAddress3))).toEqual(byte3);

    });

    test("Write doubleword to main memory", () => {

        const pyhsicalAddress = PhysicalAddress.ZERO;

        const doubleWord = DoubleWord.fromNumber(0b11011001001011101010000101100000);

        mainMemory.cells.clear();
        mainMemory.writeDoubleWordTo(pyhsicalAddress, doubleWord);

        expect(mainMemory.cells.get(FrameNumber.fromPhysicalAddress(pyhsicalAddress))?.getUint32(FrameOffset.fromPhysicalAddress(pyhsicalAddress))).toEqual(doubleWord);
    });

    test("Read single byte from memory address", () => {

        const pyhsicalAddress = PhysicalAddress.ZERO;

        const result: Byte = mainMemory.readByteFrom(pyhsicalAddress);
        const byteExpected = Byte.fromNumber(0b11011001);
        expect(result).toEqual(byteExpected);
    });

    test("Read single byte from a previously unused memory address", () => {
        const pyhsicalAddress = PhysicalAddress.fromNumber(0xFFFF);

        const result: Byte = mainMemory.readByteFrom(pyhsicalAddress);
        const byteExpected = Byte.fromNumber(0);
        expect(result).toEqual(byteExpected);
    });

    test("Read doubleword from memory address", () => {
        const result: DoubleWord = mainMemory.readDoublewordFrom(PhysicalAddress.fromNumber(0x0));
        const expectedDoubleword: DoubleWord = DoubleWord.fromNumber(0b11011001001011101010000101100000);
        expect(result).toEqual(expectedDoubleword);
    });

    test("Read doubleword from a previously unused memory address", () => {
        mainMemory.cells.clear();
        const result: DoubleWord = mainMemory.readDoublewordFrom(PhysicalAddress.fromNumber(0xFFFF));
        const expectedDoubleword: DoubleWord = DoubleWord.fromNumber(0);
        expect(result).toEqual(expectedDoubleword);
    });

    test("Read doubleword from partially unused memory address", () => {
        mainMemory.cells.clear();
        const doubleword = DoubleWord.fromNumber(0b11011001001011101010000101100000);
        mainMemory.writeDoubleWordTo(PhysicalAddress.fromNumber(0x0), doubleword);
        const result: DoubleWord = mainMemory.readDoublewordFrom(PhysicalAddress.fromNumber(0x3));
        const expectedDoubleword: DoubleWord = DoubleWord.fromNumber(0b01100000000000000000000000000000);

        expect(result).toEqual(expectedDoubleword);
    });
});