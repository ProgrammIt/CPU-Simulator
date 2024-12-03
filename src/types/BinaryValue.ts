import { Bit } from "./Bit";

/**
 * This class represents a generic binary value.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class BinaryValue {
    /**
     * An array of bits, representing a binary value.
     */
    protected _value: Array<Bit>;

    /**
     * Constructs a new binary value from the given array of bits.
     * @param value An array of bits representing a binary value.
     */
    public constructor(value: Array<Bit>) {
        this._value = value.slice();
    }

    /**
	 * Accessor for reading the binary value.
	 */
	public get value(): Array<Bit> {
		return this._value;
	}

	/**
	 * Accessor for setting the binary value.
	 * @param newValue The new value.
	 */
	public set value(newValue: Array<Bit>) {
        if (newValue.length !== this._value.length) {
            throw new Error(`The number of bits of the new value does not match that of the old value: ${newValue.length} vs. ${this._value.length}`);
        }
		this._value = newValue;
	}
}