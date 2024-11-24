import { AddressingModes, InstructionTypes, OperandTypes, Operations } from "../types";
import { Bit } from "../types/Bit";

/**
 * This class is dedicated to decoding a binary instruction.
 * It offers an interface for decoding different parts of an instruction.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class InstructionDecoder {
    /**
     * This method decodes the type of an instructions operand.
     * @param encodedOperandType 
     * @returns 
     */
    public static decodeOperandType(encodedOperandType: Array<Bit>): OperandTypes {
        var decodedOperandType: OperandTypes;
        switch (encodedOperandType.join("")) {
            case OperandTypes.CONSTANT:
                decodedOperandType = OperandTypes.CONSTANT;
                break;
            case OperandTypes.MEMORY_ADDRESS:
                decodedOperandType = OperandTypes.MEMORY_ADDRESS;
                break;
            case OperandTypes.REGISTER:
                decodedOperandType = OperandTypes.REGISTER;
                break;
            case OperandTypes.NO:
                decodedOperandType = OperandTypes.NO;
                break;
            default:
                throw Error("Unrecognized operand type.");
                break;
        }
        return decodedOperandType;
    }

    /**
     * This method decodes the addressing mode of an instructions operand.
     * @param encodedAddressingMode 
     * @returns 
     */
    public static decodeAddressingMode(encodedAddressingMode: Array<Bit>): AddressingModes {
        var decodedAddressingMode: AddressingModes;
        switch (encodedAddressingMode.join("")) {
            case AddressingModes.DIRECT:
                decodedAddressingMode = AddressingModes.DIRECT;
                break;
            case AddressingModes.INDIRECT:
                decodedAddressingMode = AddressingModes.INDIRECT;        
            default:
                throw Error("Unrecognized addressing mode.");
                break;
        }
        return decodedAddressingMode;
    }

    /**
     * This methods decodes an instructions type.
     * @param encodedInstructionType The binary encoded instructions type.
     * @returns A decoded representation of the type.
     */
    public static decodeInstructionType(encodedInstructionType: Array<Bit>): InstructionTypes {
        var decodedInstructionType: InstructionTypes;
        if (encodedInstructionType.join("") === InstructionTypes.I) {
            decodedInstructionType = InstructionTypes.I;
        } else if (encodedInstructionType.join("") === InstructionTypes.J) {
            decodedInstructionType = InstructionTypes.J;
        } else {
            decodedInstructionType = InstructionTypes.R;
        }
        return decodedInstructionType;
    }

    /**
     * This methods decodes an I-type instructions operation.
     * @param encodedOperation The binary encoded I-type operation.
     * @returns A decoded representation of the operation.
     */
    public static decodeIOperation(encodedOperation: Array<Bit>): Operations {
        var decodedITypeOperation: Operations;
        switch (encodedOperation.join("")) {
            case Operations.MOV:
                decodedITypeOperation = Operations.MOV;
                break;
            case Operations.LEA:
                decodedITypeOperation = Operations.LEA;
                break;
            case Operations.POPF:
                decodedITypeOperation = Operations.POPF;
                break;
            case Operations.PUSHF:
                decodedITypeOperation = Operations.PUSHF;
                break;
            case Operations.POP:
                decodedITypeOperation = Operations.POP;
                break;
            case Operations.PUSH:
                decodedITypeOperation = Operations.PUSH;
                break;
            default:
                throw Error("Unrecognized I-type instruction.");
                break;
        }
        return decodedITypeOperation;
    }

    /**
     * This methods decodes a J-type instructions operation.
     * @param encodedOperation The binary encoded J-type operation.
     * @returns A decoded representation of the operation.
     */
    public static decodeJOperation(encodedOperation: Array<Bit>): Operations {
        var decodedJTypeOperation: Operations;
        switch (encodedOperation.join("")) {
            case Operations.JMP:
                decodedJTypeOperation = Operations.JMP;
                break;
            case Operations.JZ:
                decodedJTypeOperation = Operations.JZ;
                break;
            case Operations.JE:
                decodedJTypeOperation = Operations.JE;
                break;
            case Operations.JNZ:
                decodedJTypeOperation = Operations.JNZ;
                break;
            case Operations.JNE:
                decodedJTypeOperation = Operations.JNE;
                break;
            case Operations.JG:
                decodedJTypeOperation = Operations.JG;
                break;
            case Operations.JGE:
                decodedJTypeOperation = Operations.JGE;
                break;
            case Operations.JL:
                decodedJTypeOperation = Operations.JL;
                break;
            case Operations.JLE:
                decodedJTypeOperation = Operations.JLE;
                break;
            case Operations.JZ:
                decodedJTypeOperation = Operations.JZ;
                break;
            case Operations.INT:
                decodedJTypeOperation = Operations.INT;
                break;
            case Operations.IRET:
                decodedJTypeOperation = Operations.IRET;
                break;
            case Operations.CALL:
                decodedJTypeOperation = Operations.CALL;
                break;
            case Operations.RET:
                decodedJTypeOperation = Operations.RET;
                break;
            case Operations.SYSENTER:
                decodedJTypeOperation = Operations.SYSENTER;
                break;
            case Operations.SYSEXIT:
                decodedJTypeOperation = Operations.SYSEXIT;
                break;
            default:
                throw Error("Unrecognized J-type instruction.");
                break;
        }
        return decodedJTypeOperation;
    }

    /**
     * This methods decodes a R-type instructions operation.
     * @param encodedOperation The binary encoded R-type operation.
     * @returns A decoded representation of the operation.
     */
    public static decodeROperation(encodedOperation: Array<Bit>): Operations {
        var decodedRTypeOperation: Operations;
        switch (encodedOperation.join("")) {
            case Operations.ADD:
                decodedRTypeOperation = Operations.ADD;
                break;
            case Operations.ADC:
                decodedRTypeOperation = Operations.ADC;
                break;
            case Operations.SUB:
                decodedRTypeOperation = Operations.SUB;
                break;
            case Operations.SBB:
                decodedRTypeOperation = Operations.SBB;
                break;
            case Operations.MUL:
                decodedRTypeOperation = Operations.MUL;
                break;
            case Operations.DIV:
                decodedRTypeOperation = Operations.DIV;
                break;
            case Operations.NEG:
                decodedRTypeOperation = Operations.NEG;
                break;
            case Operations.CMP:
                decodedRTypeOperation = Operations.CMP;
                break;
            case Operations.TEST:
                decodedRTypeOperation = Operations.TEST;
                break;
            case Operations.CLC:
                decodedRTypeOperation = Operations.CLC;
                break;
            case Operations.CMC:
                decodedRTypeOperation = Operations.CMC;
                break;
            case Operations.STC:
                decodedRTypeOperation = Operations.STC;
                break;
            case Operations.CLI:
                decodedRTypeOperation = Operations.CLI;
                break;
            case Operations.STI:
                decodedRTypeOperation = Operations.STI;
                break;
            case Operations.AND:
                decodedRTypeOperation = Operations.AND;
                break;
            case Operations.OR:
                decodedRTypeOperation = Operations.OR;
                break;
            case Operations.XOR:
                decodedRTypeOperation = Operations.XOR;
                break;
            case Operations.NOT:
                decodedRTypeOperation = Operations.NOT;
                break;
            case Operations.NOP:
                decodedRTypeOperation = Operations.NOP;
                break;
            default:
                throw Error("Unrecognized R-type instrcution.");
                break;
            }
        return decodedRTypeOperation;
    }
}