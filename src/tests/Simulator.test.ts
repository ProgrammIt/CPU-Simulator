import { SimulationController } from "../main/simulator/SimulationController";
import { DoubleWord } from "../types/binary/DoubleWord";

describe('Test Simulator', () => {
    const simulator: SimulationController = SimulationController.getInstance(
        Math.pow(2, 32), 
        "./settings/language_definition.json",
        "./assembly"
    );
    simulator.bootProcess("./assembly/examples/loop.asm");
    
    test('Test if PTP register points to a valid page table entry', () => {
        const expectedOutput: DoubleWord = new DoubleWord([1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        expect(simulator.mainMemory.readDoublewordFrom(simulator.core.ptp.content)).toEqual(expectedOutput);
    });
});