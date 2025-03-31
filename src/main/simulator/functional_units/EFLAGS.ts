import { Bit } from "../../../types/binary/Bit";
import { Byte } from "../../../types/binary/Byte";
import { DataSizes } from "../../../types/enumerations/DataSizes";
import { Register } from "./Register";

/**
 * This class represents the status register of a CPU core.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class EFLAGS extends Register<Byte> {
    // Positions of the flag bits in the status register from MSB (starting at index 0) to LSB.
    private static POS_CPL_MSB_BIT = 0;
    private static POS_CPL_LSB_BIT = 1;
    private static POS_INTERRUPT_BIT = 2;
    private static POS_OVERFLOW_BIT = 3;
    private static POS_SIGNED_BIT = 4;
    private static POS_ZERO_BIT = 5;
    private static POS_CARRY_BIT = 6;
    private static POS_PARITY_BIT = 7;

    public constructor() {
        super("EFLAGS", new Byte([1, 1, 0, 0, 0, 0, 0, 0]));
    }

    /**
     * Accessor for retrieving a copy of the current registers content.
     * @override
     * @returns A copy of the current registers content.
     */
    public get content(): Byte {
        return new Byte(this._content.value);
    }

    /**
     * Accessor for setting the current registers content to a new value.
     * @override
     * @param newValue The new value.
     */
    public set content(newValue: Byte) {
        if (newValue.value.length !== DataSizes.BYTE) {
			throw new Error(`A new value must have exactly ${DataSizes.BYTE} bits: ${newValue.value.length} given.`);
		}
        this._content = new Byte(newValue.value);
    }

    /**
     * This method sets or clears the flag bit at the specified index.
     * Clearing means setting the bit to a binary 0. Setting means setting the bit to a binary 1.
     * @param index The position of the flag bit in the register from MSB (index 0) to LSB.
     * @param bit The binary value to set the flag bit to.
     * @returns 
     */
    private setBitTo(index: number, bit: Bit) {
        // Create a deep copy of readonly array.
        const tmp: Array<Bit> = new Array<Bit>(...this.content.value);
        // Modify deep copy.
        tmp[index] = bit;
        // Set content of register.
        this._content.value = tmp;
        return;
    }

    /**
     * This method sets the parity flag bit to a binary 1.
     * @returns 
     */
    public setParity() {
       this.setBitTo(EFLAGS.POS_PARITY_BIT, 1);
       return;
    }

    /**
     * This method clears the parity flag bit to a binary 0.
     * @returns 
     */
    public clearParity() {
        this.setBitTo(EFLAGS.POS_PARITY_BIT, 0);
        return;
    }

    /**
     * This method sets the carry flag bit to a binary 1.
     * @returns 
     */
    public setCarry() {
        this.setBitTo(EFLAGS.POS_CARRY_BIT, 1);
        return;
    }

    /**
     * This method clears the carry flag bit to a binary 0.
     * @returns 
     */
    public clearCarry() {
        this.setBitTo(EFLAGS.POS_CARRY_BIT, 0);
        return;
    }

    /**
     * This method sets the zero flag bit to a binary 1.
     * @returns 
     */
    public setZero() {
        this.setBitTo(EFLAGS.POS_ZERO_BIT, 1);
        return;
    }

    /**
     * This method clears the zero flag bit to a binary 0.
     * @returns 
     */
    public clearZero() {
        this.setBitTo(EFLAGS.POS_ZERO_BIT, 0);
        return;
    }

    /**
     * This method sets the signed flag bit to a binary 1.
     * @returns 
     */
    public setSigned() {
        this.setBitTo(EFLAGS.POS_SIGNED_BIT, 1);
        return;
    }

    /**
     * This method clears the signed flag bit to a binary 0.
     * @returns 
     */
    public clearSigned() {
        this.setBitTo(EFLAGS.POS_SIGNED_BIT, 0);
        return;
    }

    /**
     * This method sets the overflow flag bit to a binary 1.
     * @returns 
     */
    public setOverflow() {
        this.setBitTo(EFLAGS.POS_OVERFLOW_BIT, 1);
        return;
    }

    /**
     * This method clears the overflow flag bit to a binary 0.
     * @returns 
     */
    public clearOverflow() {
        this.setBitTo(EFLAGS.POS_OVERFLOW_BIT, 0);
        return;
    }

    /**
     * This method sets the interrupt flag bit to a binary 1.
     * @returns 
     */
    public setInterrupt() {
        this.setBitTo(EFLAGS.POS_INTERRUPT_BIT, 1);
        return;
    }

    /**
     * This method clears the interrupt flag bit to a binary 0.
     * @returns 
     */
    public clearInterrupt() {
        this.setBitTo(EFLAGS.POS_INTERRUPT_BIT, 0);
        return;
    }

    /**
     * This method sets the CPL flag bits to a binary 3.
     * @returns 
     */
    public enterUserMode() {
        this.setBitTo(EFLAGS.POS_CPL_LSB_BIT, 1);
        this.setBitTo(EFLAGS.POS_CPL_MSB_BIT, 1);
        return;
    }

    /**
     * This method clears the CPL flag bits to a binary 0.
     * @returns 
     */
    public enterKernelMode() {
        this.setBitTo(EFLAGS.POS_CPL_LSB_BIT, 0);
        this.setBitTo(EFLAGS.POS_CPL_MSB_BIT, 0);
        return;
    }

    /**
     * This method reads the current status of the parity flag bit.
     */
    public get parity(): Bit {
        return this._content.value.at(EFLAGS.POS_PARITY_BIT)!;
    }

    /**
     * This method reads the current status of the carry flag bit.
     */
    public get carry(): Bit {
        return this._content.value.at(EFLAGS.POS_CARRY_BIT)!;
    }

    /**
     * This method reads the current status of the zero flag bit.
     */
    public get zero(): Bit {
        return this._content.value.at(EFLAGS.POS_ZERO_BIT)!;
    }

    /**
     * This method reads the current status of the signed flag bit.
     */
    public get sign(): Bit {
        return this._content.value.at(EFLAGS.POS_SIGNED_BIT)!;
    }

    /**
     * This method reads the current status of the overflow flag bit.
     */
    public get overflow(): Bit {
        return this._content.value.at(EFLAGS.POS_OVERFLOW_BIT)!;
    }

    /**
     * This method reads the current status of the interrupt flag bit.
     */
    public get interrupt(): Bit {
        return this._content.value.at(EFLAGS.POS_INTERRUPT_BIT)!;
    }

    /**
     * This method checks whether the CPU is currently in user mode.
     * @returns True if the CPU is currently in user mode, otherwise false.
     */
    public isInUserMode(): boolean {
        return (
            this._content.value.at(EFLAGS.POS_CPL_MSB_BIT)! === 1 && 
            this._content.value.at(EFLAGS.POS_CPL_LSB_BIT)! === 1
        );
    }

    /**
     * This method checks whether the CPU is currently in kernel mode.
     * @returns True if the CPU is currently in kernel mode, otherwise false.
     */
    public isInKernelMode(): boolean {
        return (
            this._content.value.at(EFLAGS.POS_CPL_MSB_BIT)! === 0 && 
            this._content.value.at(EFLAGS.POS_CPL_LSB_BIT)! === 0
        );
    }
}