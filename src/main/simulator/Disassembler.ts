import { Byte } from "../../types/binary/Byte";
import { DoubleWord } from "../../types/binary/DoubleWord";
import { InstructionOperand } from "../../types/binary/InstructionOperand";
import { DecodedOperandTypes } from "../../types/enumerations/DecodedOperandTypes";
import { EncodedOperandTypes } from "../../types/enumerations/EncodedOperandTypes";
import { ProgramMetadata } from "../../types/enumerations/ProgramMetadata";
import { OpCode } from "../../types/enumerations/OpCode";
import { RegisterNumbers } from "../../types/enumerations/RegisterNumbers";

export function disassembleProgram(program: DoubleWord[]): string {

    let disassembledCode = "";

    const metadata: ProgramMetadata = ProgramMetadata.fromFileArray(program);

    let roDataSegmentContent = "";

    for (let i = 0; i < ProgramMetadata.getRoDataSegmentSize(metadata) / DoubleWord.NUMBER_OF_BYTES; i++) {

        const value = program[ProgramMetadata.getRoDataSegmentFileOffset(metadata) / DoubleWord.NUMBER_OF_BYTES + i];
        roDataSegmentContent += String.fromCharCode(
            value >>> 24,
            value >>> 16 & 255,
            value >>> 8 & 255,
            value & 255
        );
    }

    if (roDataSegmentContent !== "") {
        disassembledCode += ".CONST RO_DATA_CONTENT \"" + roDataSegmentContent.replace(/\0+$/, "") + "\"\n";
    }

    for (let i = 0; i < ProgramMetadata.getDataSegmentSize(metadata) / DoubleWord.NUMBER_OF_BYTES; i++) {
        disassembledCode += ".variable_" + (i + 1) + " " + program[ProgramMetadata.getDataSegmentFileOffset(metadata) / DoubleWord.NUMBER_OF_BYTES + i] + "\n";
    }

    if (ProgramMetadata.getUninitializedDataSegmentSize(metadata) !== 0)
    {
        disassembledCode += ".BUF" + ProgramMetadata.getUninitializedDataSegmentSize(metadata) + " buffer\n";
    }

    program = program.slice(ProgramMetadata.getProgramHeaderOffset(metadata) / DoubleWord.NUMBER_OF_BYTES + ProgramMetadata.PROGRAM_HEADER_SIZE_IN_DOUBLEWORDS, ProgramMetadata.getProgramHeaderOffset(metadata) / DoubleWord.NUMBER_OF_BYTES + ProgramMetadata.PROGRAM_HEADER_SIZE_IN_DOUBLEWORDS + ProgramMetadata.getTextSegmentSize(metadata) / DoubleWord.NUMBER_OF_BYTES);

    return disassembledCode + disassemble(program, ProgramMetadata.getInstructionEncodingType(metadata));
};

export function disassemble(program: DoubleWord[],
    encodingType: ProgramMetadata.InstructionEncodingType = ProgramMetadata.InstructionEncodingType.FIXED_SIZE): string {

    let disassembledCode = "";

    for (let i = 0; i < program.length; i++) {

        const operationHeader = program[i];
        
        // Split instruction into its components.
        const encodedOpCode: Byte =  DoubleWord.getFirstByte(operationHeader);
        const encodedFirstOperandType: number =  DoubleWord.getBitRange(operationHeader, 8, 12);
        const encodedSecondOperandType: number =  DoubleWord.getBitRange(operationHeader, 12, 16);
        // Decode instruction.
        // Decode instruction type.

        if (!(encodedOpCode in OpCode)) {
            throw new Error("Invalid Opcode at position: " + i + " with the value of:" + operationHeader);
        }

        const decodedOpCode: OpCode = encodedOpCode as OpCode;

        // Decode type of first operand.

        if (!(encodedFirstOperandType in EncodedOperandTypes)) {
            throw new Error("Invalid Opcode at position: " + i + " with the value of:" + operationHeader);
        }

        let decodedFirstOperandType: EncodedOperandTypes = encodedFirstOperandType as EncodedOperandTypes;
   
        // Decode type of second operand.

        if (!(encodedSecondOperandType in EncodedOperandTypes)) {
            throw new Error("Invalid Opcode at position: " + i + " with the value of:" + operationHeader);
        }

        let decodedSecondOperandType: EncodedOperandTypes = encodedSecondOperandType as EncodedOperandTypes;
   
        let decodedFirstOperand: InstructionOperand | null;
        let decodedSecondOperand: InstructionOperand | null;

        let addPaddingForFirstOperand = false;
        let addPaddingForSecondOperand = false

        switch (decodedFirstOperandType) {
            case EncodedOperandTypes.PADDING:
                decodedFirstOperandType ^= 0b1000; 
                i++;
                addPaddingForFirstOperand = encodingType !== ProgramMetadata.InstructionEncodingType.FIXED_SIZE;
                // fallthrough
            case EncodedOperandTypes.NO:
                decodedFirstOperand = null;
                break;
            case EncodedOperandTypes.EMBEDDED_IMMEDIATE:
            case EncodedOperandTypes.EMBEDDED_MEMORY_ADDRESS:
                decodedFirstOperandType ^= 0b1000; 
                // fallthrough
            case EncodedOperandTypes.REGISTER_DIRECT:
            case EncodedOperandTypes.REGISTER_INDIRECT:
                decodedFirstOperand = new InstructionOperand(
                    decodedFirstOperandType as DecodedOperandTypes,
                    DoubleWord.fromNumber(DoubleWord.getThirdByte(operationHeader))
                );
                break;
            case EncodedOperandTypes.MEMORY_ADDRESS:
            case EncodedOperandTypes.IMMEDIATE:
                decodedFirstOperand = new InstructionOperand(
                    decodedFirstOperandType,
                    program[i+1]
                );
                i++;
                if (decodedFirstOperand.value < 256) {
                    addPaddingForFirstOperand = encodingType === ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS;
                }
                break;
            case EncodedOperandTypes.EXTERNAL_REGISTER_DIRECT:
            case EncodedOperandTypes.EXTERNAL_REGISTER_INDIRECT:
                decodedFirstOperandType ^= 0b1000; 
                decodedFirstOperand = new InstructionOperand(
                    decodedFirstOperandType as DecodedOperandTypes,
                    program[i+1]
                );
                i++;
                if (decodedFirstOperand.value < 256) {
                    addPaddingForFirstOperand = encodingType === ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS;
                }
                break;
            default:
                decodedFirstOperand = null;
                break;
        }

        switch (decodedSecondOperandType) {
            case EncodedOperandTypes.PADDING:
                decodedSecondOperandType ^= 0b1000; 
                i++
                addPaddingForSecondOperand = encodingType !== ProgramMetadata.InstructionEncodingType.FIXED_SIZE;
                // fallthrough
            case EncodedOperandTypes.NO:
                decodedSecondOperand = null;
                break;
            case EncodedOperandTypes.EMBEDDED_IMMEDIATE:
            case EncodedOperandTypes.EMBEDDED_MEMORY_ADDRESS:
                decodedSecondOperandType ^= 0b1000; 
                // fallthrough
            case EncodedOperandTypes.REGISTER_DIRECT:
            case EncodedOperandTypes.REGISTER_INDIRECT:
                decodedSecondOperand = new InstructionOperand(
                    decodedSecondOperandType as DecodedOperandTypes,
                    DoubleWord.fromNumber(DoubleWord.getFourthByte(operationHeader))
                );
                break;
            case EncodedOperandTypes.MEMORY_ADDRESS:
            case EncodedOperandTypes.IMMEDIATE:
                decodedSecondOperand = new InstructionOperand(
                    decodedSecondOperandType,
                    program[i+1]
                );
                i++;
                if (decodedSecondOperand.value < 256) {
                    addPaddingForSecondOperand = encodingType === ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS;
                }
                break;
            case EncodedOperandTypes.EXTERNAL_REGISTER_DIRECT:
            case EncodedOperandTypes.EXTERNAL_REGISTER_INDIRECT:
                decodedSecondOperandType ^= 0b1000; 
                decodedSecondOperand = new InstructionOperand(
                    decodedSecondOperandType as DecodedOperandTypes,
                    program[i+1]
                );
                i++;
                if (decodedSecondOperand.value < 256) {
                    addPaddingForSecondOperand = encodingType === ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS;
                }
                break;
            default:
                decodedSecondOperand = null;
                break;
        }

        disassembledCode += OpCode[decodedOpCode];

        if (decodedFirstOperand !== null) {
            if (decodedFirstOperandType === EncodedOperandTypes.IMMEDIATE) {
                disassembledCode += " $0x" + decodedFirstOperand.value.toString(16);
            } else if (decodedFirstOperandType === EncodedOperandTypes.MEMORY_ADDRESS) {
                disassembledCode += " @0x" + decodedFirstOperand.value.toString(16);
            } else {

                if (decodedFirstOperandType === EncodedOperandTypes.REGISTER_INDIRECT) {
                    disassembledCode += " *%" + RegisterNumbers[decodedFirstOperand.value];
                } else {
                    disassembledCode += " %" + RegisterNumbers[decodedFirstOperand.value];
                }
            }
        }

        if (decodedSecondOperand !== null) {
            if (decodedSecondOperandType === EncodedOperandTypes.IMMEDIATE) {
                disassembledCode += ", $0x" + decodedSecondOperand.value.toString(16);
            } else if (decodedSecondOperandType === EncodedOperandTypes.MEMORY_ADDRESS) {
                disassembledCode += ", @0x" + decodedSecondOperand.value.toString(16);
            } else {
                if (decodedSecondOperandType === EncodedOperandTypes.REGISTER_INDIRECT) {
                    disassembledCode += ", *%" + RegisterNumbers[decodedSecondOperand.value];
                } else {
                    disassembledCode += ", %" + RegisterNumbers[decodedSecondOperand.value];
                }
            }
        }
            
        disassembledCode += "\n";

        if (addPaddingForFirstOperand)
        {
            disassembledCode += "NOP\n";
        }

        if (addPaddingForSecondOperand)
        {
            disassembledCode += "NOP\n";
        }
    }

    return disassembledCode;
};

export function disassembleIfPossble(program: DoubleWord[]): [string, number][] {

    const disassembledCode = [];
    let instructionLenght = 1;

    for (let i = 0; i < program.length; i+=instructionLenght) {

        let disassembledInstruction = "";
        instructionLenght = 1;

        if (program[i] === 0)
        {
            disassembledCode.push(["Invalid", 1] as [string, number]);
            continue;
        }

        const operationHeader = program[i];
        
        // Split instruction into its components.
        const encodedOpCode: Byte =  DoubleWord.getFirstByte(operationHeader);
        const encodedFirstOperandType: number =  DoubleWord.getBitRange(operationHeader, 8, 12);
        const encodedSecondOperandType: number =  DoubleWord.getBitRange(operationHeader, 12, 16);
        // Decode instruction.
        // Decode instruction type.

        if (!(encodedOpCode in OpCode)) {
            disassembledCode.push(["Invalid", 1] as [string, number]);
            continue;
        }

        const decodedOpCode: OpCode = encodedOpCode as OpCode;

        // Decode type of first operand.

        if (!(encodedFirstOperandType in EncodedOperandTypes)) {
            disassembledCode.push(["Invalid", 1] as [string, number]);
            continue;
        }

        let decodedFirstOperandType: EncodedOperandTypes = encodedFirstOperandType as EncodedOperandTypes;
   
        // Decode type of second operand.

        if (!(encodedSecondOperandType in EncodedOperandTypes)) {
            disassembledCode.push(["Invalid", 1] as [string, number]);
            continue;        
        }

        let decodedSecondOperandType: EncodedOperandTypes = encodedSecondOperandType as EncodedOperandTypes;
   
        let decodedFirstOperand: InstructionOperand | null;
        let decodedSecondOperand: InstructionOperand | null;

        switch (decodedFirstOperandType) {
            case EncodedOperandTypes.PADDING:
                decodedFirstOperandType ^= 0b1000; 
                instructionLenght++;
                // fallthrough
            case EncodedOperandTypes.NO:
                decodedFirstOperand = null;
                break;
            case EncodedOperandTypes.EMBEDDED_IMMEDIATE:
            case EncodedOperandTypes.EMBEDDED_MEMORY_ADDRESS:
                decodedFirstOperandType ^= 0b1000; 
                // fallthrough
            case EncodedOperandTypes.REGISTER_DIRECT:
            case EncodedOperandTypes.REGISTER_INDIRECT:
                decodedFirstOperand = new InstructionOperand(
                    decodedFirstOperandType as DecodedOperandTypes,
                    DoubleWord.fromNumber(DoubleWord.getThirdByte(operationHeader))
                );
                break;
            case EncodedOperandTypes.MEMORY_ADDRESS:
            case EncodedOperandTypes.IMMEDIATE:
                decodedFirstOperand = new InstructionOperand(
                    decodedFirstOperandType,
                    program[instructionLenght+i]
                );
                instructionLenght++;
                break;
            case EncodedOperandTypes.EXTERNAL_REGISTER_DIRECT:
            case EncodedOperandTypes.EXTERNAL_REGISTER_INDIRECT:
                decodedFirstOperandType ^= 0b1000; 
                decodedFirstOperand = new InstructionOperand(
                    decodedFirstOperandType as DecodedOperandTypes,
                    program[instructionLenght+i]
                );
                instructionLenght++;
                break;
            default:
                decodedFirstOperand = null;
                break;
        }

        switch (decodedSecondOperandType) {
            case EncodedOperandTypes.PADDING:
                decodedSecondOperandType ^= 0b1000; 
                instructionLenght++;
                // fallthrough
            case EncodedOperandTypes.NO:
                decodedSecondOperand = null;
                break;
            case EncodedOperandTypes.EMBEDDED_IMMEDIATE:
            case EncodedOperandTypes.EMBEDDED_MEMORY_ADDRESS:
                decodedSecondOperandType ^= 0b1000; 
                // fallthrough
            case EncodedOperandTypes.REGISTER_DIRECT:
            case EncodedOperandTypes.REGISTER_INDIRECT:
                decodedSecondOperand = new InstructionOperand(
                    decodedSecondOperandType as DecodedOperandTypes,
                    DoubleWord.fromNumber(DoubleWord.getFourthByte(operationHeader))
                );
                break;
            case EncodedOperandTypes.MEMORY_ADDRESS:
            case EncodedOperandTypes.IMMEDIATE:
                decodedSecondOperand = new InstructionOperand(
                    decodedSecondOperandType,
                    program[instructionLenght+i]
                );
                instructionLenght++;
                break;
            case EncodedOperandTypes.EXTERNAL_REGISTER_DIRECT:
            case EncodedOperandTypes.EXTERNAL_REGISTER_INDIRECT:
                decodedSecondOperandType ^= 0b1000; 
                decodedSecondOperand = new InstructionOperand(
                    decodedSecondOperandType as DecodedOperandTypes,
                    program[instructionLenght+i]
                );
                instructionLenght++;
                break;
            default:
                decodedSecondOperand = null;
                break;
        }

        disassembledInstruction += OpCode[decodedOpCode];

        if (decodedFirstOperand !== null) {
            if (decodedFirstOperand.value === undefined) {
                disassembledCode.push(["Decoding Error", instructionLenght] as [string, number]);
                continue;        
            }
            if (decodedFirstOperandType === EncodedOperandTypes.IMMEDIATE) {
                disassembledInstruction += " $0x" + decodedFirstOperand.value.toString(16);
            } else if (decodedFirstOperandType === EncodedOperandTypes.MEMORY_ADDRESS) {
                disassembledInstruction += " @0x" + decodedFirstOperand.value.toString(16);
            } else {

                if (decodedFirstOperandType === EncodedOperandTypes.REGISTER_INDIRECT) {
                    disassembledInstruction += " *%" + RegisterNumbers[decodedFirstOperand.value];
                } else {
                    disassembledInstruction += " %" + RegisterNumbers[decodedFirstOperand.value];
                }
            }
        }

        if (decodedSecondOperand !== null) {
            if (decodedSecondOperand.value === undefined) {
                disassembledCode.push(["Decoding Error", instructionLenght] as [string, number]);
                continue;        
            }
            if (decodedSecondOperandType === EncodedOperandTypes.IMMEDIATE) {
                disassembledInstruction += ", $0x" + decodedSecondOperand.value.toString(16);
            } else if (decodedSecondOperandType === EncodedOperandTypes.MEMORY_ADDRESS) {
                disassembledInstruction += ", @0x" + decodedSecondOperand.value.toString(16);
            } else {
                if (decodedSecondOperandType === EncodedOperandTypes.REGISTER_INDIRECT) {
                    disassembledInstruction += ", *%" + RegisterNumbers[decodedSecondOperand.value];
                } else {
                    disassembledInstruction += ", %" + RegisterNumbers[decodedSecondOperand.value];
                }
            }
        }
            
        disassembledCode.push([disassembledInstruction, instructionLenght] as [string, number]);
    }

    return disassembledCode;
};