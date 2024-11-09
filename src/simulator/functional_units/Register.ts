import { convertToBinaryValue } from "../../helper";

export class Register {
    private _capacity: number;
    private _value: string;
    private _name: string;

    /**
     * This method constructs an instance of the Register class.
     * @param capacity The capacaty of the register.
     */
    public constructor(name: string, capacity: number) {
        this._name = name.toUpperCase();
        this._capacity = capacity;
        this._value = " ";
    }

    /**
     * Getter for the registers name.
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Getter for the registers capacity.
     */
    public get capacity(): number {
        return this._capacity;
    }

    /**
     * Getter for the current hold value of the register.
     */
    public get value(): string {
        return this._value;
    }

    /**
     * Setter for manipulating the hold value of the register.
     * @param n The new value to save in the register.
     */
    public set value(n: string) {
        // Make sure that new value is not empty.
        if (n.length === 0) {
            throw Error("No value given to save in the register");
        }
        // Make sure, that only a binary value is saved to the register.
        this._value = convertToBinaryValue(n);
        return;
    }
}