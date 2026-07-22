import { DoubleWord } from "../../types/binary/DoubleWord";
import { Register } from "./Register";

/**
 * This class represents a general purpose register.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class GeneralPurposeRegister extends Register<DoubleWord> {
    /**
     * This method constructs an instance.
     * @param name The name of the register.
     */
    public constructor(name: string) {
        super(name.toUpperCase(), DoubleWord.ZERO);
    }
}