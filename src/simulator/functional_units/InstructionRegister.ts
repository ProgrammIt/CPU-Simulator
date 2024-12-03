import { DataSize } from "../../types";
import { Doubleword } from "../../types/Doubleword";
import { Instruction } from "../../types/Instruction";
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
        super("EIR", new Doubleword());
    }

    /**
     * Accessor for retrieving a copy of the current registers content.
     * @override
     * @returns A copy of the current registers content.
     */
    public get content(): Doubleword {
        return new Doubleword(this._content.value);
    }

    /**
     * Accessor for setting the current registers content to a new value.
     * @param newValue The new value.
     */
    public set content(newValue: Doubleword) {
        if (newValue.value.length !== DataSize.DOUBLEWORD) {
			throw new Error(`A new value must have exactly ${DataSize.DOUBLEWORD} bits: ${newValue.value.length} given.`);
		}
        this._content = new Doubleword(newValue.value);
    }
}