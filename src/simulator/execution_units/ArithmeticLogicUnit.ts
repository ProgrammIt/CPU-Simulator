import { BinaryValue } from "../../types/BinaryValue";
import { Bit } from "../../types/Bit";
import { DataSizes } from "../../types/DataSizes";
import { Doubleword } from "../../types/Doubleword";
import { DivisionByZeroError } from "../../types/errors/DivisionByZeroError";
import { Quadword } from "../../types/Quadword";
import { EFLAGS } from "../functional_units/EFLAGS";

/**
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class ArithmeticLogicUnit {
    /**
     * A refference to the CPU cores EFLAGS register, this ALU is associated with.
     * @readonly
     */
    private readonly _eflags: EFLAGS;

    /**
     * Constructs a new instance from the given arguments.
     * @param eflags The EFLAGS register of the CPU core this ALU is associated with.
     * @constructor
     */
    public constructor(eflags: EFLAGS) {
        this._eflags = eflags;
    }

    /**
     * This method checks whether the given binary value is a binary zero
     * and sets or clears the **zero** flag accordingly.
     * @param operand A binary value.
     * @returns
     */
    private checkForZero(operand: Doubleword) {
        if (operand.value.every(bit => (bit === 0))) {
            this._eflags.setZero();
        } else {
            this._eflags.clearZero();
        }
        return;
    }

    /**
     * This method checks whether the given binary value has an even number of set bits
     * in the least significant byte and sets or clears the **parity** flag accordingly.
     * @param operand A binary value.
     * @returns
     */
    private checkForParity(operand: Doubleword) {
        var noSetBits: number = 0;
        operand.value.slice(-DataSizes.BYTE).forEach(bit => {
            if (bit === 1) {
                ++noSetBits
            }
        });
        if (noSetBits % 2 === 0) {
            this._eflags.setParity();
        } else {
            this._eflags.clearParity();
        }
        return;
    }

    /**
     * This method checks whether the given binary value is negative and
     * sets or clears the **sign** flag accordingly. The given value is 
     * treated as a negative value if the MSB is set to 1.
     * @param operand A binary value. 
     * @returns
     */
    private checkForSigned(operand: Doubleword) {
        if (operand.value[0] === 1) {
            this._eflags.setSigned();
        } else {
            this._eflags.clearSigned();
        }
        return;
    }

    /**
     * This method checks whether the last operation resulted in an overflow.
     * An overflow occurs, if the two highest bits of the carry are unequal.
     * @param carry The carry bits to check.
     */
    private checkForOverflow(carry: Array<Bit>) {
        if (carry[carry.length - 1] !== carry[carry.length - 2]) {
            this._eflags.setOverflow();
        } else {
            this._eflags.clearOverflow();
        }
        return;
    }

    /**
     * This method checks whether to set or clear the **carry** flag after an operation.
     * @param carry The carry bits to check.
     */
    private checkCarry(carry: Array<Bit>) {
        if (carry[carry.length - 1] === 1) {
            this._eflags.setCarry();
        } else {
            this._eflags.clearCarry();
        }
    }

    /**
     * This method performs the logical NOT operation bit-wise on a doubleword sized binary value.
     * All its bits will be inverted: 1 becomes 0 and vice versa.The result corresponds 
     * to the one's complement of the given binary value.
     * 
     * All flags remain unchanged.
     * @param operand The doubleword sized binary value to invert.
     * @returns The inverted binary value.
     */
    public not(operand: Doubleword): Doubleword {
        const result: Doubleword = new Doubleword(operand.value.slice());
        operand.value.forEach((bit, index) => {
            result.value[index] = (bit === 1) ? 0 : 1;
        });
        return result;
    }

    /**
     * This method performs an bit-wise, logical AND operation on two given binary values, 
     * according to the following table.
     * 
     * | Bit x | Bit y | Result |
     * |-------|-------|--------|
     * | 0     | 0     | 0      |
     * | 1     | 0     | 0      |
     * | 0     | 1     | 0      |
     * | 1     | 1     | 1      |
     * 
     * Both the **carry** and the **overflow** flag are *cleared*, while the **zero**, 
     * **sign** and **parity** flags are *set* or *cleared* according to the operations result.
     * @param firstOperand The first doubleword.
     * @param secondOperand The second doubleword.
     * @returns The resulting binary value.
     */
    public and(firstOperand: Doubleword, secondOperand: Doubleword): Doubleword {
        const result: Doubleword = new Doubleword();
        this._eflags.clearCarry();
        this._eflags.clearOverflow();
        firstOperand.value.forEach((bitFirstOperand, index) => {
            const bitSecondOperand: Bit = secondOperand.value[index];
            result.value[index] = (bitFirstOperand === 1 && bitSecondOperand === 1) ? 1 : 0;
        });
        this.checkForZero(result);
        this.checkForParity(result);
        this.checkForSigned(result);
        return result;
    }

    /**
     * This method performs an bit-wise, logical OR operation on two given binary values, 
     * according to the following table.
     * 
     * | Bit x | Bit y | Result |
     * |-------|-------|--------|
     * | 0     | 0     | 0      |
     * | 1     | 0     | 1      |
     * | 0     | 1     | 1      |
     * | 1     | 1     | 1      |
     * 
     * Both the **carry** and the **overflow** flag are *cleared*, while the **zero**, 
     * **sign** and **parity** flags are *set* or *cleared* according to the operations result.
     * @param firstOperand The first word.
     * @param secondOperand The second word.
     * @returns The resulting binary value.
     */
    public or(firstOperand: Doubleword, secondOperand: Doubleword): Doubleword {
        const result: Doubleword = new Doubleword();
        this._eflags.clearCarry();
        this._eflags.clearOverflow();
        firstOperand.value.forEach((bitFirstOperand, index) => {
            const bitSecondOperand: Bit = secondOperand.value[index];
            result.value[index] = (bitFirstOperand === 0 && bitSecondOperand === 0) ? 0 : 1;
        });
        this.checkForZero(result);
        this.checkForParity(result);
        this.checkForSigned(result);
        return result;
    }

    /**
     * This method performs an bit-wise, logical XOR operation on two given binary values, 
     * according to the following table.
     * 
     * | Bit x | Bit y | Result |
     * |-------|-------|--------|
     * | 0     | 0     | 0      |
     * | 1     | 0     | 1      |
     * | 0     | 1     | 1      |
     * | 1     | 1     | 0      |
     * 
     * Both the **carry** and the **overflow** flag are *cleared*, while the **zero**,
     * **sign** and **parity** flags are *set* or *cleared* according to the operations result.
     * @param firstOperand The first doubleword.
     * @param secondOperand The second doubleword.
     * @returns The resulting binary value.
     */
    public xor(firstOperand: Doubleword, secondOperand: Doubleword) {
        const result: Doubleword = new Doubleword();
        this._eflags.clearCarry();
        this._eflags.clearOverflow();
        firstOperand.value.forEach((bitFirstOperand, index) => {
            const bitSecondOperand: Bit = secondOperand.value[index];
            result.value[index] = (
                (bitFirstOperand === 1 && bitSecondOperand === 0) || 
                (bitFirstOperand === 0 && bitSecondOperand === 1)
            ) ? 1 : 0;
        });
        this.checkForZero(result);
        this.checkForParity(result);
        this.checkForSigned(result);
        return result;
    }

    /**
     * This method computes the two's complement of the given binary value.
     * 
     * Both the **carry** and the **overflow** flag are *cleared*, while the **zero**,
     * **sign** and **parity** flags are *set* or *cleared* according to the operations result.
     * @param operand The operand.
     * @returns The two's complement.
     */
    public neg(operand: Doubleword): Doubleword {
        operand = this.not(operand);
        return this.add(operand, Doubleword.fromInteger(1));
    }

    /**
     * This method adds two given binary numbers without taking the carry into account.
     * 
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * @param firstSummand The first operand/summand.
     * @param secondSummand The second operand/summand.
     * @returns The sum of both operands/summands.
     */
    public add(firstSummand: Doubleword, secondSummand: Doubleword): Doubleword {
        const result: Doubleword = new Doubleword();
        var carry: Array<Bit> = [0];

        for (let index = DataSizes.DOUBLEWORD - 1; index >= 0; --index) {
            const bitFirstOperand: Bit = firstSummand.value[index];
            const bitSecondOperand: Bit = secondSummand.value[index];
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
            const partialResult: Bit = (
                (bitFirstOperand === 1 && bitSecondOperand === 0) || 
                (bitFirstOperand === 0 && bitSecondOperand === 1)
            ) ? 1 : 0;
            result.value[index] = (
                (partialResult === 1 && carryBit === 0) || 
                (partialResult === 0 && carryBit === 1)
            ) ? 1 : 0;
        }
        this.checkForOverflow(carry);
        this.checkCarry(carry);
        this.checkForZero(result);
        this.checkForParity(result);
        this.checkForSigned(result);
        return result;
    }

    /**
     * This method adds two given binary numbers while taking the carry into account.
     * 
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * @param firstSummand The first operand/summand.
     * @param secondSummand The second operand/summand.
     * @returns The sum of both operands/summands.
     */
    public adc(firstSummand: Doubleword, secondSummand: Doubleword): Doubleword {
        const result: Doubleword = new Doubleword();
        var carry: Array<Bit> = (this._eflags.carry === 1) ? [1] : [0];
        for (let index = DataSizes.DOUBLEWORD - 1; index >= 0; --index) {
            const bitFirstOperand: Bit = firstSummand.value[index];
            const bitSecondOperand: Bit = secondSummand.value[index];
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
            const partialResult: Bit = (
                (bitFirstOperand === 1 && bitSecondOperand === 0) || 
                (bitFirstOperand === 0 && bitSecondOperand === 1)
            ) ? 1 : 0;
            result.value[index] = (
                (partialResult === 1 && carryBit === 0) || 
                (partialResult === 0 && carryBit === 1)
            ) ? 1 : 0;
        }
        this.checkForOverflow(carry);
        this.checkCarry(carry);
        this.checkForZero(result);
        this.checkForParity(result);
        this.checkForSigned(result);
        return result;
    }

    /**
     * This method subtracts two given binary numbers without taking the carry into account.
     * 
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * @param minuend The binary value to subtract from.
     * @param subtrahend The binary value to subtract.
     * @returns The difference of the first operand (minuend) and the second operand (subtrahend).
     */
    public sub(minuend: Doubleword, subtrahend: Doubleword): Doubleword {
        if (subtrahend.value[0] === 1) {
            /**
             * - -(x) <=> + (x)
             */
            subtrahend = this.sub(subtrahend, Doubleword.fromInteger(1));
            subtrahend = this.not(subtrahend);
        } else {
            /**
             * - (+ x) <=> - (x)
             */
            subtrahend = this.neg(subtrahend);
        }
        return this.add(minuend, subtrahend);
    }

    /**
     * This method subtracts two given binary numbers without taking the carry into account.
     * 
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * @param minuend The binary value to subtract from.
     * @param subtrahend The binary value to subtract.
     * @returns The difference of the first operand (minuend) and the second operand (subtrahend).
     */
    public sbb(minuend: Doubleword, subtrahend: Doubleword): Doubleword {
        var carryFlag: Bit = this._eflags.carry;
        if (subtrahend.value[0] === 1) {
            /**
             * - -(x) <=> + (x)
             */
            subtrahend = this.sub(subtrahend, Doubleword.fromInteger(1));
            this._eflags.clearCarry();
            subtrahend = this.not(subtrahend);
        } else {
            /**
             * + -(x) <=> - (x)
             */
            subtrahend = this.neg(subtrahend);
        }
        if (carryFlag === 1) {
            this._eflags.setCarry();
        }
        return this.adc(minuend, subtrahend);
    }

    /**
     * This method sign extends a given binary value to the specified length.
     * @param operand A binary value to sign extend.
     * @param maxLength The lenght to sign extend the operand to.
     */
    public signExtend<T extends BinaryValue>(operand: T, maxLength: number) {
        if (!Number.isInteger(maxLength)) {
			throw new Error("Given number is not an integer.");
		}
        if (maxLength <= operand.value.length) {
            return;
        }
        const isNegative: boolean = operand.value[0] === 1;
        for (let i = 0; i < maxLength - operand.value.length; ++i) {
            operand.value.unshift((isNegative) ? 1 : 0);
        }
        return;
    }

    /**
     * This method performs an arithmetic shift on the given binary value one bit to the right.
     * @param operand The operand to perform a right shift on.
     * @returns The bit right shifted.
     */
    public rightShift<T extends BinaryValue>(operand: T): Bit {
        const copy: Quadword = new Quadword(operand.value.slice());
        for (let index = 0; index < copy.value.length - 1; ++index) {
            const bitToShift: Bit = copy.value[index];
            if (index === 0) {
                operand.value[index] = bitToShift;
            }
            operand.value[index + 1] = bitToShift;
        }
        return copy.value[copy.value.length - 1];
    }

    /**
     * This method performs an arithmetic shift on the given binary value one bit to the left.
     * @param operand The operand to perform a right shift on.
     * @returns The bit left shifted.
     */
    public leftShift<T extends BinaryValue>(operand: T): Bit {
        const copy: Array<Bit> = operand.value.slice();
        for (let index = copy.length - 1; index > 0; --index) {
            const bitToShift: Bit = copy[index];
            if (index === 0) {
                operand.value[index] = 0;
            }
            operand.value[index - 1] = bitToShift;
        }
        return copy[0];
    }

    /**
     * This method multiplies both the given binary, doubleword sized values using Booths mulitplication algorithm, 
     * according to <https://medium.com/@jetnipit54/booth-algorithm-e6b8a6c5b8d>.
     * 
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * @param multiplier The operand, which determines, how often the first operand gets multiplied.
     * @param multiplicand The operand, which gets multiplied by the multiplicand.
     * @returns The resulting product.
     */
    public mul(multiplier: Doubleword, multiplicand: Doubleword): Doubleword {
        var a: Doubleword = new Doubleword();
        var q_1: Bit = 0;
        var q: Doubleword = new Doubleword(multiplicand.value.slice());
        var cnt: number = a.value.length;
        var m: Doubleword = new Doubleword(multiplier.value.slice());
        var tmp: BinaryValue = new BinaryValue(new Array<Bit>((a.value.length * 2) + 1).fill(0));
        while (cnt >= 0) {
            if (q.value[q.value.length - 1] === 1 && q_1 === 0) {
                a = this.sub(a, m);
            } else if (q.value[q.value.length - 1] === 0 && q_1 === 1) {
                a = this.add(a, m);
            }
            tmp.value = a.value.slice().concat(q.value.slice()).concat(q_1);
            this.rightShift<BinaryValue>(tmp);
            a.value = tmp.value.slice(0, DataSizes.DOUBLEWORD);
            q.value = tmp.value.slice(DataSizes.DOUBLEWORD, 64);
            q_1 = tmp.value[tmp.value.length - 1];
            --cnt;
        }
        return new Doubleword(tmp.value.slice(-DataSizes.DOUBLEWORD));
    }

    /**
     * This method divides both the given binary, doubleword sized values.
     * 
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * @param dividend The first operand, which divides the dividend.
     * @param divisor The second operand, which gets divided by the divisor.
     * @returns The resulting quotient.
     */
    public div(dividend: Doubleword, divisor: Doubleword): Doubleword {
        var quotient: Doubleword = new Doubleword();
        var flipQuotientSign: boolean = false;
        this.checkForZero(divisor);
        if (this._eflags.zero === 1) {
            throw new DivisionByZeroError("Dividing by zero is not permittet.");
        }
        if (dividend.value[0] === 1 && divisor.value[0] === 1) {
            dividend = this.sub(dividend, Doubleword.fromInteger(1));
            dividend = this.not(dividend);
            divisor = this.sub(divisor, Doubleword.fromInteger(1));
            divisor = this.not(divisor);
        }
        if (divisor.value[0] === 1) {
            // Calc the absolute value of the negative divisor first.
            divisor = this.sub(divisor, Doubleword.fromInteger(1));
            divisor = this.not(divisor);
            flipQuotientSign = true;
        }
        if (dividend.value[0] === 1) {
            // Calc the absolute value of the negative divisor first.
            dividend = this.sub(dividend, Doubleword.fromInteger(1));
            dividend = this.not(dividend);
            flipQuotientSign = true;
        }
        this.cmp(dividend, divisor);
        while (this._eflags.sign === this._eflags.overflow) {
            dividend = this.sub(dividend, divisor);
            quotient = this.add(quotient, Doubleword.fromInteger(1));
            this.cmp(dividend, divisor);
        }
        if (flipQuotientSign) {
            quotient = this.neg(quotient);
        }
        return quotient;
    }

    /**
     * This method compares both given binary values, by performing a subtraction.
     * 
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * 
     * In contrast to SUB, this operation does not effect the second operands value.
     * @param firstOperand 
     * @param secondOperand 
     */
    public cmp(firstOperand: Doubleword, secondOperand: Doubleword) {
        this.sub(firstOperand, secondOperand);
        return;
    }

    /**
     * This method compares both given binary values, by performing a logical AND operation.
     * 
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * 
     * In contrast to AND, this operation does not effect the second operands value.
     * @param firstOperand 
     * @param secondOperand 
     */
    public test(firstOperand: Doubleword, secondOperand: Doubleword) {
        // Create a copy of the second operand.
        var copy: Doubleword = new Doubleword(secondOperand.value.slice());
        this.and(firstOperand, copy);
    }
}