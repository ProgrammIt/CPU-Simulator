import { MemoryManagementUnit } from "../simulator/execution_units/MemoryManagementUnit";
import { RAM } from "../simulator/functional_units/RAM";
import { Byte, Doubleword, VirtualAddress } from "../types";

describe("Read from and write to main memory using MMU as proxy", () => {
    const mainMemory = RAM.instance;
    const mmu = MemoryManagementUnit.instance(mainMemory);

    test("Write byte to main memory", () => {
        mainMemory.cells.clear();
        var virtualAddress = VirtualAddress.fromInteger(parseInt("0xFFFFFFFF", 16));
        mmu.writeByteTo(virtualAddress, Byte.fromInteger(parseInt("11111111", 2)));

        expect(mainMemory.cells).toEqual(new Map<string, Byte>([
            ["0xFFFFFFFF", Byte.fromInteger(parseInt("11111111", 2))]
        ]));
    });

    test("Write doubleword to main memory", () => {
        mainMemory.cells.clear();
        var virtualAddress = VirtualAddress.fromInteger(parseInt("0x1000000", 16));
        mmu.writeDoublewordTo(
            virtualAddress, 
            Doubleword.fromInteger(parseInt("11011001001011101010000101100000", 2))
        );

        expect(mainMemory.cells).toEqual(new Map<string, Byte>([
            ["0x1000000", Byte.fromInteger(parseInt("11011001", 2))],
            ["0x1000001", Byte.fromInteger(parseInt("00101110", 2))],
            ["0x1000002", Byte.fromInteger(parseInt("10100001", 2))],
            ["0x1000003", Byte.fromInteger(parseInt("01100000", 2))]
        ]));
    });

    test("Write doubleword to high memory address, expecting an Error", () => {
        var virtualAddress: VirtualAddress = VirtualAddress.fromInteger(parseInt("0xFFFFFFFE", 16));
        const doubleword = Doubleword.fromInteger(parseInt("11011001001011101010000101100000", 2));
        const attemptToWrite = () => {
            mmu.writeDoublewordTo(virtualAddress, doubleword);
        }      
        expect(attemptToWrite).toThrow(Error);
    });

    test("Read single byte from memory address", () => {
        var virtualAddress: VirtualAddress = VirtualAddress.fromInteger(parseInt("0x1000000", 16));
        var result: Byte = mmu.readByteFrom(virtualAddress);
        expect(result.value.join("")).toBe("11011001");
    });

    test("Read single byte from a previously unused memory address", () => {
        var virtualAddress: VirtualAddress = VirtualAddress.fromInteger(parseInt("0xFFFF", 16));
        var result: Byte = mmu.readByteFrom(virtualAddress);
        expect(result.value.join("")).toBe("00000000");
    });

    test("Read doubleword from memory address", () => {
        mainMemory.cells.clear();
        var virtualAddress = VirtualAddress.fromInteger(parseInt("0x0", 16));
        mmu.writeDoublewordTo(
            virtualAddress, 
            Doubleword.fromInteger(parseInt("11011001001011101010000101100000", 2))
        );
        virtualAddress = VirtualAddress.fromInteger(parseInt("0x0", 16));
        var result: Doubleword = mmu.readDoublewordFrom(virtualAddress);
        expect(result.value.join("")).toBe("11011001001011101010000101100000");
    });

    test("Read doubleword from a previously unused memory address", () => {
        var virtualAddress: VirtualAddress = VirtualAddress.fromInteger(parseInt("0xFFFF", 16));
        let result: Doubleword = mmu.readDoublewordFrom(virtualAddress);
        expect(result.value.join("")).toBe("00000000000000000000000000000000");
    });

    test("Read doubleword from partially unused memory address", () => {
        var virtualAddress: VirtualAddress = VirtualAddress.fromInteger(parseInt("0x3", 16));
        let result: Doubleword = mmu.readDoublewordFrom(virtualAddress);
        expect(result.value.join("")).toBe("01100000000000000000000000000000");
    });
});