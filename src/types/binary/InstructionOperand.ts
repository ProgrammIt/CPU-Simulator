import { DoubleWord } from "./DoubleWord";
import { DecodedOperandTypes } from "../enumerations/DecodedOperandTypes";
import { EncodedOperandTypes } from "../enumerations/EncodedOperandTypes";

// Operand types: Immediate, Register, Memory address
// Access types: Direct, Indirect

/**
 * A class representing a decoded (non-binary) operand of an instruction.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class InstructionOperand {
	/**
	 * The operands type. Can be either a constant/immediate, a memory address or a register.
	 * @readonly
	 */
	public type: DecodedOperandTypes;

	/**
	 * The operands value in binary representation.
	 * @readonly
	 */
	public value: DoubleWord;

	/**
	 * Creates a new instance from the given arguments.
	 * @param type The operands type.
	 * @param value The operands value in binary representation.
	 */
    public constructor(type: DecodedOperandTypes = EncodedOperandTypes.NO, value: DoubleWord = DoubleWord.ZERO) {
        this.type = type;
        this.value = value;
    }
}