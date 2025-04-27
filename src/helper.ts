import { ArithmeticLogicUnit } from "./main/simulator/execution_units/ArithmeticLogicUnit";
import { EFLAGS } from "./main/simulator/functional_units/EFLAGS";
import { DoubleWord } from "./types/binary/DoubleWord";

/**
 * This method converts a negative binary value to its decimal representation.
 * @param doubleword The negative binary value to convert.
 * @return The decimal representation of the given value.
 */
export function twosComplementToDecimal(doubleword: DoubleWord): number {
    let result: number;
    if (doubleword.value[0] === 1) {
        const alu: ArithmeticLogicUnit = new ArithmeticLogicUnit(new EFLAGS());
        doubleword = alu.sub(doubleword, DoubleWord.fromInteger(1));
        doubleword = alu.not(doubleword);
        result = -1 * parseInt(doubleword.toString(), 2);
    } else {
        result = parseInt(doubleword.toString(), 2);
    }
    return result;
}