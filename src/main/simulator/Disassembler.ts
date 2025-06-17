import { DisassemblyError } from "../../types/errors/DisassemblyError";
import { DoubleWord } from "../../types/binary/DoubleWord";
import { encodedOperationNameByValue } from "../../types/enumerations/EncodedOperations";
import { encodedOperandTypesNameByValue } from "../../types/enumerations/EncodedOperandTypes";





/* 32 bit instruction -- 32 bit first operand -- 32 bit second operand

Bachelorarbeit table - string position
31 - 0
30 - 1
29 - 2
28 - 3  
27 - 4  
26 - 5  
25 - 6  
24 - 7  
23 - 8  
22 - 9  
21 - 10  
20 - 11  
19 - 12  
18 - 13  
17 - 14  Addressing mode of first operand
16 - 15  
15 - 16  Type of first operand
14 - 17  
13 - 18  
12 - 19  
11 - 20  
10 - 21  
9  - 22  
8  - 23  Addressing mode of second operand
7  - 24  Type of second operand
6  - 25  
5  - 26  
4  - 27  
3  - 28  
2  - 29  
1  - 30  
0  - 31


*/
export function disassemble(program: DoubleWord[], startAddress: number = 0): void {
    /*if (program.length % 12 != 0) {
        throw new DisassemblyError("Program size is not a multiple of 12 bytes.")
    }*/
   console.log("Program size: " + program.length)
    for (let i = 0; i < program.length; i += 3) {
        const address = startAddress + i * 4
        const instruction = encodedOperationNameByValue(program[i].toString().substring(5, 5+7))
        const op1 = program[i+1].toUnsignedNumber()
        //const addressingMode1 = encodedOperandTypesNameByValue(program[i].toString().substring(5, 30))
        const op2 = program[i+2].toUnsignedNumber()

        let seperator = "\t"
        if (op1 < 99999) {
            seperator = seperator + "\t"
        }
        console.log(address + " -- " + instruction + "\t" + op1 + seperator + op2)
        
    }
}