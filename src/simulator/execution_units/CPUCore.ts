import { EFLAGS } from "../functional_units/EFLAGS";
import { RAM } from "../functional_units/RAM";
import { GeneralPurposeRegister } from "../functional_units/GeneralPurposeRegister";
import { MemoryManagementUnit } from "./MemoryManagementUnit";
import { InstructionDecoder } from "./../InstructionDecoder";
import { EncodedAddressingModes} from "../../enumerations/EncodedAdressingModes";
import { DataSizes } from "../../enumerations/DataSizes";
import { DoubleWord } from "../../binary_types/DoubleWord";
import { VirtualAddress } from "../../binary_types/VirtualAddress";
import { Bit } from "../../binary_types/Bit";
import { ArithmeticLogicUnit } from "./ArithmeticLogicUnit";
import { InstructionRegister } from "../functional_units/InstructionRegister";
import { PointerRegister } from "../functional_units/PointerRegister";
import { Instruction } from "../../binary_types/Instruction";
import { InstructionOperand } from "../../binary_types/InstructionOperand";
import { DecodedInstruction } from "../../binary_types/DecodedInstruction";
import { Address } from "../../binary_types/Address";
import { Byte } from "../../binary_types/Byte";
import { MissingOperandError } from "../../error_types/MissingOperandError";
import { UnsupportedOperandTypeError } from "../../error_types/UnsupportedOperandTypeError";
import { Register } from "../functional_units/Register";
import { RegisterNotWritableInUserModeError } from "../../error_types/RegisterNotWritableInUserModeError";
import { RegisterNotAvailableError } from "../../error_types/RegisterNotAvailableError";
import { UnknownRegisterError } from "../../error_types/UnknownRegisterError";
import { PrivilegeViolationError } from "../../error_types/PrivilegeViolationError";
import { PhysicalAddress } from "../../binary_types/PhysicalAddress";
import { PageFaultError } from "../../error_types/PageFaultError";
import { EncodedReadableRegisters } from "../../enumerations/EncodedReadableRegisters";
import { EncodedWritableRegisters } from "../../enumerations/EncodedWritableRegisters";
import { EncodedOperations } from "../../enumerations/EncodedOperations";
import { EncodedInstructionTypes } from "../../enumerations/EncodedInstructionTypes";
import { EncodedOperandTypes } from "../../enumerations/EncodedOperandTypes";

/**
 * This class represents a CPU core which is capable of executing instructions.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class CPUCore {
    /**
     * An error message template that is used when operands are missing.
     * @readonly
     */
    private static readonly _ERROR_MESSAGE_MISSING_OPERAND: string = 
        "The instruction requires exactly __NBR_REQUIRED__, but found only __NBR_FOUND__.";

    /**
     * An error message template that is used when an operand with an unsupported type is used.
     * @readonly
     */
    private static readonly _ERROR_MESSAGE_INVALID_OPERANDTYPE: string = 
        "The operand type '__OPERAND_TYPE__' is not supported by the '__INSTRUCTION__' instruction.";

    private static readonly _ERROR_MESSAGE_REGISTER_NOT_WRITABLE_IN_USER_MODE: string =
        "Could not write to the __REGISTER__ register as it is read-only in user mode.";

    /**
     * This member is used as a flag and indicates, whether virtualization is enabled or not.
     */
    private _virtualizationEnabled: boolean;

    /**
     * First general purpose register: can be used for storing all kinds of "datatypes".
     * @readonly
     */
    public readonly eax: GeneralPurposeRegister;
    
    /**
     * Second general purpose register: can be used for storing all kinds of "datatypes".
     * @readonly
     */
    public readonly ebx: GeneralPurposeRegister;

    /**
     * Third general purpose register: can be used for storing all kinds of "datatypes".
     * @readonly
     */
    public readonly edx: GeneralPurposeRegister;
    
    /**
     * Instruction pointer: stores the virtual/physical address of the currently executed instruction.
     * @readonly
     */
    public readonly eip: PointerRegister;

    /**
     * Status register: stores some important status information.
     * @readonly
     */
    public readonly eflags: EFLAGS;

    /**
     * Instruction register: contains the currently executed instruction.
     * @readonly
     */
    public readonly eir: InstructionRegister;

    /**
     * Nested Page Table Pointer: contains the start address of a structure containing the Page Table of the host OS.
     * @readonly
     */
    public readonly nptp: PointerRegister;

    /**
     * Virtual Machine Pointer: containts the start address of a structure containing an Virtual Machine Control Block (VMCB).
     * @readonly
     */
    public readonly vmtpr: PointerRegister;

    /**
     * Stack Pointer: contains the currently lowes address of the stack. Always points to its end.
     * @readonly
     */
    public readonly esp: PointerRegister;

    /**
     * Interrupt Table Pointer: containts the start address of a structure containing start addresses of interrupt handlers.
     * @readonly
     */
    public readonly itp: PointerRegister;

    /**
     * Guest Page Table Pointer: contains the start address of a structure containing the Page Table of the guest OS.
     */
    public gptp: PointerRegister | null;

    /**
     * Page Table Pointer: contains the tart address of a structure containing the Page Table of the OS, when virtualization is disabled.
     * @readonly
     */
    public readonly ptp: PointerRegister;

    /**
     * An execution unit which converts virtual memory address to phyiscal memory address if memory virtualization is enbaled.
     * @readonly
     */
    public readonly mmu: MemoryManagementUnit;

    /**
     * An exeuction unit which is capable of performing logical and arithmetical operations.
     * @readonly
     */
    public readonly alu: ArithmeticLogicUnit;

    // /**
    //  * The highest virtual address of the STACK segment in decimal format.
    //  * @readonly
    //  */
    // private readonly _highestAddressOfStackDec: number;

    // /**
    //  * The lowest virtual address of the STACK segment in decimal format.
    //  * @readonly
    //  */
    // private readonly _lowestAddressOfStackDec: number;

    /**
     * The maximum number of bits that can be processed in one cycle.
     * Currently, only 32 bits (a doubleword) are supported.
     * This value is unused at the moment.
     * @readonly
     */
    private readonly _processingWidth: DataSizes;

    /**
     *  The binary encoded type of the currently executed instruction.
     */
    private _decodedInstruction: DecodedInstruction | null;

    /**
     * Constructs an instance of a CPU core.
     * @param mainMemory The main memory of the system.
     * @param highestAddressOfStackDec The highest address (bottom) of the STACK segment in decimal format.
     * @param lowestAddressOfStackDec The lowest address (top) of the STACK segment in decimal format.
     * @param processingWidth The maximum number of bits that can be processed in one cycle. Defaults to 32 bits (a doubleword).
     */
    public constructor(mainMemory: RAM, processingWidth: DataSizes) {
        this._virtualizationEnabled = false;
        this.eax = new GeneralPurposeRegister("EAX");
        this.ebx = new GeneralPurposeRegister("EBX");
        this.edx = new GeneralPurposeRegister("ECX");
        this.eip = new PointerRegister("EIP");
        this.eflags = new EFLAGS();
        this.eir = new InstructionRegister();
        this.nptp = new PointerRegister("NPTP");
        this.vmtpr = new PointerRegister("VMPTR");
        this.esp = new PointerRegister("ESP");
        this.itp = new PointerRegister("ITP");
        this.ptp = new PointerRegister("PTP");
        this.gptp = null;
        // TODO: Adopt ALU to be able to use different processing widths.
        this.alu = new ArithmeticLogicUnit(this.eflags);
        // TODO: Adopt MMU to be able to use different processing widths.
        this.mmu = new MemoryManagementUnit(mainMemory, this.ptp, this.alu, this.eflags);
        this._decodedInstruction = null;
        this._processingWidth = processingWidth;
    }

    /**
     * This method enables virtualization for this core.
     * It disables the PTP and enables the GPTP register.
     */
    public enableVirtualization() {
        this._virtualizationEnabled = true;
        this.gptp = new PointerRegister("GPTP");
        return;
    }

    /**
     * This method disables virtualization for this core.
     * It disables the GPTP and enables the PTP register.
     */
    public disableVirtualization() {
        this._virtualizationEnabled = false;
        this.gptp = null;
        return;
    }

    /**
     * This method checks whether virtualization is enabled for this core.
     * @returns True, if virtualization is enabled, false otherwise.
     */
    public virtualizationEnabled(): boolean {
        return this._virtualizationEnabled;
    }

    /**
     * This method performs a single instruction cycle.
     * @returns True, if the cycle was performed normally and false, if the cycle could not be performed because the programm has ended.
     */
    public cycle(): boolean {
        this.fetch();
        if (this.eir.content.toString() === new DoubleWord().toString()) {
            return false;
        }
        this.decode();
        this.execute();
        return true;
    }

    /**
     * This method fetches the next instruction from main memory and loads it into the EIR register.
     * The next instruction to be executed is determined by the content of the command pointer.
     * The command pointer always points to the instruction to be executed.
     */
    private fetch() {
        // Read address of next instruction from EIP register.
        const instructionAddress: VirtualAddress = this.eip.content;
        // Read next instruction from mainMemory.
        const instruction: DoubleWord = this.mmu.readDoublewordFrom(instructionAddress, true);
        // Load instruction into EIR register.
        this.eir.content = instruction;
        return;
    }

    /**
     * This method decodes or analyses the instruction found in the EIR register and prepares execution.
     */
    private decode() {
        // Read instruction from EIR register.
        const instruction: Instruction = this.eir.content;
        // Split instruction into its components.
        const binaryEncodedInstructionType: Bit[] = instruction.value.slice(0, 3);
        const binaryEncodedOperation: Bit[] = instruction.value.slice(5, 12);
        const binaryEncodedAddressingModeFirstOperand: Bit[] = instruction.value.slice(14, 16);
        const binaryEncodedTypeFirstOperand: Bit[] = instruction.value.slice(16, 23);
        const binaryEncodedAddressingModeSecondOperand: Bit[] = instruction.value.slice(23, 25);
        const binaryEncodedTypeSecondOperand: Bit[] = instruction.value.slice(25);
        // Decode instruction.
        // Decode instruction type.
        const decodedInstructionType: EncodedInstructionTypes = InstructionDecoder.decodeInstructionType(binaryEncodedInstructionType);
        // Decode operation.
        const decodedOperation: EncodedOperations = 
            (decodedInstructionType === EncodedInstructionTypes.I) ? 
                InstructionDecoder.decodeIOperation(binaryEncodedOperation) : 
                    (decodedInstructionType === EncodedInstructionTypes.R) ? 
                        InstructionDecoder.decodeROperation(binaryEncodedOperation) : 
                        InstructionDecoder.decodeJOperation(binaryEncodedOperation);
        // Decode addressing mode of first operand.
        const decodedAddressingModeFirstOperand: EncodedAddressingModes = 
            InstructionDecoder.decodeAddressingMode(binaryEncodedAddressingModeFirstOperand);
        // Decode addressing mode of second operand.
        const decodedAddressingModeSecondOperand: EncodedAddressingModes = 
            InstructionDecoder.decodeAddressingMode(binaryEncodedAddressingModeSecondOperand);
        // Decode type of first operand.
        const decodedTypeFirstOperand: EncodedOperandTypes = 
            InstructionDecoder.decodeOperandType(binaryEncodedTypeFirstOperand);
        // Decode type of second operand.
        const decodedTypeSecondOperand: EncodedOperandTypes = 
            InstructionDecoder.decodeOperandType(binaryEncodedTypeSecondOperand);
        // Create a new instance of a DecodedInstruction to save the decoded instruction to.
        this._decodedInstruction = new DecodedInstruction(decodedInstructionType, decodedOperation);
        // Retrieve current instruction pointer and convert its binary value to a decimal value.
        const addressOfCurrentInstructionDec: number = parseInt(this.eip.content.toString(), 2);
        // Define variables for decoded operands.
        var decodedSecondOperand: InstructionOperand | undefined = undefined;
        var decodedFirstOperand: InstructionOperand | undefined = undefined;
        // Decode second operands value if present.
        if (decodedTypeSecondOperand !== EncodedOperandTypes.NO) {            
            /**
             * Read second operands value from main memory.
             * It is located at addresses with an offset of 8 from the first 
             * address of the instruction.
             */
            const encodedValueSecondOperand: DoubleWord = 
                this.mmu.readDoublewordFrom(VirtualAddress.fromInteger(addressOfCurrentInstructionDec + 8), true);

            /**
             * Create instance of an InstructionOperand for the second operand.
             */
            decodedSecondOperand = new InstructionOperand(
                decodedAddressingModeSecondOperand,
                decodedTypeSecondOperand,
                encodedValueSecondOperand
            );
        } else {
            decodedSecondOperand = undefined;
        }
        
        if (decodedTypeFirstOperand !== EncodedOperandTypes.NO) {
            /**
             * Read second operands value from main memory.
             * It is located at addresses with an offset of 4 from the first 
             * address of the instruction.
             */
            const encodedValueFirstOperand: DoubleWord = 
                this.mmu.readDoublewordFrom(VirtualAddress.fromInteger(addressOfCurrentInstructionDec + 4), true);

            /**
             * Create instance of an InstructionOperand for the first operand.
             */
            decodedFirstOperand = new InstructionOperand(
                decodedAddressingModeFirstOperand,
                decodedTypeFirstOperand,
                encodedValueFirstOperand
            );
        } else {
            decodedFirstOperand = undefined;
        }

        // Set decoded operand values on decoded instruction.
        if (decodedFirstOperand !== undefined && decodedSecondOperand !== undefined) {
            this._decodedInstruction.operands = [decodedFirstOperand, decodedSecondOperand];
        } else if (decodedFirstOperand !== undefined && decodedSecondOperand === undefined) {
            this._decodedInstruction.operands = [decodedFirstOperand, undefined];
        } else {
            this._decodedInstruction.operands = undefined;
        }
        return;
    }

    /**
     * This method executes the instruction found in the EIR register.
     */
    private execute() {
        if (this._decodedInstruction === null) {
            throw new Error("No instruction is currently ready to be executed.");
        }
        const operation: EncodedOperations = this._decodedInstruction.operation;
        var jumpPerformed: boolean = false;
        switch (operation) {
            case EncodedOperations.NOT:
                this.not(
                    this._decodedInstruction.operands![0]
                );
                break;
            case EncodedOperations.AND:
                this.and(
                    this._decodedInstruction.operands![0], 
                    this._decodedInstruction.operands![1]!
                );
                break;
            case EncodedOperations.OR:
                this.or(
                    this._decodedInstruction.operands![0], 
                    this._decodedInstruction.operands![1]!
                );
                break;
            case EncodedOperations.XOR:
                this.xor(
                    this._decodedInstruction.operands![0], 
                    this._decodedInstruction.operands![1]!
                );
                break;
            case EncodedOperations.NEG:
                this.neg(this._decodedInstruction.operands![0]);
                break;
            case EncodedOperations.ADD:
                this.add(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            case EncodedOperations.ADC:
                this.adc(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            case EncodedOperations.SUB:
                this.sub(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            case EncodedOperations.SBB:
                this.sbb(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            case EncodedOperations.MUL:
                this.mul(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            case EncodedOperations.DIV:
                this.div(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            case EncodedOperations.TEST:
                this.test(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                )
                break;
            case EncodedOperations.CMP:
                this.cmp(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            case EncodedOperations.STI:
                this.sti();
                break;
            case EncodedOperations.CLI:
                this.cli();
                break;
            case EncodedOperations.CLC:
                this.clc();
                break;
            case EncodedOperations.CMC:
                this.cmc();
                break;
            case EncodedOperations.STC:
                this.stc();
                break;
            case EncodedOperations.POPF:
                this.popf();
                break;
            case EncodedOperations.PUSHF:
                this.pushf();
                break;
            case EncodedOperations.POP:
                this.pop(this._decodedInstruction.operands![0]);
                break;
            case EncodedOperations.PUSH:
                this.push(this._decodedInstruction.operands![0]);
                break;
            case EncodedOperations.JMP:
                this.jmp(this._decodedInstruction.operands![0]);
                jumpPerformed = true;
                break;
            case EncodedOperations.JE:
                jumpPerformed = this.je(this._decodedInstruction.operands![0]);
                break;
            case EncodedOperations.JG:
                jumpPerformed = this.jg(this._decodedInstruction.operands![0]);
                break;
            case EncodedOperations.JL:
                jumpPerformed = this.jl(this._decodedInstruction.operands![0]);
                break;
            case EncodedOperations.JGE:
                jumpPerformed = this.jge(this._decodedInstruction.operands![0]);
                break;
            case EncodedOperations.JLE:
                jumpPerformed = this.jle(this._decodedInstruction.operands![0]);
                break;
            case EncodedOperations.JNE:
                jumpPerformed = this.jne(this._decodedInstruction.operands![0]);
                break;
            case EncodedOperations.JNZ:
                jumpPerformed = this.jnz(this._decodedInstruction.operands![0]);
                break;
            case EncodedOperations.JZ:
                jumpPerformed = this.jz(this._decodedInstruction.operands![0]);
                break;
            case EncodedOperations.LEA:
                this.lea(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            case EncodedOperations.NOP:
                this.nop();
                break;
            case EncodedOperations.CALL:
                this.call(this._decodedInstruction.operands![0]);
                break;
            case EncodedOperations.RET:
                this.ret();
                break;
            case EncodedOperations.MOV:
                this.mov(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            case EncodedOperations.INT:
                this.int(this._decodedInstruction.operands![0]);
                break;
            case EncodedOperations.IRET:
                this.iret();
                break;
            case EncodedOperations.SYSENTER:
                this.sysenter(this._decodedInstruction.operands![0]);
                break;
            case EncodedOperations.SYSEXIT:
                this.sysexit();
                break;
            default:
                throw new Error("Unrecognized operation found.");
                break;
        }
        if (!jumpPerformed) {
            /**
             * Increment EIP by 3 x 4 bytes/addresses (<-> 12 Bytes) after execution 
             * of the current instruction.
             */
            const flags: Byte = this.eflags.content;
            this.eip.content = VirtualAddress.fromInteger(parseInt(this.eip.content.toString(), 2) + 12);
            this.eflags.content = flags;
        }
        return;
    }

    /*
     * -------------------- Arithmetic operations --------------------
     */

    /**
     * This method is a proxy for the ADD operation provided by the ALU.
     * It takes two binary values from the locations defined by the given operands to perfom the computation on.
     * The result is written to the location defined by the second operand.
     * @param source An operand used as the first argument for the operation.
     * @param target An operand used as the second argument for the operation and to write the result to.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     */
    private add(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "ADD")
            );
        }
        // Check if exactly two operands are present.
        if (source.type === EncodedOperandTypes.NO || target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (source.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "two operands").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Define variables to write the operands values to.
        var firstOperandsValue: DoubleWord;
        var secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === EncodedOperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the ADD operation.
        const result: DoubleWord = this.alu.add(secondOperandsValue, firstOperandsValue);
        // Write the result to the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result, false);
        } else {
            this.writeRegister(result, target);
        }
        return;
    }

    /**
     * This method is a proxy for the ADC operation provided by the ALU.
     * It takes two binary values from the locations defined by the given operands to perfom the computation on.
     * The result is written to the location defined by the second operand.
     * @param source An operand used as the first argument for the operation.
     * @param target An operand used as the second argument for the operation and to write the result to.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     */
    private adc(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "ADC")
            );
        }
        // Check if exactly two operands are present.
        if (source.type === EncodedOperandTypes.NO || target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (source.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "two operands").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Define variables to write the operands values to.        
        var firstOperandsValue: DoubleWord;
        var secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === EncodedOperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the ADC operation.
        const result: DoubleWord = this.alu.adc(secondOperandsValue, firstOperandsValue);
        // Write the result to the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result, false);
        } else {
            this.writeRegister(result, target);
        }
        return;
    }

    /**
     * This method is a proxy for the SUB operation provided by the ALU.
     * It takes two binary values from the locations defined by the given operands to perfom the computation on.
     * The result is written to the location defined by the second operand.
     * @param source An operand used as the first argument for the operation.
     * @param target An operand used as the second argument for the operation and to write the result to.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     */
    private sub(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "SUB")
            );
        }
        // Check if exactly two operands are present.
        if (source.type === EncodedOperandTypes.NO || target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (source.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "two operands").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Define variables to write the operands values to.        
        var firstOperandsValue: DoubleWord;
        var secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === EncodedOperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the SUB operation.
        const result: DoubleWord = this.alu.sub(secondOperandsValue, firstOperandsValue);
        // Write the result to the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result, false);
        } else {
            this.writeRegister(result, target);
        }
        return;
    }

    /**
     * This method is a proxy for the SBB operation provided by the ALU.
     * It takes two binary values from the locations defined by the given operands to perfom the computation on.
     * The result is written to the location defined by the second operand.
     * @param source An operand used as the first argument for the operation.
     * @param target An operand used as the second argument for the operation and to write the result to.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     */
    private sbb(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "SBB")
            );
        }
        // Check if exactly two operands are present.
        if (source.type === EncodedOperandTypes.NO || target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (source.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "two operands").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Define variables to write the operands values to.
        var firstOperandsValue: DoubleWord;
        var secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === EncodedOperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the SBB operation.
        const result: DoubleWord = this.alu.sbb(secondOperandsValue, firstOperandsValue);
        // Write the result to the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result, false);
        } else {
            this.writeRegister(result, target);
        }
        return;
    }

    /**
     * This method is a proxy for the MUL operation provided by the ALU.
     * It takes two binary values from the locations defined by the given operands to perfom the computation on.
     * The result is written to the location defined by the second operand.
     * @param source An operand used as the first argument for the operation.
     * @param target An operand used as the second argument for the operation and to write the result to.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     */
    private mul(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "MUL")
            );
        }
        // Check if exactly two operands are present.
        if (source.type === EncodedOperandTypes.NO || target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (source.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "two operands").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Define variables to write the operands values to.
        var firstOperandsValue: DoubleWord;
        var secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === EncodedOperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the MUL operation
        const result: DoubleWord = this.alu.mul(secondOperandsValue, firstOperandsValue);
        // Write the result to the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result, false);
        } else {
            this.writeRegister(result, target);
        }
        return;
    }

    /**
     * This method is a proxy for the DIV operation provided by the ALU.
     * It takes two binary values from the locations defined by the given operands to perfom the computation on.
     * The result is written to the location defined by the second operand.
     * @param source An operand used as the first argument for the operation.
     * @param target An operand used as the second argument for the operation and to write the result to.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     */
    private div(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "DIV")
            );
        }
        // Check if exactly two operands are present.
        if (source.type === EncodedOperandTypes.NO || target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (source.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "two operands").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Define variables to write the operands values to.
        var firstOperandsValue: DoubleWord;
        var secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === EncodedOperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the DIV operation.
        const result: DoubleWord = this.alu.div(secondOperandsValue, firstOperandsValue);
        // Write the result to the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result, false);
        } else {
            this.writeRegister(result, target);
        }
        return;
    }

    /*
     * -------------------- Logical operations --------------------
     */

    /**
     * This method is a proxy for the NEG operation provided by the ALU.
     * It takes a binary value from the location defined by the given operand to perfom the computation on.
     * The result is written to the location defined by the operand.
     * @param target An operand used as an argument for the operation and to write the result to.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     */
    private neg(target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "NEG")
            );
        }
        // Check if exactly one operand is present.
        if (target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "one operand").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Define variable to write the operands value to.
        var value: DoubleWord;
        // Read the binary value from the location defined by the operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            value = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            value = this.readRegister(target);
        }
        // Perform the NEG operation
        const result: DoubleWord = this.alu.neg(value);
        // Write the result to the location defined by the operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result, false);
        } else {
            this.writeRegister(result, target);
        }
        return;
    }

    /**
     * This method is a proxy for the AND operation provided by the ALU.
     * It takes two binary values from the locations defined by the given operands to perfom the computation on.
     * The result is written to the location defined by the second operand.
     * @param source An operand used as the first argument for the operation.
     * @param target An operand used as the second argument for the operation and to write the result to.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     */
    private and(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "AND")
            );
        }
        // Check if exactly two operands are present.
        if (source.type === EncodedOperandTypes.NO || target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            if (source.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "two operands").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Define variables to write the operands values to.
        var firstOperandsValue: DoubleWord;
        var secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === EncodedOperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the AND operation.
        const result: DoubleWord = this.alu.and(secondOperandsValue, firstOperandsValue);
        // Write the result to the location defined by the second
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result, false);
        } else {
            this.writeRegister(result, target);
        }
        return;
    }

    /**
     * This method is a proxy for the OR operation provided by the ALU.
     * It takes two binary values from the locations defined by the given operands to perfom the computation on.
     * The result is written to the location defined by the second operand.
     * @param source An operand used as the first argument for the operation.
     * @param target An operand used as the second argument for the operation and to write the result to.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     */
    private or(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "OR")
            );
        }
        // Check if exactly two operands are present.
        if (source.type === EncodedOperandTypes.NO || target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            if (source.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "two operands").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Define variables to write the operands values to.
        var firstOperandsValue: DoubleWord;
        var secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === EncodedOperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the OR operation.
        const result: DoubleWord = this.alu.or(secondOperandsValue, firstOperandsValue);
        // Write the result to the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result, false);
        } else {
            this.writeRegister(result, target);
        }
        return;
    }

    /**
     * This method is a proxy for the OR operation provided by the ALU.
     * It takes two binary values from the locations defined by the given operands to perfom the computation on.
     * The result is written to the location defined by the second operand.
     * @param source An operand used as the first argument for the operation.
     * @param target An operand used as the second argument for the operation and to write the result to.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     */
    private xor(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "OR")
            );
        }
        // Check if exactly two operands are present.
        if (source.type === EncodedOperandTypes.NO || target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            if (source.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "two operands").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Define variables to write the operands values to.
        var firstOperandsValue: DoubleWord;
        var secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === EncodedOperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the XOR operation.
        const result: DoubleWord = this.alu.xor(secondOperandsValue, firstOperandsValue);
        // Write the result to the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result, false);
        } else {
            this.writeRegister(result, target);
        }
        return;
    }

    /**
     * This method is a proxy for the NOT operation provided by the ALU.
     * It takes a binary value from the location defined by the given operand to perfom the computation on.
     * The result is written to the location defined by the operand.
     * @param target An operand used as an argument for the operation and to write the result to.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     */
    private not(target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "NOT")
            );
        }
        // Check if exactly one operand is present.
        if (target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "one operand").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        } 
        // Define variable to write the operands value to.
        var operandsValue: DoubleWord;
        // Read the binary value from the location defined by the operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            operandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            operandsValue = this.readRegister(target);
        }
        // Perform the NOT operation
        const result: DoubleWord = this.alu.not(operandsValue);
        // Write the result to the location defined by the operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result, false);
        } else {
            this.writeRegister(result, target);
        }
        return;
    }

    /**
     * This method is a proxy for the CMP operation provided by the ALU.
     * It takes two binary values from the locations defined by the given operands to perfom the computation on.
     * The operation leaves both operands intact.
     * @param source An operand used as the first argument for the operation.
     * @param target An operand used as the second argument for the operation and to write the result to.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     */
    private cmp(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "CMP")
            );
        }
        // Check if exactly two operands are present.
        if (source.type === EncodedOperandTypes.NO || target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            if (source.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "two operands").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Define variables to write the operands values to.
        var firstOperandsValue: DoubleWord;
        var secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === EncodedOperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the CMP operation
        this.alu.cmp(secondOperandsValue, firstOperandsValue);
        // Both operands are read-only, so no need to write the result back.
        return;
    }

    /**
     * This method is a proxy for the TEST operation provided by the ALU.
     * It takes two binary values from the locations defined by the given operands to perfom the computation on.
     * The operation leaves both operands intact.
     * @param source An operand used as the first argument for the operation.
     * @param target An operand used as the second argument for the operation and to write the result to.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     */
    private test(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "TEST")
            );
        }
        // Check if exactly two operands are present.
        if (source.type === EncodedOperandTypes.NO || target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            if (source.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "two operands").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Define variables to write the operands values to.
        var firstOperandsValue: DoubleWord;
        var secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === EncodedOperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the TEST operation.
        this.alu.test(secondOperandsValue, firstOperandsValue);
        // Both operands are read-only, so no need to write the result back.
        return;
    }

    /*
     * -------------------- Control flow operations --------------------
     */

    /**
     * This method performs a jump. The jump is performed immediately and unconditionally.
     * This method takes a binary value from the location defined by the specified operand. 
     * The binary value is interpreted as a virtual address. This operation is an alias for the JZ operation.
     * @param target An operand used as an argument for the operation.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     */
    private jmp(target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "JMP")
            );
        }
        // Check if exactly one operand is present.
        if (target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "one operand").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Load the given virtual address into the instruction pointer in order to perform the jump.
        this.eip.content = target.value;
        // The jump is automatically performed by the instruction fetcher. There is no need to return something.
        return;
    }    

    /**
     * This method performs a conditional jump. This means that the jump is only executed if a certain 
     * condition is met. In this case, the jump is only executed if the zero flag is set to (1)_2. This is the
     * case if the last comparison of two binary values resulted in a binary zero. 
     * This result in turn means that the first compared value was equal to the second. 
     * This method takes a binary value from the location defined by the specified operand. 
     * The binary value is interpreted as a virtual address. This operation is an alias for the JE operation.
     * @param target An operand used as an argument for the operation.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     * @returns True, if a jump was performed, false otherwise.
     */
    private jz(target: InstructionOperand): boolean {
        var jumpPerformed: boolean = false;
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "JZ")
            );
        }
        // Check if exactly one operand is present.
        if (target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "one operand").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Check if the zero flag is set to (1)_2.
        if (this.eflags.zero === 1) {
            // Load the given virtual address into the instruction pointer in order to perform the jump.
            this.eip.content = target.value;
            jumpPerformed = true;
        }
        return jumpPerformed;
    }

    /**
     * This method performs a conditional jump. This means that the jump is only executed if a certain 
     * condition is met. In this case, the jump is only executed if the zero flag is set to (1)_2. This is the
     * case if the last comparison of two binary values resulted in a binary zero. 
     * This result in turn means that the first compared value was equal to the second. 
     * This method takes a binary value from the location defined by the specified operand. 
     * The binary value is interpreted as a virtual address. This operation is an alias for the JZ operation.
     * @param target An operand used as an argument for the operation.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     * @returns True, if a jump was performed, false otherwise.
     */
    private je(target: InstructionOperand): boolean {
        var jumpPerformed: boolean = false;
        // This operation is an alias for the JZ operation.
        try {
            jumpPerformed = this.jz(target);
        } catch (error) {
            if (error instanceof UnsupportedOperandTypeError) {
                throw new UnsupportedOperandTypeError(error.message.replace("JZ", "JE"));
            }
        }
        return jumpPerformed;
    }

    /**
     * This method performs a conditional jump. This means that the jump is only executed if a certain 
     * condition is met. In this case, the jump is only executed if the zero flag is set to (0)_2. This is the
     * case if the last comparison of two binary values resulted in a binary value other than the binary zero. 
     * This result in turn means that the first compared value was greater or smaller than the second. 
     * This method takes a binary value from the location defined by the specified operand. 
     * The binary value is interpreted as a virtual address. This operation is an alias for the JNE operation.
     * @param target An operand used as an argument for the operation.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     * @returns True, if a jump was performed, false otherwise.
     */
    private jnz(target: InstructionOperand): boolean {
        var jumpPerformed: boolean = false;
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "JNZ")
            );
        }
        // Check if exactly one operand is present.
        if (target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "one operand").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Check if the zero flag is cleared to (0)_2.
        if (this.eflags.zero === 0) {
            // Load the given virtual address into the instruction pointer in order to perform the jump.
            this.eip.content = target.value;
            jumpPerformed = true;
        }
        return jumpPerformed;
    }

    /**
     * This method performs a conditional jump. This means that the jump is only executed if a certain 
     * condition is met. In this case, the jump is only executed if the zero flag is set to (0)_2. This is the
     * case if the last comparison of two binary values resulted in a binary value other than the binary zero. 
     * This result in turn means that the first compared value was greater or smaller than the second. 
     * This method takes a binary value from the location defined by the specified operand. 
     * The binary value is interpreted as a virtual address. This operation is an alias for the JNZ operation.
     * @param target An operand used as an argument for the operation.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     * @returns True, if a jump was performed, false otherwise.
     */
    private jne(target: InstructionOperand): boolean {
        var jumpPerformed: boolean = false;
        // This operation is an alias for the JNZ operation.
        try {
            jumpPerformed = this.jnz(target);
        } catch (error) {
            if (error instanceof UnsupportedOperandTypeError) {
                throw new UnsupportedOperandTypeError(error.message.replace("JNZ", "JNE"));
            }
        }
        return jumpPerformed;
    }

    /**
     * This method performs a conditional jump. This means that the jump is only executed if a certain 
     * condition is met. In this case, the jump is only executed if the overflow and sign flags 
     * have identical values, while the zero flag is cleared to (0)_2. This is the case if the last comparison 
     * of two binary values resulted in a positive binary value. This result in turn means that the first 
     * compared value was greater than the second. This method takes a binary value from the location defined 
     * by the specified operand. The binary value is interpreted as a virtual address.
     * @param target An operand used as an argument for the operation.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     * @returns True, if a jump was performed, false otherwise.
     */
    private jg(target: InstructionOperand): boolean {
        var jumpPerformed = false;
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "JG")
            );
        }
        // Check if exactly one operand is present.
        if (target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "one operand").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        /*
         * Check if: 
         *      1. The zero flag is cleared to (0)_2
         *      2. The values of the overflow and sign flags are identical. 
         */
        if (this.eflags.zero === 0 && this.eflags.overflow === this.eflags.sign) {
            // Load the given virtual address into the instruction pointer in order to perform the jump.
            this.eip.content = target.value;
            jumpPerformed = true;
        }
        return jumpPerformed;
    }

    /**
     * This method performs a conditional jump. This means that the jump is only executed if a certain 
     * condition is met. In this case, the jump is only executed if the overflow and sign flags 
     * have identical values. This is the case if the last comparison of two binary values resulted in a 
     * binary zero or a positive binary value. This result in turn means that the first compared value was 
     * equal to or greater than the second. This method takes a binary value from the location defined by the 
     * specified operand. The binary value is interpreted as a virtual address.
     * @param target An operand used as an argument for the operation.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     * @returns True, if a jump was performed, false otherwise.
     */
    private jge(target: InstructionOperand): boolean {
        var jumpPerformed: boolean = false;
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "JGE")
            );
        }
        // Check if exactly one operand is present.
        if (target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "one operand").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Check if the values of the overflow and sign flags are identical.
        if (this.eflags.sign === this.eflags.overflow) {
            // Load the given virtual address into the instruction pointer in order to perform the jump.
            this.eip.content = target.value;
            jumpPerformed = true
        }
        return jumpPerformed;
    }

    /**
     * This method performs a conditional jump. This means that the jump is only executed if a certain 
     * condition is met. In this case, the jump is only executed if the overflow and sign flags 
     * have different values. This is the case if the last comparison of two binary values resulted in a 
     * negative binary result. This result in turn means that the first compared value was smaller than the 
     * second. This method takes a binary value from the location defined by the specified operand. 
     * The binary value is interpreted as a virtual address.
     * @param target An operand used as an argument for the operation.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     * @returns True, if a jump was performed, false otherwise.
     */
    private jl(target: InstructionOperand): boolean {
        var jumpPerformed: boolean = false;
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "JL")
            );
        }
        // Check if exactly one operand is present.
        if (target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "one operand").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Check if the values of the overflow and sign flags are not identical.
        if (this.eflags.sign !== this.eflags.overflow) {
            // Load the given virtual address into the instruction pointer in order to perform the jump.
            this.eip.content = target.value;
            jumpPerformed = true;
        }
        return jumpPerformed;
    }

    /**
     * This method performs a conditional jump. This means that the jump is only executed if a certain 
     * condition is met. In this case, the jump is only executed if the overflow and sign flags 
     * have different values, while the zero flag is set to (1)_2. This is the case if the last comparison 
     * of two binary values resulted in a binary zero or a negative binary value. This result in turn means 
     * that the first compared value was equal to or smaller than the second. This method takes a binary value 
     * from the location defined by the specified operand. The binary value is interpreted as a virtual address.
     * @param target An operand used as an argument for the operation.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     * @returns True, if a jump was performed, false otherwise.
     */
    private jle(target: InstructionOperand): boolean {
        var jumpPerformed: boolean = false;
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "JG")
            );
        }
        // Check if exactly one operand is present.
        if (target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "one operand").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        /*
         * Check if: 
         *      1. The zero flag is set to (1)_2
         *      2. The values of the overflow and sign flags are not identical. 
         */
        if (this.eflags.zero === 1 && this.eflags.sign !== this.eflags.overflow) {
            // Load the given virtual address into the instruction pointer in order to perform the jump.
            this.eip.content = target.value;
            jumpPerformed = true;
        }
        return jumpPerformed;
    }

    /*
     * -------------------- Data transfer operations -------------------- 
     */

    /**
     * This method copies a binary value from a location defined by the first operand to a location defined by the second operand.
     * The source operand can be of type IMMEDIATE, MEMORY_ADDRESS or REGISTER. The target operand can be of type MEMORY_ADDRESS or REGISTER.
     * @param source The first operand which defines the value to copy and the location to copy this value from.
     * @param target The second operand which defines the value to copy and the location to copy this value from.
     * @throws {UnsupportedOperandTypeError} If the source and target operands are both of type memory address.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If one of the operands is missing.
     * @throws {UnknownRegisterError} If the source or target operand is of type REGISTER and the register could not be decoded.
     * @throws {RegisterNotWritableInUserModeError} If the target operand is of type REGISTER and the register is read-only in user mode.
     * @throws {RegisterNotAvailableError} If source or target operand is of type REGISTER and the register is currently not available.
     */
    private mov(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the source and target operands are both of type memory address.
        if (source.type === EncodedOperandTypes.MEMORY_ADDRESS && target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            throw new UnsupportedOperandTypeError("MOV instruction does not support two operands of type memory address.");
        }
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "MOV")
            );
        }
        // Check if exactly two operands are present.
        if (source.type === EncodedOperandTypes.NO || target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            if (source.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "two operands").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Define variable to write the operands value to.
        var valueToMove: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === EncodedOperandTypes.IMMEDIATE) {
            valueToMove = source.value;
        } else if (source.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            valueToMove = this.mmu.readDoublewordFrom(source.value, false);
        } else {
            valueToMove = this.readRegister(source);
        }
        // Write the value to the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, valueToMove, false);
        } else {
            this.writeRegister(valueToMove, target);
        }
        return;
    }

    /**
     * This method copies a the (virtual) memory address from a location defined by the first operand to a location defined by the second operand.
     * The source operand can be of type MEMORY_ADDRESS or REGISTER. The target operand can be of type MEMORY_ADDRESS or REGISTER.
     * @param source The first operand which defines the (virtual) memory address to copy.
     * @param target The second operand which defines the value to copy and the location to copy this value from.
     * @throws {UnsupportedOperandTypeError} If the source and target operands are both of type memory address.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {UnsupportedOperandTypeError} If the source operand is of type REGISTER and uses DIRECT addressing mode.
     * @throws {MissingOperandError} If one of the operands is missing.
     * @throws {UnknownRegisterError} If the source or target operand is of type REGISTER and the register could not be decoded.
     * @throws {RegisterNotWritableInUserModeError} If the target operand is of type REGISTER and the register is read-only in user mode.
     * @throws {RegisterNotAvailableError} If source or target operand is of type REGISTER and the register is currently not available.
     */
    private lea(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the source and target operands are both of type memory address.
        if (source.type === EncodedOperandTypes.MEMORY_ADDRESS && target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            throw new UnsupportedOperandTypeError("LEA instruction does not support two operands of type memory address.");
        }
        // Check if the source or target operand are of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE || source.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "LEA")
            );
        }
        // Check if the source operand is of type REGISTER and the addressing mode is DIRECT.
        if (source.type === EncodedOperandTypes.REGISTER && source.addressingMode === EncodedAddressingModes.DIRECT) {
            throw new UnsupportedOperandTypeError("LEA instruction can not extract an (virtual) address of a register.");
        }
        // Check if exactly two operands are present.
        if (source.type === EncodedOperandTypes.NO || target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            if (source.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "two operands").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Define variable to write the (virtual) memory address to.
        var address: Address = new Address();
        // Read the (virtual) memory address from the location defined by the first operand.
        if (source.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            address = source.value;
        } else {
            address = this.readRegister(source);
        }
        // Write the (virtual) memory address to the location defined by the second operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, address, false);
        } else {
            this.writeRegister(address, target);
        }
        return;
    }

    /*
     * -------------------- FLAG operations -------------------- 
     */

    /**
     * This method clears the carry flag.
     */
    private clc(): void {
        this.eflags.clearCarry();
        return;
    }

    /**
     * This method complements the carry flag.
     * If the carry flag is set, it is cleared. If the carry flag is cleared, it is set.
     */
    private cmc(): void {
        if (this.eflags.carry === 1) {
            this.eflags.clearCarry();
        } else {
            this.eflags.setCarry();
        }
        return;
    }

    /**
     * This method sets the carry flag.
     */
    private stc(): void {
        this.eflags.setCarry();
        return;
    }

    /**
     * This method clears the interrupt flag.
     * The CPU will ignore all software interrupts to occur.
     * @throws {PrivilegeViolationError} If the CPU is not in kernel mode.
     */
    private cli(): void {
        // Check whether CPU is in kernel mode.
        if (!this.eflags.isInKernelMode()) {
            // CPU is not in kernel mode.
            throw new PrivilegeViolationError("PUSHF can only executed in kernel mode, but current process is running in user mode.");
        }
        this.eflags.clearInterrupt();
        return;
    }

    /**
     * This method sets the interrupt flag.
     * This enables the CPU to handle software interrupts.
     * @throws {PrivilegeViolationError} If the CPU is not in kernel mode.
     */
    private sti(): void {
        // Check whether CPU is in kernel mode.
        if (!this.eflags.isInKernelMode()) {
            // CPU is not in kernel mode.
            throw new PrivilegeViolationError("PUSHF can only executed in kernel mode, but current process is running in user mode.");
        }
        this.eflags.setInterrupt();
        return;
    }

    /*
     * -------------------- Stack operations -------------------- 
     */

    /**
     * This method pushes the contents of the EFLAGS register onto the STACK.
     * @throws {PrivilegeViolationError} If the CPU is not in kernel mode.
     * @throws {StackOverflowError} If the ESP reached the lowest possible address (top) of the STACK segment.
     */
    private pushf(): void {
        // Check whether CPU is in kernel mode.
        if (!this.eflags.isInKernelMode()) {
            // CPU is not in kernel mode.
            throw new PrivilegeViolationError("PUSHF can only executed in kernel mode, but current process is running in user mode.");
        }
        // Check whether ESP reached lowest address (top) of STACK segment.
        // if (this.esp.content.equal(Doubleword.fromInteger(this._lowestAddressOfStackDec))) {
        //     // ESP reached highest possible address (top) of STACK segment.
        //     throw new StackUnderflowError("Could not perform PUSHF operation. STACK pointer reached top of the STACK.");
        // }
        // Allocate one byte on STACK by decrementing the value in ESP.
        this.esp.content = this.alu.sub(this.esp.content, DoubleWord.fromInteger(1));
        // Write contents of flags register on STACK.
        this.mmu.writeByteTo(this.esp.content, this.eflags.content);
        return;
    }

    /**
     * This method reads the contents of the EFLAGS register from the STACK into the EFLAGS register.
     * The STACK pointer is incremented by 1 (byte/address) after the operation and the used memory gets deallocated.
     * @throws {PrivilegeViolationError} If the CPU is not in kernel mode.
     * @throws {StackUnderflowError} If the ESP reached the highest possible address (bottom) of the STACK segment.
     */
    private popf(): void {
        // Check whether CPU is in kernel mode.
        if (!this.eflags.isInKernelMode()) {
            // CPU is not in kernel mode.
            throw new PrivilegeViolationError("POPF can only executed in kernel mode, but current process is running in user mode.");
        }
        // Check whether ESP reached highest address (bottom) of STACK segment.
        // if (this.esp.content.equal(Doubleword.fromInteger(this._highestAddressOfStackDec))) {
        //     // ESP reached highest possible address (bottom) of STACK segment.
        //     throw new StackOverflowError("Could not perform POPF operation. STACK pointer reached bottom of the STACK.");
        // }
        // Read contents of flags register from STACK into flags register.
        this.eflags.content = this.mmu.readByteFrom(this.esp.content);
        // Deallocate four byte or one doubleword from STACK by incrementing the value in ESP.
        this.mmu.clearMemory(this.esp.content, DataSizes.DOUBLEWORD);
        // TODO: Call interrupt handler for deallocation of page frame in page table.
        this.esp.content = this.alu.add(this.esp.content, DoubleWord.fromInteger(1));
        return;
    }

    /**
     * This method copies a doubleword sized binary value from the STACK to the target defined by the given operand.
     * The STACK pointer is incremented by four (bytes/addresses), which deallocates memory for a doubleword.
     * @param target This operand defines where to put the red binary value from the STACK to.
     * @throws {StackUnderflowError} If the ESP reached the highest possible address (bottom) of the STACK segment.
     * @throws {RegisterNotWritableInUserModeError} If the targeted register is not writable in user mode.
     * @throws {UnknownRegisterError} If the targeted register is unknown.
     * @throws {MissingOperandError} If the operand given is of type NO.
     */
    private pop(target: InstructionOperand) {
        // Check whether ESP reached highest address (bottom) of STACK segment.
        // if (this.esp.content.equal(Doubleword.fromInteger(this._highestAddressOfStackDec))) {
        //     // ESP reached highest address (bottom) of STACK segment.
        //     throw new StackUnderflowError("Could not perform POP operation. STACK pointer reached bottom of the STACK.");
        // }
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "POP")
            );
        }
        // Check if exactly one operand is present.
        if (target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "one operand").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Read the binary value from the STACK.
        const value: DoubleWord = this.mmu.readDoublewordFrom(this.esp.content, false);
        // Write the value to the location defined by the operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            const address: Address = target.value;
            this.mmu.writeDoublewordTo(address, value, false);
        } else {
            this.writeRegister(value, target);
        }
        // Deallocate one doubleword from STACK by incrementing the value in ESP.
        this.mmu.clearMemory(this.esp.content, DataSizes.DOUBLEWORD);
        // TODO: Call interrupt handler for deallocation of page frame in page table.
        this.esp.content = PhysicalAddress.fromInteger(parseInt(this.esp.content.toString(), 2) + 4);
        return;
    }

    /**
     * This method copies a doubleword sized binary value defined by the given operand onto the STACK.
     * Therefore the stack pointer is decremented by 4 (bytes/addresses), which allocates memory for a doubleword on the STACK.
     * @param target This operand defines from where to copy the binary value.
     * @throws {StackOverflowError} If the ESP reached the lowest possible address (top) of the STACK segment.
     * @throws {RegisterNotWritableInUserModeError} If the targeted register is not writable in user mode.
     * @throws {UnknownRegisterError} If the targeted register is unknown.
     * @throws {MissingOperandError} If the operand given is of type NO.
     */
    private push(source: InstructionOperand) {
        // Check whether ESP reached lowest address (top) of STACK segment.
        // if (this.esp.content.equal(Doubleword.fromInteger(this._lowestAddressOfStackDec))) {
        //     // ESP reached lowest address (top) of STACK segment.
        //     throw new StackOverflowError("Could not perform PUSH operation. STACK pointer reached top of the STACK.");
        // }
        // Check if the source operand is of type IMMEDIATE.
        if (source.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "PUSH")
            );
        }
        // Check if exactly one operand is present.
        if (source.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (source.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "one operand").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Allocate one doubleword (4 byte) on STACK by decrementing ESP.
        this.esp.content = PhysicalAddress.fromInteger(parseInt(this.esp.content.toString(), 2) - 4);
        // Create a variable to store the value to write on STACK.
        var value: DoubleWord;
        // Depending on the operand type, the value is read from the main memory or a register.
        if (source.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            // Read the binary value from the (virtual) memory address defined by the given operand.
            value = this.mmu.readDoublewordFrom(source.value, false);            
        } else {
            // Read the binary value from the register defined by the given operand.
            value = this.readRegister(source);
        }
        // Write the value to the STACK.
        this.mmu.writeDoublewordTo(this.esp.content, value, false);
        return;
    }

    /*
     * -------------------- Subroutine operations -------------------- 
     */

    /**
     * This method performs a procedure call. It performs a jump to the (virtual) memory address defined by the given operand. 
     * The (virtual) memory address should be the base address of the subroutine to call. Before transfering control to the callee,
     * this method writes a return address onto the STACK. Afterwards the (virtual) address gets loaded into the instruction pointer 
     * (EIP) register and control is transfered to the callee (targeted subroutine).
     * @param target This operand defines the (virtual) base address of the subroutine to call.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If the operand given is of type NO.
     * @throws {RegisterNotAvailableError} If the register to read from, is not available.
     * @throws {UnknownRegisterError} If the register to read from, is unknown.
     */
    private call(target: InstructionOperand): void {
        // Check if the source operand is of type IMMEDIATE.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "CALL")
            );
        }
        // Check if exactly one operand is present.
        if (target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "one operand").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        /*
         * Before calling a subroutine, the caller needs to push the return address onto the STACK.
         * The return address is necessary to hand over control to the caller again after the subroutine 
         * has finished. The return address is an alias for the address of the instruction following the 
         * CALL instruction. Therefore, one doubleword ((4)_10 byte) needs to be allocated on the STACK 
         * by decrementing ESP first.
         */
        this.esp.content = PhysicalAddress.fromInteger(parseInt(this.esp.content.toString(), 2) - 4);
        /*
         * The instruction following the CALL instruction is located at EIP (currently pointing at
         * the CALL instruction) plus (12)_10 ((3)_10 * (4)_10 byte per instruction).
         */
        const returnAddress: DoubleWord = this.alu.add(this.eip.content, DoubleWord.fromInteger(12));
        // Write the return address to the STACK.
        this.mmu.writeDoublewordTo(this.esp.content, returnAddress, false);
        // Transfer control to the subroutine by loading the subroutines base address into EIP register.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            this.eip.content = target.value;
        } else {
            this.eip.content = this.readRegister(target);
        }
        return;
    }

    /**
     * This method returns from a subroutine. It reads the return address from the STACK and transfers
     * control to the caller, by loading the return address into the instruction pointer (EIP) register.
     */
    private ret(): void {
        // Read the return address from the STACK.
        this.eip.content = this.mmu.readDoublewordFrom(this.esp.content, false);
        // Deallocate one doubleword from the STACK by incrementing ESP.
        this.mmu.clearMemory(this.esp.content, DataSizes.DOUBLEWORD);
        // TODO: Call interrupt handler for deallocation of page frame in page table.
        this.esp.content = PhysicalAddress.fromInteger(parseInt(this.esp.content.toString(), 2) + 4);
        return;
    }

    /*
     * -------------------- Interrupt operations -------------------- 
     */

    /**
     * This method triggers a software interrupt by calling an interrupt handler. The operating system stores the 
     * interrupt handlers in a list located in a restricted area of the main memory. This erea is only accessable in kernel mode. 
     * Each interrupt handler is identified by a unique number or index. This method performs a jump to the physical memory address 
     * of the interrupt handler, which is computed by adding the interrupt handlers number to the interrupt tables base address.
     * This base address is stored in the interrupt table pointer (ITP) register. Before transfering control to the interrupt handler,
     * the current EFLAGS are saved on the STACK. In order to do so, this method enters kernel mode. To prevent the handler from beeing
     * interrupted, the interrupt flag is cleared as well. Afterwards the handler is called. 
     * The call follows the same rules as a normal function call.
     * @param target The interrupt handlers number.
     * @throws {StackOverflowError} If the ESP reached the lowest possible address (top) of the STACK segment.
     */
    public int(target: InstructionOperand): void {
        // Check if exactly one operand is present.
        if (target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "one operand").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Check if the target operand is of type MEMORY_ADDRESS.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "MEMORY_ADDRESS").replace("__INSTRUCTION__", "INT")
            );    
        }
        // Check if the target operand is of type REGISTER.
        if (target.type === EncodedOperandTypes.REGISTER) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "REGISTER").replace("__INSTRUCTION__", "INT")
            );
        }
        // Switch to kernel mode.
        this.eflags.enterKernelMode();
        // Disable software interrupts by clearing the interrupt flag.
        this.eflags.clearInterrupt();
        // Add the number of the interrupt handler to the interrupt tables base address, which is stored in the ITP register.
        const interruptHandlerAddress: DoubleWord = this.alu.add(this.itp.content, target.value);
        // Push the current EFLAGS onto the STACK to save them for later.
        this.pushf();
        // Call subroutine at the interrupt handlers address.
        this.call(new InstructionOperand(EncodedAddressingModes.DIRECT, EncodedOperandTypes.MEMORY_ADDRESS, interruptHandlerAddress));
        return;
    }

    /**
     * This method returns from an interrupt handler triggered by a software interrupt. It reads the return address from the STACK
     * and transfers control back to the interrupted process. Additionally, the EFLAGS gets restored from the STACK, the interrupt flag
     * is cleared and the CPU switches back to user mode.
     * @throws {PrivilegeViolationError} If the CPU is not in kernel mode when this mehtod is called.
     */
    public iret(): void {
        // Check whether CPU is in kernel mode.
        if (!this.eflags.isInKernelMode()) {
            // CPU is not in kernel mode.
            throw new PrivilegeViolationError("IRET can only be called when CPU is in kernel mode.");
        }
        // Return from the interrupt handler by calling the RET operation.
        this.ret();
        // Enable software interrupts by setting the interrupt flag.
        this.eflags.setInterrupt();
        // Restore the old EFLAGS contents from the STACK.
        this.popf();
        // Switch back to user mode.
        this.eflags.enterUserMode();
        return;
    }

    /*
     * -------------------- System operations -------------------- 
     */

    /**
     * This method performs a call to a systems subroutine. It performs a jump to the physical memory address defined by the given operand. 
     * The physical memory address should be the base address of the subroutine to call. Before transfering control to the callee,
     * this method writes a return address onto the STACK. Afterwards the physical address gets loaded into the instruction pointer 
     * (EIP) register and control is transfered to the callee (targeted subroutine). As all systems subroutines reside in a restricted 
     * erea of the main memory, this method needs to enter the kernel mode. In order to ensure, this subroutine can not be interrupted,
     * the interrupt flag is cleared. The current content of the EFLAGS register is written onto the STACK.
     * @param target This operand defines the physical base address of the systems subroutine to call.
     * @throws {StackOverflowError} If the ESP reached the lowest possible address (top) of the STACK segment.
     * @throws {UnsupportedOperandTypeError} If the target operand is of type IMMEDIATE.
     * @throws {MissingOperandError} If the operand given is of type NO. 
     * @throws {RegisterNotAvailableError} If the register to read from, is not available.
     * @throws {UnknownRegisterError} If the register to read from, is unknown.
     */
    private sysenter(target: InstructionOperand): void {
        // Check if exactly one operand is present.
        if (target.type === EncodedOperandTypes.NO) {
            const msg: string = CPUCore._ERROR_MESSAGE_MISSING_OPERAND;
            let nbrMissingOperands: number = 0;
            if (target.type === EncodedOperandTypes.NO) {
                ++nbrMissingOperands;
            }
            throw new MissingOperandError(
                msg.replace("__NBR_REQUIRED__", "one operand").replace("__NBR_FOUND__", `${nbrMissingOperands} operand(s) found`)
            );
        }
        // Check if the target operand is of type MEMORY_ADDRESS.
        if (target.type === EncodedOperandTypes.IMMEDIATE) {
            const msg: string = CPUCore._ERROR_MESSAGE_INVALID_OPERANDTYPE;
            throw new UnsupportedOperandTypeError(
                msg.replace("__OPERAND_TYPE__", "IMMEDIATE").replace("__INSTRUCTION__", "SYSENTER")
            );    
        }
        // Create a variable to store the (virtual) address of the systems subroutine.
        var systemSubroutineAddress: DoubleWord;
        // Read the physical address of the systems subroutine from the operand.
        if (target.type === EncodedOperandTypes.MEMORY_ADDRESS) {
            systemSubroutineAddress = target.value;
        } else {
            systemSubroutineAddress = this.readRegister(target);
        }
        // Switch to kernel mode.
        this.eflags.enterKernelMode();
        // Push the current EFLAGS onto the STACK.
        this.pushf();
        // Disable software interrupts by clearing the interrupt flag.
        this.eflags.clearInterrupt();
        // Call the systems subroutine.
        this.call(
            new InstructionOperand(
                EncodedAddressingModes.DIRECT, 
                EncodedOperandTypes.MEMORY_ADDRESS, 
                systemSubroutineAddress)
        );
        return;
    }

    /**
     * This method returns from a systems subroutine. It reads the return address from the STACK
     * and transfers control back to the caller. Additionally, the EFLAGS gets restored from the STACK, the interrupt flag
     * is cleared and the CPU switches back to user mode.
     * @throws {StackUnderflowError} If the ESP reached the highest possible address (bottom) of the STACK segment.
     */
    private sysexit(): void {
        if (!this.eflags.isInKernelMode()) {
            throw new PrivilegeViolationError("SYSEXIT can only be called when kernel mode is enabled.");
        }
        // Return from the systems subroutine by calling the RET operation.
        this.ret();
        // Enable software interrupts by setting the interrupt flag.
        this.eflags.setInterrupt();
        // Restore the old EFLAGS contents from the STACK.
        this.popf();
        // Switch back to user mode.
        this.eflags.enterUserMode();
        return;
    }

    /*
     * -------------------- Special operations -------------------- 
     */

    /**
     * This method does nothing.
     */
    private nop(): void {}

    /**
     * This method writes a given doubleword sized binary value to the register defined by the given operand.
     * Depending on the access type, the value is written directly to the register or to an referenced 
     * (virtual) memory address.
     * @param operand The register operand to read a binary value from.
     * @throws {RegisterNotWritableInUserModeError} If the targeted register is not writable in user mode.
     * @throws {UnknownRegisterError} If the targeted is unknown.
     * @returns The red binary value.
     */
    private writeRegister(value: DoubleWord, operand: InstructionOperand): void {
        // Depending on the addressing mode, the value is written to the register directly or to the referenced (virtual) memory address.
        if (operand.addressingMode === EncodedAddressingModes.INDIRECT) {
            this.writeRegisterIndirect(value, operand);
        } else {
            this.writeRegisterDirect(value, operand);
        }
        return;
    }

    /**
     * This method writes a given doubleword sized binary value to the register defined by the given operand.
     * @param value The binary value to write to the given register.
     * @param operand The register to write the value to.
     * @throws {RegisterNotWritableInUserModeError} If the targeted register is not writable in user mode.
     * @throws {UnknownRegisterError} If the targeted is unknown.
     */
    private writeRegisterDirect(value: DoubleWord, operand: InstructionOperand): void {
        // Decode the register defined by the operand.
        const register: Register<DoubleWord> = this.decodeWritableRegister(operand);
        // Check if the decoded register is writable in user mode.
        if (register === this.eir && !this.eflags.isInKernelMode()) {
            // Writing to the EIP register is only allowed in kernel mode.
            const msg: string = CPUCore._ERROR_MESSAGE_REGISTER_NOT_WRITABLE_IN_USER_MODE;
            throw new RegisterNotWritableInUserModeError(
                msg.replace("__REGISTER__", "EIR")
            );
        } else if (register === this.gptp && !this.eflags.isInKernelMode()) {
            // Writing to the GPTP register is only allowed in kernel mode.
            const msg: string = CPUCore._ERROR_MESSAGE_REGISTER_NOT_WRITABLE_IN_USER_MODE;
            throw new RegisterNotWritableInUserModeError(
                msg.replace("__REGISTER__", "GPTP")
            );
        } else if (register === this.nptp && !this.eflags.isInKernelMode()) {
            // Writing to the NPTP register is only allowed in kernel mode.
            const msg: string = CPUCore._ERROR_MESSAGE_REGISTER_NOT_WRITABLE_IN_USER_MODE;
            throw new RegisterNotWritableInUserModeError(
                msg.replace("__REGISTER__", "NPTP")
            );
        } else if (register === this.vmtpr && !this.eflags.isInKernelMode()) {
            // Writing to the VMPTR register is only allowed in kernel mode.
            const msg: string = CPUCore._ERROR_MESSAGE_REGISTER_NOT_WRITABLE_IN_USER_MODE;
            throw new RegisterNotWritableInUserModeError(
                msg.replace("__REGISTER__", "VMTPR")
            );
        } else {
            // Write the doubleword to the register.
            register.content = value;
        }
        return;
    }

    /**
     * This method writes a given doubleword sized binary value to a (virtual) memory address.
     * The (virtual memory address) is referenced by the register defined by the given operand.
     * @param value The binary value to write to the memory address referenced by the given register.
     * @param operand The register which references a memory address to write to.
     * @throws {RegisterNotAvailableError} If the register to write to is not available.
     * @throws {UnknownRegisterError} If the register to write to is unknown.
     */
    private writeRegisterIndirect(value: DoubleWord, operand: InstructionOperand): void {
        // Decode the register defined by the operand.
        const register: Register<DoubleWord> = this.decodeWritableRegister(operand);
        // Write the doubleword to the referenced (virtual) memory address.
        this.mmu.writeDoublewordTo(register.content, value, false);
        return;
    }

    /**
     * This method reads a given doubleword sized binary value from a register defined by the given operand. 
     * Depending on the addressing mode, the value is read directly from the register or from the main memory. 
     * In the latter case, the value contained in the register is interpreted as the memory address.
     * @param operand The register operand to read a binary value from.
     * @throws {RegisterNotAvailableError} If the register to read from is not available.
     * @throws {UnknownRegisterError} If the register to read from is unknown.
     * @returns The binary value red from the register or the referenced (virtual) memory address.
     */
    private readRegister(operand: InstructionOperand): DoubleWord {
        var doubleword: DoubleWord;
        // Depending on the addressing mode, the value is read from the register directly or from the referenced (virtual) memory address.
        if (operand.addressingMode === EncodedAddressingModes.INDIRECT) {
            doubleword = this.readRegisterIndirect(operand);
        } else {
            doubleword = this.readRegisterDirect(operand);
        }
        return doubleword;
    }

    /**
     * This method reads a given doubleword sized binary value from a (virtual) memory address.
     * The (virtual) memory address is referenced by the register defined in the given operand.
     * @param operand The operand to extract the register from.
     * @throws {RegisterNotAvailableError} If the register to read from is not available.
     * @throws {UnknownRegisterError} If the register to read from is unknown.
     * @returns The binary value red from the referenced (virtual) memory address.
     */
    private readRegisterIndirect(operand: InstructionOperand): DoubleWord {
        // Decode the register defined by the operand and read its value.
        const address: Address = this.decodeReadableRegister(operand).content;
        // Read the doubleword from the referenced (virtual) memory address.
        return this.mmu.readDoublewordFrom(address, false);
    }

    /**
     * This method reads a given doubleword sized binary value from the register defined by the given operand.
     * @param operand The operand to extract the register from.
     * @throws {RegisterNotAvailableError} If the register to read from is not available.
     * @throws {UnknownRegisterError} If the register to read from is unknown.
     * @returns The binary value red from the register.
     */
    private readRegisterDirect(operand: InstructionOperand): DoubleWord {
        // Decode the register defined by the operand and return its value.
        return this.decodeReadableRegister(operand).content;
    }

    /**
     * This method decodes a given operands value and returns the encoded register.
     * Only readable registers can be decoded.
     * @param operand The operand to extract the register from.
     * @throws {RegisterNotAvailableError} If the register to decode is not available.
     * @throws {UnknownRegisterError} If the register to decode is unknown.
     * @returns The decoded register.
     */
    private decodeReadableRegister(operand: InstructionOperand): Register<DoubleWord> {
        var register: Register<DoubleWord>;
        switch (operand.value.toString()) {
            case EncodedReadableRegisters.EAX:
                register = this.eax;
                break;
            case EncodedReadableRegisters.EBX:
                register = this.ebx;
                break;
            case EncodedReadableRegisters.ECX:
                register = this.edx;
                break;
            case EncodedReadableRegisters.EIP:
                register = this.eip;
                break;
            case EncodedReadableRegisters.EIR:
                register = this.eir;
                break;
            case EncodedReadableRegisters.ESP:
                register = this.esp;
                break;
            case EncodedReadableRegisters.GPTP:
                if (this.gptp === null) {
                    throw new RegisterNotAvailableError("Could not access GPTP register. Please enable virtualization before trying to access GPTP.");
                }
                register = this.gptp;
                break;
            case EncodedReadableRegisters.ITP:
                register = this.itp;
                break;
            case EncodedReadableRegisters.NPTP:
                register = this.nptp;
                break;
            case EncodedReadableRegisters.VMPTR:
                register = this.vmtpr;
                break;
            default:
                throw new UnknownRegisterError(`Unrecognized binary encoded register: ${operand.value.toString()}.`);
                break;
        }
        return register;
    }

    /**
     * This method decodes a given operands value and returns the encoded register. 
     * Both read- and writable registers can be decoded.
     * @param operand The operand to extract the register from.
     * @throws {RegisterNotAvailableError} If the register to decode is not available.
     * @throws {UnknownRegisterError} If the register to decode is unknown.
     * @returns The decoded register.
     */
    private decodeWritableRegister(operand: InstructionOperand): Register<DoubleWord> {
        var register: Register<DoubleWord>;
        switch (operand.value.toString()) {
            case EncodedWritableRegisters.EAX:
                register = this.eax;
                break;
            case EncodedWritableRegisters.EBX:
                register = this.ebx;
                break;
            case EncodedWritableRegisters.ECX:
                register = this.edx;
                break;
            case EncodedWritableRegisters.EIP:
                register = this.eip;
                break;
            case EncodedWritableRegisters.ESP:
                register = this.esp;
                break;
            case EncodedWritableRegisters.GPTP:
                if (this.gptp === null) {
                    throw new RegisterNotAvailableError("Could not access GPTP register. Please enable virtualization before trying to access GPTP.");
                }
                register = this.gptp;
                break;
            case EncodedWritableRegisters.ITP:
                register = this.itp;
                break;
            case EncodedWritableRegisters.NPTP:
                register = this.nptp;
                break;
            case EncodedWritableRegisters.VMPTR:
                register = this.vmtpr;
                break;
            default:
                throw new UnknownRegisterError(`Unrecognized binary encoded register: ${operand.value.toString()}.`);
                break;
        }
        return register;
    }
}