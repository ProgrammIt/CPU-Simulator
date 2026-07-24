import { DoubleWord } from "../../types/binary/DoubleWord";
import { CPUCore } from "./CPUCore";
import { InterruptNumbers } from "../../types/enumerations/InterruptNumbers";
import { ExceptionError } from "../../types/errors/ExceptionError";
import { Byte } from "../../../types/binary/Byte";

/**
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class ArithmeticLogicUnit {
    /**
     * A refference to the CPU cores EFLAGS register, this ALU is associated with.
     * @readonly
     */
    private readonly _cpu: CPUCore;

    /**
     * Constructs a new instance from the given arguments.
     * @param cpu The cpu.
     */
    public constructor(cpu: CPUCore) {
        this._cpu = cpu;
    }

    /**
     * This method checks whether the given binary value is a binary zero
     * and sets or clears the **zero** flag accordingly.
     * @param operand A binary value.
     */
    private checkForZero(operand: DoubleWord): void {
        if (operand === 0) {
            this._cpu.flags.setZero();
        } else {
            this._cpu.flags.clearZero();
        }
    }

    /**
     * This method checks whether the given binary value has an even number of set bits
     * in the least significant byte and sets or clears the **parity** flag accordingly.
     * @param operand A binary value.
     */
    private checkForParity(operand: DoubleWord): void {
        let value = DoubleWord.getFourthByte(operand);

        let parity = 0;

        // count bits using bitwise ops
        for (let i = 0; i < 8; i++) {
            const result = Byte.logicalRightShift(value);
            value = result[0];
            parity ^= result[1];
        }
        
        if (parity === 0) {
            this._cpu.flags.setParity();
        } else {
            this._cpu.flags.clearParity();
        }
    }

    /**
     * This method checks whether the given binary value is negative and
     * sets or clears the **sign** flag accordingly. The given value is 
     * treated as a negative value if the MSB is set to 1.
     * @param operand A binary value. 
     */
    private checkForSigned(operand: DoubleWord) {
        if (DoubleWord.getMostSignificantBit(operand) === 1) {
            this._cpu.flags.setSigned();
        } else {
            this._cpu.flags.clearSigned();
        }
    }

    /**
     * This method checks whether the last operation resulted in an overflow.
     * An overflow occurs, if the two highest bits of the carry are unequal.
     * @param carry The carry bits to check.
     * @param sign The sign of the result
     */
    private checkForOverflow(carry: boolean, sign: boolean) {
        if (carry !== sign) {
            this._cpu.flags.setOverflow();
        } else {
            this._cpu.flags.clearOverflow();
        }
        return;
    }

    /**
     * This method checks whether to set or clear the **carry** flag after an operation.
     * @param carry The carry bits to check.
     */
    private checkCarry(carry: boolean) {
        if (carry === true) {
            this._cpu.flags.setCarry();
        } else {
            this._cpu.flags.clearCarry();
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
    public not(operand: DoubleWord): DoubleWord {        
        return DoubleWord.fromNumber(~operand);
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
    public and(firstOperand: DoubleWord, secondOperand: DoubleWord): DoubleWord {
        const result: DoubleWord = DoubleWord.fromNumber(firstOperand & secondOperand);
        this._cpu.flags.clearCarry();
        this._cpu.flags.clearOverflow();
    
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
    public or(firstOperand: DoubleWord, secondOperand: DoubleWord): DoubleWord {
        const result: DoubleWord = DoubleWord.fromNumber(firstOperand | secondOperand);
        this._cpu.flags.clearCarry();
        this._cpu.flags.clearOverflow();
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
    public xor(firstOperand: DoubleWord, secondOperand: DoubleWord): DoubleWord {
        const result: DoubleWord = DoubleWord.fromNumber(firstOperand ^ secondOperand);
        this._cpu.flags.clearCarry();
        this._cpu.flags.clearOverflow();
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
    public neg(operand: DoubleWord): DoubleWord {
        const result: DoubleWord = DoubleWord.fromNumber((~operand) + 1);
        this._cpu.flags.clearCarry();
        this._cpu.flags.clearOverflow();
        this.checkForZero(result);
        this.checkForParity(result);
        this.checkForSigned(result);
        return result;
    }

    /**
     * This method adds two given binary numbers without taking the carry into account.
     * 
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * @param firstSummand The first operand/summand.
     * @param secondSummand The second operand/summand.
     * @returns The sum of both operands/summands.
     */
    public add(firstSummand: DoubleWord, secondSummand: DoubleWord): DoubleWord {

        const numericResult = firstSummand + secondSummand;

        const carry: boolean = numericResult > DoubleWord.MAX_POSITIVE_NUMBER;
        const result: DoubleWord = DoubleWord.fromNumber(numericResult);


        this.checkForParity(result);
        this.checkForSigned(result);
        this.checkForZero(result);

        this.checkForOverflow(carry, this._cpu.flags.sign === 1);
        this.checkCarry(carry);
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
    public adc(firstSummand: DoubleWord, secondSummand: DoubleWord): DoubleWord {
        
        const numericResult = firstSummand + secondSummand + this._cpu.flags.carry;

        const carry: boolean = numericResult > DoubleWord.MAX_POSITIVE_NUMBER;
        const result: DoubleWord = DoubleWord.fromNumber(numericResult);

        this.checkForZero(result);
        this.checkForParity(result);
        this.checkForSigned(result);

        this.checkForOverflow(carry, this._cpu.flags.sign === 1);
        this.checkCarry(carry);
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
    public sub(minuend: DoubleWord, subtrahend: DoubleWord): DoubleWord {
        
        const numericResult = minuend - subtrahend;

        const barrow: boolean = numericResult < 0;
        const result: DoubleWord = DoubleWord.fromNumber(numericResult);

        this.checkForParity(result);
        this.checkForSigned(result);
        this.checkForZero(result);

        const overflow =
            DoubleWord.getMostSignificantBit(minuend) !== DoubleWord.getMostSignificantBit(subtrahend) &&
            DoubleWord.getMostSignificantBit(minuend) !== DoubleWord.getMostSignificantBit(result);

        if (overflow) {
            this._cpu.flags.setOverflow();
        } else {
            this._cpu.flags.clearOverflow();
        }

        this.checkCarry(barrow);

        return result;
    }

    /**
     * This method subtracts two given binary numbers while taking the borrow into account.
     * 
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * @param minuend The binary value to subtract from.
     * @param subtrahend The binary value to subtract.
     * @returns The difference of the first operand (minuend) and the second operand (subtrahend).
     */
    public sbb(minuend: DoubleWord, subtrahend: DoubleWord): DoubleWord {

        const numericResult = minuend - subtrahend - this._cpu.flags.carry;

        const barrow: boolean = numericResult < 0;
        const result: DoubleWord = DoubleWord.fromNumber(numericResult);

        this.checkForZero(result);
        this.checkForParity(result);
        this.checkForSigned(result);

        const overflow =
            DoubleWord.getMostSignificantBit(minuend) !== DoubleWord.getMostSignificantBit(subtrahend) &&
            DoubleWord.getMostSignificantBit(minuend) !== DoubleWord.getMostSignificantBit(result);

        if (overflow) {
            this._cpu.flags.setOverflow();
        } else {
            this._cpu.flags.clearOverflow();
        }

        this.checkCarry(barrow);

        return result;
    }

     /**
     * This method performs a logical left shift on a given binary value
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * @param value The second operand, binary value to be shifted.
     * @param count The first operand, number of left shifts.
     * @returns The resulting binary value.
     */
    public shl(value: DoubleWord, count: DoubleWord.BitCount): DoubleWord {

        let result: DoubleWord = DoubleWord.ZERO;

        this._cpu.flags.clearCarry()

        if (DoubleWord.NUMBER_OF_BITS >= count && count > 0) {
            result = DoubleWord.fromNumber(value << count);
            const overflow =
                count === 1 &&
                DoubleWord.getMostSignificantBit(value) !== DoubleWord.getBit(value, 1);

            if (overflow) {
                this._cpu.flags.setOverflow();
            } else {
                this._cpu.flags.clearOverflow();
            }

            const carry = DoubleWord.getBit(value, count - 1 as DoubleWord.BitIndex) == 1;

            if (carry) {
                this._cpu.flags.setCarry();
            } else {
                this._cpu.flags.clearCarry();
            }
        }

        this.checkForZero(result);
        this.checkForParity(result);
        this.checkForSigned(result);

        return result;
    }

    /**
     * This method performs a logical right shift on a given binary value
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * @param value The second operand, binary value to be shifted.
     * @param count The first operand, number of right shifts.
     * @returns The resulting binary value.
     */
    public shr(value: DoubleWord, count: DoubleWord.BitCount): DoubleWord {

        let result: DoubleWord = DoubleWord.ZERO;

        this._cpu.flags.clearCarry()


        if (DoubleWord.NUMBER_OF_BITS >= count && count > 0) {
            result = DoubleWord.fromNumber(value >>> count);

            const overflow =
                count === 1 &&
                DoubleWord.getMostSignificantBit(value) !== DoubleWord.getBit(value, 1);

            if (overflow) {
                this._cpu.flags.setOverflow();
            } else {
                this._cpu.flags.clearOverflow();
            }

            const carry = DoubleWord.getBit(value, DoubleWord.NUMBER_OF_BITS - count as DoubleWord.BitIndex) == 1;

            if (carry) {
                this._cpu.flags.setCarry();
            } else {
                this._cpu.flags.clearCarry();
            }
        }

        this.checkForZero(result);
        this.checkForParity(result);
        this.checkForSigned(result);

        return result;
    }

    /**
     * This method performs a arithmetic right shift on a given binary value
     * Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.
     * @param value The second operand, binary value to be shifted.
     * @param count The first operand, number of right shifts.
     * @returns The resulting binary value.
     */
    public sar(value: DoubleWord, count: DoubleWord.BitCount): DoubleWord {

        let result: DoubleWord = value;

        this._cpu.flags.clearCarry()

        if (DoubleWord.NUMBER_OF_BITS >= count && count > 0) {
            result = DoubleWord.fromNumber(value >> count);
            const carry = DoubleWord.getBit(value, DoubleWord.NUMBER_OF_BITS - count as DoubleWord.BitIndex) == 1;

            if (carry) {
                this._cpu.flags.setCarry();
            } else {
                this._cpu.flags.clearCarry();
            }
        }

        this._cpu.flags.clearOverflow();
        this.checkForZero(result);
        this.checkForParity(result);
        this.checkForSigned(result);

        return result;
    }


    /**
     * This method multiplies both the given binary, doubleword sized values using Booths mulitplication algorithm, 
     * according to <https://medium.com/@jetnipit54/booth-algorithm-e6b8a6c5b8d>.
     * 
     * Affects the **carry** and **overflow** bit according to the result.
     * @param multiplier The operand, which determines, how often the first operand gets multiplied.
     * @param multiplicand The operand, which gets multiplied by the multiplicand.
     * @returns The resulting product.
     */
    public imul(multiplier: DoubleWord, multiplicand: DoubleWord): DoubleWord {
        
        const result64 = BigInt(multiplier) * BigInt(multiplicand);

        const low32 = Number(result64 & 0xFFFFFFFFn) >>> 0; 
        const high32 = Number((result64 >> 32n) & 0xFFFFFFFFn);

        const result = DoubleWord.fromNumber(low32);

        // Determine if high32 is proper sign extension of low32
        const low32Signed = low32 | 0; // convert to signed
        const properSignExtension =
            (low32Signed >= 0 && high32 === 0) ||
            (low32Signed < 0 && high32 === 0xFFFFFFFF);

        const overflow = !properSignExtension;

        if (overflow) {
            this._cpu.flags.setOverflow();
            this._cpu.flags.setCarry();
        } else {
            this._cpu.flags.clearOverflow();
            this._cpu.flags.clearCarry();
        }


        return result;
    }

    /**
     * This method divides both the given binary, doubleword sized values.
     * 
     * Status flags are not Affected.
     * @param dividend The first operand, which gets divided by the divisor.
     * @param divisor The second operand, which divides the dividend.
     * @returns The resulting quotient.
     */
    public idiv(dividend: DoubleWord, divisor: DoubleWord): DoubleWord {
        if (divisor === 0) {
            throw new ExceptionError(InterruptNumbers.DIVIDE_ERROR);
        }
        
        const result = (dividend | 0) / (divisor | 0);

        return DoubleWord.fromNumber(result);
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
    public cmp(firstOperand: DoubleWord, secondOperand: DoubleWord): void {
        this.sub(secondOperand, firstOperand);
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
    public test(firstOperand: DoubleWord, secondOperand: DoubleWord): void {
        this.and(firstOperand, secondOperand);
    }
}