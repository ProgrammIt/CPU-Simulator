
import { SimulationController } from "../simulator/SimulationController";
import { DoubleWord } from "../types/binary/DoubleWord";
import { describe, expect, test } from '@jest/globals';

describe('Test Simulator', () => {
  test('loop program', () => {
    console.time("total");

    console.time("init");
    SimulationController.getInstanceOrCreate(
        2 ** 32,
        "./settings/language_definition.json",
        "./os_filesystem"
      ).then((simulator) => {
        console.timeEnd("init");

        console.time("load");
        simulator.createProcess(simulator.pathToOSFilesystem + "/home/examples/loop.asm");
        console.timeEnd("load");
        
        console.time("execution");

        while (simulator.core.edx.content !== DoubleWord.fromNumber(0x12345678)) {
          simulator.cycle();
        }

        console.timeEnd("execution");

        console.timeEnd("total");

        expect(simulator.core.eax.content).toEqual(DoubleWord.ZERO);
      });
  });
});