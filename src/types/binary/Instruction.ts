import { OpCode } from "../enumerations/OpCode";
import { InstructionOperand } from "./InstructionOperand";

/**
 * This class represents a decoded (non-binary) instruction, ready for execution.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class Instruction {

	/**
	 * The instructions operation.
	 */
	public instruction: OpCode;

	/**
	 * A list of the operations operands or undefined, if no operand is present.
	 */
	public operand1: InstructionOperand | null;

	public operand2: InstructionOperand | null;

	/**
	 * Constructs a new instance from the given arguments.
	 * @param instruction The instruction.
	 * @param operand1 The first instructions operands.
	 * @param operand2 The second instructions operands.
	 */
    public constructor(instruction: OpCode, operand1: InstructionOperand | null, operand2: InstructionOperand | null) {
        this.instruction = instruction;
        this.operand1 = operand1;
		this.operand2 = operand2;
	}

	public get operandCount(): number {
		return this.operand1 === null ? 0 : this.operand2 === null ? 1 : 2;
	}
}