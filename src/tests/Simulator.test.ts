
import { SimulationController } from "../main/simulator/SimulationController";
import { DoubleWord } from "../types/binary/DoubleWord";
import { ProgramExecutionStepping } from "../types/enumerations/ProgramExecutionStepping";

describe('Test Simulator', () => {
  test('loop program', () => {
    console.time("total");

    console.time("init");
    const simulator: SimulationController =
      SimulationController.getInstanceOrCreate(
        2 ** 32,
        "./settings/language_definition.json",
        "./os_filesystem"
      );
    console.timeEnd("init");

    console.time("load");
    simulator.createProcess(simulator.pathToOSFilesystem + "/testing/loop.asm");
    console.timeEnd("load");

    console.time("execution");

    simulator.core.MAX_INSTRUCTIONS_PER_CYCLE = Infinity;
    simulator.core.executionStepping = ProgramExecutionStepping.INT;
    simulator.core.debugKernel = false;

    simulator.core.cycle();

    console.timeEnd("execution");

    console.timeEnd("total");

    expect(simulator.core.edx.content).toEqual(DoubleWord.fromNumber(0x12345678));

    simulator.dispose();
  });
});