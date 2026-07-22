import { Byte } from "../types/binary/Byte";
import { DoubleWord } from "../types/binary/DoubleWord";
import { ArithmeticLogicUnit } from "../simulator/execution_units/ArithmeticLogicUnit";
import { RAM } from "../simulator/functional_units/RAM";
import { CPUCore } from "../simulator/execution_units/CPUCore";
import { DataSizes } from "../types/enumerations/DataSizes";
import { describe, expect, test } from '@jest/globals';

describe("Test ALU", () => {
    const mainMemory = new RAM(DoubleWord.SIZE);
    const cpu = new CPUCore(mainMemory, DataSizes.DOUBLEWORD, "./os_filesystem");
    const alu: ArithmeticLogicUnit = new ArithmeticLogicUnit(cpu);

    test("Perform logical NOT on binary representation of decimal 255", () => {
        const testDoubleword: DoubleWord = DoubleWord.fromNumber(255);
        expect(alu.not(testDoubleword))
            .toEqual(0b11111111111111111111111100000000);
    });

    test("Perform logical NOT on binary 0b01111111111111111111111110000000", () => {
        const testDoubleword: DoubleWord = DoubleWord.fromNumber(2147483520);
        expect(alu.not(testDoubleword))
            .toEqual(0b10000000000000000000000001111111);
    });

    test("Perform logical AND on binary representation of decimal 255 and binary representation of decimal 0", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(255);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(0);
        expect(alu.and(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000000000000);
    });

    test("Perform logical AND on binary representation of decimal 255 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(255);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(255);
        expect(alu.and(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000011111111);
    });

    test("Perform logical AND on binary representation of decimal 128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(255);
        expect(alu.and(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000010000000);
    });

    test("Perform logical OR on binary representation of decimal 255 and binary representation of decimal 0", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(255);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(0);
        expect(alu.or(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000011111111);
    });

    test("Perform logical OR on binary representation of decimal 255 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(255);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(255);
        expect(alu.or(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000011111111);
    });

    test("Perform logical OR on binary representation of decimal 128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(255);
        expect(alu.or(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000011111111);
    });

    test("Perform logical OR on binary representation of decimal 255 and binary representation of decimal 0", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(255);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(0);
        expect(alu.xor(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000011111111);
    });

    test("Perform logical OR on binary representation of decimal 255 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(255);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(255);
        expect(alu.xor(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000000000000);
    });

    test("Perform logical OR on binary representation of decimal 128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(255);
        expect(alu.xor(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000001111111);
    });

    test("Perform ADD on binary representation of decimal 128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(255);
        expect(alu.add(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000101111111);
    });

    test("Perform ADD on binary representation of decimal 128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(-255);
        expect(alu.add(testDoubleword1, testDoubleword2))
            .toEqual(0b11111111111111111111111110000001);
    });

    test("Perform ADD on binary representation of decimal -128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(-128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(-255);
        expect(alu.add(testDoubleword1, testDoubleword2))
            .toEqual(0b11111111111111111111111010000001);
    });

    test("Perform ADC on binary representation of decimal 128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(255);
        cpu.flags.clearCarry();
        expect(alu.adc(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000101111111);
    });

    test("Perform ADC on binary representation of decimal 128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(-255);
        cpu.flags.clearCarry();
        expect(alu.adc(testDoubleword1, testDoubleword2))
            .toEqual(0b11111111111111111111111110000001);
    });

    test("Perform ADC on binary representation of decimal 128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(-255);
        cpu.flags.setCarry();
        expect(alu.adc(testDoubleword1, testDoubleword2))
            .toEqual(0b11111111111111111111111110000010);
    });

    test("Perform ADC on binary representation of decimal -128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(-128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(-255);
        cpu.flags.clearCarry();
        expect(alu.adc(testDoubleword1, testDoubleword2))
            .toEqual(0b11111111111111111111111010000001);
    });

    // test("Add two quadwords with usage of ADD and ADC operations on the lower and higher doublewords of both values seperatly", () => {
    //     var testQuadword1: Quadword = Quadword.fromInteger(-922036852776000);
    //     var testQuadword2: Quadword = Quadword.fromInteger(184744708552000);

    //     var testQuadword1LowerDoubleword: Doubleword = DoubleWord.fromNumber();
    //     testQuadword1LowerDoubleword.value = testQuadword1.value.slice(0, DataSize.DOUBLEWORD);
    //     var testQuadword1HigherDoubleword: Doubleword = DoubleWord.fromNumber();
    //     testQuadword1HigherDoubleword.value = testQuadword1.value.slice(DataSize.DOUBLEWORD);

    //     var testQuadword2LowerDoubleword: Doubleword = DoubleWord.fromNumber();
    //     testQuadword2LowerDoubleword.value = testQuadword1.value.slice(0, DataSize.DOUBLEWORD);
    //     var testQuadword2HigherDoubleword: Doubleword = DoubleWord.fromNumber();
    //     testQuadword2HigherDoubleword.value = testQuadword2.value.slice(DataSize.DOUBLEWORD);

    //     var resLower: Doubleword = alu.add(testQuadword1LowerDoubleword, testQuadword2LowerDoubleword);
    //     var resUpper: Doubleword = alu.adc(testQuadword1HigherDoubleword, testQuadword2HigherDoubleword);
    //     expect(resUpper + resLower)
    //         .toEqual("1111111111111101011000010110111111001011101001011101100100000000");
    // });

    test("Perform SUB on binary representation of decimal -128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(-128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(-255);
        expect(alu.sub(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000001111111);
    });

    test("Perform SUB on binary representation of decimal 128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(-255);
        expect(alu.sub(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000101111111);
    });

    test("Perform SUB on binary representation of decimal 128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(255);
        expect(alu.sub(testDoubleword1, testDoubleword2))
            .toEqual(0b11111111111111111111111110000001);
    });

    test("Perform SBB on binary representation of decimal -128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(-128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(-255);
        cpu.flags.clearCarry();
        expect(alu.sbb(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000001111111);
    });

    test("Perform SBB on binary representation of decimal 128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(-255);
        cpu.flags.clearCarry();
        expect(alu.sbb(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000101111111);
    });

    test("Perform SBB on binary representation of decimal 128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(255);
        cpu.flags.clearCarry();
        expect(alu.sbb(testDoubleword1, testDoubleword2))
            .toEqual(0b11111111111111111111111110000001);
    });

    test("Perform logical right shift on doubleword", () => {
        let testDoubleword1: DoubleWord = DoubleWord.fromNumber(-128);
        testDoubleword1 = DoubleWord.logicalRightShift(testDoubleword1)[0];
        expect(testDoubleword1).toEqual(0b01111111111111111111111111000000);
        // 11111111111111111111111110000000
        // 01111111111111111111111111000000
    });

    test("Perform arithmetic right shift on doubleword", () => {
        let testDoubleword1: DoubleWord = DoubleWord.fromNumber(-128);
        testDoubleword1 = DoubleWord.arithmeticRightShift(testDoubleword1)[0];
        expect(testDoubleword1).toEqual(0b11111111111111111111111111000000);
        // 11111111111111111111111110000000
        // 11111111111111111111111111000000
    });

    test("Perform arithmetic right shift on doubleword and check shifted bit", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(-128);
        const shiftedBit = DoubleWord.arithmeticRightShift(testDoubleword1)[1];
        expect(shiftedBit).toEqual(0b0);
    });

    test("Perform arithmetic right shift on byte and check shifted bit", () => {
        const testByte: Byte = Byte.fromNumber(0b10000011);
        const shiftedBit = Byte.arithmeticRightShift(testByte)[1];
        expect(shiftedBit).toEqual(0b1);
    });

    test("Perform logical left shift on doubleword", () => {
        let testDoubleword1: DoubleWord = DoubleWord.fromNumber(-128);
        testDoubleword1 = DoubleWord.leftShift(testDoubleword1)[0];
        expect(testDoubleword1).toEqual(0b11111111111111111111111100000000);
        // 11111111111111111111111110000000
        // 11111111111111111111111100000000
    });

    test("Left shift byte one bit", () => {
        let testByte: Byte = Byte.fromNumber(0b10000011);
        testByte = Byte.leftShift(testByte)[0];
        expect(testByte).toEqual(0b00000110);
        // 10000011
        // 00000110
    });

    test("Perform MUL on binary representation of decimal 128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(255);
        expect(alu.imul(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000111111110000000);
    });

    test("Perform MUL on binary representation of decimal 128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(-256);
        expect(alu.imul(testDoubleword1, testDoubleword2))
            .toEqual(0b11111111111111111000000000000000);
    });

    test("Perform MUL on binary representation of decimal 2147483647 and binary representation of decimal -1", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(2147483647);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(-1);
        expect(alu.imul(testDoubleword1, testDoubleword2))
            .toEqual(0b10000000000000000000000000000001);
    });

    test("Perform MUL on binary representation of decimal -2147483647 and binary representation of decimal 0", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(-2147483648);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(0);
        expect(alu.imul(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000000000000);
    });

    test("Perform MUL on binary representation of decimal -128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(-128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(255);
        expect(alu.imul(testDoubleword1, testDoubleword2))
            .toEqual(0b11111111111111111000000010000000);
    });

    test("Perform MUL on binary representation of decimal -128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(-128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(-255);
        expect(alu.imul(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000111111110000000);
    });

    test("Perform DIV on binary representation of decimal -128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(-128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(-255);
        expect(alu.idiv(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000000000000);
    });

    test("Perform DIV on binary representation of decimal 128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(-255);
        expect(alu.idiv(testDoubleword1, testDoubleword2))
            .toEqual(0b00000000000000000000000000000000);
    });

    test("Perform DIV on binary representation of decimal 256 and binary representation of decimal -128", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(256);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(-128);
        expect(alu.idiv(testDoubleword1, testDoubleword2))
            .toEqual(0b11111111111111111111111111111110);
    });

    test("Perform DIV on binary representation of decimal -256 and binary representation of decimal 128", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(-256);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(128);
        expect(alu.idiv(testDoubleword1, testDoubleword2))
            .toEqual(0b11111111111111111111111111111110);
    });

    test("Perform DIV on binary representation of decimal -2001 and binary representation of decimal 128", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromNumber(-2001);
        const testDoubleword2: DoubleWord = DoubleWord.fromNumber(128);
        expect(alu.idiv(testDoubleword1, testDoubleword2))
            .toEqual(0b11111111111111111111111111110001);
    });
});