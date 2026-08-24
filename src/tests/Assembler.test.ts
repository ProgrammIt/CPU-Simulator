import { readFileSync } from 'fs';
import { Assembler } from '../main/simulator/Assembler';
import { DoubleWord } from '../types/binary/DoubleWord';
import { ProgramMetadata } from '../types/enumerations/ProgramMetadata';

describe('Encode instructions', () => {
    const assembler = new Assembler("./settings/language_definition.json", "./os_filesystem");
    
    const elfHeader: DoubleWord[] = [ProgramMetadata.ICE_MAGIC_NUMBER, 
        32 as DoubleWord, DoubleWord.ZERO, DoubleWord.ZERO, DoubleWord.ZERO, DoubleWord.ZERO, DoubleWord.ZERO, DoubleWord.ZERO,]

    test('Encode instruction "ADD $1, %eax"', () => {
        const result: DoubleWord[] = assembler.assemble("ADD $1, %eax");
        const expectedOutput: DoubleWord[] = [
            DoubleWord.fromNumber(0b00000000_00010010_00000001_00000000),
            DoubleWord.fromNumber(4278190080),
            DoubleWord.fromNumber(4278190080),
            DoubleWord.fromNumber(4278190080)
        ];
        expect(result.slice(24)).toEqual(expectedOutput);
    });

    test('Encode instruction "MOV $0x64, %eax"', () => {
        const result: DoubleWord[] = assembler.assemble("MOV $0x64, %eax");
        const expectedOutput: DoubleWord[] = [
            DoubleWord.fromNumber(0b00010010_00010010_01100100_00000000),
            DoubleWord.fromNumber(4278190080),
            DoubleWord.fromNumber(4278190080),
            DoubleWord.fromNumber(4278190080)
        ];
        expect(result.slice(24)).toEqual(expectedOutput);
    });

    test('Encode instruction "NOP"', () => {
        const result: DoubleWord[] = assembler.assemble("NOP");
        const expectedOutput: DoubleWord[] = [
            ...elfHeader,
            DoubleWord.fromNumber(1),
            DoubleWord.fromNumber(0),
            DoubleWord.fromNumber(96),
            DoubleWord.fromNumber(16),
            DoubleWord.fromNumber(4096),
            DoubleWord.fromNumber(112),
            DoubleWord.fromNumber(0),
            DoubleWord.fromNumber(4096),
            DoubleWord.fromNumber(112),
            DoubleWord.fromNumber(0),
            DoubleWord.fromNumber(4096),
            DoubleWord.fromNumber(0),
            DoubleWord.fromNumber(0),
            DoubleWord.fromNumber(0),
            DoubleWord.fromNumber(0),
            DoubleWord.fromNumber(0),

            DoubleWord.fromNumber(0b11111111_00000000_00000000_00000000),
            DoubleWord.fromNumber(4278190080),
            DoubleWord.fromNumber(4278190080),
            DoubleWord.fromNumber(4278190080)
        ];
        expect(result).toEqual(expectedOutput);
    });

    test('Encode instruction "ADD" with negative decimal immediate', () => {
        const result: DoubleWord[] = assembler.assemble("ADD $-10, %eax");
        const expectedOutput: DoubleWord[] = [
            DoubleWord.fromNumber(0b00000000_10010010_00000000_00000000),
            DoubleWord.fromNumber(0b11111111111111111111111111110110),
            DoubleWord.fromNumber(4278190080),
            DoubleWord.fromNumber(4278190080)
        ];
        expect(result.slice(24)).toEqual(expectedOutput);
    });

    test('Encode instruction "ADD" with negative hexadecimal immediate', () => {
        const result: DoubleWord[] = assembler.assemble("ADD $-0x10, %eax");
        const expectedOutput: DoubleWord[] = [
            DoubleWord.fromNumber(0b00000000_10010010_00000000_00000000),
            DoubleWord.fromNumber(0b11111111111111111111111111110000),
            DoubleWord.fromNumber(4278190080),
            DoubleWord.fromNumber(4278190080)
        ];
        expect(result.slice(24)).toEqual(expectedOutput);
    });

    test('Encode instruction "ADD" with negative binary immediate', () => {
        const result: DoubleWord[] = assembler.assemble("ADD $-0b10, %eax");
        const expectedOutput: DoubleWord[] = [
            DoubleWord.fromNumber(0b00000000_10010010_00000000_00000000),
            DoubleWord.fromNumber(0b11111111111111111111111111111110),
            DoubleWord.fromNumber(4278190080),
            DoubleWord.fromNumber(4278190080)
        ];
        expect(result.slice(24)).toEqual(expectedOutput);
    });

    test("Encode assembly programs", () => {        
        const result: DoubleWord[] = assembler.assemble(readFileSync("./os_filesystem/testing/loop.asm", "utf8"));
        const expectedOutput: DoubleWord[] = [
            DoubleWord.fromNumber(303195136),

            DoubleWord.fromNumber(34734336),

            DoubleWord.fromNumber(118620160),

            DoubleWord.fromNumber(239076352),
            DoubleWord.fromNumber(311558147),

            DoubleWord.fromNumber(305419896),
            DoubleWord.fromNumber(303173888),
            
            DoubleWord.fromNumber(454066176),
        ];
        expect(result.slice(24)).toEqual(expectedOutput);
    });
});