import { Bit } from "../../types/binary/Bit";
import { Byte } from "../../types/binary/Byte";
import { Register } from "./Register";

/**
 * This class represents the status register of a CPU core.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class FLAGS extends Register<Byte> {
    // Positions of the flag bits in the status register from MSB (starting at index 0) to LSB.
    private static POS_CPL_MSB_BIT: Byte.BitIndex = 0;
    private static POS_CPL_LSB_BIT: Byte.BitIndex = 1;
    private static POS_INTERRUPT_BIT: Byte.BitIndex = 2;
    private static POS_OVERFLOW_BIT: Byte.BitIndex = 3;
    private static POS_SIGNED_BIT: Byte.BitIndex = 4;
    private static POS_ZERO_BIT: Byte.BitIndex = 5;
    private static POS_CARRY_BIT: Byte.BitIndex = 6;
    private static POS_PARITY_BIT: Byte.BitIndex = 7;

    /**
     * This method constructs an instance.
     */
    public constructor() {
        super("FLAGS", Byte.fromNumber(0b11000000));
    }

    /**
     * This method sets the parity flag bit to a binary 1.
     * @returns 
     */
    public setParity() {
       this._content = Byte.setBit(this._content, FLAGS.POS_PARITY_BIT, 1);
    }

    /**
     * This method clears the parity flag bit to a binary 0.
     * @returns 
     */
    public clearParity() {
        this._content = Byte.setBit(this._content, FLAGS.POS_PARITY_BIT, 0);
    }

    /**
     * This method sets the carry flag bit to a binary 1.
     * @returns 
     */
    public setCarry() {
        this._content = Byte.setBit(this._content, FLAGS.POS_CARRY_BIT, 1);
    }

    /**
     * This method clears the carry flag bit to a binary 0.
     * @returns 
     */
    public clearCarry() {
        this._content = Byte.setBit(this._content, FLAGS.POS_CARRY_BIT, 0);
    }

    /**
     * This method sets the zero flag bit to a binary 1.
     * @returns 
     */
    public setZero() {
        this._content = Byte.setBit(this._content, FLAGS.POS_ZERO_BIT, 1);
    }

    /**
     * This method clears the zero flag bit to a binary 0.
     * @returns 
     */
    public clearZero() {
        this._content = Byte.setBit(this._content, FLAGS.POS_ZERO_BIT, 0);
    }

    /**
     * This method sets the signed flag bit to a binary 1.
     * @returns 
     */
    public setSigned() {
        this._content = Byte.setBit(this._content, FLAGS.POS_SIGNED_BIT, 1);
    }

    /**
     * This method clears the signed flag bit to a binary 0.
     * @returns 
     */
    public clearSigned() {
        this._content = Byte.setBit(this._content, FLAGS.POS_SIGNED_BIT, 0);
    }

    /**
     * This method sets the overflow flag bit to a binary 1.
     * @returns 
     */
    public setOverflow() {
        this._content = Byte.setBit(this._content, FLAGS.POS_OVERFLOW_BIT, 1);
    }

    /**
     * This method clears the overflow flag bit to a binary 0.
     * @returns 
     */
    public clearOverflow() {
        this._content = Byte.setBit(this._content, FLAGS.POS_OVERFLOW_BIT, 0);
    }

    /**
     * This method sets the interrupt flag bit to a binary 1.
     * @returns 
     */
    public setInterrupt() {
        this._content = Byte.setBit(this._content, FLAGS.POS_INTERRUPT_BIT, 1);
    }

    /**
     * This method clears the interrupt flag bit to a binary 0.
     * @returns 
     */
    public clearInterrupt() {
        this._content = Byte.setBit(this._content, FLAGS.POS_INTERRUPT_BIT, 0);
    }

    /**
     * This method reads the current status of the parity flag bit.
     */
    public get parity(): Bit {
        return Byte.getBit(this._content, FLAGS.POS_PARITY_BIT);
    }

    /**
     * This method reads the current status of the carry flag bit.
     */
    public get carry(): Bit {
        return Byte.getBit(this._content, FLAGS.POS_CARRY_BIT);
    }

    /**
     * This method reads the current status of the zero flag bit.
     */
    public get zero(): Bit {
        return Byte.getBit(this._content, FLAGS.POS_ZERO_BIT);
    }

    /**
     * This method reads the current status of the signed flag bit.
     */
    public get sign(): Bit {
        return Byte.getBit(this._content, FLAGS.POS_SIGNED_BIT);
    }

    /**
     * This method reads the current status of the overflow flag bit.
     */
    public get overflow(): Bit {
        return Byte.getBit(this._content, FLAGS.POS_OVERFLOW_BIT);
    }

    /**
     * This method reads the current status of the interrupt flag bit.
     */
    public get interrupt(): Bit {
        return Byte.getBit(this._content, FLAGS.POS_INTERRUPT_BIT);
    }

    /**
     * This method checks whether the CPU is currently in user mode.
     * @returns True if the CPU is currently in user mode, otherwise false.
     */
    public isInUserMode(): boolean {
        return (
            Byte.getBit(this._content, FLAGS.POS_CPL_MSB_BIT) === 1 &&
            Byte.getBit(this._content, FLAGS.POS_CPL_LSB_BIT) === 1
        );
    }

    /**
     * This method checks whether the CPU is currently in kernel mode.
     * @returns True if the CPU is currently in kernel mode, otherwise false.
     */
    public isInKernelMode(): boolean {
        return (
            Byte.getBit(this._content, FLAGS.POS_CPL_MSB_BIT) === 0 &&
            Byte.getBit(this._content, FLAGS.POS_CPL_LSB_BIT) === 0
        );
    }

    /**
     * This method sets the CPL flag bits to a binary 3.
     * @returns 
     */
    public enterUserMode() {
        this._content = Byte.setBit(this._content, FLAGS.POS_CPL_MSB_BIT, 1);
        this._content = Byte.setBit(this._content, FLAGS.POS_CPL_LSB_BIT, 1);
    }

    /**
     * This method clears the CPL flag bits to a binary 0.
     * @returns 
     */
    public enterKernelMode() {
        this._content = Byte.setBit(this._content, FLAGS.POS_CPL_MSB_BIT, 0);
        this._content = Byte.setBit(this._content, FLAGS.POS_CPL_LSB_BIT, 0);
    }

}