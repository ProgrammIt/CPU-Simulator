import { Simulator } from "../simulator/Simulator";
import { DoubleWord } from "../types/DoubleWord";

describe('Test Simulator', () => {
    const simulator: Simulator = Simulator.getInstance(Math.pow(2, 32));
    simulator.bootProcess("./assembly/examples/loop.asm");
    
    test('Test if PTP register points to a valid page table entry', () => {
        let expectedOutput: DoubleWord = new DoubleWord([1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        expect(simulator.mainMemory.readDoublewordFrom(simulator.core.ptp.content)).toEqual(expectedOutput);
    });
});