import { DataSizes } from "../../../types/enumerations/DataSizes";
import { DoubleWord } from "../../../types/binary/DoubleWord";
import { Register } from "./Register";

/**
 * This class represents a general purpose register.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class GeneralPurposeRegister extends Register<DoubleWord> {
    /**
     * This method constructs an instance.
     * @param name The name of the register.
     * @constructor
     */
    public constructor(name: string) {
        super(name.toUpperCase(), new DoubleWord());
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