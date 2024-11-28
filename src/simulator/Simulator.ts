import { readFileSync } from "fs";
import { Assembler } from "./Assembler";
import { CPUCore } from "./execution_units/CPUCore";
import { RAM } from "./functional_units/RAM";
import { Doubleword } from "../types/Doubleword";
import { Instruction } from "../types/Instruction";

/**
 * The main logic of the simulator. Trough this class, the CPU cores and execution is controlled.
 */
export class Simulator {
    public readonly cpuCore: CPUCore;
    public readonly mainMemory: RAM;
    private static _instance: Simulator|null = null;
    private _assembler: Assembler;
    private _programmLoaded: boolean;
    private _pathToLanguageConfig: string;

    /**
     * Creates a new instance.
     * @param capacityOfMainMemory The initial capacity of the main memory. This value can not be modified after the simulator started.
     */
    private constructor(capacityOfMainMemory: number) {
        this.mainMemory = RAM.getInstance(capacityOfMainMemory);
        this.cpuCore = new CPUCore(this.mainMemory);
        this._assembler = Assembler.instance;
        this._pathToLanguageConfig = "./src/settings/language_definition.json";
        this._programmLoaded = false;
    }

    /**
     * This method checks whether an assembly programm is currently loaded into the main memory.
     * @returns True, if an assembly programm is currently loaded into main memory, false otherwise.
     */
    public get programmLoaded(): boolean {
        return this._programmLoaded;
    }

    /**
     * This method can be used to retrieve an initialized instance of the simulator.
     * @param capacityOfMainMemory 
     * @returns 
     */
    public static getInstance(capacityOfMainMemory: number): Simulator {
        if (Simulator._instance === null) {
            Simulator._instance = new Simulator(capacityOfMainMemory);
        }
        return Simulator._instance;
    }

    /**
     * This method triggers execution of the next instruction of a loaded programm.
     */
    public cycle() {
        this.cpuCore.fetch();
        this.cpuCore.decode();
        this.cpuCore.execute();
    }

    /**
     * This method compiles the given assembly programm and loads it into the main memory.
     * @param fileContents The file contents of the assembly program.
     */
    public loadProgramm(fileContents: string) {
        this._assembler.loadLanguageDefinition(readFileSync(this._pathToLanguageConfig, "utf-8"));
        const compiledProgram: Array<Doubleword|Instruction> = this._assembler.compile(fileContents);
        this.cpuCore.loadProgramm(compiledProgram);
        this._programmLoaded = true;
    }

    /**
     * This method unloads a compiled assembly programm from the main memory and resets the instruction pointer to 0b0.
     * The process of unloading includes clearing all used frames and reseting the page table for the programm/process.
     */
    public unloadProgramm() {
        this.cpuCore.unloadProgramm();
    }
}