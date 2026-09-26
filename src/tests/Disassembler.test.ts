import { Assembler } from '../main/simulator/Assembler';
import { DoubleWord } from '../types/binary/DoubleWord';
import { disassembleProgram } from '../main/simulator/Disassembler';
import { ProgramMetadata } from '../types/enumerations/ProgramMetadata';
import { Byte } from '../types/binary/Byte';

describe('Disassemble program', () => {
    const assembler = new Assembler("./settings/language_definition.json", "./os_filesystem");
    
    test('Decode instruction "ADD $1, %EAX"', () => {
        const binary: DoubleWord[] = assembler.assemble("ADD $1, %EAX", 0, ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS, Byte.fromNumber(4));
        const result = disassembleProgram(binary);
        expect(result).toEqual("ADD $0x1, %EAX\nNOP\nNOP\nNOP\n");
    });

    test('Decode instruction "MOV $0x64, %EAX"', () => {
        const binary: DoubleWord[] = assembler.assemble("MOV $0x64, %EAX", 0, ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS, Byte.fromNumber(4));
        const result = disassembleProgram(binary);
        expect(result).toEqual("MOV $0x64, %EAX\nNOP\nNOP\nNOP\n");
    });

    test('Decode instruction "NOP"', () => {
        const binary: DoubleWord[] = assembler.assemble("NOP", 0, ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS, Byte.fromNumber(4));
        const result = disassembleProgram(binary);
        expect(result).toEqual("NOP\nNOP\nNOP\nNOP\n");
    });

    test('Decode instruction "ADD" with negative decimal immediate', () => {
        const binary: DoubleWord[] = assembler.assemble("ADD $-10, %EAX", 0, ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS, Byte.fromNumber(4));
        const result = disassembleProgram(binary);
        expect(result).toEqual("ADD $0xfffffff6, %EAX\nNOP\nNOP\n");
    });

    test('Decode instruction "ADD" with negative hexadecimal immediate', () => {
        const binary: DoubleWord[] = assembler.assemble("ADD $-0x10, %EAX", 0, ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS, Byte.fromNumber(4));
        const result = disassembleProgram(binary);
        expect(result).toEqual("ADD $0xfffffff0, %EAX\nNOP\nNOP\n");
    });

    test('Decode instruction "ADD" with negative binary immediate', () => {
        const binary: DoubleWord[] = assembler.assemble("ADD $-0b10, %EAX", 0, ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS, Byte.fromNumber(4));
        const result = disassembleProgram(binary);
        expect(result).toEqual("ADD $0xfffffffe, %EAX\nNOP\nNOP\n");
    });

    test("Decode assembly programs", () => {        


    const input = `.CONST TEST "test string"
MOV $0x64, %EAX
SUB $0x1, %EAX
CMP $0x0, %EAX
JG @0x4
NOP
MOV $0x12345678, %EDX
MOV $0x11, %EAX
INT $0x80
`;


        const output = `.CONST CONSTANT_1 1952805748
.CONST CONSTANT_2 544437362
.CONST CONSTANT_3 1768843008
MOV $0x64, %EAX
SUB $0x1, %EAX
CMP $0x0, %EAX
JG @0x4
NOP
MOV $0x12345678, %EDX
MOV $0x11, %EAX
INT $0x80
NOP
NOP
NOP
`;
        const binary: DoubleWord[] = assembler.assemble(input, 0, ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS, Byte.fromNumber(4));
        const result = disassembleProgram(binary);
        expect(result).toEqual(output);
    });
});