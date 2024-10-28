import {describe, expect, test} from '@jest/globals';
import {Assembler} from './Assembler';
import { readFileSync } from 'fs';

describe('Encode instructions', () => {
    var assembler = Assembler.instance;
    assembler.loadLanguageDefinition(readFileSync("./src/settings/language_definition.json", "utf-8"));

    test('Encode instruction "ADD $1, %eax"', () => {
        expect(assembler.compile("ADD $1, %eax")[0]).toBe("10011000000011101010000101100000");
    });

    test('Encode instruction "MOV $0x64, %eax"', () => {
        expect(assembler.compile("MOV $0x64, %eax")[0]).toBe("11011001001011101010000101100000");
    });

    test('Encode instruction "NOP"', () => {
        expect(assembler.compile("NOP")[0]).toBe("10011111111111100000000100000000");
    });
});

describe("Encode assembly programs", () => {
    var assembler = Assembler.instance;
    assembler.loadLanguageDefinition(readFileSync("./src/settings/language_definition.json", "utf-8"));
    
    var loopTestProgram: string = "MOV $0x64, %eax      ; Kopiere den Wert 100 in das Register eax.\n\n.loop: \n\tSUB $1, %eax     ; Subtrahiere den Wert 1 vom Wert im Register eax.\n\tCMP $0, %eax     ; Vergleiche den Inhalt von Register eax mit der 0.\n\tJG loop         ; Springe zum Schleifenanfang, wenn der Wert im Register ax noch größer als 0 ist.\n\n; Ende des Programms. Das Ergebnis steht in Register eax.";
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
        "00000000000000000000000000000101",
        "00000000000000000000000000000000"
    ];
    
    test("Encode assembly program with a simple loop", () => {
        expect(assembler.compile(loopTestProgram)).toEqual(expectedOutputLoopProgram);
    });
});