import { DataSizes } from "../../../types/enumerations/DataSizes";
import { DoubleWord } from "../../../types/binary/DoubleWord";
import { Instruction } from "../../../types/binary/Instruction";
import { Register } from "./Register";

/**
 * This class represents the instruction register (EIR).
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class InstructionRegister extends Register<Instruction> {
    /**
     * Constructs a new instance.
     * @constructor
     */
    public constructor() {
        super("EIR", new DoubleWord());
    }

    /**
     * Accessor for retrieving a copy of the current registers content.
     * @override
     * @returns A copy of the current registers content.
     */
    public get content(): DoubleWord {
        return new DoubleWord(this._content.value);
    }

    /**
     * Accessor for setting the current registers content to a new value.
     * @param newValue The new value.
     */
    public set content(newValue: DoubleWord) {
        if (newValue.value.length !== DataSizes.DOUBLEWORD) {
			throw new Error(`A new value must have exactly ${DataSizes.DOUBLEWORD} bits: ${newValue.value.length} given.`);
		}
        this._content = new DoubleWord(newValue.value);
    }
}