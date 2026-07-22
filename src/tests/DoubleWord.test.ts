import { ArithmeticLogicUnit } from "../simulator/execution_units/ArithmeticLogicUnit";
import { DoubleWord } from "../types/binary/DoubleWord";
import { CPUCore } from "../simulator/execution_units/CPUCore";
import { RAM } from "../simulator/functional_units/RAM";
import { DataSizes } from "../types/enumerations/DataSizes";
import { describe, expect, test } from '@jest/globals';

describe("Create doubleword from decimal integer values", () => {
    test("Create doubleword from decimal -6", () => {
        expect(DoubleWord.fromNumber(-6)).toBe(0b11111111111111111111111111111010);
    });

    test("Create doubleword from decimal -300", () => {
        expect(DoubleWord.fromNumber(-300)).toBe(0b11111111111111111111111011010100);
    });

    test("Group bytes in doubleword string", () => {
        expect(DoubleWord.fromNumber(8)).toBe(0b00000000000000000000000000001000);
    });

    test("Create doubleword from positive decimal integer value", () => {
        expect(DoubleWord.fromNumber(6)).toBe(0b00000000000000000000000000000110);
    });

    test("Check wether (8)_10 is smaller than (11)_10", () => {
        expect(DoubleWord.fromNumber(8) < DoubleWord.fromNumber(11)).toBe(true);
    });

    test("Check wether (-1)_10 is smaller than (1)_10", () => {
        expect(DoubleWord.fromNumber(-1) > DoubleWord.fromNumber(1)).toBe(true);
    });

    test("Check wether (-1)_10 is smaller than (-2)_10", () => {
        expect(DoubleWord.fromNumber(-1) < DoubleWord.fromNumber(-2)).toBe(false);
    });

    test("Check wether (100)_10 is smaller than (11)_10", () => {
        expect(DoubleWord.fromNumber(100) < DoubleWord.fromNumber(11)).toBe(false);
    });

    test("Measure toNumber() performance", () => {
        const mainMemory = new RAM(DoubleWord.SIZE);
        const cpu = new CPUCore(mainMemory, DataSizes.DOUBLEWORD, "./os_filesystem");
        const alu: ArithmeticLogicUnit = new ArithmeticLogicUnit(cpu);
        const repetitions = 100_000;
        let dword = DoubleWord.ZERO
        for (let i = 0; i < repetitions; i++) {
            expect(dword).toBe(i)
            dword = alu.add(dword, DoubleWord.fromNumber(1))
        }
        expect(dword).toBe(repetitions);
    });
});