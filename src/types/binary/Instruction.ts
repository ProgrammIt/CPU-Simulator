import { InstructionSet } from "../enumerations/InstructionSet";
import { InstructionTypes } from "../enumerations/InstructionTypes";
import { InstructionOperand } from "./InstructionOperand";

/**
 * This class represents a decoded (non-binary) instruction, ready for execution.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class Instruction {
	/**
	 * The instructions type.
	 */
	private readonly _type: InstructionTypes;
	
	/**
	 * The instructions operation.
	 */
	private readonly _instruction: InstructionSet;

	/**
	 * A list of the operations operands or undefined, if no operand is present.
	 */
	private readonly _operands: [InstructionOperand | undefined, InstructionOperand | undefined];

	/**
	 * Constructs a new instance from the given arguments.
	 * @param type The instructions type.
	 * @param instruction The instruction.
	 * @param operands The instructions operands.
	 */
    public constructor(type: InstructionTypes, instruction: InstructionSet, operands: [InstructionOperand | undefined, InstructionOperand | undefined] = [undefined, undefined]) {
        this._type = type;
        this._instruction = instruction;
        this._operands = operands;
    }

	public get type(): InstructionTypes {
		return this._type;
	}

	public get instruction(): InstructionSet {
		return this._instruction;
	}

	public get operands(): [InstructionOperand | undefined, InstructionOperand | undefined] {
		return this._operands;
	}
}