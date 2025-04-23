import { EncodedAddressingModes } from "../../types/enumerations/EncodedAdressingModes";
import { Bit } from "../../types/binary/Bit";
import { EncodedInstructionTypes } from "../../types/enumerations/EncodedInstructionTypes";
import { EncodedOperandTypes } from "../../types/enumerations/EncodedOperandTypes";
import { EncodedOperations } from "../../types/enumerations/EncodedOperations";

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
    public static decodeOperandType(encodedOperandType: Array<Bit>): EncodedOperandTypes {
        let decodedOperandType: EncodedOperandTypes;
        switch (encodedOperandType.join("")) {
            case EncodedOperandTypes.IMMEDIATE:
                decodedOperandType = EncodedOperandTypes.IMMEDIATE;
                break;
            case EncodedOperandTypes.MEMORY_ADDRESS:
                decodedOperandType = EncodedOperandTypes.MEMORY_ADDRESS;
                break;
            case EncodedOperandTypes.REGISTER:
                decodedOperandType = EncodedOperandTypes.REGISTER;
                break;
            case EncodedOperandTypes.NO:
                decodedOperandType = EncodedOperandTypes.NO;
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
    public static decodeAddressingMode(encodedAddressingMode: Array<Bit>): EncodedAddressingModes {
        let decodedAddressingMode: EncodedAddressingModes;
        switch (encodedAddressingMode.join("")) {
            case EncodedAddressingModes.DIRECT:
                decodedAddressingMode = EncodedAddressingModes.DIRECT;
                break;
            case EncodedAddressingModes.INDIRECT:
                decodedAddressingMode = EncodedAddressingModes.INDIRECT;
                break;       
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
    public static decodeInstructionType(encodedInstructionType: Array<Bit>): EncodedInstructionTypes {
        let decodedInstructionType: EncodedInstructionTypes;
        if (encodedInstructionType.join("") === EncodedInstructionTypes.I) {
            decodedInstructionType = EncodedInstructionTypes.I;
        } else if (encodedInstructionType.join("") === EncodedInstructionTypes.J) {
            decodedInstructionType = EncodedInstructionTypes.J;
        } else {
            decodedInstructionType = EncodedInstructionTypes.R;
        }
        return decodedInstructionType;
    }

    /**
     * This methods decodes an I-type instructions operation.
     * @param encodedOperation The binary encoded I-type operation.
     * @returns A decoded representation of the operation.
     */
    public static decodeIOperation(encodedOperation: Array<Bit>): EncodedOperations {
        let decodedITypeOperation: EncodedOperations;
        switch (encodedOperation.join("")) {
            case EncodedOperations.MOV:
                decodedITypeOperation = EncodedOperations.MOV;
                break;
            case EncodedOperations.LEA:
                decodedITypeOperation = EncodedOperations.LEA;
                break;
            case EncodedOperations.POPF:
                decodedITypeOperation = EncodedOperations.POPF;
                break;
            case EncodedOperations.PUSHF:
                decodedITypeOperation = EncodedOperations.PUSHF;
                break;
            case EncodedOperations.POP:
                decodedITypeOperation = EncodedOperations.POP;
                break;
            case EncodedOperations.PUSH:
                decodedITypeOperation = EncodedOperations.PUSH;
                break;
            case EncodedOperations.DEV:
                decodedITypeOperation = EncodedOperations.DEV;
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
    public static decodeJOperation(encodedOperation: Array<Bit>): EncodedOperations {
        let decodedJTypeOperation: EncodedOperations;
        switch (encodedOperation.join("")) {
            case EncodedOperations.JMP:
                decodedJTypeOperation = EncodedOperations.JMP;
                break;
            case EncodedOperations.JZ:
                decodedJTypeOperation = EncodedOperations.JZ;
                break;
            case EncodedOperations.JE:
                decodedJTypeOperation = EncodedOperations.JE;
                break;
            case EncodedOperations.JNZ:
                decodedJTypeOperation = EncodedOperations.JNZ;
                break;
            case EncodedOperations.JNE:
                decodedJTypeOperation = EncodedOperations.JNE;
                break;
            case EncodedOperations.JG:
                decodedJTypeOperation = EncodedOperations.JG;
                break;
            case EncodedOperations.JGE:
                decodedJTypeOperation = EncodedOperations.JGE;
                break;
            case EncodedOperations.JL:
                decodedJTypeOperation = EncodedOperations.JL;
                break;
            case EncodedOperations.JLE:
                decodedJTypeOperation = EncodedOperations.JLE;
                break;
            case EncodedOperations.INT:
                decodedJTypeOperation = EncodedOperations.INT;
                break;
            case EncodedOperations.IRET:
                decodedJTypeOperation = EncodedOperations.IRET;
                break;
            case EncodedOperations.CALL:
                decodedJTypeOperation = EncodedOperations.CALL;
                break;
            case EncodedOperations.RET:
                decodedJTypeOperation = EncodedOperations.RET;
                break;
            case EncodedOperations.SYSENTER:
                decodedJTypeOperation = EncodedOperations.SYSENTER;
                break;
            case EncodedOperations.SYSEXIT:
                decodedJTypeOperation = EncodedOperations.SYSEXIT;
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
    public static decodeROperation(encodedOperation: Array<Bit>): EncodedOperations {
        let decodedRTypeOperation: EncodedOperations;
        switch (encodedOperation.join("")) {
            case EncodedOperations.ADD:
                decodedRTypeOperation = EncodedOperations.ADD;
                break;
            case EncodedOperations.ADC:
                decodedRTypeOperation = EncodedOperations.ADC;
                break;
            case EncodedOperations.SUB:
                decodedRTypeOperation = EncodedOperations.SUB;
                break;
            case EncodedOperations.SBB:
                decodedRTypeOperation = EncodedOperations.SBB;
                break;
            case EncodedOperations.MUL:
                decodedRTypeOperation = EncodedOperations.MUL;
                break;
            case EncodedOperations.DIV:
                decodedRTypeOperation = EncodedOperations.DIV;
                break;
            case EncodedOperations.NEG:
                decodedRTypeOperation = EncodedOperations.NEG;
                break;
            case EncodedOperations.CMP:
                decodedRTypeOperation = EncodedOperations.CMP;
                break;
            case EncodedOperations.TEST:
                decodedRTypeOperation = EncodedOperations.TEST;
                break;
            case EncodedOperations.CLC:
                decodedRTypeOperation = EncodedOperations.CLC;
                break;
            case EncodedOperations.CMC:
                decodedRTypeOperation = EncodedOperations.CMC;
                break;
            case EncodedOperations.STC:
                decodedRTypeOperation = EncodedOperations.STC;
                break;
            case EncodedOperations.CLI:
                decodedRTypeOperation = EncodedOperations.CLI;
                break;
            case EncodedOperations.STI:
                decodedRTypeOperation = EncodedOperations.STI;
                break;
            case EncodedOperations.AND:
                decodedRTypeOperation = EncodedOperations.AND;
                break;
            case EncodedOperations.OR:
                decodedRTypeOperation = EncodedOperations.OR;
                break;
            case EncodedOperations.XOR:
                decodedRTypeOperation = EncodedOperations.XOR;
                break;
            case EncodedOperations.NOT:
                decodedRTypeOperation = EncodedOperations.NOT;
                break;
            case EncodedOperations.NOP:
                decodedRTypeOperation = EncodedOperations.NOP;
                break;
            default:
                throw Error("Unrecognized R-type instrcution.");
                break;
            }
        return decodedRTypeOperation;
    }
}