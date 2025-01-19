import { readFileSync } from 'fs';
import { Assembler } from '../simulator/Assembler';
import { Doubleword } from '../types/Doubleword';

describe('Encode instructions', () => {
    const assembler = new Assembler(32);
    
    test('Encode instruction "ADD $1, %eax"', () => {
        let result: Doubleword[] = assembler.compile("ADD $1, %eax");
        let expectedOutput: Doubleword[] = [
            new Doubleword([1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]),
            new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "MOV $0x64, %eax"', () => {
        let result: Doubleword[] = assembler.compile("MOV $0x64, %eax");
        let expectedOutput: Doubleword[] = [
            new Doubleword([1,1,0,1,1,0,0,1,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0]),
            new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "NOP"', () => {
        let result: Doubleword[] = assembler.compile("NOP");
        let expectedOutput: Doubleword[] = [
            new Doubleword([1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0]),
            new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
            new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "ADD" with negative decimal immediate', () => {
        let result: Doubleword[] = assembler.compile("ADD $-10, %eax");
        let expectedOutput: Doubleword[] = [
            new Doubleword([1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new Doubleword([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0]),
            new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "ADD" with negative hexadecimal immediate', () => {
        let result: Doubleword[] = assembler.compile("ADD $-0x10, %eax");
        let expectedOutput: Doubleword[] = [
            new Doubleword([1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new Doubleword([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0]),
            new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "ADD" with negative binary immediate', () => {
        let result: Doubleword[] = assembler.compile("ADD $0b10, %eax");
        let expectedOutput: Doubleword[] = [
            new Doubleword([1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new Doubleword([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0]),
            new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test("Encode assembly programs", () => {        
        let result: Doubleword[] = assembler.compile(readFileSync("./assets/programs/examples/loop.asm", "utf8"));
        let expectedOutput: Doubleword[] = [
            new Doubleword([1,1,0,1,1,0,0,1,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0]),
            new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),

            new Doubleword([1,0,0,1,1,0,0,0,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]),
            new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),

            new Doubleword([1,0,0,1,1,0,0,0,0,1,1,1,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
            new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
            
            new Doubleword([1,1,1,1,1,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0]),
            new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0]),
            new Doubleword([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });
});