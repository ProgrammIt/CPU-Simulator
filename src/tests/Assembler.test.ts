import { readFileSync } from 'fs';
import { Assembler } from '../simulator/Assembler';
import { DoubleWord } from '../types/binary/DoubleWord';
import { describe, expect, test } from '@jest/globals';

describe('Encode instructions', () => {
    const assembler = new Assembler("./settings/language_definition.json", "./os_filesystem");
    
    test('Encode instruction "ADD $1, %eax"', () => {
        const result: DoubleWord[] = assembler.assemble("ADD $1, %eax");
        const expectedOutput: DoubleWord[] = [
            DoubleWord.fromNumber(0b10011000000011101010000101100000),
            DoubleWord.fromNumber(1),
            DoubleWord.fromNumber(0)
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "MOV $0x64, %eax"', () => {
        const result: DoubleWord[] = assembler.assemble("MOV $0x64, %eax");
        const expectedOutput: DoubleWord[] = [
            DoubleWord.fromNumber(0b11011001001011101010000101100000),
            DoubleWord.fromNumber(0b1100100),
            DoubleWord.fromNumber(0)
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "NOP"', () => {
        const result: DoubleWord[] = assembler.assemble("NOP");
        const expectedOutput: DoubleWord[] = [
            DoubleWord.fromNumber(0b10011111111111100000000100000000),
            DoubleWord.fromNumber(0),
            DoubleWord.fromNumber(0)
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "ADD" with negative decimal immediate', () => {
        const result: DoubleWord[] = assembler.assemble("ADD $-10, %eax");
        const expectedOutput: DoubleWord[] = [
            DoubleWord.fromNumber(0b10011000000011101010000101100000),
            DoubleWord.fromNumber(0b11111111111111111111111111110110),
            DoubleWord.fromNumber(0)
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "ADD" with negative hexadecimal immediate', () => {
        const result: DoubleWord[] = assembler.assemble("ADD $-0x10, %eax");
        const expectedOutput: DoubleWord[] = [
            DoubleWord.fromNumber(0b10011000000011101010000101100000),
            DoubleWord.fromNumber(0b11111111111111111111111111110000),
            DoubleWord.fromNumber(0)
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "ADD" with negative binary immediate', () => {
        const result: DoubleWord[] = assembler.assemble("ADD $0b10, %eax");
        const expectedOutput: DoubleWord[] = [
            DoubleWord.fromNumber(0b10011000000011101010000101100000),
            DoubleWord.fromNumber(0b11111111111111111111111111111110),
            DoubleWord.fromNumber(0)
        ];
        expect(result).toEqual(expectedOutput);
    });

    test("Encode assembly programs", () => {        
        const result: DoubleWord[] = assembler.assemble(readFileSync("./os_filesystem/home/examples/loop.asm", "utf8"));
        const expectedOutput: DoubleWord[] = [
            DoubleWord.fromNumber(0b11011001001011101010000101100000),
            DoubleWord.fromNumber(100),
            DoubleWord.fromNumber(0),

            DoubleWord.fromNumber(0b10011000001011101010000101100000),
            DoubleWord.fromNumber(1),
            DoubleWord.fromNumber(0),

            DoubleWord.fromNumber(0b10011000011111101010000101100000),
            DoubleWord.fromNumber(0),
            DoubleWord.fromNumber(0),

            DoubleWord.fromNumber(0b11111000111011101110000100000000),
            DoubleWord.fromNumber(0b1100),
            DoubleWord.fromNumber(0),

            DoubleWord.fromNumber(0b11011001001011101010000101100000),
            DoubleWord.fromNumber(305419896),
            DoubleWord.fromNumber(3),

            DoubleWord.fromNumber(0b11011001001011101010000101100000),
            DoubleWord.fromNumber(17),
            DoubleWord.fromNumber(0),

            DoubleWord.fromNumber(4190019840),
            DoubleWord.fromNumber(128),
            DoubleWord.fromNumber(0)
        ];
        expect(result).toEqual(expectedOutput);
    });
});