import { ArithmeticLogicUnit } from "../simulator/execution_units/ArithmeticLogicUnit";
import { EFLAGS } from "../simulator/functional_units/EFLAGS";
import { DataSize } from "../types";
import { Doubleword } from "../types/Doubleword";
import { Quadword } from "../types/Quadword";

describe("Test ALU", () => {
    const flags: EFLAGS = new EFLAGS();
    const alu: ArithmeticLogicUnit = new ArithmeticLogicUnit(flags);

    test("Perform logical NOT on 0b0", () => {
        expect(alu.not(0)).toEqual(1);
    });

    test("Perform logical OR on 0b1", () => {
        expect(alu.not(1)).toEqual(0);
    });

    test("Perform logical AND on 0b0 and 0b0", () => {
        expect(alu.and(0, 0)).toEqual(0);
    });

    test("Perform logical AND on 0b0 and 0b1", () => {
        expect(alu.and(0, 1)).toEqual(0);
    });

    test("Perform logical AND on 0b1 and 0b0", () => {
        expect(alu.and(1, 0)).toEqual(0);
    });

    test("Perform logical AND on 0b1 and 0b1", () => {
        expect(alu.and(1, 1)).toEqual(1);
    });

    test("Perform logical NAND on 0b0 and 0b0", () => {
        expect(alu.nand(0, 0)).toEqual(1);
    });

    test("Perform logical NAND on 0b0 and 0b1", () => {
        expect(alu.nand(0, 1)).toEqual(1);
    });

    test("Perform logical NAND on 0b1 and 0b0", () => {
        expect(alu.nand(1, 0)).toEqual(1);
    });

    test("Perform logical NAND on 0b1 and 0b1", () => {
        expect(alu.nand(1, 1)).toEqual(0);
    });

    test("Perform logical OR on 0b0 and 0b0", () => {
        expect(alu.or(0, 0)).toEqual(0);
    });

    test("Perform logical OR on 0b0 and 0b1", () => {
        expect(alu.or(0, 1)).toEqual(1);
    });

    test("Perform logical OR on 0b1 and 0b0", () => {
        expect(alu.or(1, 0)).toEqual(1);
    });

    test("Perform logical OR on 0b1 and 0b1", () => {
        expect(alu.or(1, 1)).toEqual(1);
    });

    test("Perform logical XOR on 0b0 and 0b0", () => {
        expect(alu.xor(0, 0)).toEqual(0);
    });

    test("Perform logical XOR on 0b0 and 0b1", () => {
        expect(alu.xor(0, 1)).toEqual(1);
    });

    test("Perform logical XOR on 0b1 and 0b0", () => {
        expect(alu.xor(1, 0)).toEqual(1);
    });

    test("Perform logical XOR on 0b1 and 0b1", () => {
        expect(alu.xor(1, 1)).toEqual(0);
    });

    test("Perform logical NOT on binary representation of decimal 255", () => {
        var testDoubleword: Doubleword = Doubleword.fromInteger(255);
        alu.notDoubleword(testDoubleword);
        expect(alu.result.toString()).toEqual("11111111111111111111111100000000");
    });

    test("Perform logical NOT on binary 0b01111111111111111111111110000000", () => {
        var testDoubleword: Doubleword = Doubleword.fromInteger(2147483520, false);
        alu.notDoubleword(testDoubleword);
        expect(alu.result.toString()).toEqual("10000000000000000000000001111111");
    });

    test("Perform logical AND on binary representation of decimal 255 and binary representation of decimal 0", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(255);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(0);
        alu.andDoubleword(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000000000000000000");
    });

    test("Perform logical AND on binary representation of decimal 255 and binary representation of decimal 255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(255);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(255);
        alu.andDoubleword(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000000000011111111");
    });

    test("Perform logical AND on binary representation of decimal 128 and binary representation of decimal 255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(255);
        alu.andDoubleword(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000000000010000000");
    });

    test("Perform logical NAND on binary representation of decimal 255 and binary representation of decimal 0", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(255);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(0);
        alu.nandDoubleword(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("11111111111111111111111111111111");
    });

    test("Perform logical NAND on binary representation of decimal 255 and binary representation of decimal 255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(255);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(255);
        alu.nandDoubleword(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("11111111111111111111111100000000");
    });

    test("Perform logical NAND on binary representation of decimal 128 and binary representation of decimal 255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(255);
        alu.nandDoubleword(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("11111111111111111111111101111111");
    });

    test("Perform logical OR on binary representation of decimal 255 and binary representation of decimal 0", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(255);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(0);
        alu.orDoubleword(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000000000011111111");
    });

    test("Perform logical OR on binary representation of decimal 255 and binary representation of decimal 255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(255);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(255);
        alu.orDoubleword(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000000000011111111");
    });

    test("Perform logical OR on binary representation of decimal 128 and binary representation of decimal 255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(255);
        alu.orDoubleword(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000000000011111111");
    });

    test("Perform logical OR on binary representation of decimal 255 and binary representation of decimal 0", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(255);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(0);
        alu.xorDoubleword(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000000000011111111");
    });

    test("Perform logical OR on binary representation of decimal 255 and binary representation of decimal 255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(255);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(255);
        alu.xorDoubleword(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000000000000000000");
    });

    test("Perform logical OR on binary representation of decimal 128 and binary representation of decimal 255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(255);
        alu.xorDoubleword(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000000000001111111");
    });

    test("Perform ADD on binary representation of decimal 128 and binary representation of decimal 255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(255);
        alu.add(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000000000101111111");
    });

    test("Perform ADD on binary representation of decimal 128 and binary representation of decimal -255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(-255);
        alu.add(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("11111111111111111111111110000001");
    });

    test("Perform ADD on binary representation of decimal -128 and binary representation of decimal -255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(-128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(-255);
        alu.add(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("11111111111111111111111010000001");
    });

    test("Perform ADC on binary representation of decimal 128 and binary representation of decimal 255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(255);
        flags.clearCarry();
        alu.adc(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000000000101111111");
    });

    test("Perform ADC on binary representation of decimal 128 and binary representation of decimal -255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(-255);
        flags.clearCarry();
        alu.adc(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("11111111111111111111111110000001");
    });

    test("Perform ADC on binary representation of decimal -128 and binary representation of decimal -255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(-128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(-255);
        flags.clearCarry();
        alu.adc(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("11111111111111111111111010000001");
    });

    test("Add two quadwords with usage of ADD and ADC operations on the lower and higher doublewords of both values seperatly", () => {
        var testQuadword1: Quadword = Quadword.fromInteger(Quadword.MAX_POSITIVE_NUMBER_SIGNED);
        var testQuadword2: Quadword = Quadword.fromInteger(Quadword.MAX_NEGATIVE_NUMBER_SIGNED);

        var testQuadword1LowerDoubleword: Doubleword = new Doubleword();
        testQuadword1LowerDoubleword.value = testQuadword1.value.slice(0, DataSize.DOUBLEWORD);
        var testQuadword1HigherDoubleword: Doubleword = new Doubleword();
        testQuadword1HigherDoubleword.value = testQuadword1.value.slice(DataSize.DOUBLEWORD);

        var testQuadword2LowerDoubleword: Doubleword = new Doubleword();
        testQuadword2LowerDoubleword.value = testQuadword1.value.slice(0, DataSize.DOUBLEWORD);
        var testQuadword2HigherDoubleword: Doubleword = new Doubleword();
        testQuadword2HigherDoubleword.value = testQuadword2.value.slice(DataSize.DOUBLEWORD);

        alu.add(testQuadword1LowerDoubleword, testQuadword2LowerDoubleword);
        alu.adc(testQuadword1HigherDoubleword, testQuadword2HigherDoubleword);
        expect(alu.result.toString()).toEqual("11111111111111111111111111111111");
    });

    test("Perform SUB on binary representation of decimal -128 and binary representation of decimal -255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(-128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(-255);
        alu.sub(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000000000001111111");
    });

    test("Perform SUB on binary representation of decimal 128 and binary representation of decimal -255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(-255);
        alu.sub(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000000000101111111");
    });

    test("Perform SUB on binary representation of decimal 128 and binary representation of decimal 255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(255);
        alu.sub(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("11111111111111111111111110000001");
    });

    test("Perform SBB on binary representation of decimal -128 and binary representation of decimal -255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(-128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(-255);
        flags.clearCarry();
        alu.sub(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000000000001111111");
    });

    test("Perform SBB on binary representation of decimal 128 and binary representation of decimal -255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(-255);
        flags.clearCarry();
        alu.sub(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000000000101111111");
    });

    test("Perform SBB on binary representation of decimal 128 and binary representation of decimal 255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(255);
        flags.clearCarry();
        alu.sub(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("11111111111111111111111110000001");
    });

    test("Perform MUL on binary representation of decimal 128 and binary representation of decimal 255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(255);
        alu.mul(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000111111110000000");
    });

    test("Perform MUL on binary representation of decimal -128 and binary representation of decimal 255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(-128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(255);
        alu.mul(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("11111111111111111000000010000000");
    });

    test("Perform MUL on binary representation of decimal -128 and binary representation of decimal -255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(-128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(-255);
        alu.mul(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000111111110000000");
    });

    test("Perform DIV on binary representation of decimal -128 and binary representation of decimal -255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(-128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(-255);
        alu.div(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000000000000000000");
    });

    test("Perform DIV on binary representation of decimal 128 and binary representation of decimal -255", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(128);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(-255);
        alu.div(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("00000000000000000000000000000000");
    });

    test("Perform DIV on binary representation of decimal 256 and binary representation of decimal -128", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(256);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(-128);
        alu.div(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("11111111111111111111111111111110");
    });

    test("Perform DIV on binary representation of decimal -256 and binary representation of decimal 128", () => {
        var testDoubleword1: Doubleword = Doubleword.fromInteger(-256);
        var testDoubleword2: Doubleword = Doubleword.fromInteger(128);
        alu.div(testDoubleword1, testDoubleword2);
        expect(alu.result.toString()).toEqual("11111111111111111111111111111110");
    });
});