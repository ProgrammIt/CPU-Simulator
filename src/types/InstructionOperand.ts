import { AddressingModes as AddressingMode, OperandTypes as OperandType } from "../types";
import { Doubleword } from "./Doubleword";

// Operand types: Immediate, Register, Memory address
// Access types: Direct, Indirect

/**
 * A class representing a decoded (non-binary) operand of an instruction.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class InstructionOperand {
	/**
	 * The operands addressing mode. Can be either direct or indirect. Indirect mode is only valid for registers.
	 * @readonly
	 */
	public readonly addressingMode: AddressingMode;

	/**
	 * The operands type. Can be either a constant/immediate, a memory address or a register.
	 * @readonly
	 */
	public readonly type: OperandType;

	/**
	 * The operands value in decimal, hexadecimal and binary representation.
	 * @readonly
	 */
	public readonly value: Doubleword;

	/**
	 * Creates a new instance from the given arguments.
	 * @param addressingMode The operands addressing mode.
	 * @param type The operands type.
	 * @param value The operands value in binary representation.
	 * @constructor
	 */
    public constructor(addressingMode: AddressingMode, type: OperandType, value: Doubleword) {
        this.addressingMode = addressingMode;
        this.type = type;
        this.value = value;
    }
}