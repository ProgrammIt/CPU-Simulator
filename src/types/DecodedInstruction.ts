import { EncodedInstructionTypes, EncodedOperations } from "../types";
import { InstructionOperand } from "./InstructionOperand";

/**
 * This class represents a decoded (non-binary) instruction, ready for execution.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class DecodedInstruction {
	/**
	 * The instructions type.
	 */
	public type: EncodedInstructionTypes;
	
	/**
	 * The instructions operation.
	 */
	public operation: EncodedOperations;

	/**
	 * A list of the operations operands or undefined, if no operand is present.
	 */
	public operands: [InstructionOperand, InstructionOperand | undefined] | undefined;

	/**
	 * Constructs a new instance from the given arguments.
	 * @param type The instructions type.
	 * @param operation The instructions operation.
	 */
    public constructor(type: EncodedInstructionTypes, operation: EncodedOperations) {
        this.type = type;
        this.operation = operation;
        this.operands = undefined;
    }
}