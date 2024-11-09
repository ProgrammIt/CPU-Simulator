import {describe, expect, test} from '@jest/globals';
import {MainMemory} from './MainMemory';

describe("Read and write from or to main memory", () => {
    const WORD_WIDTH: number = 32;
    var mainMemory: MainMemory = MainMemory.instance(Math.pow(2, WORD_WIDTH));
    
    test("Write byte to main memory", () => {
        var physicalAddress: string = parseInt("0x0", 16).toString(2);
        mainMemory.writeByteTo(physicalAddress, "10011000");

        physicalAddress = parseInt("0xFFFFFFFF", 16).toString(2);
        mainMemory.writeByteTo(physicalAddress, "11111111");

        physicalAddress = parseInt("0x1000000", 16).toString(2);
        mainMemory.writeByteTo(physicalAddress, "10010001");

        expect(mainMemory.cells).toEqual(new Map<string, string>([
            ["0x0", "10011000"],
            ["0xFFFFFFFF", "11111111"],
            ["0x1000000", "10010001"]
        ]));
    });

    test("Write quadword to main memory", () => {
        var physicalAddress: string = parseInt("0x0", 16).toString(2);
        mainMemory.writeQuadwordTo(physicalAddress, "11011001001011101010000101100000");
        physicalAddress = parseInt("0x1000000", 16).toString(2);
        mainMemory.writeQuadwordTo(physicalAddress, "11011001001011101010000101100000");
        expect(mainMemory.cells).toEqual(new Map<string, string>([
            ["0x0", "11011001"],
            ["0x1", "00101110"],
            ["0x2", "10100001"],
            ["0x3", "01100000"],
            ["0x1000000", "11011001"],
            ["0x1000001", "00101110"],
            ["0x1000002", "10100001"],
            ["0x1000003", "01100000"],
            ["0xFFFFFFFF", "11111111"]
        ]));
    });

    test("Write quadword to high memory address, expecting an Error", () => {
        var physicalAddress: string = parseInt("0xFFFFFFFE", 16).toString(2);
        const attemptToWrite = () => {
            mainMemory.writeQuadwordTo(physicalAddress, "11011001001011101010000101100000");
        }      
        expect(attemptToWrite).toThrow(Error);
    });

    test("Read single byte from memory address", () => {
        var physicalAddress: string = parseInt("0x1000000", 16).toString(2);
        var result = mainMemory.readByteFrom(physicalAddress);
        expect(result).toBe("11011001");
    });

    test("Read single byte from a previously unused memory address", () => {
        var physicalAddress: string = parseInt("0xFFFF", 16).toString(2);
        var result: string = mainMemory.readByteFrom(physicalAddress);
        expect(result).toBe("00000000");
    });

    test("Read quadword from memory address", () => {
        var physicalAddress: string = parseInt("0x0", 16).toString(2);
        var result: string = mainMemory.readQuadwordFrom(physicalAddress);
        expect(result).toBe("11011001001011101010000101100000");
    });

    test("Read quadword from a previously unused memory address", () => {
        var physicalAddress: string = parseInt("0xFFFF", 16).toString(2);
        let result: string = mainMemory.readQuadwordFrom(physicalAddress);
        expect(result).toBe("00000000000000000000000000000000");
    });

    test("Read quadword from partially unused memory address", () => {
        var physicalAddress: string = parseInt("0x3", 16).toString(2);
        let result: string = mainMemory.readQuadwordFrom(physicalAddress);
        expect(result).toBe("01100000000000000000000000000000");
    });
});