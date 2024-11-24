import { EFLAGS } from "../functional_units/EFLAGS";
import { RAM } from "../functional_units/RAM";
import { DoublewordRegister, Register } from "../functional_units/Register";
import { MemoryManagementUnit } from "./MemoryManagementUnit";
import { InstructionDecoder } from "./../InstructionDecoder";
import { AddressingModes, DecodedInstruction, InstructionOperand, InstructionTypes, OperandTypes, Operations } from "../../types";
import { Doubleword } from "../../types/Doubleword";
import { VirtualAddress } from "../../types/VirtualAddress";
import { Bit } from "../../types/Bit";
import { ArithmeticLogicUnit } from "./ArithmeticLogicUnit";

export class CPUCore {
    /**
     * This member is used as a flag and indicates, whether virtualization is enabled or not.
     */
    private _virtualizationEnabled: boolean;

    /**
     * First general purpose register: can be used for storing all kinds of "datatypes".
     * @readonly
     */
    public readonly eax: DoublewordRegister;
    
    /**
     * Second general purpose register: can be used for storing all kinds of "datatypes".
     * @readonly
     */
    public readonly ebx: DoublewordRegister;
    
    /**
     * Instruction pointer: stores the virtual/physical address of the currently executed instruction.
     * @readonly
     */
    public readonly eip: DoublewordRegister;

    /**
     * Status register: stores some important status information.
     * @readonly
     */
    public readonly eflags: EFLAGS;

    /**
     * Instruction register: contains the currently executed instruction.
     * @readonly
     */
    public readonly eir: DoublewordRegister

    /**
     * Nested Page Table Pointer: contains the start address of a structure containing the Page Table of the host OS.
     * @readonly
     */
    public readonly nptp: DoublewordRegister

    /**
     * Virtual Machine Pointer: containts the start address of a structure containing an Virtual Machine Control Block (VMCB).
     * @readonly
     */
    public readonly vmtpr: DoublewordRegister

    /**
     * Stack Pointer: contains the currently lowes address of the stack. Always points to its end.
     * @readonly
     */
    public readonly esp: DoublewordRegister

    /**
     * Interrupt Table Pointer: containts the start address of a structure containing start addresses of interrupt handlers.
     * @readonly
     */
    public readonly itp: DoublewordRegister

    /**
     * Guest Page Table Pointer: contains the start address of a structure containing the Page Table of the guest OS.
     */
    public gptp: DoublewordRegister | null

    /**
     * Page Table Pointer: contains the tart address of a structure containing the Page Table of the OS, when virtualization is disabled.
     * @readonly
     */
    public readonly ptp: DoublewordRegister;

    /**
     * An execution unit which converts virtual memory address to phyiscal memory address if memory virtualization is enbaled.
     * @readonly
     */
    public readonly mmu: MemoryManagementUnit

    /**
     * An exeuction unit which is capable of performing logical and arithmetical operations.
     * @readonly
     */
    public readonly alu: ArithmeticLogicUnit;

    // The binary encoded type of the currently executed instruction.
    private _decodedInstruction: DecodedInstruction | null;

    /**
     * Constructs a fresh instance of a CPU core.
     * @param mainMemory 
     * @param processingWidth 
     */
    public constructor(mainMemory: RAM) {
        this._virtualizationEnabled = false;
        this.eax = new DoublewordRegister("EAX");
        this.ebx = new DoublewordRegister("EBX");
        this.eip = new DoublewordRegister("EIP");
        this.eflags = new EFLAGS();
        this.eir = new DoublewordRegister("EIR");
        this.nptp = new DoublewordRegister("NPTP");
        this.vmtpr = new DoublewordRegister("VMPTR");
        this.esp = new DoublewordRegister("ESP");
        this.itp = new DoublewordRegister("ITP");
        this.ptp = new DoublewordRegister("PTP");
        this.gptp = null;
        this.mmu = new MemoryManagementUnit(mainMemory);
        this.alu = new ArithmeticLogicUnit(this.eflags);
        this._decodedInstruction = null;
    }

    /**
     * This method enables virtualization for this core.
     * It disables the PTP and enables the GPTP register.
     */
    public enableVirtualization() {
        this._virtualizationEnabled = true;
        this.gptp = new DoublewordRegister("GPTP");
    }

    /**
     * This method disables virtualization for this core.
     * It disables the GPTP and enables the PTP register.
     */
    public disableVirtualization() {
        this._virtualizationEnabled = false;
        this.gptp = null;
    }

    /**
     * This method checks whether virtualization is enabled for this core.
     * @returns True, if virtualization is enabled, false otherwise.
     */
    public virtualizationEnabled(): boolean {
        return this._virtualizationEnabled;
    }

    /**
     * This method fetches the next instruction from main memory and loads it into the EIR register.
     * The next instruction to be executed is determined by the content of the command pointer.
     * The command pointer always points to the instruction to be executed.
     */
    public fetch() {
        // Read address of next instruction from EIP register.
        const instructionAddress: VirtualAddress = this.eip.content;

        // Read next instruction from mainMemory.
        const instruction: Doubleword = this.mmu.readDoublewordFrom(instructionAddress);
        
        // Load instruction into EIR register.
        this.eir.content = instruction;
    }

    /**
     * This method decodes or analyses the instruction found in the EIR register and prepares execution.
     */
    public decode() {
        // Read instruction from EIR register.
        const instruction: Doubleword = this.eir.content;

        // Split instruction into its components.
        const binaryEncodedInstructionType: Bit[] = instruction.value.slice(0, 4);
        const binaryEncodedOperation: Bit[] = instruction.value.slice(6, 13);
        const binaryEncodedAddressingModeFirstOperand: Bit[] = instruction.value.slice(15, 17);
        const binaryEncodedTypeFirstOperand: Bit[] = instruction.value.slice(17, 24);
        const binaryEncodedAddressingModeSecondOperand: Bit[] = instruction.value.slice(24, 26);
        const binaryEncodedTypeSecondOperand: Bit[] = instruction.value.slice(26);

        // Decode instruction.
        const decodedInstructionType: InstructionTypes = InstructionDecoder.decodeInstructionType(binaryEncodedInstructionType);

        const decodedOperation: Operations = 
            (decodedInstructionType === InstructionTypes.I) ? 
                InstructionDecoder.decodeIOperation(binaryEncodedOperation) : 
                    (decodedInstructionType === InstructionTypes.R) ? 
                        InstructionDecoder.decodeROperation(binaryEncodedOperation) : 
                        InstructionDecoder.decodeJOperation(binaryEncodedOperation);

        const decodedAddressingModeFirstOperand: AddressingModes = 
            InstructionDecoder.decodeAddressingMode(binaryEncodedAddressingModeFirstOperand);

        const decodedAddressingModeSecondOperand: AddressingModes = 
            InstructionDecoder.decodeAddressingMode(binaryEncodedAddressingModeSecondOperand);

        const decodedTypeFirstOperand: OperandTypes = 
            InstructionDecoder.decodeOperandType(binaryEncodedTypeFirstOperand);
        
            const decodedTypeSecondOperand: OperandTypes = 
            InstructionDecoder.decodeOperandType(binaryEncodedTypeSecondOperand);
        
        this._decodedInstruction = new DecodedInstruction(decodedInstructionType, decodedOperation);

        // Retrieve current instruction pointer and convert its binary value to a decimal value.
        const addressOfCurrentInstructionDec: number = parseInt(this.eip.content.toString(), 2);

        var decodedSecondOperand: InstructionOperand | undefined = undefined;
        var decodedFirstOperand: InstructionOperand | undefined = undefined;
        
        if (decodedTypeSecondOperand !== OperandTypes.NO) {            
            /**
             * Read second operands value from main memory.
             * It is located at addresses with an offset of 8 from the first 
             * address of the instruction.
             */
            const encodedValueSecondOperand: Doubleword = 
                this.mmu.readDoublewordFrom(VirtualAddress.fromInteger(addressOfCurrentInstructionDec + 8));

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
        
        if (decodedTypeFirstOperand !== OperandTypes.NO) {
            /**
             * Read second operands value from main memory.
             * It is located at addresses with an offset of 4 from the first 
             * address of the instruction.
             */
            const encodedValueFirstOperand: Doubleword = 
                this.mmu.readDoublewordFrom(VirtualAddress.fromInteger(addressOfCurrentInstructionDec + 4));

            /**
             * Create instance of an InstructionOperand for the first operand.
             */
            const decodedFirstOperand = new InstructionOperand(
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
    }

    /**
     * This method executes the instruction found in the EIR register.
     */
    public execute() {
        if (this._decodedInstruction === null) {
            throw new Error("No instruction is currently ready to be executed.");
        }
        // TODO
    }
}