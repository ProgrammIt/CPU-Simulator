import { readFileSync } from 'fs';
import { Assembler } from '../main/simulator/Assembler';
import { DoubleWord } from '../types/binary/DoubleWord';

describe('Encode instructions', () => {
    const assembler = new Assembler("./settings/language_definition.json");
    
    test('Encode instruction "ADD $1, %eax"', () => {
        const result: DoubleWord[] = assembler.compile("ADD $1, %eax");
        const expectedOutput: DoubleWord[] = [
            new DoubleWord([1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "MOV $0x64, %eax"', () => {
        const result: DoubleWord[] = assembler.compile("MOV $0x64, %eax");
        const expectedOutput: DoubleWord[] = [
            new DoubleWord([1,1,0,1,1,0,0,1,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "NOP"', () => {
        const result: DoubleWord[] = assembler.compile("NOP");
        const expectedOutput: DoubleWord[] = [
            new DoubleWord([1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "ADD" with negative decimal immediate', () => {
        const result: DoubleWord[] = assembler.compile("ADD $-10, %eax");
        const expectedOutput: DoubleWord[] = [
            new DoubleWord([1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new DoubleWord([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "ADD" with negative hexadecimal immediate', () => {
        const result: DoubleWord[] = assembler.compile("ADD $-0x10, %eax");
        const expectedOutput: DoubleWord[] = [
            new DoubleWord([1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new DoubleWord([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "ADD" with negative binary immediate', () => {
        const result: DoubleWord[] = assembler.compile("ADD $0b10, %eax");
        const expectedOutput: DoubleWord[] = [
            new DoubleWord([1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new DoubleWord([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test("Encode assembly programs", () => {        
        const result: DoubleWord[] = assembler.compile(readFileSync("./assembly/examples/loop.asm", "utf8"));
        const expectedOutput: DoubleWord[] = [
            new DoubleWord([1,1,0,1,1,0,0,1,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),

            new DoubleWord([1,0,0,1,1,0,0,0,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),

            new DoubleWord([1,0,0,1,1,0,0,0,0,1,1,1,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
            
            new DoubleWord([1,1,1,1,1,0,0,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });
});