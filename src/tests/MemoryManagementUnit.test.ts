import { ArithmeticLogicUnit } from "../simulator/execution_units/ArithmeticLogicUnit";
import { MemoryManagementUnit } from "../simulator/execution_units/MemoryManagementUnit";
import { EFLAGS } from "../simulator/functional_units/EFLAGS";
import { PointerRegister } from "../simulator/functional_units/PointerRegister";
import { RAM } from "../simulator/functional_units/RAM";
import { Byte } from "../types/Byte";
import { DoubleWord } from "../types/DoubleWord";
import { VirtualAddress } from "../types/VirtualAddress";

describe("Read from and write to main memory using MMU as proxy", () => {
    const mainMemory = new RAM(Math.pow(2, 32));
    const flags: EFLAGS = new EFLAGS();
    const mmu = new MemoryManagementUnit(mainMemory, new PointerRegister("PTP"), new ArithmeticLogicUnit(flags), flags);

    test("Write byte to main memory", () => {
        mainMemory.cells.clear();
        var virtualAddress = VirtualAddress.fromInteger(parseInt("0xFFFFFFFF", 16));
        mmu.writeByteTo(virtualAddress, Byte.fromInteger(-128));

        expect(mainMemory.cells).toEqual(new Map<string, Byte>([
            ["0xFFFFFFFF", Byte.fromInteger(-128)]
        ]));
    });

    test("Write doubleword to main memory", () => {
        mainMemory.cells.clear();
        var virtualAddress = VirtualAddress.fromInteger(parseInt("0x1000000", 16));
        mmu.writeDoublewordTo(
            virtualAddress, 
            DoubleWord.fromInteger(parseInt("01101100100101110101000010110000", 2)),
            false
        );
        expect(mainMemory.cells).toEqual(new Map<string, Byte>([
            ["0x1000000", new Byte([0, 1, 1, 0, 1, 1, 0, 0])],
            ["0x1000001", new Byte([1, 0, 0, 1, 0, 1, 1, 1])],
            ["0x1000002", new Byte([0, 1, 0, 1, 0, 0, 0, 0])],
            ["0x1000003", new Byte([1, 0, 1, 1, 0, 0, 0, 0])]
        ]));
    });

    test("Write doubleword to high memory address, expecting an Error", () => {
        var virtualAddress: VirtualAddress = VirtualAddress.fromInteger(parseInt("0xFFFFFFFE", 16));
        const doubleword = DoubleWord.fromInteger(parseInt("01101100100101110101000010110000", 2));
        const attemptToWrite = () => {
            mmu.writeDoublewordTo(virtualAddress, doubleword, false);
        }      
        expect(attemptToWrite).toThrow(Error);
    });

    test("Read single byte from memory address", () => {
        var virtualAddress: VirtualAddress = VirtualAddress.fromInteger(parseInt("0x1000000", 16));
        var result: Byte = mmu.readByteFrom(virtualAddress);
        expect(result.value.join("")).toBe("01101100");
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
            DoubleWord.fromInteger(parseInt("01101100100101110101000010110000", 2)),
            false
        );
        virtualAddress = VirtualAddress.fromInteger(parseInt("0x0", 16));
        var result: DoubleWord = mmu.readDoublewordFrom(virtualAddress, false);
        expect(result.value.join("")).toBe("01101100100101110101000010110000");
    });

    test("Read doubleword from a previously unused memory address", () => {
        var virtualAddress: VirtualAddress = VirtualAddress.fromInteger(parseInt("0xFFFF", 16));
        let result: DoubleWord = mmu.readDoublewordFrom(virtualAddress, false);
        expect(result.value.join("")).toBe("00000000000000000000000000000000");
    });

    test("Read doubleword from partially unused memory address", () => {
        var virtualAddress: VirtualAddress = VirtualAddress.fromInteger(parseInt("0x3", 16));
        let result: DoubleWord = mmu.readDoublewordFrom(virtualAddress, false);
        expect(result.value.join("")).toBe("10110000000000000000000000000000");
    });
});