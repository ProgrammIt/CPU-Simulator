import { InstructionTypes, Operations, AccessableRegisters } from "../types";
import { InstructionOperand } from "./InstructionOperand";

/**
 * This class represents a decoded (non-binary) instruction, ready for execution.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class DecodedInstruction {
	/**
	 * The instructions type.
	 */
	public type: InstructionTypes;
	
	/**
	 * The instructions operation.
	 */
	public operation: Operations;

	/**
	 * A list of the operations operands or undefined, if no operand is present.
	 */
	public operands: [InstructionOperand, InstructionOperand | undefined] | undefined;

	/**
	 * Constructs a new instance from the given arguments.
	 * @param type The instructions type.
	 * @param operation The instructions operation.
	 */
    public constructor(type: InstructionTypes, operation: Operations) {
        this.type = type;
        this.operation = operation;
        this.operands = undefined;
    }
}