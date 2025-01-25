import { readFileSync } from 'fs';
import Assembler from '../simulator/Assembler';
import DoubleWord from '../binary_types/DoubleWord';

describe('Encode instructions', () => {
    const assembler = new Assembler(32);
    
    test('Encode instruction "ADD $1, %eax"', () => {
        let result: DoubleWord[] = assembler.compile("ADD $1, %eax");
        let expectedOutput: DoubleWord[] = [
            new DoubleWord([1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "MOV $0x64, %eax"', () => {
        let result: DoubleWord[] = assembler.compile("MOV $0x64, %eax");
        let expectedOutput: DoubleWord[] = [
            new DoubleWord([1,1,0,1,1,0,0,1,0,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "NOP"', () => {
        let result: DoubleWord[] = assembler.compile("NOP");
        let expectedOutput: DoubleWord[] = [
            new DoubleWord([1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "ADD" with negative decimal immediate', () => {
        let result: DoubleWord[] = assembler.compile("ADD $-10, %eax");
        let expectedOutput: DoubleWord[] = [
            new DoubleWord([1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new DoubleWord([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "ADD" with negative hexadecimal immediate', () => {
        let result: DoubleWord[] = assembler.compile("ADD $-0x10, %eax");
        let expectedOutput: DoubleWord[] = [
            new DoubleWord([1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new DoubleWord([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "ADD" with negative binary immediate', () => {
        let result: DoubleWord[] = assembler.compile("ADD $0b10, %eax");
        let expectedOutput: DoubleWord[] = [
            new DoubleWord([1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0]),
            new DoubleWord([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0]),
            new DoubleWord([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
        ];
        expect(result).toEqual(expectedOutput);
    });

    test("Encode assembly programs", () => {        
        let result: DoubleWord[] = assembler.compile(readFileSync("./assembly/examples/loop.asm", "utf8"));
        let expectedOutput: DoubleWord[] = [
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