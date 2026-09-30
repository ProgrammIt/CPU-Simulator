import { Assembler } from "./Assembler";
import { CPUCore } from "./execution_units/CPUCore";
import { RAM } from "./functional_units/RAM";
import { DoubleWord } from "../types/binary/DoubleWord";
import { DataSizes } from "../types/enumerations/DataSizes";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { DebugLogger } from "./Logger";
import { Byte } from "../types/binary/Byte";
import { PhysicalAddress } from "../types/binary/PhysicalAddress";
import { applicationWindow } from "../main";

/**
 * The main logic of the simulator. Trough this class, the CPU cores and execution is controlled.
 */
export class SimulationController {
    /**
     * The main CPU core of the simulator.
     * @readonly
     */
    public readonly core: CPUCore;

    /**
     * The main memory of the simulator.
     * @readonly
     */
    public readonly mainMemory: RAM;

    /**
     * The singleton instance of the SimulationController.
     */
    private static _instance: SimulationController | null = null;

    /**
     * The assembler instance responsible for translating assembly code into machine code.
     */
    private _assembler: Assembler;

    /**
     * Indicates whether an assembly program is currently loaded into the main memory.
     */
    private _programmLoaded: boolean;

    /**
     * Stores the mapping of console IDs to their corresponding process IDs.
     */
    private _consoles: Map<number, number>; // Maps consoleId to processId

    /**
     * This class member stores the highest available memory address of physical memory.
     * @readonly
     */
    public static readonly HIGH_ADDRESS_PHYSICAL_MEMORY_DEC: number = 0xFFFFFFFF; // 4_294_967_295

    /**
     * This class member stores the highest available memory address of physical memory.
     * @readonly
     */
    public static readonly LOW_ADDRESS_PHYSICAL_MEMORY_DEC: number = 0;

    /**
     * This class member stores the highest physical memory address of the kernel space.
     * The size of the kernel space is exactly 1 gibibyte.
     * @readonly
     */
    private static readonly KERNEL_SPACE_START: DoubleWord = DoubleWord.fromNumber(0xC0000000);

    /**
     * This field represents a flag, which enables automatic scroll for the GUIs Page Table widget.
     */
    public autoScrollForPageTableEnabled: boolean;

    public readonly pathToOSFilesystem: string;

    public readonly inDevMode: boolean;

    /**
     * Creates a new instance.
     * @param capacityOfMainMemory The initial capacity of the main memory. This value can not be modified after the simulator started.
     * @param pathToLanguageDefinition The path to the language definition file.
     * @param pathToOSFilesystem The path to the language definition file.
     * @param [processingWidth=DataSizes.DOUBLEWORD] The processing width of the simulated CPU.
     * @param [devMode=false] 
     */
    private constructor(capacityOfMainMemory: number, pathToLanguageDefinition: string, pathToOSFilesystem: string, processingWidth: DataSizes = DataSizes.DOUBLEWORD, devMode: boolean = false) {
        this.mainMemory = new RAM(capacityOfMainMemory);
        this.pathToOSFilesystem = pathToOSFilesystem;
        this.core = new CPUCore(this.mainMemory, processingWidth, pathToOSFilesystem);
        this._assembler = new Assembler(pathToLanguageDefinition, pathToOSFilesystem);
        this._programmLoaded = true;
        this._consoles = new Map<number, number>();
        this.autoScrollForPageTableEnabled = true;
        this.inDevMode = devMode;
    }

    /**
     * Returns a map of console IDs to their corresponding process IDs.
     * @returns A map where the keys are console IDs and the values are process IDs.
     */
    public get consoles(): Map<number, number> {
        return this._consoles;
    }

    /**
     * Adds a new console to the simulator.
     * @param consoleId The ID of the console to be added.
     * @param processId The ID of the process associated with the console.
     */
    public addConsole(consoleId: number, processId: number): void {
        this._consoles.set(consoleId, processId);
    }

    /**
     * Removes a console from the simulator.
     * @param consoleId The ID of the console to be removed.
     */
    public removeConsole(consoleId: number): void {
        this._consoles.delete(consoleId);
    }

    /**
     * This method checks whether an assembly programm is currently loaded into the main memory.
     * @returns True, if an assembly programm is currently loaded into main memory, false otherwise.
     */
    public get programmLoaded(): boolean {
        return this._programmLoaded;
    }

    /**
     * This method returns the SimulatorController instance or creates one if not present
     * @param capacityOfMainMemory
     * @param pathToLanguageDefinition
     * @param pathToOSFilesystem
     * @param [devMode=false] 
     * @returns 
     */
    public static async getInstanceOrCreate(capacityOfMainMemory: number, pathToLanguageDefinition: string, pathToOSFilesystem: string, devMode: boolean = false): Promise<SimulationController> {
        if (SimulationController._instance === null) {
            SimulationController._instance = new SimulationController(capacityOfMainMemory, pathToLanguageDefinition, pathToOSFilesystem, DataSizes.DOUBLEWORD, devMode);
            await SimulationController._instance.bootKernel();
        }
        return SimulationController._instance;
    }

    /**
     * This method boots the operating system by loading its data into main memory. The address space,
     * where the operating system is located in memory is sometimes called kernel space.
     */
    public async assemblyKernel(): Promise<void> {

        this.assembleOSCode(this.pathToOSFilesystem + "/os/src/os_entry.asm", "ihmeOS", SimulationController.KERNEL_SPACE_START);

        //Assemble the init program (needed by the os)
        this.assembleOSCode(this.pathToOSFilesystem + "/os/user/init.asm");
    
        //Assemble the init program (needed by the os)
        this.assembleOSCode(this.pathToOSFilesystem + "/os/user/idle.asm");
    }

    /**
     * This method boots the operating system by loading its data into main memory. The address space,
     * where the operating system is located in memory is sometimes called kernel space.
     */
    private async bootKernel(): Promise<void> {
        // Enter kernel mode.
        this.core.flags.enterKernelMode();
        // Enable real mode and disable memory virtualization.
        this.core.mmu.disableMemoryVirtualization();

        if (!existsSync(this.pathToOSFilesystem + "/os/bin/ihmeOS.bin") || this.inDevMode)
        {
            await this.assemblyKernel();
        }

        const buffer = readFileSync(this.pathToOSFilesystem + "/os/bin/ihmeOS.bin");

        const magicNumber: DoubleWord = DoubleWord.fromNumber(buffer.readUint32BE(0));

        if (buffer.length < 96) {
            throw new Error(this.pathToOSFilesystem + "/os/bin/ihmeOS.bin is not a valid executable. File too small.")
        }
        if (magicNumber != 0x7F_49_43_45) {
            throw new Error(this.pathToOSFilesystem + "/os/bin/ihmeOS.bin is not a valid executable.")
        }

        const programHeaderOffset = buffer.readUint32BE(1 * 4) //ice header position for program header offset
        
        // load text segment
        const codeFileOffset = buffer.readUint32BE(programHeaderOffset + 2 * 4); //header position for code offset in binary
        const programLength = buffer.readUint32BE(programHeaderOffset + 3 * 4); //header position for program size
        this.loadSegment(codeFileOffset, programLength, SimulationController.KERNEL_SPACE_START, buffer);

        // load roData segment
        const roDataStartAddress = buffer.readUint32BE(programHeaderOffset + 4 * 4);
        const roDataFileOffset = buffer.readUint32BE(programHeaderOffset + 5 * 4);
        const roDataSize = buffer.readUint32BE(programHeaderOffset + 6 * 4);
        this.loadSegment(roDataFileOffset, roDataSize, roDataStartAddress, buffer);

        // load data segment
        const dataSegmentStartAddress = buffer.readUint32BE(programHeaderOffset + 7 * 4); //header position for data segment start address
        const dataFileOffset = buffer.readUint32BE(programHeaderOffset + 8 * 4); //header position for data offset in binary
        const dataSegmentLength = buffer.readUint32BE(programHeaderOffset + 9 * 4); //header position for data size
        this.loadSegment(dataFileOffset, dataSegmentLength,dataSegmentStartAddress, buffer);

        
        this.core.eip.content = SimulationController.KERNEL_SPACE_START;


        if (!existsSync(this.pathToOSFilesystem + "/os/bin/init.bin"))
        {
            //Assemble the init program (needed by the os)
            this.assembleOSCode(this.pathToOSFilesystem + "/os/user/init.asm");
        }

        if (!existsSync(this.pathToOSFilesystem + "/os/bin/idle.bin"))
        {
            //Assemble the idle program (needed by the os)
            this.assembleOSCode(this.pathToOSFilesystem + "/os/user/idle.asm");
        }
        this.createUtilityFiles();

        DebugLogger.log("");
        DebugLogger.log("Starting Execution");
        DebugLogger.log("");

        this.core.cycle();       
        
        applicationWindow?.mainWindow?.webContents.send('clear_log');

        applicationWindow?.mainWindow?.webContents.send('update_log', "OS Initialized");

        return;
    }


    private loadSegment(fileOffset: number, segmentLength: number, targetAddress: number, buffer: Buffer): void {
        if (segmentLength <= 0) {
            return;
        }
        const doubleWordAlignedLength = segmentLength - (segmentLength % 4);

        //write full double words
        for (let i = 0; i < doubleWordAlignedLength; i += 4) {
            const value: DoubleWord = DoubleWord.fromNumber(buffer.readUint32BE(i + fileOffset));
            this.mainMemory.writeDoubleWordTo(PhysicalAddress.fromNumber(targetAddress + i), value);
        }

        // write rest
        const remainder = segmentLength % 4;
        if (remainder !== 0) {
            const value: DoubleWord = DoubleWord.fromBytes(
                Byte.fromNumber(buffer[fileOffset + doubleWordAlignedLength]), 
                Byte.fromNumber(remainder >= 2 ? buffer[fileOffset + doubleWordAlignedLength + 1] : 0), 
                Byte.fromNumber(remainder === 3 ? buffer[fileOffset + doubleWordAlignedLength + 2] : 0), 
                Byte.ZERO
            );

            this.mainMemory.writeDoubleWordTo(PhysicalAddress.fromNumber(targetAddress + doubleWordAlignedLength), value)
        }
    }

    /**
     * This method is used to initialize a process and prepare its execution.
     * @param pathToProgramCode The path to the program code to create a process for.
     */
    public createProcess(pathToProgramCode: string): void {

        if (pathToProgramCode.endsWith(".asm")) {
            this.assembleProgram(pathToProgramCode);
            pathToProgramCode = pathToProgramCode.replace(".asm", ".bin");
        }

        if (!pathToProgramCode.endsWith(".bin")) {
            throw new EvalError("Expected a binary or assembly file")
        }

        if (!pathToProgramCode.includes("/os_filesystem/")) {
            throw new EvalError("file must be in the os_filesystem")
        }

        const programName = pathToProgramCode.substring(pathToProgramCode.lastIndexOf("/"));
        let relativePathToCode = "/bin" + programName + "\0";

        while (relativePathToCode.length % 4 != 0)
        {
            relativePathToCode = relativePathToCode.concat("\0");
        }

        writeFileSync(this.pathToOSFilesystem + "/os/util/new_process_name.bin", Buffer.from(relativePathToCode, "utf8"));
        
        return;
    }

    /**
     * This method is used to assemble a program
     * @param pathToProgramCode The path to the program code to assemble.
     */
    public assembleProgram(pathToProgramCode: string): void {
        
        // Read the program code.
        const fileContents: string = readFileSync(pathToProgramCode, "utf-8");
        // Compile the program code.
        const compiledProgram: Array<DoubleWord> = this._assembler.assemble(fileContents);

        const buffer = Buffer.allocUnsafe(compiledProgram.length * 4);

        for (let index = 0; index < compiledProgram.length; index++) {
            buffer.writeUInt32BE(compiledProgram[index], index * 4);
        }

        pathToProgramCode = this.pathToOSFilesystem + "/bin" + pathToProgramCode.substring(pathToProgramCode.lastIndexOf("/"));
        pathToProgramCode = pathToProgramCode.replace(".asm", ".bin");

        writeFileSync(pathToProgramCode, buffer);
    }

    /**
     * This method is used to assemble os code.
     * @param pathToProgramCode The path to the OS program code to assemble.
     * @param [name=null] The name of the output binary file. If null, it will be derived from the input file name.
     * @param [baseOffeset=0] The base offset to use during assembly.
     */
    public assembleOSCode(pathToProgramCode: string, name: string | null = null, baseOffeset: number = 0): void {
        
        // Read the program code.
        const fileContents: string = readFileSync(pathToProgramCode, "utf-8");
        // Compile the program code.
        const compiledProgram: Array<DoubleWord> = this._assembler.assemble(fileContents, baseOffeset);

        const buffer = Buffer.allocUnsafe(compiledProgram.length * 4);

        for (let index = 0; index < compiledProgram.length; index++) {
            buffer.writeUInt32BE(compiledProgram[index], index * 4);
        }

        pathToProgramCode = pathToProgramCode.replace(".asm", "");

        if (name === null)
        {
            name = pathToProgramCode.substring(pathToProgramCode.lastIndexOf('/'));
        }

        pathToProgramCode = this.pathToOSFilesystem + "/os/bin/" + name;
        pathToProgramCode += ".bin";

        writeFileSync(pathToProgramCode, buffer);
    }

    /**
     * This method is used to assemble a program
     */
    public createUtilityFiles(): void {
        
        const newProcessNamePath = this.pathToOSFilesystem + "/os/util/new_process_name.bin"

        if (!existsSync(newProcessNamePath))
        {
            writeFileSync(newProcessNamePath, Buffer.from([0]));
        }
    }

    /**
     * This method triggers execution of the next instruction
     */
    public cycle(): void {
        
        this.core.cycle();
    }
}
