import { Simulator } from "../simulator/Simulator";
import { Doubleword } from "../types/Doubleword";

describe('Test Simulator', () => {
    const simulator: Simulator = Simulator.getInstance(Math.pow(2, 32));
    simulator.bootProcess("./assets/programs/examples/loop.asm");
    
    test('Test if PTP register points to a valid page table entry', () => {
        let expectedOutput: Doubleword = new Doubleword([1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        expect(simulator.mainMemory.readDoublewordFrom(simulator.core.ptp.content)).toEqual(expectedOutput);
    });
});