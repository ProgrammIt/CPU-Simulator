import { FLAGS as FLAGS } from "../functional_units/FLAGS";
import { RAM } from "../functional_units/RAM";
import { GeneralPurposeRegister } from "../functional_units/GeneralPurposeRegister";
import { MemoryManagementUnit } from "./MemoryManagementUnit";
import { AddressingModes} from "../../types/enumerations/AddressingModes";
import { DataSizes } from "../../types/enumerations/DataSizes";
import { DoubleWord } from "../../types/binary/DoubleWord";
import { ArithmeticLogicUnit } from "./ArithmeticLogicUnit";
import { InstructionRegister } from "../functional_units/InstructionRegister";
import { PointerRegister } from "../functional_units/PointerRegister";
import { InstructionOperand } from "../../types/binary/InstructionOperand";
import { Instruction } from "../../types/binary/Instruction";
import { Byte } from "../../types/binary/Byte";
import { Register } from "../functional_units/Register";
import { Instructions } from "../../types/enumerations/Instructions";
import { InstructionTypes } from "../../types/enumerations/InstructionTypes";
import { OperandTypeCodes } from "../../types/enumerations/OperandTypes";
import { DevOperations } from "../../types/enumerations/DevOperations";
import { PassthroughFilesystem } from "../os/PassthroughFilesystem";
import { InterruptNumbers } from "../../types/enumerations/InterruptNumbers";
import { Timer } from "./Timer";
import { DebugLogger } from "../Logger";
import { ExceptionError } from "../../types/errors/ExceptionError";
import { RegisterNumbers } from "../../types/enumerations/RegisterNumbers";
import { applicationWindow } from "./../../main";

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
    public readonly ecx: GeneralPurposeRegister;

    /**
     * Fourth general purpose register: can be used for storing all kinds of "datatypes".
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
    public readonly flags: FLAGS;

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
    public readonly vmptr: PointerRegister;

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

    private interruptQueue: InterruptNumbers[] = [];

    /**
     *  The binary encoded type of the currently executed instruction.
     */
    private _decodedInstruction: Instruction | null;
    
    public fs: PassthroughFilesystem;

    public readonly timer: Timer;

    public mainMemory: RAM;

    /**
     * Constructs an instance of a CPU core.
     * @param mainMemory The main memory of the system.
     * @param processingWidth The maximum number of bits that can be processed in one cycle. Defaults to 32 bits (a doubleword).
     * @param pathToOSFilesystem 
     */
    public constructor(mainMemory: RAM, processingWidth: DataSizes, pathToOSFilesystem: string) {
        this._virtualizationEnabled = false;
        this.eax = new GeneralPurposeRegister("EAX");
        this.ebx = new GeneralPurposeRegister("EBX");
        this.ecx = new GeneralPurposeRegister("ECX");
        this.edx = new GeneralPurposeRegister("EDX");
        this.eip = new PointerRegister("EIP");
        this.flags = new FLAGS();
        this.eir = new InstructionRegister();
        this.nptp = new PointerRegister("NPTP");
        this.vmptr = new PointerRegister("VMPTR");
        this.esp = new PointerRegister("ESP");
        this.itp = new PointerRegister("ITP");
        this.ptp = new PointerRegister("PTP");
        this.gptp = null;
        // TODO: Adopt ALU to be able to use different processing widths.
        this.alu = new ArithmeticLogicUnit(this);
        // TODO: Adopt MMU to be able to use different processing widths.
        this.mainMemory = mainMemory;
        this.mmu = new MemoryManagementUnit(this);
        this.fs = new PassthroughFilesystem(pathToOSFilesystem);
        this.timer = new Timer(this);
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
     * This method performs a single user instruction cycle.
     */
    public cycle(): void {

        if (this.flags.isInUserMode())
        {
            this.internalCycle();
            this.timer.countDown();
        }

        while (this.flags.isInKernelMode())
        {
            this.internalCycle();
        }

        //Now handle all pending interrupts
        while (this.flags.interrupt && this.interruptQueue.length !== 0) {

            this.handleInterrupt(this.interruptQueue.shift() as InterruptNumbers)

            while (this.flags.isInKernelMode())
            {
                this.internalCycle();
            }
        }


    }


    /**
     * Handle an Interrupt
     * @param number Interrupt number to handle
     */
    public handleInterrupt(number: InterruptNumbers)
    {
        if (this.flags.interrupt == 0) {
            this.reset(); //A CPU exception while interrupt are disabled -> panic, reset system
            throw new Error("Kernel Panic");
        }

        const returnValue = this.eip.content;

        this.int(new InstructionOperand(
            AddressingModes.DIRECT,
            OperandTypeCodes.IMMEDIATE,
            DoubleWord.fromNumber(number)
        ));

        //Make sure the current instruction is re-executed
        // Overwrite the return address on the STACK.
        this.mmu.writeDoublewordTo(this.esp.content, returnValue, false);

        DebugLogger.log("Interrupt: " + InterruptNumbers[number]);

        if (number === InterruptNumbers.PAGE_FAULT) {

            if (this.mmu.pageFaultAddress == undefined)
            {
                throw new Error("Page Fault happent but the did not provide the address that failed");
            }
            // Write the "bad" address onto the interrupt STACK.
            this.esp.content = DoubleWord.fromNumber(this.esp.content - 4);
            this.mmu.writeDoublewordTo(this.esp.content, this.mmu.pageFaultAddress, false);
            this.mmu.pageFaultAddress = undefined;
        }
    }

    /**
     * This method performs a single instruction cycle.
     */
    private internalCycle(): void {

        try {
            this.fetch();
            this.decode();
            this.execute();
        } catch(error) {
            if (!(error instanceof ExceptionError)) {
                DebugLogger.log(error);
            }
            else
            {
                this.handleInterrupt(error.interruptNumber)
            }
        }
    }

    /**
     * This method fetches the next instruction from main memory and loads it into the EIR register.
     * The next instruction to be executed is determined by the content of the command pointer.
     * The command pointer always points to the instruction to be executed.
     */
    private fetch(): void {

        // Read address of next instruction from EIP register.
        const instructionAddress: DoubleWord = this.eip.content;
        // Read next instruction from mainMemory.
        const instruction: DoubleWord = this.mmu.readDoublewordFrom(instructionAddress, true);
        // Load instruction into EIR register.
        this.eir.content = instruction;
    }

    /**
     * This method decodes or analyses the instruction found in the EIR register and prepares execution.
     */
    private decode(): void {
        // Read instruction from EIR register.
        const instruction: DoubleWord = this.eir.content;
        // Split instruction into its components.
        const binaryEncodedInstructionType: number = DoubleWord.getBitRange(instruction, 0, 3);
        const binaryEncodedOperation: number =  DoubleWord.getBitRange(instruction, 5, 12);
        const binaryEncodedAddressingModeFirstOperand: number =  DoubleWord.getBitRange(instruction, 14, 16);
        const binaryEncodedTypeFirstOperand: number =  DoubleWord.getBitRange(instruction, 16, 23);
        const binaryEncodedAddressingModeSecondOperand: number =  DoubleWord.getBitRange(instruction, 23, 25);
        const binaryEncodedTypeSecondOperand: number =  DoubleWord.getBitRange(instruction, 25);
        // Decode instruction.
        // Decode instruction type.
        const decodedInstructionType: InstructionTypes = this.decodeInstructionType(binaryEncodedInstructionType);
        // Decode operation.
        const decodedOperation: Instructions = 
            (decodedInstructionType === InstructionTypes.I) ? 
                this.decodeIInstruction(binaryEncodedOperation) : 
                    (decodedInstructionType === InstructionTypes.R) ? 
                        this.decodeRIntruction(binaryEncodedOperation) : 
                        this.decodeJIntruction(binaryEncodedOperation);
        // Decode addressing mode of first operand.
        const decodedAddressingModeFirstOperand: AddressingModes = 
            this.decodeAddressingMode(binaryEncodedAddressingModeFirstOperand);
        // Decode addressing mode of second operand.
        const decodedAddressingModeSecondOperand: AddressingModes = 
            this.decodeAddressingMode(binaryEncodedAddressingModeSecondOperand);
        // Decode type of first operand.
        const decodedTypeFirstOperand: OperandTypeCodes = 
            this.decodeOperandType(binaryEncodedTypeFirstOperand);
        // Decode type of second operand.
        const decodedTypeSecondOperand: OperandTypeCodes = 
            this.decodeOperandType(binaryEncodedTypeSecondOperand);
        // Create a new instance of a DecodedInstruction to save the decoded instruction to.
        this._decodedInstruction = new Instruction(decodedInstructionType, decodedOperation);
        // Retrieve current instruction pointer and convert its binary value to a decimal value.
        const addressOfCurrentInstructionDec: number = this.eip.content
        // Define variables for decoded operands.
        let decodedSecondOperand: InstructionOperand | undefined = undefined;
        let decodedFirstOperand: InstructionOperand | undefined = undefined;
        // Decode second operands value if present.
        if (decodedTypeSecondOperand !== OperandTypeCodes.NO) {            
            /**
             * Read second operands value from main memory.
             * It is located at addresses with an offset of 8 from the first 
             * address of the instruction.
             */
            const encodedValueSecondOperand: DoubleWord = 
                this.mmu.readDoublewordFrom(DoubleWord.fromNumber(addressOfCurrentInstructionDec + 8), true);

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
        
        if (decodedTypeFirstOperand !== OperandTypeCodes.NO) {
            /**
             * Read second operands value from main memory.
             * It is located at addresses with an offset of 4 from the first 
             * address of the instruction.
             */
            const encodedValueFirstOperand: DoubleWord = 
                this.mmu.readDoublewordFrom(DoubleWord.fromNumber(addressOfCurrentInstructionDec + 4), true);

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
            this._decodedInstruction = new Instruction(decodedInstructionType, decodedOperation, [decodedFirstOperand, decodedSecondOperand]);
        } else if (decodedFirstOperand !== undefined && decodedSecondOperand === undefined) {
            this._decodedInstruction = new Instruction(decodedInstructionType, decodedOperation, [decodedFirstOperand, undefined]);
        } else {
            this._decodedInstruction = new Instruction(decodedInstructionType, decodedOperation);
        }
    }

    /**
     * This method executes the instruction found in the EIR register.
     */
    private execute(): void {
        if (this._decodedInstruction === null) {
            throw new Error("No instruction is currently ready to be executed.");
        }
        const operation: Instructions = this._decodedInstruction.instruction;
        const currentOperation:string = Instructions[operation];


        let logText = "";

        if (DebugLogger.isLoggingEnabled() || this.flags.isInUserMode())
        {
            logText = this.getLogText(currentOperation)
        }

        if (DebugLogger.isLoggingEnabled()) {

            if (Instructions.CALL === operation || Instructions.INT === operation)
            {
                DebugLogger.log("");
            }

            if (Instructions.RET === operation || Instructions.IRET === operation)
            {
                DebugLogger.removeIndentation()
            }

            DebugLogger.log(logText);
        }

        if (this.flags.isInUserMode()) {
            let log = "Executing:    ";
            log += logText;
            
            this.logToLogger(" ");
            this.logToLogger(log);
        }

        let jumpPerformed = false;
        switch (operation) {
            case Instructions.NOT:
                this.not(
                    this._decodedInstruction.operands[0]!
                );
                break;
            case Instructions.AND:
                this.and(
                    this._decodedInstruction.operands[0]!, 
                    this._decodedInstruction.operands[1]!
                );
                break;
            case Instructions.OR:
                this.or(
                    this._decodedInstruction.operands[0]!, 
                    this._decodedInstruction.operands[1]!
                );
                break;
            case Instructions.XOR:
                this.xor(
                    this._decodedInstruction.operands[0]!, 
                    this._decodedInstruction.operands[1]!
                );
                break;
            case Instructions.NEG:
                this.neg(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.ADD:
                this.add(
                    this._decodedInstruction.operands[0]!,
                    this._decodedInstruction.operands[1]!
                );
                break;
            case Instructions.ADC:
                this.adc(
                    this._decodedInstruction.operands[0]!,
                    this._decodedInstruction.operands[1]!
                );
                break;
            case Instructions.SUB:
                this.sub(
                    this._decodedInstruction.operands[0]!,
                    this._decodedInstruction.operands[1]!
                );
                break;
            case Instructions.SBB:
                this.sbb(
                    this._decodedInstruction.operands[0]!,
                    this._decodedInstruction.operands[1]!
                );
                break;
            case Instructions.MUL:
                this.mul(
                    this._decodedInstruction.operands[0]!,
                    this._decodedInstruction.operands[1]!
                );
                break;
            case Instructions.DIV:
                this.div(
                    this._decodedInstruction.operands[0]!,
                    this._decodedInstruction.operands[1]!
                );
                break;
            case Instructions.TEST:
                this.test(
                    this._decodedInstruction.operands[0]!,
                    this._decodedInstruction.operands[1]!
                )
                break;
            case Instructions.CMP:
                this.cmp(
                    this._decodedInstruction.operands[0]!,
                    this._decodedInstruction.operands[1]!
                );
                break;
            case Instructions.STI:
                this.sti();
                break;
            case Instructions.CLI:
                this.cli();
                break;
            case Instructions.CLC:
                this.clc();
                break;
            case Instructions.CMC:
                this.cmc();
                break;
            case Instructions.STC:
                this.stc();
                break;
            case Instructions.POPF:
                this.popf();
                break;
            case Instructions.PUSHF:
                this.pushf();
                break;
            case Instructions.POP:
                this.pop(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.PUSH:
                this.push(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.JMP:
                this.jmp(this._decodedInstruction.operands[0]!);
                jumpPerformed = true;
                break;
            case Instructions.JE:
                jumpPerformed = this.je(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.JA:
                jumpPerformed = this.ja(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.JAE:
                jumpPerformed = this.jae(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.JB:
                jumpPerformed = this.jb(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.JBE:
                jumpPerformed = this.jle(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.JG:
                jumpPerformed = this.jg(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.JL:
                jumpPerformed = this.jl(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.JGE:
                jumpPerformed = this.jge(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.JLE:
                jumpPerformed = this.jle(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.JNE:
                jumpPerformed = this.jne(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.JNZ:
                jumpPerformed = this.jnz(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.JZ:
                jumpPerformed = this.jz(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.LEA:
                this.lea(
                    this._decodedInstruction.operands[0]!,
                    this._decodedInstruction.operands[1]!
                );
                break;
            case Instructions.NOP:
                this.nop();
                break;
            case Instructions.CALL:
                jumpPerformed = this.call(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.RET:
                jumpPerformed = this.ret();
                break;
            case Instructions.MOV:
                this.mov(
                    this._decodedInstruction.operands[0]!,
                    this._decodedInstruction.operands[1]!
                );
                break;
            case Instructions.INT:
                jumpPerformed = this.int(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.IRET:
                this.iret();
                jumpPerformed = true;
                break;
            case Instructions.SYSENTER:
                this.sysenter(this._decodedInstruction.operands[0]!);
                break;
            case Instructions.SYSEXIT:
                this.sysexit();
                break;
            case Instructions.DEV:
                this.dev(
                    this._decodedInstruction.operands[0]!,
                    this._decodedInstruction.operands[1]!
                );
                break;
            case Instructions.SHL: // SHL = SAL
                this.shl(
                    this._decodedInstruction.operands[0]!,
                    this._decodedInstruction.operands[1]!
                );
                break;
            case Instructions.SHR:
                this.shr(
                    this._decodedInstruction.operands[0]!,
                    this._decodedInstruction.operands[1]!
                );
                break;
            case Instructions.SAR:
                this.sar(
                    this._decodedInstruction.operands[0]!,
                    this._decodedInstruction.operands[1]!
                );
                break;
            case Instructions.INVTLB:
                this.invtlb();
                break;
            default:
                // Call interrupt handler for Invalid Opcode.
                throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
                break;
        }
        if (!jumpPerformed) {
            /**
             * Increment EIP by 3 x 4 bytes/addresses (<-> 12 Bytes) after execution 
             * of the current instruction.
             */
            const flags: Byte = this.flags.content;
            this.eip.content = DoubleWord.fromNumber(this.eip.content + 12);
            this.flags.content = flags;
        }

        if (DebugLogger.isLoggingEnabled()) {

            if (Instructions.CALL === operation || Instructions.INT === operation)
            {
                DebugLogger.addIndentation()
            }

            try {
                if (this.esp.content <= 0xFFFFFFFC) {
                    const physicalAddress: DoubleWord = this.mmu.translate(this.esp.content, false, false, true);
                    const value = this.mainMemory.readDoublewordFrom(physicalAddress);
                    DebugLogger.log("Stack value: 0x" + value.toString(16));
                }
                else {
                    DebugLogger.log("Stack empty");
                }
            }
            catch {
                DebugLogger.log("Stack value: Not Mapped");
            }
            
            if (Instructions.RET === operation || Instructions.IRET === operation)
            {
                DebugLogger.log("");
                DebugLogger.removeIndentation()
            }
        }
    }

    private getLogText(currentOperation: string): string {
        let text = currentOperation;

        if (this._decodedInstruction?.operands !== undefined) {
            if (0 in this._decodedInstruction.operands! && this._decodedInstruction.operands[0] !== undefined &&
                1 in this._decodedInstruction.operands! && this._decodedInstruction.operands[1] === undefined) {
                if (this._decodedInstruction.operands[0]!.type === OperandTypeCodes.IMMEDIATE) {
                    text += " 0x" + this._decodedInstruction.operands[0]!.value.toString(16);
                } else if (this._decodedInstruction.operands[0]!.type === OperandTypeCodes.MEMORY_ADDRESS) {
                    text += " 0x" + this.mmu.readDoublewordFrom(this._decodedInstruction.operands[0]!.value, true).toString(16);
                } else {
                    const register = this.decodeReadableRegister(this._decodedInstruction.operands[0]!);

                    if (this._decodedInstruction.operands[0]!.addressingMode === AddressingModes.INDIRECT) {
                        text += " *%" + register.name + " (*0x" + register.content.toString(16) + ")" + " (0x" + this.mmu.readDoublewordFrom(register.content, false).toString(16) + ")";
                    } else {
                        text += " %" + register.name + " (0x" + register.content.toString(16) + ")";
                    }
                }
            }
            else if (0 in this._decodedInstruction.operands! && this._decodedInstruction.operands[0] !== undefined) {
                let operand: DoubleWord;

                if (this._decodedInstruction.operands[0]!.type === OperandTypeCodes.IMMEDIATE) {
                    operand = this._decodedInstruction.operands[0]!.value;
                } else if (this._decodedInstruction.operands[0]!.type === OperandTypeCodes.MEMORY_ADDRESS) {
                    operand = this.mmu.readDoublewordFrom(this._decodedInstruction.operands[0]!.value, true);
                } else {
                    operand = this.readRegister(this._decodedInstruction.operands[0]!);
                }
                const hexOperand = operand.toString(16);
                text += " 0x" + hexOperand;
            }
            if (1 in this._decodedInstruction.operands! && this._decodedInstruction.operands[1] !== undefined) {
                if (this._decodedInstruction.operands[1]!.type === OperandTypeCodes.IMMEDIATE) {
                    text += ", 0x" + this._decodedInstruction.operands[1]!.value.toString(16);
                } else if (this._decodedInstruction.operands[1]!.type === OperandTypeCodes.MEMORY_ADDRESS) {
                    text += ", 0x" + this.mmu.readDoublewordFrom(this._decodedInstruction.operands[1]!.value, true).toString(16);
                } else {
                    const register = this.decodeReadableRegister(this._decodedInstruction.operands[1]!);

                    if (this._decodedInstruction.operands[1]!.addressingMode === AddressingModes.INDIRECT) {
                        text += ", *%" + register.name + " (*0x" + register.content.toString(16) + ")" + " (0x" + this.mmu.readDoublewordFrom(register.content, false).toString(16) + ")";
                    } else {
                        text += ", %" + register.name + " (0x" + register.content.toString(16) + ")";
                    }
                }
            }
        }
        return text;
    }

    /*
     * -------------------- DEV / IO --------------------
     */

    /**
     * DEV instruction handles communication with the filesystem, console, and process API.
     * DEV COMMAND DATA
     * DEV operand_1                             operand_2
     *     12345678 12345678 12345678 12345678   12345678 12345678 12345678 12345678
     *     .........reserved......... command.   ...............data................
     * 
     * 
     * command:
     * 0    00000000 - io_seek (fd=op2, offset=stack, mode=stack) -> success=eax
     *          mode:   0 - Seek from current position
     *              1 - Seek from start of file
     *              2 - Seek from end of file
     * 1    00000001 - io_close (fd=op2)
     * 2    00000010 - io_read_buffer (fd=op2, buffer_ptr=stack, buffer_size=stack) -> bytes_read=eax
     * 3    00000011 - io_write_buffer (fd=op2, buffer_ptr=stack, buffer_size=stack) -> bytes_written=eax
     * 4    00000100 - file_create (filename_ptr=op2)
     * 5    00000101 - file_delete (filename_ptr=op2) -> success=eax
     * 6    00000110 - file_open (filename_ptr=op2) -> fd=eax
     * 7    00000111 - file_stat (filename_ptr=op2) -> file_length=eax
     * 8    00001000 - console_print_number(number=op2)
     * 9    00001001 - console_read_number() -> number=eax, error=ebx
     * 10   00001010 - process_create(filename_ptr=op2) -> process_id=eax
     * 11   00001011 - process_exit ()
     * 12   00001100 - process_yield ()
     * 
     * 
     * file descriptor (fd):
     * fd = 0   -> console
     * fd > 0   -> filesystem file descriptors

     * @param command 
     * @param data Command-dependend
     * @throws {ExceptionError} If an exception was generated
     * @author Laurin Gehlenborg
     */
    private dev(command: InstructionOperand, data: InstructionOperand): void {
        // Check whether CPU is in kernel mode.
        if (!this.flags.isInKernelMode()) {
            // CPU is not in kernel mode.
            throw new ExceptionError(InterruptNumbers.GENERAL_PROTECTION_FAULT);
        }

        // Check if exactly two operands are present.
        if (command.type === OperandTypeCodes.NO || data.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }

        let op1: number = 0;
        switch (command.type) {
            case OperandTypeCodes.IMMEDIATE:
                op1 = command.value;
                break;
            case OperandTypeCodes.REGISTER:
                op1 = this.readRegister(command);
                break;
            case OperandTypeCodes.MEMORY_ADDRESS:
                op1 = this.mmu.readDoublewordFrom(command.value, false);
                break;
            default:
                throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }

        let op2: number = 0;
        switch (data.type) {
            case OperandTypeCodes.IMMEDIATE:
                op2 = data.value;
                break;
            case OperandTypeCodes.REGISTER:
                op2 = this.readRegister(data);
                break;
            case OperandTypeCodes.MEMORY_ADDRESS:
                op2 = this.mmu.readDoublewordFrom(data.value, false);
                break;
            default:
                throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }

        let filename: string;
        switch (op1) {
            case DevOperations.IO_SEEK: { // 00000000 - io_seek (fd=op2, offset=stack, mode=stack) -> success=eax
                const seekMode = this.internal_pop();
                const seekOffset = this.internal_pop();
                const seek_result = this.fs.io_seek(op2, seekOffset, seekMode);
                this.eax.content = DoubleWord.fromNumber(seek_result);
                break;
            }
            case DevOperations.IO_CLOSE: {
                this.eax.content =  DoubleWord.fromNumber(this.fs.io_close(op2))
                break;
            }
            case DevOperations.IO_READ_BUFFER: {// 00000010 - io_read_buffer (fd=op2, buffer=stack, b_size=stack) -> bytes_read=eax
                const bufferAddress = this.internal_pop();
                const bufferSize = this.internal_pop();
                const buffer = new Uint8Array(bufferSize);
                const bytesRead = this.fs.io_read_buffer(op2, buffer, bufferSize);
                this.eax.content = DoubleWord.fromNumber(bytesRead);

                if (this.mmu.isMemoryVirtualizationEnabled()) {
                    if (bytesRead > 0) {
                        for (let index = 0; index < bytesRead; index++) {
                            this.mmu.writeByteTo(DoubleWord.fromNumber(bufferAddress + index), Byte.fromNumber(buffer[index]));
                        }
                    }
                } else {
                    if (bytesRead > 0) {
                        for (let index = 0; index < bytesRead; index++) {
                            this.mainMemory.writeByteTo(DoubleWord.fromNumber(bufferAddress + index), Byte.fromNumber(buffer[index]));
                        }
                    }
                }
                
                break;
            }
            case DevOperations.IO_WRITE_BUFFER: {// 00000011 - io_write_buffer (fd=op2, buffer=stack, b_size=stack) -> bytes_written=eax
                const writeBufferAddress = this.internal_pop();
                const writeBufferSize = this.internal_pop();
                const writeBuffer = new Uint8Array(writeBufferSize);
                for (let index = 0; index < writeBufferSize; index++) {
                    const byte = this.mmu.readByteFrom(DoubleWord.fromNumber(writeBufferAddress + index))
                    writeBuffer[index] = byte;
                }
                const bytesWritten = this.fs.io_write_buffer(op2, writeBuffer, writeBufferSize);
                this.eax.content = DoubleWord.fromNumber(bytesWritten);
                break;
            }
            case DevOperations.FILE_CREATE: { // 00000100 - file_create (filename_ptr=op2)
                filename = this.loadZeroTerminatedASCIIStringFromMemory(DoubleWord.fromNumber(op2));
                this.eax.content = DoubleWord.fromNumber(this.fs.file_create(filename));
                break;
            }
            case DevOperations.FILE_DELETE: {// 00000101 file_delete (filename_ptr=op2) -> success=eax
                filename = this.loadZeroTerminatedASCIIStringFromMemory(DoubleWord.fromNumber(op2));
                this.eax.content = DoubleWord.fromNumber(this.fs.file_delete(filename));
                break;
            }
            case DevOperations.FILE_OPEN:{ // 00000110 - file_open (filename_ptr=op2) -> fd=eax
                // load the filename from the given address
                filename = this.loadZeroTerminatedASCIIStringFromMemory(DoubleWord.fromNumber(op2));
                const fd: number = this.fs.file_open(filename);
                this.eax.content = DoubleWord.fromNumber(fd);
                break;
            }
            case DevOperations.FILE_STAT: {// 00000111 - file_stat (filename_ptr=op2) -> file_length=eax
                filename = this.loadZeroTerminatedASCIIStringFromMemory(DoubleWord.fromNumber(op2));
                this.eax.content = DoubleWord.fromNumber(this.fs.file_stat(filename));
                break;
            }
            case DevOperations.CONSOLE_PRINT_NUMBER:{ // 00001000 - console_print_number(number=op2)
                this.fs.console_print_number(op2);
                break;
            }
            case DevOperations.CONSOLE_READ_NUMBER: {//  00001001 - console_read_number() -> number=eax, error=ebx
                const [num, err] = this.fs.console_read_number();
                this.eax.content = DoubleWord.fromNumber(num);
                this.ebx.content = DoubleWord.fromNumber(err);
                break;
            }
            case DevOperations.CPU_IS_MEMORY_VIRTUALIZATION_ENABLED: {//  00001010 isMemoryVirtualizationEnabled()
                this.eax.content = DoubleWord.fromNumber(this.mmu.isMemoryVirtualizationEnabled());
                break;
            }
            case DevOperations.CPU_ENABLE_MEMORY_VIRTUALIZATION: {//  00001011 enableMemoryVirtualization()
                this.mmu.enableMemoryVirtualization();
                break;
            }
            case DevOperations.CPU_DISABLE_MEMORY_VIRTUALIZATION:{ //  00001100 disableMemoryVirtualization()
                this.mmu.disableMemoryVirtualization();
                break;
            }
            case DevOperations.TIMER_GET_FINISHED:{ //  00001101 getReadyID() -> id=eax
                this.eax.content = DoubleWord.fromNumber(this.timer.getReadyID());
                break;
            }
            case DevOperations.TIMER_SET:{ //  00001110 addTimer()
                const timeValue = this.internal_pop();

                this.timer.addTimer(op2, timeValue);
                break;
            }
            default:{
                throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
            }
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
     * @throws {ExceptionError} If an exception was generated
     */
    private add(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly two operands are present.
        if (source.type === OperandTypeCodes.NO || target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Define variables to write the operands values to.
        let firstOperandsValue: DoubleWord;
        let secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === OperandTypeCodes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === OperandTypeCodes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the ADD operation.
        const result: DoubleWord = this.alu.add(secondOperandsValue, firstOperandsValue);
        // Write the result to the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
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
     * @throws {ExceptionError} If an exception was generated
     */
    private adc(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly two operands are present.
        if (source.type === OperandTypeCodes.NO || target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Define variables to write the operands values to.        
        let firstOperandsValue: DoubleWord;
        let secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === OperandTypeCodes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === OperandTypeCodes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the ADC operation.
        const result: DoubleWord = this.alu.adc(secondOperandsValue, firstOperandsValue);
        // Write the result to the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
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
     * @throws {ExceptionError} If an exception was generated
     */
    private sub(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly two operands are present.
        if (source.type === OperandTypeCodes.NO || target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);

        }
        // Define variables to write the operands values to.        
        let firstOperandsValue: DoubleWord;
        let secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === OperandTypeCodes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === OperandTypeCodes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the SUB operation.
        const result: DoubleWord = this.alu.sub(secondOperandsValue, firstOperandsValue);
        // Write the result to the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
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
     * @throws {ExceptionError} If an exception was generated
     */
    private sbb(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly two operands are present.
        if (source.type === OperandTypeCodes.NO || target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Define variables to write the operands values to.
        let firstOperandsValue: DoubleWord;
        let secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === OperandTypeCodes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === OperandTypeCodes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the SBB operation.
        const result: DoubleWord = this.alu.sbb(secondOperandsValue, firstOperandsValue);
        // Write the result to the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result, false);
        } else {
            this.writeRegister(result, target);
        }
        return;
    }

    /**
     * This method is a proxy for the SHL operation provided by the ALU.
     * It takes two binary values from the locations defined by the given operands to perfom the computation on.
     * The result is written to the location defined by the second operand.
     * @param source An operand used as the first argument for the operation.
     * @param target An operand used as the second argument for the operation and to write the result to.
     * @throws {ExceptionError} If an exception was generated
     */
    private shl(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);

        }
        // Check if exactly two operands are present.
        if (source.type === OperandTypeCodes.NO || target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);

        }
        // Define variables to write the operands values to.
        let firstOperandsValue: DoubleWord;
        let secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === OperandTypeCodes.IMMEDIATE) {
            firstOperandsValue = source.value;
        } else if (source.type === OperandTypeCodes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the ADD operation.
        const result: DoubleWord = this.alu.shl(secondOperandsValue, firstOperandsValue as DoubleWord.BitCount);
        // Write the result to the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result, false);
        } else {
            this.writeRegister(result, target);
        }
        return;
    }

    /**
     * This method is a proxy for the SHR operation provided by the ALU.
     * It takes two binary values from the locations defined by the given operands to perfom the computation on.
     * The result is written to the location defined by the second operand.
     * @param source An operand used as the first argument for the operation.
     * @param target An operand used as the second argument for the operation and to write the result to.
     * @throws {ExceptionError} If an exception was generated
     */
    private shr(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);

        }
        // Check if exactly two operands are present.
        if (source.type === OperandTypeCodes.NO || target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);

        }
        // Define variables to write the operands values to.
        let firstOperandsValue: DoubleWord;
        let secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === OperandTypeCodes.IMMEDIATE) {
             firstOperandsValue = source.value;
        } else if (source.type === OperandTypeCodes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the ADD operation.
        const result: DoubleWord = this.alu.shr(secondOperandsValue, firstOperandsValue as DoubleWord.BitCount);
        // Write the result to the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            this.mmu.writeDoublewordTo(target.value, result, false);
        } else {
            this.writeRegister(result, target);
        }
        return;
    }

    /**
     * This method is a proxy for the SAR operation provided by the ALU.
     * It takes two binary values from the locations defined by the given operands to perfom the computation on.
     * The result is written to the location defined by the second operand.
     * @param source An operand used as the first argument for the operation.
     * @param target An operand used as the second argument for the operation and to write the result to.
     * @throws {ExceptionError} If an exception was generated
     */
    private sar(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly two operands are present.
        if (source.type === OperandTypeCodes.NO || target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Define variables to write the operands values to.
        let firstOperandsValue: DoubleWord;
        let secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === OperandTypeCodes.IMMEDIATE) {
             firstOperandsValue = source.value;
        } else if (source.type === OperandTypeCodes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the ADD operation.
        const result: DoubleWord = this.alu.sar(secondOperandsValue, firstOperandsValue as DoubleWord.BitCount);
        // Write the result to the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
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
     * @throws {ExceptionError} If an exception was generated
     */
    private mul(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly two operands are present.
        if (source.type === OperandTypeCodes.NO || target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Define variables to write the operands values to.
        let firstOperandsValue: DoubleWord;
        let secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === OperandTypeCodes.IMMEDIATE) {
             firstOperandsValue = source.value;
        } else if (source.type === OperandTypeCodes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the MUL operation
        const result: DoubleWord = this.alu.imul(secondOperandsValue, firstOperandsValue);
        // Write the result to the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
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
     * @throws {ExceptionError} If an exception was generated
     */
    private div(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }

        // Check if exactly two operands are present.
        if (source.type === OperandTypeCodes.NO || target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }

        // Define variables to write the operands values to.
        let firstOperandsValue: DoubleWord;
        let secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === OperandTypeCodes.IMMEDIATE) {
             firstOperandsValue = source.value;
        } else if (source.type === OperandTypeCodes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        let result = DoubleWord.ZERO;
        // Perform the DIV operation.
        result = this.alu.idiv(secondOperandsValue, firstOperandsValue);
 
        // Write the result to the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
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
     * @throws {ExceptionError} If an exception was generated
     */
    private neg(target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);

        }
        // Check if exactly one operand is present.
        if (target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Define variable to write the operands value to.
        let value: DoubleWord;
        // Read the binary value from the location defined by the operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            value = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            value = this.readRegister(target);
        }
        // Perform the NEG operation
        const result: DoubleWord = this.alu.neg(value);
        // Write the result to the location defined by the operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
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
     * @throws {ExceptionError} If an exception was generated
     */
    private and(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly two operands are present.
        if (source.type === OperandTypeCodes.NO || target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Define variables to write the operands values to.
        let firstOperandsValue: DoubleWord;
        let secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === OperandTypeCodes.IMMEDIATE) {
             firstOperandsValue = source.value;
        } else if (source.type === OperandTypeCodes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the AND operation.
        const result: DoubleWord = this.alu.and(secondOperandsValue, firstOperandsValue);
        // Write the result to the location defined by the second
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
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
     * @throws {ExceptionError} If an exception was generated
     */
    private or(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly two operands are present.
        if (source.type === OperandTypeCodes.NO || target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Define variables to write the operands values to.
        let firstOperandsValue: DoubleWord;
        let secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === OperandTypeCodes.IMMEDIATE) {
             firstOperandsValue = source.value;
        } else if (source.type === OperandTypeCodes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the OR operation.
        const result: DoubleWord = this.alu.or(secondOperandsValue, firstOperandsValue);
        // Write the result to the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
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
     * @throws {ExceptionError} If an exception was generated
     */
    private xor(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly two operands are present.
        if (source.type === OperandTypeCodes.NO || target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Define variables to write the operands values to.
        let firstOperandsValue: DoubleWord;
        let secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === OperandTypeCodes.IMMEDIATE) {
             firstOperandsValue = source.value;
        } else if (source.type === OperandTypeCodes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the XOR operation.
        const result: DoubleWord = this.alu.xor(secondOperandsValue, firstOperandsValue);
        // Write the result to the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
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
     * @throws {ExceptionError} If an exception was generated
     */
    private not(target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly one operand is present.
        if (target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        } 
        // Define variable to write the operands value to.
        let operandsValue: DoubleWord;
        // Read the binary value from the location defined by the operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            operandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            operandsValue = this.readRegister(target);
        }
        // Perform the NOT operation
        const result: DoubleWord = this.alu.not(operandsValue);
        // Write the result to the location defined by the operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
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
     * @throws {ExceptionError} If an exception was generated
     */
    private cmp(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly two operands are present.
        if (source.type === OperandTypeCodes.NO || target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Define variables to write the operands values to.
        let firstOperandsValue: DoubleWord;
        let secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === OperandTypeCodes.IMMEDIATE) {
             firstOperandsValue = source.value;
        } else if (source.type === OperandTypeCodes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            secondOperandsValue = this.mmu.readDoublewordFrom(target.value, true);
        } else {
            secondOperandsValue = this.readRegister(target);
        }
        // Perform the CMP operation
        this.alu.cmp(firstOperandsValue, secondOperandsValue);
        // Both operands are read-only, so no need to write the result back.
        return;
    }

    /**
     * This method is a proxy for the TEST operation provided by the ALU.
     * It takes two binary values from the locations defined by the given operands to perfom the computation on.
     * The operation leaves both operands intact.
     * @param source An operand used as the first argument for the operation.
     * @param target An operand used as the second argument for the operation and to write the result to.
     * @throws {ExceptionError} If an exception was generated
     */
    private test(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly two operands are present.
        if (source.type === OperandTypeCodes.NO || target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Define variables to write the operands values to.
        let firstOperandsValue: DoubleWord;
        let secondOperandsValue: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === OperandTypeCodes.IMMEDIATE) {
             firstOperandsValue = source.value;
        } else if (source.type === OperandTypeCodes.MEMORY_ADDRESS) {
            firstOperandsValue = this.mmu.readDoublewordFrom(source.value, true);
        } else {
            firstOperandsValue = this.readRegister(source);
        }
        // Read the binary value from the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
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
     * @throws {ExceptionError} If an exception was generated
     */
    private jmp(target: InstructionOperand): void {
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly one operand is present.
        if (target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
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
     * @throws {ExceptionError} If an exception was generated
     * @returns True, if a jump was performed, false otherwise.
     */
    private jz(target: InstructionOperand): boolean {
        let jumpPerformed = false;
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly one operand is present.
        if (target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if the zero flag is set to (1)_2.
        if (this.flags.zero === 1) {
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
     * @throws {ExceptionError} If an exception was generated
     * @returns True, if a jump was performed, false otherwise.
     */
    private je(target: InstructionOperand): boolean {
        // This operation is an alias for the JZ operation.
        return this.jz(target);
    }

    /**
     * This method performs a conditional jump. This means that the jump is only executed if a certain 
     * condition is met. In this case, the jump is only executed if the zero flag is set to (0)_2. This is the
     * case if the last comparison of two binary values resulted in a binary value other than the binary zero. 
     * This result in turn means that the first compared value was greater or smaller than the second. 
     * This method takes a binary value from the location defined by the specified operand. 
     * The binary value is interpreted as a virtual address. This operation is an alias for the JNE operation.
     * @param target An operand used as an argument for the operation.
     * @throws {ExceptionError} If an exception was generated
     * @returns True, if a jump was performed, false otherwise.
     */
    private jnz(target: InstructionOperand): boolean {
        let jumpPerformed = false;
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly one operand is present.
        if (target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if the zero flag is cleared to (0)_2.
        if (this.flags.zero === 0) {
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
     * @throws {ExceptionError} If an exception was generated
     * @returns True, if a jump was performed, false otherwise.
     */
    private jne(target: InstructionOperand): boolean {
        // This operation is an alias for the JNZ operation.
        return this.jnz(target);
    }

    /**
     * This method performs a conditional jump. This means that the jump is only executed if a certain 
     * condition is met. In this case, the jump is only executed if the carry and zero flag
     * is 0.  This result in turn means that the first 
     * compared value was above the second. This method takes a binary value from the location defined 
     * by the specified operand. The binary value is interpreted as a virtual address.
     * @param target An operand used as an argument for the operation.
     * @throws {ExceptionError} If an exception was generated
     * @returns True, if a jump was performed, false otherwise.
     */
    private ja(target: InstructionOperand): boolean {
        let jumpPerformed = false;
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly one operand is present.
        if (target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        /*
         * Check if: 
         *      1. The carry flag is cleared to (0)_2
         *      2. The zero flag is cleared to (0)_2
         */
        if (this.flags.carry === 0 && this.flags.zero === 0) {
            // Load the given virtual address into the instruction pointer in order to perform the jump.
            this.eip.content = target.value;
            jumpPerformed = true;
        }
        return jumpPerformed;
    }

    /**
     * This method performs a conditional jump. This means that the jump is only executed if a certain 
     * condition is met. In this case, the jump is only executed if the carry flag
     * is 0.  This result in turn means that the first 
     * compared value was above or equal to the second. This method takes a binary value from the location defined 
     * by the specified operand. The binary value is interpreted as a virtual address.
     * @param target An operand used as an argument for the operation.
     * @throws {ExceptionError} If an exception was generated
     * @returns True, if a jump was performed, false otherwise.
     */
    private jae(target: InstructionOperand): boolean {
        let jumpPerformed = false;
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly one operand is present.
        if (target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        /*
         * Check if: 
         *      1. The carry flag is cleared to (0)_2
         */
        if (this.flags.carry === 0) {
            // Load the given virtual address into the instruction pointer in order to perform the jump.
            this.eip.content = target.value;
            jumpPerformed = true;
        }
        return jumpPerformed;
    }

    /**
     * This method performs a conditional jump. This means that the jump is only executed if a certain 
     * condition is met. In this case, the jump is only executed if the carry flag
     * is 1.  This result in turn means that the first 
     * compared value was below the second. This method takes a binary value from the location defined 
     * by the specified operand. The binary value is interpreted as a virtual address.
     * @param target An operand used as an argument for the operation.
     * @throws {ExceptionError} If an exception was generated
     * @returns True, if a jump was performed, false otherwise.
     */
    private jb(target: InstructionOperand): boolean {
        let jumpPerformed = false;
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly one operand is present.
        if (target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        /*
         * Check if: 
         *      1. The carry flag is set to (1)_2
         */
        if (this.flags.carry === 1) {
            // Load the given virtual address into the instruction pointer in order to perform the jump.
            this.eip.content = target.value;
            jumpPerformed = true;
        }
        return jumpPerformed;
    }

    /**
     * This method performs a conditional jump. This means that the jump is only executed if a certain 
     * condition is met. In this case, the jump is only executed if the carry flag
     * is 1.  This result in turn means that the first 
     * compared value was below or equal to the second. This method takes a binary value from the location defined 
     * by the specified operand. The binary value is interpreted as a virtual address.
     * @param target An operand used as an argument for the operation.
     * @throws {ExceptionError} If an exception was generated
     * @returns True, if a jump was performed, false otherwise.
     */
    private jbe(target: InstructionOperand): boolean {
        let jumpPerformed = false;
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly one operand is present.
        if (target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        /*
         * Check if: 
         *      1. The carry flag is set to (1)_2
         *      2. The zero flag is set to (1)_2
         */
        if (this.flags.carry === 1 && this.flags.zero === 1) {
            // Load the given virtual address into the instruction pointer in order to perform the jump.
            this.eip.content = target.value;
            jumpPerformed = true;
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
     * @throws {ExceptionError} If an exception was generated
     * @returns True, if a jump was performed, false otherwise.
     */
    private jg(target: InstructionOperand): boolean {
        let jumpPerformed = false;
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly one operand is present.
        if (target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        /*
         * Check if: 
         *      1. The zero flag is cleared to (0)_2
         *      2. The values of the overflow and sign flags are identical. 
         */
        if (this.flags.zero === 0 && this.flags.overflow === this.flags.sign) {
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
     * @throws {ExceptionError} If an exception was generated
     * @returns True, if a jump was performed, false otherwise.
     */
    private jge(target: InstructionOperand): boolean {
        let jumpPerformed = false;
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly one operand is present.
        if (target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if the values of the overflow and sign flags are identical.
        if (this.flags.sign === this.flags.overflow) {
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
     * @throws {ExceptionError} If an exception was generated
     * @returns True, if a jump was performed, false otherwise.
     */
    private jl(target: InstructionOperand): boolean {
        let jumpPerformed = false;
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly one operand is present.
        if (target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if the values of the overflow and sign flags are not identical.
        if (this.flags.sign !== this.flags.overflow) {
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
     * @throws {ExceptionError} If an exception was generated
     * @returns True, if a jump was performed, false otherwise.
     */
    private jle(target: InstructionOperand): boolean {
        let jumpPerformed = false;
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly one operand is present.
        if (target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        /*
         * Check if: 
         *      1. The zero flag is set to (1)_2
         *      2. The values of the overflow and sign flags are not identical. 
         */
        if (this.flags.zero === 1 && this.flags.sign !== this.flags.overflow) {
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
     * @throws {ExceptionError} If an exception was generated
     */
    private mov(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the source and target operands are both of type memory address.
        if (source.type === OperandTypeCodes.MEMORY_ADDRESS && target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly two operands are present.
        if (source.type === OperandTypeCodes.NO || target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Define variable to write the operands value to.
        let valueToMove: DoubleWord;
        // Read the binary value from the location defined by the first operand.
        if (source.type === OperandTypeCodes.IMMEDIATE) {
            valueToMove = source.value;
        } else if (source.type === OperandTypeCodes.MEMORY_ADDRESS) {
            valueToMove = this.mmu.readDoublewordFrom(source.value, false);
        } else {
            valueToMove = this.readRegister(source);
        }
        // Write the value to the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
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
     * @throws {ExceptionError} If an exception was generated
     */
    private lea(source: InstructionOperand, target: InstructionOperand): void {
        // Check if the source and target operands are both of type memory address.
        if (source.type === OperandTypeCodes.MEMORY_ADDRESS && target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if the source or target operand are of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE || source.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if the source operand is of type REGISTER and the addressing mode is DIRECT.
        if (source.type === OperandTypeCodes.REGISTER && source.addressingMode === AddressingModes.DIRECT) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly two operands are present.
        if (source.type === OperandTypeCodes.NO || target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Define variable to write the (virtual) memory address to.
        let address: DoubleWord = DoubleWord.ZERO;
        // Read the (virtual) memory address from the location defined by the first operand.
        if (source.type === OperandTypeCodes.MEMORY_ADDRESS) {
            address = source.value;
        } else {
            address = this.readRegister(source);
        }
        // Write the (virtual) memory address to the location defined by the second operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
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
        this.flags.clearCarry();
        return;
    }

    /**
     * This method complements the carry flag.
     * If the carry flag is set, it is cleared. If the carry flag is cleared, it is set.
     */
    private cmc(): void {
        if (this.flags.carry === 1) {
            this.flags.clearCarry();
        } else {
            this.flags.setCarry();
        }
        return;
    }

    /**
     * This method sets the carry flag.
     */
    private stc(): void {
        this.flags.setCarry();
        return;
    }

    /**
     * This method clears the interrupt flag.
     * The CPU will ignore all software interrupts to occur.
     * @throws {ExceptionError} If an exception was generated
     */
    private cli(): void {
        // Check whether CPU is in kernel mode.
        if (!this.flags.isInKernelMode()) {
            // CPU is not in kernel mode.
            throw new ExceptionError(InterruptNumbers.GENERAL_PROTECTION_FAULT);
            return;
        }
        this.flags.clearInterrupt();
        return;
    }

    /**
     * This method sets the interrupt flag.
     * This enables the CPU to handle software interrupts.
     */
    private sti(): void {
        // Check whether CPU is in kernel mode.
        if (!this.flags.isInKernelMode()) {
            // CPU is not in kernel mode.
            throw new ExceptionError(InterruptNumbers.GENERAL_PROTECTION_FAULT);
            return;
        }
        this.flags.setInterrupt();
        return;
    }

    /*
     * -------------------- Stack operations -------------------- 
     */

    /**
     * This method pushes the contents of the EFLAGS register onto the STACK.
     * @throws {ExceptionError} If an exception was generated
     */
    private pushf(): void {
        // Check whether CPU is in kernel mode.
        if (!this.flags.isInKernelMode()) {
            // CPU is not in kernel mode.
            throw new ExceptionError(InterruptNumbers.GENERAL_PROTECTION_FAULT);
            return;
        }
        // Check whether ESP reached lowest address (top) of STACK segment.
        // if (this.esp.content.equal(Doubleword.fromInteger(this._lowestAddressOfStackDec))) {
        //     // ESP reached highest possible address (top) of STACK segment.
        //     throw new StackUnderflowError("Could not perform PUSHF operation. STACK pointer reached top of the STACK.");
        // }
        // Allocate 4 bytes on STACK by decrementing the value in ESP.
        this.esp.content = DoubleWord.fromNumber(this.esp.content - 4);
        // Write contents of flags register on STACK.
        this.mmu.writeDoublewordTo(this.esp.content, DoubleWord.fromNumber(this.flags.content), false);

        return;
    }

    /**
     * This method reads the contents of the EFLAGS register from the STACK into the EFLAGS register.
     * The STACK pointer is incremented by 1 (byte/address) after the operation and the used memory gets deallocated.
     * @throws {ExceptionError} If an exception was generated
     */
    private popf(): void {
        // Check whether CPU is in kernel mode.
        if (!this.flags.isInKernelMode()) {
            // CPU is not in kernel mode.
            throw new ExceptionError(InterruptNumbers.GENERAL_PROTECTION_FAULT);
            return;
        }
        // Check whether ESP reached highest address (bottom) of STACK segment.
        // if (this.esp.content.equal(Doubleword.fromInteger(this._highestAddressOfStackDec))) {
        //     // ESP reached highest possible address (bottom) of STACK segment.
        //     throw new StackOverflowError("Could not perform POPF operation. STACK pointer reached bottom of the STACK.");
        // }

        // Read contents of flags register from STACK into flags register.
        const content = this.mmu.readDoublewordFrom(this.esp.content, false);
        // Deallocate four bytes from STACK by incrementing the value in ESP.
        this.mmu.clearMemory(this.esp.content, DataSizes.DOUBLEWORD);

        this.esp.content = DoubleWord.fromNumber(this.esp.content + 4);

        this.flags.content = DoubleWord.getFourthByte(content);
        return;
    }

    /**
     * This method copies a doubleword sized binary value from the STACK to the target defined by the given operand.
     * The STACK pointer is incremented by four (bytes/addresses), which deallocates memory for a doubleword.
     * @param target This operand defines where to put the red binary value from the STACK to.
     * @throws {ExceptionError} If an exception was generated
     */
    public pop(target: InstructionOperand) {
        // Check whether ESP reached highest address (bottom) of STACK segment.
        // if (this.esp.content.equal(Doubleword.fromInteger(this._highestAddressOfStackDec))) {
        //     // ESP reached highest address (bottom) of STACK segment.
        //     throw new StackUnderflowError("Could not perform POP operation. STACK pointer reached bottom of the STACK.");
        // }
        // Check if the target operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly one operand is present.
        if (target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Read the binary value from the STACK.
        const value: DoubleWord = this.mmu.readDoublewordFrom(this.esp.content, false);
        // Write the value to the location defined by the operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            const address: DoubleWord = target.value;
            this.mmu.writeDoublewordTo(address, value, false);
        } else {
            this.writeRegister(value, target);
        }
        // Deallocate one doubleword from STACK by incrementing the value in ESP.
        this.mmu.clearMemory(this.esp.content, DataSizes.DOUBLEWORD);
        // TODO: Call interrupt handler for deallocation of page frame in page table.
        this.esp.content = DoubleWord.fromNumber(this.esp.content + 4);
        return;
    }

    /**
     * This method copies a doubleword sized binary value defined by the given operand onto the STACK.
     * Therefore the stack pointer is decremented by 4 (bytes/addresses), which allocates memory for a doubleword on the STACK.
     * @param source This operand defines from where to copy the binary value.
     * @throws {ExceptionError} If an exception was generated
     */
    public push(source: InstructionOperand): void {
        // Check whether ESP reached lowest address (top) of STACK segment.
        // if (this.esp.content.equal(Doubleword.fromInteger(this._lowestAddressOfStackDec))) {
        //     // ESP reached lowest address (top) of STACK segment.
        //     throw new StackOverflowError("Could not perform PUSH operation. STACK pointer reached top of the STACK.");
        // }
        // Check if exactly one operand is present.
        if (source.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Allocate one doubleword (4 byte) on STACK by decrementing ESP.
        this.esp.content = DoubleWord.fromNumber(this.esp.content - 4);
        // Create a variable to store the value to write on STACK.
        let value: DoubleWord;
        // Depending on the operand type, the value is read from the main memory or a register.
        if (source.type === OperandTypeCodes.MEMORY_ADDRESS) {
            // Read the binary value from the (virtual) memory address defined by the given operand.
            value = this.mmu.readDoublewordFrom(source.value, false);            
        } else if (source.type === OperandTypeCodes.REGISTER) {
            // Read the binary value from the register defined by the given operand.
            value = this.readRegister(source);
        } else {
            // Read the binary value from the immediate operand.
            value = source.value;
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
     * @returns True if jump was performed, which is always the case.
     * @throws {ExceptionError} If an exception was generated
     */
    private call(target: InstructionOperand): boolean {
        // Check if the source operand is of type IMMEDIATE.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if exactly one operand is present.
        if (target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        /*
         * Before calling a subroutine, the caller needs to push the return address onto the STACK.
         * The return address is necessary to hand over control to the caller again after the subroutine 
         * has finished. The return address is an alias for the address of the instruction following the 
         * CALL instruction. Therefore, one doubleword ((4)_10 byte) needs to be allocated on the STACK 
         * by decrementing ESP first.
         */
        this.esp.content = DoubleWord.fromNumber(this.esp.content - 4);
        /*
         * The instruction following the CALL instruction is located at EIP (currently pointing at
         * the CALL instruction) plus (12)_10 ((3)_10 * (4)_10 byte per instruction).
         */
        const returnAddress: DoubleWord = DoubleWord.fromNumber(this.eip.content + 12);

        // Write the return address to the STACK.
        this.mmu.writeDoublewordTo(this.esp.content, returnAddress, false);
        // Transfer control to the subroutine by loading the subroutines base address into EIP register.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            this.eip.content = target.value;
        } else {
            this.eip.content = this.readRegister(target);
        }
        return true;
    }

    /**
     * This method returns from a subroutine. It reads the return address from the STACK and transfers
     * control to the caller, by loading the return address into the instruction pointer (EIP) register.
     * @throws {ExceptionError} If an exception was generated
     * @returns Always returns true to indicate a jump was performed.
     */
    private ret(): boolean {
        // Read the return address from the STACK.
        this.eip.content = this.mmu.readDoublewordFrom(this.esp.content, false);
        // Deallocate one doubleword from the STACK by incrementing ESP.
        this.mmu.clearMemory(this.esp.content, DataSizes.DOUBLEWORD);

        this.esp.content = DoubleWord.fromNumber(this.esp.content + 4);
        return true;
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
     * @returns Always returns true to indicate a jump was performed.
     * @throws {ExceptionError} If an exception was generated
     */
    public int(target: InstructionOperand): boolean {
        // Check if exactly one operand is present.
        if (target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }
        // Check if the target operand is of type MEMORY_ADDRESS.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE); 
        }
        // Check if the target operand is of type REGISTER.
        if (target.type === OperandTypeCodes.REGISTER) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }

        // Only allow INT for interrupt index 0 to 255
        if (0 > target.type || 255 < target.value) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }

        if (this.flags.isInUserMode())
        {
            this.logToLogger("");
            this.logToLogger("Interrupted: " + InterruptNumbers[target.value]);
        }

        const eflagsValue = DoubleWord.fromNumber(this.flags.content);
        // Switch to kernel mode.
        this.flags.enterKernelMode();
        this.flags.clearInterrupt();

        // Switch to the interrupt stack
        const stackPointer = DoubleWord.fromNumber(this.esp.content);
        this.esp.content = DoubleWord.ZERO;
        
        // Write the user stack address to the interrupt STACK.
        this.esp.content = DoubleWord.fromNumber(this.esp.content - 4);
        this.mmu.writeDoublewordTo(this.esp.content, stackPointer, false);

        // Push the current EFLAGS onto the STACK to save them for later.
        this.esp.content = DoubleWord.fromNumber(this.esp.content - 4);
        this.mmu.writeDoublewordTo(this.esp.content, eflagsValue, false);
  
        // Add the number of the interrupt handler to the interrupt tables base address, which is stored in the ITP register.
        const interruptHandlerTableEntry: DoubleWord = DoubleWord.fromNumber(this.itp.content + target.value*4);
        // Load interrupt handler address
        const interruptHandler = this.mmu.readDoublewordFrom(interruptHandlerTableEntry, true)
        /*
         * Before calling a subroutine, the caller needs to push the return address onto the STACK.
         * The return address is necessary to hand over control to the caller again after the subroutine 
         * has finished. The return address is an alias for the address of the instruction following the 
         * CALL instruction. Therefore, one doubleword ((4)_10 byte) needs to be allocated on the STACK 
         * by decrementing ESP first.
         */
        this.esp.content = DoubleWord.fromNumber(this.esp.content - 4);
        /*
         * The instruction following the CALL instruction is located at EIP (currently pointing at
         * the CALL instruction) plus (12)_10 ((3)_10 * (4)_10 byte per instruction).
         */
        const returnAddress: DoubleWord = DoubleWord.fromNumber(this.eip.content + 12);
        // Write the return address to the STACK.
        this.mmu.writeDoublewordTo(this.esp.content, returnAddress, false);
        // Jump into subroutine at the interrupt handlers address.
        this.eip.content = interruptHandler;
        return true;
    }

    /**
     * This method returns from an interrupt handler triggered by a software interrupt. It reads the return address from the STACK
     * and transfers control back to the interrupted process. Additionally, the EFLAGS gets restored from the STACK, the interrupt flag
     * is cleared and the CPU switches back to user mode.
     * @throws {ExceptionError} If the CPU is not in kernel mode when this mehtod is called.
     */
    public iret(): void {
        // Check whether CPU is in kernel mode.
        if (!this.flags.isInKernelMode()) {
            // CPU is not in kernel mode.
            throw new ExceptionError(InterruptNumbers.GENERAL_PROTECTION_FAULT);
        }
        // Return from the interrupt handler by calling the RET operation.
        this.ret();
        // Restore the old EFLAGS contents from the STACK.
        const eflagsValue = this.mmu.readDoublewordFrom(this.esp.content, false);
        this.mmu.clearMemory(this.esp.content, DataSizes.DOUBLEWORD);
        this.esp.content = DoubleWord.fromNumber(this.esp.content + 4);

        // Restore the old STACK value.
        this.esp.content = this.mmu.readDoublewordFrom(this.esp.content, false);

        this.flags.content = DoubleWord.getFourthByte(eflagsValue);

        if (this.flags.isInUserMode())
        {
            this.logToLogger("Interrupt Handler Finished");
        }
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
     * @throws {ExceptionError} If an exception was generated
     */
    private sysenter(target: InstructionOperand): void {
        // Check if exactly one operand is present.
        if (target.type === OperandTypeCodes.NO) {
            throw new ExceptionError(InterruptNumbers.GENERAL_PROTECTION_FAULT);
        }
        // Check if the target operand is of type MEMORY_ADDRESS.
        if (target.type === OperandTypeCodes.IMMEDIATE) {
            throw new ExceptionError(InterruptNumbers.GENERAL_PROTECTION_FAULT); 
        }
        // Create a variable to store the (virtual) address of the systems subroutine.
        let systemSubroutineAddress: DoubleWord;
        // Read the physical address of the systems subroutine from the operand.
        if (target.type === OperandTypeCodes.MEMORY_ADDRESS) {
            systemSubroutineAddress = target.value;
        } else {
            systemSubroutineAddress = this.readRegister(target);
        }
        // Switch to kernel mode.
        this.flags.enterKernelMode();
        // Push the current EFLAGS onto the STACK.
        this.pushf();
        // Disable software interrupts by clearing the interrupt flag.
        this.flags.clearInterrupt();
        // Call the systems subroutine.
        this.call(
            new InstructionOperand(
                AddressingModes.DIRECT, 
                OperandTypeCodes.MEMORY_ADDRESS, 
                systemSubroutineAddress)
        );
        return;
    }

    /**
     * This method returns from a systems subroutine. It reads the return address from the STACK
     * and transfers control back to the caller. Additionally, the EFLAGS gets restored from the STACK, the interrupt flag
     * is cleared and the CPU switches back to user mode.
     * @throws {ExceptionError} If an exception was generated
     */
    private sysexit(): void {
        if (!this.flags.isInKernelMode()) {
            throw new ExceptionError(InterruptNumbers.GENERAL_PROTECTION_FAULT);
        }
        // Return from the systems subroutine by calling the RET operation.
        this.ret();
        // Enable software interrupts by setting the interrupt flag.
        this.flags.setInterrupt();
        // Restore the old EFLAGS contents from the STACK.
        this.popf();
        // Switch back to user mode.
        this.flags.enterUserMode();
        return;
    }

    /*
     * -------------------- Special operations -------------------- 
     */

    /**
     * This method does nothing.
     */
    private nop(): void {
        return;
    }

    /**
     * This method invalidates the TLB
     * @throws {ExceptionError} If an exception was generated
     */
    private invtlb(): void {
               // Check whether CPU is in kernel mode.
        if (!this.flags.isInKernelMode()) {
            // CPU is not in kernel mode.
            throw new ExceptionError(InterruptNumbers.GENERAL_PROTECTION_FAULT);
        }

        this.mmu.invalidateTLB();

        return;
    }
    
    /**
     * This method writes a given doubleword sized binary value to the register defined by the given operand.
     * Depending on the access type, the value is written directly to the register or to an referenced 
     * (virtual) memory address.
     * @param operand The register operand to read a binary value from.
     * @throws {ExceptionError} If an exception was generated
     * @returns The red binary value.
     */
    private writeRegister(value: DoubleWord, operand: InstructionOperand): void {
        // Depending on the addressing mode, the value is written to the register directly or to the referenced (virtual) memory address.
        if (operand.addressingMode === AddressingModes.INDIRECT) {
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
     * @throws {ExceptionError} If an exception was generated
     */
    private writeRegisterDirect(value: DoubleWord, operand: InstructionOperand): void {
        // Decode the register defined by the operand.
        const register: Register<DoubleWord> = this.decodeWritableRegister(operand);
        // Check if the decoded register is writable in user mode.
        if (register === this.eir && !this.flags.isInKernelMode()) {
            // Writing to the EIP register is only allowed in kernel mode.
            throw new ExceptionError(InterruptNumbers.GENERAL_PROTECTION_FAULT);
        } else if (register === this.ptp && !this.flags.isInKernelMode()) {
            // Writing to the GPTP register is only allowed in kernel mode.
            throw new ExceptionError(InterruptNumbers.GENERAL_PROTECTION_FAULT);
        } else if (register === this.nptp && !this.flags.isInKernelMode()) {
            // Writing to the NPTP register is only allowed in kernel mode.
            throw new ExceptionError(InterruptNumbers.GENERAL_PROTECTION_FAULT);
        } else if (register === this.vmptr && !this.flags.isInKernelMode()) {
            // Writing to the VMPTR register is only allowed in kernel mode.
            throw new ExceptionError(InterruptNumbers.GENERAL_PROTECTION_FAULT);
        } else {
            // Write the doubleword to the register.
            register.content = value;
        }
    }

    /**
     * This method writes a given doubleword sized binary value to a (virtual) memory address.
     * The (virtual memory address) is referenced by the register defined by the given operand.
     * @param value The binary value to write to the memory address referenced by the given register.
     * @param operand The register which references a memory address to write to.
     * @throws {ExceptionError} If an exception was generated
     */
    private writeRegisterIndirect(value: DoubleWord, operand: InstructionOperand): void {
        // Decode the register defined by the operand.
        const register: Register<DoubleWord> = this.decodeWritableRegister(operand);
        // Write the doubleword to the referenced (virtual) memory address.
        this.mmu.writeDoublewordTo(register.content, value, false);
    }

    /**
     * This method reads a given doubleword sized binary value from a register defined by the given operand. 
     * Depending on the addressing mode, the value is read directly from the register or from the main memory. 
     * In the latter case, the value contained in the register is interpreted as the memory address.
     * @param operand The register operand to read a binary value from.
     * @throws {ExceptionError} If an exception was generated
     * @returns The binary value red from the register or the referenced (virtual) memory address.
     */
    private readRegister(operand: InstructionOperand): DoubleWord {
        let doubleword: DoubleWord;
        // Depending on the addressing mode, the value is read from the register directly or from the referenced (virtual) memory address.
        if (operand.addressingMode === AddressingModes.INDIRECT) {
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
     * @throws {ExceptionError} If an exception was generated
     * @returns The binary value red from the referenced (virtual) memory address.
     */
    private readRegisterIndirect(operand: InstructionOperand): DoubleWord {
        // Decode the register defined by the operand and read its value.
        const address: DoubleWord = this.decodeReadableRegister(operand).content;
        // Read the doubleword from the referenced (virtual) memory address.
        return this.mmu.readDoublewordFrom(address, false);
    }

    /**
     * This method reads a given doubleword sized binary value from the register defined by the given operand.
     * @param operand The operand to extract the register from.
     * @throws {ExceptionError} If an exception was generated
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
     * @throws {ExceptionError} If an exception was generated
     * @returns The decoded register.
     */
    private decodeReadableRegister(operand: InstructionOperand): Register<DoubleWord> {
        let register: Register<DoubleWord> = this.eax;
        switch (operand.value) {
            case RegisterNumbers.EAX:
                register = this.eax;
                break;
            case RegisterNumbers.EBX:
                register = this.ebx;
                break;
            case RegisterNumbers.ECX:
                register = this.ecx;
                break;
            case RegisterNumbers.EDX:
                register = this.edx;
                break;
            case RegisterNumbers.EIP:
                register = this.eip;
                break;
            case RegisterNumbers.EIR:
                register = this.eir;
                break;
            case RegisterNumbers.ESP:
                register = this.esp;
                break;
            case RegisterNumbers.PTP:
                register = this.ptp;
                break;
            case RegisterNumbers.ITP:
                register = this.itp;
                break;
            case RegisterNumbers.NPTP:
                register = this.nptp;
                break;
            case RegisterNumbers.VMPTR:
                register = this.vmptr;
                break;
            default:
                throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
                break;
        }
        return register;
    }

    /**
     * This method decodes a given operands value and returns the encoded register. 
     * Both read- and writable registers can be decoded.
     * @param operand The operand to extract the register from.
     * @throws {ExceptionError} If an exception was generated
     * @returns The decoded register.
     */
    private decodeWritableRegister(operand: InstructionOperand): Register<DoubleWord> {
        let register: Register<DoubleWord> = this.eax;
        switch (operand.value) {
            case RegisterNumbers.EAX:
                register = this.eax;
                break;
            case RegisterNumbers.EBX:
                register = this.ebx;
                break;
            case RegisterNumbers.ECX:
                register = this.ecx;
                break;
            case RegisterNumbers.EDX:
                register = this.edx;
                break;
            case RegisterNumbers.EIP:
                register = this.eip;
                break;
            case RegisterNumbers.ESP:
                register = this.esp;
                break;
            case RegisterNumbers.PTP:
                register = this.ptp;
                break;
            case RegisterNumbers.ITP:
                register = this.itp;
                break;
            case RegisterNumbers.NPTP:
                register = this.nptp;
                break;
            case RegisterNumbers.VMPTR:
                register = this.vmptr;
                break;
            default:
                throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
                break;
        }
        return register;
    }

    /**
     * Read a buffer bytewise from memory until the first zero byte and return it as ASCII string
     * @param address The start of the buffer.
     * @throws {ExceptionError} If an exception was generated
     * @returns ASCII string of the content
     * @author Laurin Gehlenborg
     */
    private loadZeroTerminatedASCIIStringFromMemory(address: DoubleWord): string {
        let str: string = "";
        let currentDoubleWord: DoubleWord;
        let addressValue = address;
        while(true) {
            currentDoubleWord = this.mmu.readDoublewordFrom(addressValue, false);
            addressValue = DoubleWord.fromNumber(addressValue + 4);

            for (let index = 0; index < 4; index++) {
                const byte = DoubleWord.getBitsStartingAt(currentDoubleWord, index * Byte.NUMBER_OF_BITS as DoubleWord.BitIndex, Byte.NUMBER_OF_BITS as DoubleWord.BitCount)
                if (byte == 0)
                {
                    return str
                }
                str += String.fromCharCode(byte);
            }
        }
    }

    /**
     * Pop a value from stack and return it for CPU-internal usage.
     * @throws {ExceptionError} If an exception was generated
     * @returns 32 bit value from stack.
     * @author Laurin Gehlenborg
     */
    private internal_pop(): DoubleWord {
        const oldEAX = this.eax.content;
        this.pop(new InstructionOperand(AddressingModes.DIRECT, OperandTypeCodes.REGISTER, DoubleWord.ZERO)) // 0 for EAX
        const poppedValue = this.eax.content;
        this.eax.content = oldEAX;
        return poppedValue;
    }

    /**
     * Trigger an External Interrupt
     */
    public triggertExternalInterrupt(number: InterruptNumbers): void {
        //Add interrupt to list to be executed after current instruction finishes
        this.interruptQueue.push(number);
    }

    /**
     * Reset the cpu
     */
    public reset(): void {
        // TODO implement
        this.logToLogger("");
        this.logToLogger("KERNEL PANIC! RESETING SIMULATOR");
    }

    /**
     * This method decodes the type of an instruction.
     * @param encodedOperandType 
     * @throws {ExceptionError} If an exception was generated
     * @returns 
     */
    public decodeOperandType(encodedOperandType: number): OperandTypeCodes {
        if (OperandTypeCodes[encodedOperandType] === undefined) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }

        return encodedOperandType as OperandTypeCodes;
    }

    /**
     * This method decodes the addressing mode of an instruction.
     * @param encodedAddressingMode 
     * @throws {ExceptionError} If an exception was generated
     * @returns 
     */
    public decodeAddressingMode(encodedAddressingMode: number): AddressingModes {
        if (AddressingModes[encodedAddressingMode] === undefined) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }

        return encodedAddressingMode as AddressingModes;
    }

    /**
     * This methods decodes an instructions type.
     * @param encodedInstructionType The binary encoded instructions type.
     * @throws {ExceptionError} If an exception was generated
     * @returns A decoded representation of the type.
     */
    public decodeInstructionType(encodedInstructionType: number): InstructionTypes {
        if (InstructionTypes[encodedInstructionType] === undefined) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }

        return encodedInstructionType as InstructionTypes;
    }

    /**
     * This methods decodes an I-type instruction.
     * @param encodedOperation The binary encoded I-type operation.
     * @throws {ExceptionError} If an exception was generated
     * @returns A decoded representation of the operation.
     */
    public decodeIInstruction(encodedOperation: number): Instructions {
        if (Instructions[encodedOperation] === undefined) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }

        return encodedOperation as Instructions;
    }

    /**
     * This methods decodes a J-type instruction.
     * @param encodedOperation The binary encoded J-type instruction.
     * @throws {ExceptionError} If an exception was generated
     * @returns A decoded representation of the operation.
     */
    public decodeJIntruction(encodedOperation: number): Instructions {
        if (Instructions[encodedOperation] === undefined) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }

        return encodedOperation as Instructions;
    }

    /**
     * This methods decodes a R-type instruction.
     * @param encodedOperation The binary encoded R-type instruction.
     * @throws {ExceptionError} If an exception was generated
     * @returns A decoded representation of the operation.
     */
    public decodeRIntruction(encodedOperation: number): Instructions {
        if (Instructions[encodedOperation] === undefined) {
            throw new ExceptionError(InterruptNumbers.INVALID_OPCODE);
        }

        return encodedOperation as Instructions;
    }

    /**
     * Send a message to be appended to the log-widget in the main window.
     * @param message The message that gets appended to the log-widget.
     */
    public logToLogger(message: string): void {
        applicationWindow?.mainWindow?.webContents.send('update_log', message);
        DebugLogger.log("  " + message);
    }
}