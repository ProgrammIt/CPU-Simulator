import { DataSize } from "../../types";
import { Bit } from "../../types/Bit";
import { Byte } from "../../types/Byte";
import { Doubleword } from "../../types/Doubleword";
import { Word } from "../../types/Word";
import { EFLAGS } from "../functional_units/EFLAGS";

/**
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class ArithmeticLogicUnit {
    /**
     * A refference to the CPU cores EFLAGS register, this ALU is associated with.
     */
    private _eflags: EFLAGS;
    
    /**
     * The last operations result.
     */
    public _result: Doubleword;

    /**
     * Constructs a new instance from the given arguments.
     * @param eflags The EFLAGS register of the CPU core this ALU is associated with.
     * @constructor
     */
    public constructor(eflags: EFLAGS) {
        this._eflags = eflags;
        this._result = new Doubleword();
    }

    /**
     * A getter for retrieving the result of the last operation.
     * @returns The last operations result. 
     */
    public get result() {
        return this._result;
    }

    /**
     * This method checks whether the last operation resulted in a binary zero
     * and sets the zero flag accordingly.
     * @returns
     */
    private checkForZero() {
        if (this._result.value.every(bit => (bit === 0))) {
            this._eflags.setZero();
        }
    }

    /**
     * This method checks whether the last operation resulted in a binary zero
     * and sets the zero flag accordingly.
     * @returns
     */
    private checkForParity() {
        var noSetBits: number = 0;
        this._result.value.slice(-DataSize.DOUBLEWORD).forEach(bit => {
            if (bit === 1) {
                ++noSetBits
            }
        });
        if (noSetBits % 2 === 0) {
            this._eflags.setParity();
        }
    }

    /**
     * This method checks whether the last operation resulted in a negative
     * value.
     * @returns
     */
    private checkForSigned() {
        if (this._result.value[0] === 1) {
            this._eflags.setSigned();
        }
    }

    /**
     * This method checks whether the last operation resulted in an overflow.
     * An overflow occurs, if the two highest bits of the carry are unequal.
     * @param carry The carry bits to check.
     */
    private checkForOverflow(carry: Array<Bit>) {
        if (carry[carry.length - 1] !== carry[carry.length - 2]) {
            this._eflags.setOverflow();
        }
    }

    /**
     * This method checks whether the last operation resulted in a negative value.
     * A negative value is present if the MSB is set to 1.
     * @param carry The carry bits to check.
     */
    private checkNegativeValue(carry: Array<Bit>) {
        if (carry[carry.length - 1] === 1) {
            this._eflags.setCarry();
        }
    }

    /**
     * This method performs the logical NOT operation on a single bit. The given value will be inverted:
     * 1 becomes 0 and vice versa.
     * @param operand The bit to invert.
     * @returns The inverted bit.
     */
    public not(operand: Bit): Bit {
        return (operand === 1) ? 0 : 1;
    }

    /**
     * This method performs the logical AND operation on two given bits, according to the following table:
     * | Bit x | Bit y | Result |
     * |-------|-------|--------|
     * | 0     | 0     | 0      |
     * | 1     | 0     | 0      |
     * | 0     | 1     | 0      |
     * | 1     | 1     | 1      |
     * @param firstOperand The first bit.
     * @param secondOperand The second bit.
     * @returns The result of the logical AND operation.
     */
    public and(firstOperand: Bit, secondOperand: Bit): Bit {
        return (firstOperand === 1 && secondOperand === 1) ? 1 : 0;
    }

    /**
     * This method performs the logical NAND operation on two given bits, according to the following table:
     * | Bit x | Bit y | Result |
     * |-------|-------|--------|
     * | 0     | 0     | 1      |
     * | 1     | 0     | 1      |
     * | 0     | 1     | 1      |
     * | 1     | 1     | 0      |
     * @param firstOperand The first bit.
     * @param secondOperand The second bit.
     * @returns The result of the logical NAND operation.
     */
    public nand(firstOperand: Bit, secondOperand: Bit): Bit {
        return (firstOperand === 1 && secondOperand === 1) ? 0 : 1;
    }

    /**
     * This method performs the logical OR operation on two given bits, according to the following table:
     * | Bit x | Bit y | Result |
     * |-------|-------|--------|
     * | 0     | 0     | 0      |
     * | 1     | 0     | 1      |
     * | 0     | 1     | 1      |
     * | 1     | 1     | 1      |
     * @param firstOperand The first bit.
     * @param secondOperand The second bit.
     * @returns The result of the logical OR operation.
     */
    public or(firstOperand: Bit, secondOperand: Bit): Bit {
        return (firstOperand === 0 && secondOperand === 0) ? 0 : 1;
    }

    /**
     * This method performs the logical XOR operation on two given bits, according to the following table:
     * | Bit x | Bit y | Result |
     * |-------|-------|--------|
     * | 0     | 0     | 0      |
     * | 1     | 0     | 1      |
     * | 0     | 1     | 1      |
     * | 1     | 1     | 0      |
     * @param firstOperand The first bit.
     * @param secondOperand The second bit.
     * @returns The result of the logical XOR operation.
     */
    public xor(firstOperand: Bit, secondOperand: Bit): Bit {
        return (
            (firstOperand === 1 && secondOperand === 0) || (firstOperand === 0 && secondOperand === 1)
        ) ? 1 : 0;
    }

    /**
     * This method performs the logical NOT operation bit-wise on a doubleword.
     * The result corresponds to the one's complement of the given binary value.
     * All flags remain unchanged.
     * @param operand The doubleword to invert.
     */
    public notDoubleword(operand: Doubleword) {
        this._result = new Doubleword();
        operand.value.forEach((bit, index) => {
            this._result.value[index] = this.not(bit);
        });
    }

    /**
     * This method performs the logical AND operation bit-wise on two given doubleword.
     * Both the **carry** and the **overflow** flag are *cleared*, while the **zero**, **sign** and **parity** flags
     * are *set* according to the operations result.
     * @param firstOperand The first doubleword.
     * @param secondOperand The second doubleword.
     */
    public andDoubleword(firstOperand: Doubleword, secondOperand: Doubleword) {
        this._result = new Doubleword();
        this._eflags.clearCarry();
        this._eflags.clearOverflow();
        this._eflags.clearZero();
        this._eflags.clearParity();
        this._eflags.clearSigned();
        firstOperand.value.forEach((bit, index) => {
            this._result.value[index] = this.and(bit, secondOperand.value[index]);
        });
        this.checkForZero();
        this.checkForParity();
        this.checkForSigned();
    }

    /**
     * This method performs the logical NAND operation bit-wise on two given doubleword.
     * @param firstOperand The first doubleword.
     * @param secondOperand The second doubleword.
     */
    public nandDoubleword(firstOperand: Doubleword, secondOperand: Doubleword) {
        this._result = new Doubleword();
        this._eflags.clearCarry();
        this._eflags.clearOverflow();
        this._eflags.clearZero();
        this._eflags.clearParity();
        this._eflags.clearSigned();
        firstOperand.value.forEach((bit, index) => {
            this._result.value[index] = this.nand(bit, secondOperand.value[index]);
        });
        this.checkForZero();
        this.checkForParity();
        this.checkForSigned();
    }

    /**
     * This method performs the logical OR operation bit-wise on two given doubleword.
     * Both the **carry** and the **overflow** flag are *cleared*, while the **zero**, **sign** and **parity** flags
     * are *set* according to the operations result. 
     * @param firstOperand The first word.
     * @param secondOperand The second word.
     */
    public orDoubleword(firstOperand: Doubleword, secondOperand: Doubleword) {
        this._result = new Doubleword();
        this._eflags.clearCarry();
        this._eflags.clearOverflow();
        this._eflags.clearZero();
        this._eflags.clearParity();
        this._eflags.clearSigned();
        firstOperand.value.forEach((bit, index) => {
            this._result.value[index] = this.or(bit, secondOperand.value[index]);
        });
        this.checkForZero();
        this.checkForParity();
        this.checkForSigned();
    }

    /**
     * This method performs the logical XOR operation bit-wise on two given doubleword.
     * Both the **carry** and the **overflow** flag are *cleared*, while the **zero**, **sign** and **parity** flags
     * are *set* according to the operations result. 
     * @param firstOperand The first doubleword.
     * @param secondOperand The second doubleword.
     */
    public xorDoubleword(firstOperand: Doubleword, secondOperand: Doubleword) {
        this._result = new Doubleword();
        this._eflags.clearCarry();
        this._eflags.clearOverflow();
        this._eflags.clearZero();
        this._eflags.clearParity();
        this._eflags.clearSigned();
        firstOperand.value.forEach((bit, index) => {
            this._result.value[index] = this.xor(bit, secondOperand.value[index]);
        });
        this.checkForZero();
        this.checkForParity();
        this.checkForSigned();
    }

    /**
     * This method computes the two's complement of the given binary value.
     * Affects the **overflow**, **carry**, **sign**, **zero** and **parity** flags.
     * @param operand The operand.
     */
    public neg(operand: Doubleword) {
        this._result = new Doubleword();
        this._eflags.clearCarry();
        this._eflags.clearOverflow();
        this._eflags.clearZero();
        this._eflags.clearParity();
        this._eflags.clearSigned();
        this.notDoubleword(operand);
        this.add(this._result, Doubleword.fromInteger(1));
        this.checkForZero();
        this.checkForParity();
        this.checkForSigned();
    }

    /**
     * This method adds two given binary numbers without taking the carry into account.
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * @param firstOperand The first operand.
     * @param secondOperand The second operand.
     */
    public add(firstOperand: Doubleword, secondOperand: Doubleword) {
        this._result = new Doubleword();
        this._eflags.clearCarry();
        this._eflags.clearOverflow();
        this._eflags.clearZero();
        this._eflags.clearParity();
        this._eflags.clearSigned();
        var carry: Array<Bit> = [0];
        for (let index = DataSize.DOUBLEWORD - 1; index >= 0; --index) {
            const bitFirstOperand: Bit = firstOperand.value[index];
            const bitSecondOperand: Bit = secondOperand.value[index];
            const carryBit: Bit = carry[carry.length - 1];
            if (
                (bitFirstOperand === 1 && bitSecondOperand === 1) || 
                (bitFirstOperand === 1 && carryBit === 1) || 
                (bitSecondOperand === 1 && carryBit === 1) 
            ){
                carry.push(1);
            } else {
                carry.push(0);
            }
            const partialResult: Bit = this.xor(bitFirstOperand, bitSecondOperand);
            this._result.value[index] = this.xor(partialResult, carryBit);
        }
        this.checkForOverflow(carry);
        this.checkNegativeValue(carry);
        this.checkForZero();
        this.checkForParity();
        this.checkForSigned();
    }

    /**
     * This method adds two given binary numbers while taking the carry into account.
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * @param firstOperand The first operand.
     * @param secondOperand The second operand.
     */
    public adc(firstOperand: Doubleword, secondOperand: Doubleword) {
        this._result = new Doubleword();
        this._eflags.clearOverflow();
        this._eflags.clearZero();
        this._eflags.clearParity();
        this._eflags.clearSigned();
        var carry: Array<Bit> = (this._eflags.carry === 1) ? [1] : [0];
        for (let index = DataSize.DOUBLEWORD - 1; index >= 0; --index) {
            const bitFirstOperand: Bit = firstOperand.value[index];
            const bitSecondOperand: Bit = secondOperand.value[index];
            const carryBit: Bit = carry[carry.length - 1];
            if (
                (bitFirstOperand === 1 && bitSecondOperand === 1) || 
                (bitFirstOperand === 1 && carryBit === 1) || 
                (bitSecondOperand === 1 && carryBit === 1) 
            ){
                carry.push(1);
            } else {
                carry.push(0);
            }
            const partialResult: Bit = this.xor(bitFirstOperand, bitSecondOperand);
            this._result.value[index] = this.xor(partialResult, carryBit);
        }
        this.checkForOverflow(carry);
        this.checkNegativeValue(carry);
        this.checkForZero();
        this.checkForParity();
        this.checkForSigned();
    }

    /**
     * This method subtracts two given binary numbers without taking the carry into account.
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * @param firstOperand The first operand.
     * @param secondOperand The second operand.
     */
    public sub(firstOperand: Doubleword, secondOperand: Doubleword) {
        this._result = new Doubleword();
        this._eflags.clearOverflow();
        this._eflags.clearZero();
        this._eflags.clearParity();
        this._eflags.clearSigned();
        if (secondOperand.value[0] === 1) {
            /**
             * - -(x) <=> + (x)
             */
            this.sub(secondOperand, Doubleword.fromInteger(1));
            this.notDoubleword(this._result);
            secondOperand = this._result;
        } else {
            /**
             * + -(x) <=> - (x)
             */
            this.neg(secondOperand);
            secondOperand = this._result;
        }
        this.add(firstOperand, secondOperand);
    }

    /**
     * This method subtracts two given binary numbers without taking the carry into account.
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * @param firstOperand The first operand.
     * @param secondOperand The second operand.
     */
    public sbb(firstOperand: Doubleword, secondOperand: Doubleword) {
        this._result = new Doubleword();
        this._eflags.clearOverflow();
        this._eflags.clearZero();
        this._eflags.clearParity();
        this._eflags.clearSigned();
        if (secondOperand.value[0] === 1) {
            this.sub(secondOperand, Doubleword.fromInteger(1));
            this.notDoubleword(this._result);
            secondOperand = this._result;
        } else {
            this.neg(secondOperand);
            secondOperand = this._result;
        }
        this.adc(firstOperand, secondOperand);
    }

    /**
     * This method multiplies both the given binary, doubleword sized values.
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * @param firstOperand The first operand, which gets multiplied by the second operand.
     * @param secondOperand The second operand, which determines, how often the first operand gets added to itself.
     */
    public mul(firstOperand: Doubleword, secondOperand: Doubleword) {
        // TODO: Realize multiplication through several additions.
        this._result = new Doubleword;
        this._eflags.clearOverflow();
        this._eflags.clearZero();
        this._eflags.clearParity();
        this._eflags.clearSigned();
        var firstOperandDec: number = 0;
        var secondOperandDec: number = 0;
        if (firstOperand.value[0] === 1) {
            this.sub(firstOperand, Doubleword.fromInteger(1));
            this._eflags.clearOverflow();
            this._eflags.clearZero();
            this._eflags.clearParity();
            this._eflags.clearSigned();
            this.notDoubleword(this._result);
            firstOperandDec = parseInt(this._result.toString(), 2) * (-1);
        } else {
            firstOperandDec = parseInt(firstOperand.toString(), 2);
        }

        if (secondOperand.value[0] === 1) {
            this.sub(secondOperand, Doubleword.fromInteger(1));
            this._eflags.clearOverflow();
            this._eflags.clearZero();
            this._eflags.clearParity();
            this._eflags.clearSigned();
            this.notDoubleword(this._result);
            secondOperandDec = parseInt(this._result.toString(), 2) * (-1);
        } else {
            secondOperandDec = parseInt(secondOperand.toString(), 2);
        }

        this._result = Doubleword.fromInteger(firstOperandDec * secondOperandDec);
        /**
         * Checks for an overflow or carry currently can not be performed, as the multiplication is not realized through multiple additions.
         */
        this.checkForZero();
        this.checkForParity();
        this.checkForSigned();
    }

    /**
     * This method divides both the given binary, doubleword sized values.
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * @param firstOperand The first operand, which gets multiplied by the second operand.
     * @param secondOperand The second operand, which determines, how often the first operand gets added to itself.
     */
    public div(firstOperand: Doubleword, secondOperand: Doubleword) {
        // TODO: Realize multiplication through several subtractions.
        this._result = new Doubleword;
        this._eflags.clearOverflow();
        this._eflags.clearZero();
        this._eflags.clearParity();
        this._eflags.clearSigned();
        var firstOperandDec: number = 0;
        var secondOperandDec: number = 0;
        if (firstOperand.value[0] === 1) {
            this.sub(firstOperand, Doubleword.fromInteger(1));
            this._eflags.clearOverflow();
            this._eflags.clearZero();
            this._eflags.clearParity();
            this._eflags.clearSigned();
            this.notDoubleword(this._result);
            firstOperandDec = parseInt(this._result.toString(), 2) * (-1);
        } else {
            firstOperandDec = parseInt(firstOperand.toString(), 2);
        }

        if (secondOperand.value[0] === 1) {
            this.sub(secondOperand, Doubleword.fromInteger(1));
            this._eflags.clearOverflow();
            this._eflags.clearZero();
            this._eflags.clearParity();
            this._eflags.clearSigned();
            this.notDoubleword(this._result);
            secondOperandDec = parseInt(this._result.toString(), 2) * (-1);
        } else {
            secondOperandDec = parseInt(secondOperand.toString(), 2);
        }
        this._result = Doubleword.fromInteger(Math.trunc(firstOperandDec / secondOperandDec));
        /**
         * Checks for an overflow or carry currently can not be performed, as the multiplication is not realized through multiple subtractions.
         */
        this.checkForZero();
        this.checkForParity();
        this.checkForSigned();
    }
}