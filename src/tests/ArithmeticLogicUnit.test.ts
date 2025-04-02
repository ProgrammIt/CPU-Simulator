import { Bit } from "../types/binary/Bit";
import { Byte } from "../types/binary/Byte";
import { DoubleWord } from "../types/binary/DoubleWord";
import { ArithmeticLogicUnit } from "../main/simulator/execution_units/ArithmeticLogicUnit";
import { EFLAGS } from "../main/simulator/functional_units/EFLAGS";

describe("Test ALU", () => {
    const flags: EFLAGS = new EFLAGS();
    const alu: ArithmeticLogicUnit = new ArithmeticLogicUnit(flags);

    test("Perform logical NOT on binary representation of decimal 255", () => {
        const testDoubleword: DoubleWord = DoubleWord.fromInteger(255);
        expect(alu.not(testDoubleword).toString())
            .toEqual("11111111111111111111111100000000");
    });

    test("Perform logical NOT on binary 0b01111111111111111111111110000000", () => {
        const testDoubleword: DoubleWord = DoubleWord.fromInteger(2147483520);
        expect(alu.not(testDoubleword).toString())
            .toEqual("10000000000000000000000001111111");
    });

    test("Perform logical AND on binary representation of decimal 255 and binary representation of decimal 0", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(255);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(0);
        expect(alu.and(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000000000000");
    });

    test("Perform logical AND on binary representation of decimal 255 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(255);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(255);
        expect(alu.and(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000011111111");
    });

    test("Perform logical AND on binary representation of decimal 128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(255);
        expect(alu.and(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000010000000");
    });

    test("Perform logical OR on binary representation of decimal 255 and binary representation of decimal 0", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(255);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(0);
        expect(alu.or(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000011111111");
    });

    test("Perform logical OR on binary representation of decimal 255 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(255);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(255);
        expect(alu.or(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000011111111");
    });

    test("Perform logical OR on binary representation of decimal 128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(255);
        expect(alu.or(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000011111111");
    });

    test("Perform logical OR on binary representation of decimal 255 and binary representation of decimal 0", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(255);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(0);
        expect(alu.xor(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000011111111");
    });

    test("Perform logical OR on binary representation of decimal 255 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(255);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(255);
        expect(alu.xor(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000000000000");
    });

    test("Perform logical OR on binary representation of decimal 128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(255);
        expect(alu.xor(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000001111111");
    });

    test("Perform ADD on binary representation of decimal 128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(255);
        expect(alu.add(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000101111111");
    });

    test("Perform ADD on binary representation of decimal 128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(-255);
        expect(alu.add(testDoubleword1, testDoubleword2).toString())
            .toEqual("11111111111111111111111110000001");
    });

    test("Perform ADD on binary representation of decimal -128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(-128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(-255);
        expect(alu.add(testDoubleword1, testDoubleword2).toString())
            .toEqual("11111111111111111111111010000001");
    });

    test("Perform ADC on binary representation of decimal 128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(255);
        flags.clearCarry();
        expect(alu.adc(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000101111111");
    });

    test("Perform ADC on binary representation of decimal 128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(-255);
        flags.clearCarry();
        expect(alu.adc(testDoubleword1, testDoubleword2).toString())
            .toEqual("11111111111111111111111110000001");
    });

    test("Perform ADC on binary representation of decimal 128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(-255);
        flags.setCarry();
        expect(alu.adc(testDoubleword1, testDoubleword2).toString())
            .toEqual("11111111111111111111111110000010");
    });

    test("Perform ADC on binary representation of decimal -128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(-128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(-255);
        flags.clearCarry();
        expect(alu.adc(testDoubleword1, testDoubleword2).toString())
            .toEqual("11111111111111111111111010000001");
    });

    // test("Add two quadwords with usage of ADD and ADC operations on the lower and higher doublewords of both values seperatly", () => {
    //     var testQuadword1: Quadword = Quadword.fromInteger(-922036852776000);
    //     var testQuadword2: Quadword = Quadword.fromInteger(184744708552000);

    //     var testQuadword1LowerDoubleword: Doubleword = new Doubleword();
    //     testQuadword1LowerDoubleword.value = testQuadword1.value.slice(0, DataSize.DOUBLEWORD);
    //     var testQuadword1HigherDoubleword: Doubleword = new Doubleword();
    //     testQuadword1HigherDoubleword.value = testQuadword1.value.slice(DataSize.DOUBLEWORD);

    //     var testQuadword2LowerDoubleword: Doubleword = new Doubleword();
    //     testQuadword2LowerDoubleword.value = testQuadword1.value.slice(0, DataSize.DOUBLEWORD);
    //     var testQuadword2HigherDoubleword: Doubleword = new Doubleword();
    //     testQuadword2HigherDoubleword.value = testQuadword2.value.slice(DataSize.DOUBLEWORD);

    //     var resLower: Doubleword = alu.add(testQuadword1LowerDoubleword, testQuadword2LowerDoubleword);
    //     var resUpper: Doubleword = alu.adc(testQuadword1HigherDoubleword, testQuadword2HigherDoubleword);
    //     expect(resUpper.toString() + resLower.toString())
    //         .toEqual("1111111111111101011000010110111111001011101001011101100100000000");
    // });

    test("Perform SUB on binary representation of decimal -128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(-128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(-255);
        expect(alu.sub(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000001111111");
    });

    test("Perform SUB on binary representation of decimal 128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(-255);
        expect(alu.sub(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000101111111");
    });

    test("Perform SUB on binary representation of decimal 128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(255);
        expect(alu.sub(testDoubleword1, testDoubleword2).toString())
            .toEqual("11111111111111111111111110000001");
    });

    test("Perform SBB on binary representation of decimal -128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(-128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(-255);
        flags.clearCarry();
        expect(alu.sbb(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000001111111");
    });

    test("Perform SBB on binary representation of decimal 128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(-255);
        flags.clearCarry();
        expect(alu.sbb(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000101111111");
    });

    test("Perform SBB on binary representation of decimal 128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(255);
        flags.clearCarry();
        expect(alu.sbb(testDoubleword1, testDoubleword2).toString())
            .toEqual("11111111111111111111111110000001");
    });

    test("Extend sign by one bit", () => {
        const testDoubleword: DoubleWord = DoubleWord.fromInteger(-128);
        alu.signExtend<DoubleWord>(testDoubleword, 33);
        expect(testDoubleword.toString()).toEqual("111111111111111111111111110000000");
    });

    test("Perform logical right shift on doubleword", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(-128);
        alu.logicalRightShift<DoubleWord>(testDoubleword1);
        expect(testDoubleword1.toString()).toEqual("01111111111111111111111111000000");
        // 11111111111111111111111110000000
        // 01111111111111111111111111000000
    });

    test("Perform arithmetic right shift on doubleword", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(-128);
        alu.arithmeticRightShift<DoubleWord>(testDoubleword1);
        expect(testDoubleword1.toString()).toEqual("11111111111111111111111111000000");
        // 11111111111111111111111110000000
        // 11111111111111111111111111000000
    });

    test("Perform arithmetic right shift on doubleword and check shifted bit", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(-128);
        const shiftedBit: Bit = alu.arithmeticRightShift<DoubleWord>(testDoubleword1);
        expect(shiftedBit.toString()).toEqual("0");
    });

    test("Perform arithmetic right shift on byte and check shifted bit", () => {
        const testByte: Byte = new Byte([1, 0, 0, 0, 0, 0, 1, 1]);
        const shiftedBit: Bit = alu.logicalLeftShift<Byte>(testByte);
        expect(shiftedBit.toString()).toEqual("1");
    });

    test("Perform logical left shift on doubleword", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(-128);
        alu.logicalLeftShift<DoubleWord>(testDoubleword1);
        expect(testDoubleword1.toString()).toEqual("11111111111111111111111100000000");
        // 11111111111111111111111110000000
        // 11111111111111111111111100000000
    });

    test("Left shift byte one bit", () => {
        const testByte: Byte = new Byte([1, 0, 0, 0, 0, 0, 1, 1]);
        alu.logicalLeftShift<Byte>(testByte);
        expect(testByte.toString()).toEqual("00000110");
        // 10000011
        // 00000110
    });

    test("Perform MUL on binary representation of decimal 128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(255);
        expect(alu.mul(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000111111110000000");
    });

    test("Perform MUL on binary representation of decimal 128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(-256);
        expect(alu.mul(testDoubleword1, testDoubleword2).toString())
            .toEqual("11111111111111111000000000000000");
    });

    test("Perform MUL on binary representation of decimal 2147483647 and binary representation of decimal -1", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(2147483647);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(-1);
        expect(alu.mul(testDoubleword1, testDoubleword2).toString())
            .toEqual("10000000000000000000000000000001");
    });

    test("Perform MUL on binary representation of decimal -2147483647 and binary representation of decimal 0", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(-2147483648);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(0);
        expect(alu.mul(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000000000000");
    });

    test("Perform MUL on binary representation of decimal -128 and binary representation of decimal 255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(-128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(255);
        expect(alu.mul(testDoubleword1, testDoubleword2).toString())
            .toEqual("11111111111111111000000010000000");
    });

    test("Perform MUL on binary representation of decimal -128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(-128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(-255);
        expect(alu.mul(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000111111110000000");
    });

    test("Perform DIV on binary representation of decimal -128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(-128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(-255);
        expect(alu.div(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000000000000");
    });

    test("Perform DIV on binary representation of decimal 128 and binary representation of decimal -255", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(128);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(-255);
        expect(alu.div(testDoubleword1, testDoubleword2).toString())
            .toEqual("00000000000000000000000000000000");
    });

    test("Perform DIV on binary representation of decimal 256 and binary representation of decimal -128", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(256);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(-128);
        expect(alu.div(testDoubleword1, testDoubleword2).toString())
            .toEqual("11111111111111111111111111111110");
    });

    test("Perform DIV on binary representation of decimal -256 and binary representation of decimal 128", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(-256);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(128);
        expect(alu.div(testDoubleword1, testDoubleword2).toString())
            .toEqual("11111111111111111111111111111110");
    });

    test("Perform DIV on binary representation of decimal -256 and binary representation of decimal 128", () => {
        const testDoubleword1: DoubleWord = DoubleWord.fromInteger(-2001);
        const testDoubleword2: DoubleWord = DoubleWord.fromInteger(128);
        expect(alu.div(testDoubleword1, testDoubleword2).toString())
            .toEqual("11111111111111111111111111110001");
    });
});