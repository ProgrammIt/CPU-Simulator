import { DataSize } from "../../types";
import { Address } from "../../types/Address";
import { Register } from "./Register";

/**
 * This class represents a special tpye of register,
 * which can hold a single address.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class PointerRegister extends Register<Address> {
    /**
     * Constructs a new instance.
     * @constructor
     */
    public constructor(name: string) {
        super(name, new Address());
    }

    /**
     * Accessor for retrieving a copy of the current registers content.
     * @override
     * @returns A copy of the current registers content.
     */
    public get content(): Address {
        return new Address(this._content.value);
    }

    /**
     * Accessor for setting the current registers content to a new value.
     * @override
     * @param newValue The new value.
     */
    public set content(newValue: Address) {
        if (newValue.value.length !== DataSize.DOUBLEWORD) {
			throw new Error(`A new value must have exactly ${DataSize.DOUBLEWORD} bits: ${newValue.value.length} given.`);
		}
        this._content = new Address(newValue.value);
    }
}