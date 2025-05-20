import { ArithmeticLogicUnit } from "../main/simulator/execution_units/ArithmeticLogicUnit";
import { MemoryManagementUnit } from "../main/simulator/execution_units/MemoryManagementUnit";
import { EFLAGS } from "../main/simulator/functional_units/EFLAGS";
import { PointerRegister } from "../main/simulator/functional_units/PointerRegister";
import { RAM } from "../main/simulator/functional_units/RAM";
import { Byte } from "../types/binary/Byte";
import { DoubleWord } from "../types/binary/DoubleWord";
import { VirtualAddress } from "../types/binary/VirtualAddress";

describe("Read from and write to main memory using MMU as proxy", () => {
    const mainMemory = new RAM(Math.pow(2, 32));
    const flags: EFLAGS = new EFLAGS();
    const mmu = new MemoryManagementUnit(mainMemory, new PointerRegister("PTP"), new ArithmeticLogicUnit(flags), flags);

    test("Write byte to main memory", () => {
        mainMemory.cells.clear();
        const virtualAddress = VirtualAddress.fromInteger(parseInt("0xFFFFFFFF", 16));
        mmu.writeByteTo(virtualAddress, Byte.fromInteger(-128));

        expect(mainMemory.cells).toEqual(new Map<number, Byte>([
            [parseInt("0xFFFFFFFF", 16), Byte.fromInteger(-128)]
        ]));
    });

    test("Write doubleword to main memory", () => {
        mainMemory.cells.clear();
        const virtualAddress = VirtualAddress.fromInteger(parseInt("0x1000000", 16));
        mmu.writeDoublewordTo(
            virtualAddress, 
            DoubleWord.fromInteger(parseInt("01101100100101110101000010110000", 2)),
            false
        );
        expect(mainMemory.cells).toEqual(new Map<number, Byte>([
            [parseInt("0x1000000", 16), new Byte([0, 1, 1, 0, 1, 1, 0, 0])],
            [parseInt("0x1000001", 16), new Byte([1, 0, 0, 1, 0, 1, 1, 1])],
            [parseInt("0x1000002", 16), new Byte([0, 1, 0, 1, 0, 0, 0, 0])],
            [parseInt("0x1000003", 16), new Byte([1, 0, 1, 1, 0, 0, 0, 0])]
        ]));
    });

    test("Write doubleword to high memory address, expecting an Error", () => {
        const virtualAddress: VirtualAddress = VirtualAddress.fromInteger(parseInt("0xFFFFFFFE", 16));
        const doubleword = DoubleWord.fromInteger(parseInt("01101100100101110101000010110000", 2));
        const attemptToWrite = () => {
            mmu.writeDoublewordTo(virtualAddress, doubleword, false);
        }      
        expect(attemptToWrite).toThrow(Error);
    });

    test("Read single byte from memory address", () => {
        const virtualAddress: VirtualAddress = VirtualAddress.fromInteger(parseInt("0x1000000", 16));
        const result: Byte = mmu.readByteFrom(virtualAddress);
        expect(result.value.join("")).toBe("01101100");
    });

    test("Read single byte from a previously unused memory address", () => {
        const virtualAddress: VirtualAddress = VirtualAddress.fromInteger(parseInt("0xFFFF", 16));
        const result: Byte = mmu.readByteFrom(virtualAddress);
        expect(result.value.join("")).toBe("00000000");
    });

    test("Read doubleword from memory address", () => {
        mainMemory.cells.clear();
        let virtualAddress = VirtualAddress.fromInteger(parseInt("0x0", 16));
        mmu.writeDoublewordTo(
            virtualAddress, 
            DoubleWord.fromInteger(parseInt("01101100100101110101000010110000", 2)),
            false
        );
        virtualAddress = VirtualAddress.fromInteger(parseInt("0x0", 16));
        const result: DoubleWord = mmu.readDoublewordFrom(virtualAddress, false);
        expect(result.value.join("")).toBe("01101100100101110101000010110000");
    });

    test("Read doubleword from a previously unused memory address", () => {
        const virtualAddress: VirtualAddress = VirtualAddress.fromInteger(parseInt("0xFFFF", 16));
        const result: DoubleWord = mmu.readDoublewordFrom(virtualAddress, false);
        expect(result.value.join("")).toBe("00000000000000000000000000000000");
    });

    test("Read doubleword from partially unused memory address", () => {
        const virtualAddress: VirtualAddress = VirtualAddress.fromInteger(parseInt("0x3", 16));
        const result: DoubleWord = mmu.readDoublewordFrom(virtualAddress, false);
        expect(result.value.join("")).toBe("10110000000000000000000000000000");
    });
});