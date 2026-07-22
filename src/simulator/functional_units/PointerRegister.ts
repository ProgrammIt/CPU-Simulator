import { DoubleWord } from "../../types/binary/DoubleWord";
import { Register } from "./Register";

/**
 * This class represents a special tpye of register,
 * which can hold a single address.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class PointerRegister extends Register<DoubleWord> {
    /**
     * Constructs a new instance.
     */
    public constructor(name: string) {
        super(name, DoubleWord.ZERO);
    }
}