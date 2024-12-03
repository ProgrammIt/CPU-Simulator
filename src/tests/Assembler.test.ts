import { readFileSync } from 'fs';
import { Assembler } from '../simulator/Assembler';
import { Doubleword } from '../types/Doubleword';

describe('Encode instructions', () => {
    var assembler = Assembler.instance;
    assembler.loadLanguageDefinition(readFileSync("./src/settings/language_definition.json", "utf-8"));

    test('Encode instruction "ADD $1, %eax"', () => {
        const result: Doubleword = assembler.compile("ADD $1, %eax")[0];
        expect(result.toString()).toBe("10011000000011101010000101100000");
    });

    test('Encode instruction "MOV $0x64, %eax"', () => {
        const result: Doubleword = assembler.compile("MOV $0x64, %eax")[0];
        expect(result.toString()).toBe("11011001001011101010000101100000");
    });

    test('Encode instruction "NOP"', () => {
        const result: Doubleword = assembler.compile("NOP")[0];
        expect(result.toString()).toBe("10011111111111100000000100000000");
    });

    test("Encode assembly programs", () => {
        var assembler = Assembler.instance;
        assembler.loadLanguageDefinition(readFileSync("./src/settings/language_definition.json", "utf-8"));
        
        var loopTestProgram: string = readFileSync("./src/assets/programs/examples/loop.asm", "utf8");
        var expectedOutputLoopProgram: string[] = [
            "11011001001011101010000101100000",
            "00000000000000000000000001100100",
            "00000000000000000000000000000000",

            "10011000001011101010000101100000",
            "00000000000000000000000000000001",
            "00000000000000000000000000000000",

            "10011000011111101010000101100000",
            "00000000000000000000000000000000",
            "00000000000000000000000000000000",

            "11111000111011101110000100000000",
            "00000000000000000000000000001100",
            "00000000000000000000000000000000"
        ];

        const compiledProgramm: Doubleword[] = assembler.compile(loopTestProgram);
        const stringyfiedCompiledProgramm: string[] = [];
        compiledProgramm.forEach(doubleword => {
            stringyfiedCompiledProgramm.push(doubleword.toString());
        });
        
        expect(stringyfiedCompiledProgramm).toEqual(expectedOutputLoopProgram);
    });
});