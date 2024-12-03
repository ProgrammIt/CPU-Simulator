import { EFLAGS } from "../functional_units/EFLAGS";
import { RAM } from "../functional_units/RAM";
import { GeneralPurposeRegister } from "../functional_units/GeneralPurposeRegister";
import { MemoryManagementUnit } from "./MemoryManagementUnit";
import { InstructionDecoder } from "./../InstructionDecoder";
import { AddressingModes, InstructionTypes, OperandTypes, Operations, AccessableRegisters, WritableRegisters, DataSize } from "../../types";
import { Doubleword } from "../../types/Doubleword";
import { VirtualAddress } from "../../types/VirtualAddress";
import { Bit } from "../../types/Bit";
import { ArithmeticLogicUnit } from "./ArithmeticLogicUnit";
import { InstructionRegister } from "../functional_units/InstructionRegister";
import { PointerRegister } from "../functional_units/PointerRegister";
import { Instruction } from "../../types/Instruction";
import { InstructionOperand } from "../../types/InstructionOperand";
import { DecodedInstruction } from "../../types/DecodedInstruction";
import { Address } from "../../types/Address";
import { Byte } from "../../types/Byte";

export class CPUCore {
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

    /**
     *  The binary encoded type of the currently executed instruction.
     */
    private _decodedInstruction: DecodedInstruction | null;

    /**
     * The start address of any programm.
     */
    private _programmLowAddressDec: number;

    /**
     * The highest address of any programm
     */
    private _programmHighAddressDec: number;

    /**
     * Constructs a fresh instance of a CPU core.
     * @param mainMemory 
     * @param processingWidth 
     */
    public constructor(mainMemory: RAM) {
        this._virtualizationEnabled = false;
        this.eax = new GeneralPurposeRegister("EAX");
        this.ebx = new GeneralPurposeRegister("EBX");
        this.eip = new PointerRegister("EIP");
        this.eflags = new EFLAGS();
        this.eir = new InstructionRegister();
        this.nptp = new PointerRegister("NPTP");
        this.vmtpr = new PointerRegister("VMPTR");
        this.esp = new PointerRegister("ESP");
        this.itp = new PointerRegister("ITP");
        this.ptp = new PointerRegister("PTP");
        this.gptp = null;
        this.mmu = new MemoryManagementUnit(mainMemory);
        this.alu = new ArithmeticLogicUnit(this.eflags);
        this._decodedInstruction = null;
        this._programmLowAddressDec = 0;
        this._programmHighAddressDec = mainMemory.capacity;
    }

    /**
     * This method loads a compiled assembly programm into the main memory and resets the instruction pointer to 0b0.
     * @param compiledProgram 
     */
    public loadProgramm(compiledProgram: Array<Doubleword|Instruction>) {
        // Load compiled programm into main memory.
        var currentAddressDec: number = this._programmLowAddressDec;
        for (const binaryValue of compiledProgram) {
            this.mmu.writeDoublewordTo(VirtualAddress.fromInteger(currentAddressDec), binaryValue);
            currentAddressDec += 4;
        }
        this._programmHighAddressDec = currentAddressDec;
        // Reset the instruction pointer
        this.eip.content = VirtualAddress.fromInteger(this._programmLowAddressDec);
        return;
    }

    /**
     * This method unloads a compiled assembly programm from the main memory and resets the instruction pointer to 0b0.
     * The process of unloading includes clearing all used frames and reseting the page table for the programm/process.
     */
    public unloadProgramm() {
        // TODO: Unload compiled programm into main memory.
        // Reset the instruction pointer
        this.eip.content = VirtualAddress.fromInteger(this._programmLowAddressDec);
        return;
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
        if (this.eir.content.toString() === "".padStart(DataSize.DOUBLEWORD, "0")) {
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
        const instruction: Doubleword = this.mmu.readDoublewordFrom(instructionAddress);
        
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
        const operation: Operations = this._decodedInstruction.operation;
        var jumpPerformed: boolean = false;
        switch (operation) {
            case Operations.NOT:
                this.not(
                    this._decodedInstruction.operands![0]
                );
                break;
            case Operations.AND:
                this.and(
                    this._decodedInstruction.operands![0], 
                    this._decodedInstruction.operands![1]!
                );
                break;
            case Operations.OR:
                this.or(
                    this._decodedInstruction.operands![0], 
                    this._decodedInstruction.operands![1]!
                );
                break;
            case Operations.XOR:
                this.xor(
                    this._decodedInstruction.operands![0], 
                    this._decodedInstruction.operands![1]!
                );
                break;
            case Operations.NEG:
                this.neg(this._decodedInstruction.operands![0]);
                break;
            case Operations.ADD:
                this.add(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            case Operations.ADC:
                this.adc(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            case Operations.SUB:
                this.sub(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            case Operations.SBB:
                this.sbb(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            case Operations.MUL:
                this.mul(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            case Operations.DIV:
                this.div(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            case Operations.TEST:
                this.test(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                )
                break;
            case Operations.CMP:
                this.cmp(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            case Operations.STI:
                this.sti();
                break;
            case Operations.CLI:
                this.cli();
                break;
            case Operations.CLC:
                this.clc();
                break;
            case Operations.CMC:
                this.cmc();
                break;
            case Operations.STC:
                this.stc();
                break;
            case Operations.POPF:
                this.popf();
                break;
            case Operations.PUSHF:
                this.pushf();
                break;
            case Operations.POP:
                this.pop(this._decodedInstruction.operands![0]);
                break;
            case Operations.PUSH:
                this.push(this._decodedInstruction.operands![0]);
                break;
            case Operations.JMP:
                jumpPerformed = this.jump(this._decodedInstruction.operands![0]);
                break;
            case Operations.JE:
                jumpPerformed = this.je(this._decodedInstruction.operands![0]);
                break;
            case Operations.JG:
                jumpPerformed = this.jg(this._decodedInstruction.operands![0]);
                break;
            case Operations.JL:
                jumpPerformed = this.jl(this._decodedInstruction.operands![0]);
                break;
            case Operations.JGE:
                jumpPerformed = this.jge(this._decodedInstruction.operands![0]);
                break;
            case Operations.JLE:
                jumpPerformed = this.jle(this._decodedInstruction.operands![0]);
                break;
            case Operations.JNE:
                jumpPerformed = this.jne(this._decodedInstruction.operands![0]);
                break;
            case Operations.JNZ:
                jumpPerformed = this.jnz(this._decodedInstruction.operands![0]);
                break;
            case Operations.JZ:
                jumpPerformed = this.jz(this._decodedInstruction.operands![0]);
                break;
            case Operations.LEA:
                this.lea(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            case Operations.NOP:
                this.nop();
                break;
            case Operations.CALL:
                this.call(this._decodedInstruction.operands![0]);
                break;
            case Operations.RET:
                this.ret();
                break;
            case Operations.MOV:
                this.mov(
                    this._decodedInstruction.operands![0],
                    this._decodedInstruction.operands![1]!
                );
                break;
            default:
                throw new Error("Unrecognized operation found.");
                break;
        }
        if (!jumpPerformed) {
            /**
             * Increment EIP by 3 x 4 addresses (<-> 12 Bytes) after execution 
             * of the current instruction.
             */
            const flags: Byte = this.eflags.content;
            this.eip.content = this.alu.add(this.eip.content, Doubleword.fromInteger(12));
            this.eflags.content = flags;
        }
        return;
    }

    /**
     * This method is a proxy for the NOT operation provided by the ALU.
     * It retrieves the binary value to perfom computation on from the given operands location
     * and writes the result back to this location.
     * @param target The operand to perform this operation on.
     */
    private not(target: InstructionOperand) {
        var operandsValue: Doubleword;
        if (target.type === OperandTypes.IMMEDIATE) {
            throw new Error("NOT instruction does not support an immediate target operand.");
        } else if (target.type === OperandTypes.NO) {
            throw new Error("NOT instruction does need at least one operand.");
        } else if (target.type === OperandTypes.MEMORY_ADDRESS) {
            operandsValue = this.mmu.readDoublewordFrom(target.value);
        } else {
            operandsValue = this.readRegister(target);
        }
        const result: Doubleword = this.alu.not(operandsValue);
        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result);
        } else {
            this.writeRegister(result, target);
        }
    }

    /**
     * This method is a proxy for the AND operation provided by the ALU.
     * It retrieves the binary value to perfom computation on from the given operands location
     * and writes the result back to the second operands location.
     * @param source The operand to perform this operation on.
     * @param target The second operand to perform this operation on.
     */
    private and(source: InstructionOperand, target: InstructionOperand) {
        var firstOperandsValue: Doubleword;
        var secondOperandsValue: Doubleword;

        if (target.type === OperandTypes.IMMEDIATE) {
            throw new Error("AND instruction does not support an immediate target operand.");
        }
        if (source.type === OperandTypes.NO || target.type === OperandTypes.NO) {
            throw new Error("AND instruction does require at exactly two operands.");
        }
        
        if (source.type === OperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === OperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value);
        } else {
            firstOperandsValue = this.readRegister(source);
        }

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value);
        } else {
            secondOperandsValue = this.readRegister(target);
        }

        const result: Doubleword = this.alu.and(secondOperandsValue, firstOperandsValue);

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result);
        } else {
            this.writeRegister(result, target);
        }
    }

    /**
     * This method is a proxy for the OR operation provided by the ALU.
     * It retrieves the binary value to perfom computation on from the given operands location
     * and writes the result back to the second operands location.
     * @param source The first operand to perform this operation on.
     * @param target The second operand to perform this operation on.
     */
    private or(source: InstructionOperand, target: InstructionOperand) {
        var firstOperandsValue: Doubleword;
        var secondOperandsValue: Doubleword;

        if (target.type === OperandTypes.IMMEDIATE) {
            throw new Error("AND instruction does not support an immediate target operand.");
        }
        if (source.type === OperandTypes.NO || target.type === OperandTypes.NO) {
            throw new Error("AND instruction does require at exactly two operands.");
        }
        
        if (source.type === OperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === OperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value);
        } else {
            firstOperandsValue = this.readRegister(source);
        }

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value);
        } else {
            secondOperandsValue = this.readRegister(target);
        }

        const result: Doubleword = this.alu.or(secondOperandsValue, firstOperandsValue);

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result);
        } else {
            this.writeRegister(result, target);
        }
    }

    /**
     * This method is a proxy for the XOR operation provided by the ALU.
     * It retrieves the binary value to perfom computation on from the given operands location
     * and writes the result back to the second operands location.
     * @param source The first operand to perform this operation on.
     * @param target The second operand to perform this operation on.
     */
    private xor(source: InstructionOperand, target: InstructionOperand) {
        var firstOperandsValue: Doubleword;
        var secondOperandsValue: Doubleword;

        if (target.type === OperandTypes.IMMEDIATE) {
            throw new Error("AND instruction does not support an immediate target operand.");
        }
        if (source.type === OperandTypes.NO || target.type === OperandTypes.NO) {
            throw new Error("AND instruction does require at exactly two operands.");
        }
        
        if (source.type === OperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === OperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value);
        } else {
            firstOperandsValue = this.readRegister(source);
        }

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value);
        } else {
            secondOperandsValue = this.readRegister(target);
        }

        const result: Doubleword = this.alu.xor(secondOperandsValue, firstOperandsValue);

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result);
        } else {
            this.writeRegister(result, target);
        }
    }

    /**
     * This method is a proxy for the NEG operation provided by the ALU.
     * It retrieves the binary value to perfom computation on from the given operands location
     * and writes the result back to the operands location.
     * @param target The operand to perform this operation on.
     */
    private neg(target: InstructionOperand) {
        var value: Doubleword;
        if (target.type === OperandTypes.IMMEDIATE) {
            throw new Error("AND instruction does not support an immediate target operand.");
        }
        if (target.type === OperandTypes.NO) {
            throw new Error("AND instruction does require at exactly two operands.");
        }

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            value = this.mmu.readDoublewordFrom(target.value);
        } else {
            value = this.readRegister(target);
        }

        const result: Doubleword = this.alu.neg(value);

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result);
        } else {
            this.writeRegister(result, target);
        }
    }

    /**
     * This method is a proxy for the ADD operation provided by the ALU.
     * It retrieves the binary value to perfom computation on from the given operands location
     * and writes the result back to the second operands location.
     * @param source The first operand to perform this operation on.
     * @param target The second operand to perform this operation on.
     */
    private add(source: InstructionOperand, target: InstructionOperand) {
        var firstOperandsValue: Doubleword;
        var secondOperandsValue: Doubleword;

        if (target.type === OperandTypes.IMMEDIATE) {
            throw new Error("AND instruction does not support an immediate target operand.");
        }
        if (source.type === OperandTypes.NO || target.type === OperandTypes.NO) {
            throw new Error("AND instruction does require at exactly two operands.");
        }
        
        if (source.type === OperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === OperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value);
        } else {
            firstOperandsValue = this.readRegister(source);
        }

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value);
        } else {
            secondOperandsValue = this.readRegister(target);
        }

        const result: Doubleword = this.alu.add(secondOperandsValue, firstOperandsValue);

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result);
        } else {
            this.writeRegister(result, target);
        }
    }

    /**
     * This method is a proxy for the ADC operation provided by the ALU.
     * It retrieves the binary value to perfom computation on from the given operands location
     * and writes the result back to the second operands location.
     * @param source The first operand to perform this operation on.
     * @param target The second operand to perform this operation on.
     */
    private adc(source: InstructionOperand, target: InstructionOperand) {
        var firstOperandsValue: Doubleword;
        var secondOperandsValue: Doubleword;

        if (target.type === OperandTypes.IMMEDIATE) {
            throw new Error("AND instruction does not support an immediate target operand.");
        }
        if (source.type === OperandTypes.NO || target.type === OperandTypes.NO) {
            throw new Error("AND instruction does require at exactly two operands.");
        }
        
        if (source.type === OperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === OperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value);
        } else {
            firstOperandsValue = this.readRegister(source);
        }

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value);
        } else {
            secondOperandsValue = this.readRegister(target);
        }

        const result: Doubleword = this.alu.adc(secondOperandsValue, firstOperandsValue);

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result);
        } else {
            this.writeRegister(result, target);
        }
    }

    /**
     * This method is a proxy for the SUB operation provided by the ALU.
     * It retrieves the binary value to perfom computation on from the given operands location
     * and writes the result back to the second operands location.
     * @param source The first operand to perform this operation on.
     * @param target The second operand to perform this operation on.
     */
    private sub(source: InstructionOperand, target: InstructionOperand) {
        var firstOperandsValue: Doubleword;
        var secondOperandsValue: Doubleword;

        if (target.type === OperandTypes.IMMEDIATE) {
            throw new Error("AND instruction does not support an immediate target operand.");
        }
        if (source.type === OperandTypes.NO || target.type === OperandTypes.NO) {
            throw new Error("AND instruction does require at exactly two operands.");
        }
        
        if (source.type === OperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === OperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value);
        } else {
            firstOperandsValue = this.readRegister(source);
        }

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value);
        } else {
            secondOperandsValue = this.readRegister(target);
        }

        const result: Doubleword = this.alu.sub(secondOperandsValue, firstOperandsValue);

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result);
        } else {
            this.writeRegister(result, target);
        }
    }

    /**
     * This method is a proxy for the SBB operation provided by the ALU.
     * It retrieves the binary value to perfom computation on from the given operands location
     * and writes the result back to the second operands location.
     * @param source The first operand to perform this operation on.
     * @param target The second operand to perform this operation on.
     */
    private sbb(source: InstructionOperand, target: InstructionOperand) {
        var firstOperandsValue: Doubleword;
        var secondOperandsValue: Doubleword;

        if (target.type === OperandTypes.IMMEDIATE) {
            throw new Error("AND instruction does not support an immediate target operand.");
        }
        if (source.type === OperandTypes.NO || target.type === OperandTypes.NO) {
            throw new Error("AND instruction does require at exactly two operands.");
        }
        
        if (source.type === OperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === OperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value);
        } else {
            firstOperandsValue = this.readRegister(source);
        }

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value);
        } else {
            secondOperandsValue = this.readRegister(target);
        }

        const result: Doubleword = this.alu.sbb(secondOperandsValue, firstOperandsValue);

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result);
        } else {
            this.writeRegister(result, target);
        }
    }

    /**
     * This method is a proxy for the MUL operation provided by the ALU.
     * It retrieves the binary value to perfom computation on from the given operands location
     * and writes the result back to the second operands location.
     * @param source The first operand to perform this operation on.
     * @param target The second operand to perform this operation on.
     */
    private mul(source: InstructionOperand, target: InstructionOperand) {
        var firstOperandsValue: Doubleword;
        var secondOperandsValue: Doubleword;

        if (target.type === OperandTypes.IMMEDIATE) {
            throw new Error("AND instruction does not support an immediate target operand.");
        }
        if (source.type === OperandTypes.NO || target.type === OperandTypes.NO) {
            throw new Error("AND instruction does require at exactly two operands.");
        }
        
        if (source.type === OperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === OperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value);
        } else {
            firstOperandsValue = this.readRegister(source);
        }

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value);
        } else {
            secondOperandsValue = this.readRegister(target);
        }

        const result: Doubleword = this.alu.mul(secondOperandsValue, firstOperandsValue);

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result);
        } else {
            this.writeRegister(result, target);
        }
    }

    /**
     * This method is a proxy for the DIV operation provided by the ALU.
     * It retrieves the binary value to perfom computation on from the given operands location
     * and writes the result back to the second operands location.
     * @param source The first operand to perform this operation on.
     * @param target The second operand to perform this operation on.
     */
    private div(source: InstructionOperand, target: InstructionOperand) {
        var firstOperandsValue: Doubleword;
        var secondOperandsValue: Doubleword;

        if (target.type === OperandTypes.IMMEDIATE) {
            throw new Error("AND instruction does not support an immediate target operand.");
        }
        if (source.type === OperandTypes.NO || target.type === OperandTypes.NO) {
            throw new Error("AND instruction does require at exactly two operands.");
        }
        
        if (source.type === OperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === OperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value);
        } else {
            firstOperandsValue = this.readRegister(source);
        }

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value);
        } else {
            secondOperandsValue = this.readRegister(target);
        }

        const result: Doubleword = this.alu.div(secondOperandsValue, firstOperandsValue);

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result);
        } else {
            this.writeRegister(result, target);
        }
    }

    /**
     * This method is a proxy for the CMP operation provided by the ALU.
     * It retrieves the binary value to perfom computation on from the given operands location
     * and writes the result back to the second operands location.
     * @param source The first operand to perform this operation on.
     * @param target The second operand to perform this operation on.
     */
    private cmp(source: InstructionOperand, target: InstructionOperand) {
        var firstOperandsValue: Doubleword;
        var secondOperandsValue: Doubleword;

        if (target.type === OperandTypes.IMMEDIATE) {
            throw new Error("AND instruction does not support an immediate target operand.");
        }
        if (source.type === OperandTypes.NO || target.type === OperandTypes.NO) {
            throw new Error("AND instruction does require at exactly two operands.");
        }
        
        if (source.type === OperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === OperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value);
        } else {
            firstOperandsValue = this.readRegister(source);
        }

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value);
        } else {
            secondOperandsValue = this.readRegister(target);
        }

        this.alu.cmp(secondOperandsValue, firstOperandsValue);
        return;
    }

    /**
     * This method is a proxy for the TEST operation provided by the ALU.
     * It retrieves the binary value to perfom computation on from the given operands location
     * and writes the result back to the second operands location.
     * @param source The first operand to perform this operation on.
     * @param target The second operand to perform this operation on.
     */
    private test(source: InstructionOperand, target: InstructionOperand) {
        var firstOperandsValue: Doubleword;
        var secondOperandsValue: Doubleword;

        if (target.type === OperandTypes.IMMEDIATE) {
            throw new Error("AND instruction does not support an immediate target operand.");
        }
        if (source.type === OperandTypes.NO || target.type === OperandTypes.NO) {
            throw new Error("AND instruction does require at exactly two operands.");
        }
        
        if (source.type === OperandTypes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === OperandTypes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value);
        } else {
            firstOperandsValue = this.readRegister(source);
        }

        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value);
        } else {
            secondOperandsValue = this.readRegister(target);
        }

        this.alu.test(secondOperandsValue, firstOperandsValue);
    }

    /**
     * This method performs a jump and loads the given virtual address
     * into the instruction pointer (**EIP**).
     * @param target
     * @returns Returns true.
     */
    private jump(target: InstructionOperand): boolean {
        this.eip.content = target.value;
        return true;
    }    

    /**
     * This method performs a conditional jump and loads the given virtual address
     * into the instruction pointer (**EIP**). The jump is performed only, if the
     * last operation performed by the ALU resulted in a binary zero.
     * @param target 
     * @returns True, if the jump will is performed, false otherwise.
     */
    private jz(target: InstructionOperand): boolean {
        var perfomJump: boolean = false;
        if (this.eflags.zero === 1) {
            this.eip.content = target.value;
            perfomJump = true;
        }
        return perfomJump;
    }

    /**
     * This method performs a conditional jump and loads the given virtual address
     * into the instruction pointer (**EIP**). The jump is performed only, if the
     * last operation performed by the ALU resulted in a binary zero. Or in other words
     * if the last compared two binary values are equal.
     * @param target
     * @returns True, if the jump will is performed, false otherwise.
     */
    private je(target: InstructionOperand): boolean {
        var perfomJump: boolean = false;
        if (this.eflags.zero === 1) {
            this.eip.content = target.value;
            perfomJump = true;
        }
        return perfomJump;
    }

    /**
     * This method performs a conditional jump and loads the given virtual address
     * into the instruction pointer (**EIP**). The jump is performed only, if the
     * last operation performed by the ALU resulted in a value unequal to a binary zero.
     * @param target
     * @returns True, if the jump will is performed, false otherwise.
     */
    private jnz(target: InstructionOperand): boolean {
        var performJump: boolean = false;
        if (this.eflags.zero === 0) {
            this.eip.content = target.value;
            performJump = true;
        }
        return performJump;
    }

    /**
     * This method performs a conditional jump and loads the given virtual address
     * into the instruction pointer (**EIP**). The jump is performed only, if the
     * last operation performed by the ALU resulted in a value unequal to a binary zero.
     * @param target
     * @returns True, if the jump will is performed, false otherwise.
     */
    private jne(target: InstructionOperand): boolean {
        var performJump: boolean = false;
        if (this.eflags.zero === 0) {
            this.eip.content = target.value;
            performJump = true;
        }
        return performJump;
    }

    /**
     * This method performs a conditional jump and loads the given virtual address
     * into the instruction pointer (**EIP**). The jump is only performed if the last
     * comparison of two binary numbers resulted in the first operand being greater than the second.
     * @param target
     * @returns True, if the jump will is performed, false otherwise.
     */
    private jg(target: InstructionOperand): boolean {
        var perfomJump: boolean = false;
        if (this.eflags.zero === 0 && this.eflags.overflow === this.eflags.sign) {
            this.eip.content = target.value;
            perfomJump = true;
        }
        return perfomJump;
    }

    /**
     * This method performs a conditional jump and loads the given virtual address
     * into the instruction pointer (**EIP**). The jump is only performed if the last
     * comparison of two binary numbers resulted in the first operand being greater than or equal 
     * to the second.
     * @param target
     * @returns True, if the jump will is performed, false otherwise.
     */
    private jge(target: InstructionOperand): boolean {
        var perfomJump: boolean = false;
        if (this.eflags.sign === this.eflags.overflow) {
            this.eip.content = target.value;
            perfomJump = true;
        }
        return perfomJump;
    }

    /**
     * This method performs a conditional jump and loads the given virtual address
     * into the instruction pointer (**EIP**). The jump is only performed if the last
     * comparison of two binary numbers resulted in the first operand being smaller than the second.
     * @param target
     * @returns True, if the jump will is performed, false otherwise.
     */
    private jl(target: InstructionOperand): boolean {
        var perfomJump: boolean = false;
        if (this.eflags.sign !== this.eflags.overflow) {
            this.eip.content = target.value;
            perfomJump = true;
        }
        return perfomJump;
    }

    /**
     * This method performs a conditional jump and loads the given virtual address
     * into the instruction pointer (**EIP**). The jump is only performed if the last
     * comparison of two binary numbers resulted in the first operand being smaller than or 
     * equal to the second.
     * @param target
     * @returns True, if the jump will is performed, false otherwise.
     */
    private jle(target: InstructionOperand): boolean {
        var performJump: boolean = false;
        if (this.eflags.zero === 1 && this.eflags.sign !== this.eflags.overflow) {
            this.eip.content = target.value;
            performJump = true;
        }
        return performJump;
    }

    /**
     * This method does basically nothing.
     */
    private nop() {}

    /**
     * This method extracts a bnary value from the source defined by the first operand 
     * and copies it to the target specified by the second operand.
     * @param source The location from where to copy the binary value from.
     * @param target The location to copy the binary value to.
     */
    private mov(source: InstructionOperand, target: InstructionOperand) {
        if (source.type === OperandTypes.MEMORY_ADDRESS && target.type === OperandTypes.MEMORY_ADDRESS) {
            throw new Error("MOV instruction does not support two operands of type memory address.");
        }
        if (target.type === OperandTypes.IMMEDIATE) {
            throw new Error("MOV instruction does not support an immediate target operand.");
        }
        if (source.type === OperandTypes.NO || target.type === OperandTypes.NO) {
            throw new Error("MOV instruction requires two operands. At least one of the given ones is undefined.");
        }
        var valueToMove: Doubleword;
        if (source.type === OperandTypes.IMMEDIATE) {
            valueToMove = source.value;
        } else if (source.type === OperandTypes.MEMORY_ADDRESS) {
            valueToMove = this.mmu.readDoublewordFrom(source.value);
        } else {
            valueToMove = this.readRegister(source);
        }
        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, valueToMove);
        } else {
            this.writeRegister(valueToMove, target);
        }
        return;
    }

    /**
     * This method loads the address of the first operand, which represents the source, into the second operand, the target.
     * @param source The location from where to find the address of. Only a memory address, or register with indirect addressing mode (references a memory address) is permitted.
     * @param target The location to copy the address to. Only a memory address or register (direct and indirect addressing mode) is permitted.
     */
    private lea(source: InstructionOperand, target: InstructionOperand) {
        if (source.type === OperandTypes.IMMEDIATE || target.type === OperandTypes.IMMEDIATE) {
            throw new Error("LEA instruction does not support an immediate source or target operands.");
        }
        if (source.type === OperandTypes.REGISTER && source.addressingMode === AddressingModes.DIRECT) {
            throw new Error("LEA instruction can not extract an address of a register.");
        }
        if (source.type === OperandTypes.NO || target.type === OperandTypes.NO) {
            throw new Error("LEA instruction requires two operands. At least one of the given ones is undefined.");
        }
        var address: Address = new Address();
        if (source.type === OperandTypes.MEMORY_ADDRESS) {
            address = source.value;
        } else {
            address = this.readRegister(source);
        }
        if (target.type === OperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, address);
        } else {
            this.writeRegister(address, target);
        }
        return;
    }

    /**
     * This method clears the carry flag.
     */
    private clc() {
        this.eflags.clearCarry();
        return;
    }

    /**
     * This method complements the carry flag.
     */
    private cmc() {
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
    private stc() {
        this.eflags.setCarry();
        return;
    }

    /**
     * This method clears the interrupt flag.
     */
    private cli() {
        this.eflags.clearInterrupt();
        return;
    }

    /**
     * This method sets the interrupt flag.
     */
    private sti() {
        this.eflags.setInterrupt();
        return;
    }

    /**
     * This method pushes the contents of the EFLAGS register onto the STACK.
     */
    private pushf() {
        // Allocate one byte on STACK by decrementing the value in ESP.
        this.esp.content = this.alu.sub(this.esp.content, Doubleword.fromInteger(1));
        // Write contents of flags register on STACK.
        this.mmu.writeByteTo(this.esp.content, this.eflags.content);
        return;
    }

    /**
     * This method reads the contents of the EFLAGS register from the STACK into the EFLAGS register.
     */
    private popf() {
        // Read contents of flags register from STACK into flags register.
        this.eflags.content = this.mmu.readByteFrom(this.esp.content);
        // Deallocate one byte on STACK by incrementing the value in ESP.
        this.esp.content = this.alu.add(this.esp.content, Doubleword.fromInteger(1));
        return;
    }

    /**
     * This method copies a doubleword sized binary value from the STACK to the specified target.
     * @param target Defines, where to put the red binary value from the STACK.
     */
    private pop(target: InstructionOperand) {
        if (target.type === OperandTypes.IMMEDIATE) {
            throw new Error("POP instruction does not support an immediate as a target operand.");
        } else if (target.type === OperandTypes.NO) {
            throw new Error("POP instruction requires one operand.");
        } else if (target.type === OperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(
                target.value, 
                this.mmu.readDoublewordFrom(this.esp.content)
            );
        } else {
            this.writeRegister(
                this.mmu.readDoublewordFrom(this.esp.content), 
                target
            );
        }
        this.esp.content = this.alu.add(this.esp.content, Doubleword.fromInteger(4));
        return;
    }

    /**
     * This method puts a doubleword sized binary value onto the STACK.
     * @param source The binary value to put onto the STACK.
     */
    private push(source: InstructionOperand) {
        // Move STACK pointer towards lower addresses in order to alocate memory.
        this.esp.content = this.alu.sub(this.esp.content, Doubleword.fromInteger(4));
        if (source.type === OperandTypes.IMMEDIATE) {
            throw new Error("PUSH instruction does not support an immediate as a target operand.");
        } else if (source.type === OperandTypes.NO) {
            throw new Error("PUSH instruction requires one operand.");
        } else if (source.type === OperandTypes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(
                this.esp.content, 
                this.mmu.readDoublewordFrom(source.value)
            );
        } else {
            this.mmu.writeDoublewordTo(
                this.esp.content, 
                this.readRegister(source)
            );
        }
        return;
    }

    /**
     * This method sets the EIP register to the specified memory address in order to realize the
     * call of a subroutine.
     * @param target 
     */
    private call(target: InstructionOperand) {
        if (target.type === OperandTypes.IMMEDIATE) {
            throw new Error("POP instruction does not support an immediate as a target operand.");
        } else if (target.type === OperandTypes.NO) {
            throw new Error("POP instruction requires one operand.");
        } else if (target.type === OperandTypes.MEMORY_ADDRESS) {
            this.eip.content = target.value;
        } else {
            this.eip.content = this.readRegister(target);
        }
        return;
    }

    /**
     * This method takes the return address from the stack and transfers control
     * to the command located at this address (the caller).
     * @param target 
     */
    private ret() {
        this.eip.content = this.mmu.readDoublewordFrom(this.esp.content);
        this.alu.add(this.esp.content, Doubleword.fromInteger(4));
        return;
    }

    /**
     * This method writes a doubleword sized binary value to a given register operand.
     * Depending on the access type, the value is written directly to the register or
     * to an referenced address of the main memory.
     * @param operand The register operand to read a binary value from.
     * @returns The red binary value.
     */
    private writeRegister(value: Doubleword, operand: InstructionOperand) {
        if (operand.addressingMode === AddressingModes.INDIRECT) {
            this.writeRegisterIndirect(value, operand);
        } else {
            this.writeRegisterDirect(value, operand);
        }
        return;
    }

    /**
     * This methods writes a given doubleword sized binary value to the given
     * register.
     * @param value The binary value to write to the given register.
     * @param operand The register to write the value to.
     */
    private writeRegisterDirect(value: Doubleword, operand: InstructionOperand) {
        switch (operand.value.toString()) {
            case WritableRegisters.EAX:
                this.eax.content = value;
                break;
            case WritableRegisters.EBX:
                this.ebx.content = value;
                break;
            case WritableRegisters.EIP:
                this.eip.content = value;
                break;
            case WritableRegisters.ESP:
                this.esp.content = value;
                break;
            case WritableRegisters.GPTP:
                if (this.gptp === null) {
                    throw new Error("Could not access GPTP register. Please enable virtualization before trying to access GPTP.");
                }
                this.gptp.content = value;
                break;
            case WritableRegisters.ITP:
                this.itp.content = value;
                break;
            case WritableRegisters.NPTP:
                this.nptp.content = value;
                break;
            case WritableRegisters.VMPTR:
                this.vmtpr.content = value;
                break;
            default:
                throw new Error(`Unrecognized binary encoded register: ${operand.value.toString()}.`);
                break;
        }
    }

    /**
     * This methods writes a given doubleword sized binary value to the memory address
     * referenced by the given register.
     * @param value The binary value to write to the memory address referenced by the given register.
     * @param operand The register which references a memory address to write to.
     */
    private writeRegisterIndirect(value: Doubleword, operand: InstructionOperand) {
        var register: GeneralPurposeRegister|PointerRegister;
        switch (operand.value.toString()) {
            case WritableRegisters.EAX:
                register = this.eax;
                break;
            case WritableRegisters.EBX:
                register = this.ebx;
                break;
            case WritableRegisters.EIP:
                register = this.eip;
                break;
            case WritableRegisters.ESP:
                register = this.esp;
                break;
            case WritableRegisters.GPTP:
                if (this.gptp === null) {
                    throw new Error("Could not access GPTP register. Please enable virtualization before trying to access GPTP.");
                }
                register = this.gptp;
                break;
            case WritableRegisters.ITP:
                register = this.itp;
                break;
            case WritableRegisters.NPTP:
                register = this.nptp;
                break;
            case WritableRegisters.VMPTR:
                register = this.vmtpr;
                break;
            default:
                throw new Error(`Unrecognized binary encoded register: ${operand.value.toString()}.`);
                break;
        }
        this.mmu.writeDoublewordTo(register.content, value);
        return;
    }

    /**
     * This method reads a doubleword sized binary value from a given register operand.
     * Depending on the access type, the value is read directly from the register or
     * from the main memory, if an address is referenced by the register.
     * @param operand The register operand to read a binary value from.
     * @returns The red binary value.
     */
    private readRegister(operand: InstructionOperand): Doubleword {
        var doubleword: Doubleword = new Doubleword();
        if (operand.addressingMode === AddressingModes.INDIRECT) {
            doubleword = this.readRegisterIndirect(operand);
        } else {
            doubleword = this.readRegisterDirect(operand);
        }
        return doubleword;
    }

    /**
     * This method reads a doubleword from the memory address the given register
     * is pointing to.
     * @param operand The register which references a memory address.
     * @returns The binary value read from the memory address referenced by the register.
     */
    private readRegisterIndirect(operand: InstructionOperand): Doubleword {
        const address: Address = this.readRegisterDirect(operand);
        return this.mmu.readDoublewordFrom(address);
    }

    /**
     * This method reads a doubleword from the register.
     * @param operand The register operand.
     * @returns The binary value read from the register.
     */
    private readRegisterDirect(operand: InstructionOperand): Doubleword {
        var value: Doubleword;
        switch (operand.value.toString()) {
            case AccessableRegisters.EAX:
                value = this.eax.content;
                break;
            case AccessableRegisters.EBX:
                value = this.ebx.content;
                break;
            case AccessableRegisters.EIP:
                value = this.eip.content;
                break;
            case AccessableRegisters.EIR:
                value = this.eir.content;
                break;
            case AccessableRegisters.ESP:
                value = this.esp.content;
                break;
            case AccessableRegisters.GPTP:
                if (this.gptp === null) {
                    throw new Error("Could not access GPTP register. Please enable virtualization before trying to access GPTP.");
                }
                value = this.gptp.content;
                break;
            case AccessableRegisters.ITP:
                value = this.itp.content;
                break;
            case AccessableRegisters.NPTP:
                value = this.nptp.content;
                break;
            case AccessableRegisters.VMPTR:
                value = this.vmtpr.content;
                break;
            default:
                throw new Error(`Unrecognized binary encoded register: ${operand.value.toString()}.`);
                break;
        }
        return value;
    }
}