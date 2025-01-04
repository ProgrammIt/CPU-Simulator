import { Bit } from "./Bit";
import { DataSizes } from "./DataSizes";

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

    /**
     * This method returns the least significant bit of this value.
     * @returns The least significant bit.
     */
    public getLeastSignificantBit(): Bit {
        return this._value[this._value.length - 1];
    }

    /**
     * This method returns the most significant bit of this value.
     * @returns The most significant bit.
     */
    public getMostSignificantBit(): Bit {
        return this._value[0];
    }

    /**
     * This method returns the least significant byte of this value.
     * @returns The least significant byte.
     */
    public getLeastSignificantByte(): Array<Bit> {
        if (this._value.length < 8) {
            throw new Error("The value does not contain enough bits to retrieve a byte.");
        }
        return this._value.slice(-DataSizes.BYTE);
    }

    /**
     * This method returns the least significant byte of this value.
     * @returns The least significant byte.
     */
    public getMostSignificantByte(): Array<Bit> {
        if (this._value.length < 8) {
            throw new Error("The value does not contain enough bits to retrieve a byte.");
        }
        return this._value.slice(0, DataSizes.BYTE);
    }

    /**
     * This method returns the last bits of the binary value.
     * The number of bits returned depends on the argument passed.
     * @param nbrOfBits 
     * @returns 
     */
    public getLeastSignificantBits(nbrOfBits: number): BinaryValue {
        if (nbrOfBits > this._value.length) {
            throw new Error(`The value does not contain enough bits to retrieve a subset of ${nbrOfBits} bits.`);
        }
        return new BinaryValue(this._value.slice(-nbrOfBits));
    }

    /**
     * This method returns the first bits of the binary value.
     * The number of bits returned depends on the argument passed.
     * @param nbrOfBits 
     * @returns 
     */
    public getMostSignificantBits(nbrOfBits: number): BinaryValue {
        if (nbrOfBits > this._value.length) {
            throw new Error(`The value does not contain enough bits to retrieve a subset of ${nbrOfBits} bits.`);
        }
        return new BinaryValue(this._value.slice(0, nbrOfBits));
    }
}