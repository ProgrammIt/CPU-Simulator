import { DoubleWord } from "../../types/binary/DoubleWord";
import { Register } from "./Register";

/**
 * This class represents the instruction register (EIR).
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class InstructionRegister extends Register<DoubleWord> {
    /**
     * Constructs a new instance.
     */
    public constructor() {
        super("EIR", DoubleWord.ZERO);
    }
}