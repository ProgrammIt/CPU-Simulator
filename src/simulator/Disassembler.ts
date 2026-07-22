import { DoubleWord } from "../../types/binary/DoubleWord";
import { Instructions } from "../../types/enumerations/IntructionSet";

export function disassemble(program: DoubleWord[], startAddress: number = 0): void {
   console.log("Program size: " + program.length)
    for (let i = 0; i < program.length; i += 3) {
        const address = startAddress + i * 4
        const instruction = DoubleWord.getBitRange(program[i], 5, 12) as Instructions;
        const op1 = program[i+1];
        const op2 = program[i+2];

        let seperator = "\t";
        if (op1 < 99999) {
            seperator = seperator + "\t"
        }
        console.log(address + " -- " + instruction + "\t" + op1 + seperator + op2)
        
    }
}