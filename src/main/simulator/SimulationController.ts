import { Assembler } from "./Assembler";
import { CPUCore } from "./execution_units/CPUCore";
import { RAM } from "./functional_units/RAM";
import { DoubleWord } from "../../types/binary/DoubleWord";
import { DataSizes } from "../../types/enumerations/DataSizes";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { DebugLogger } from "./Logger";
import { Byte } from "../../types/binary/Byte";
import { getMainWindow } from "../index";
import { PhysicalAddress } from "../../types/binary/PhysicalAddress";
import { FrameOffset } from "../../types/binary/FrameOffset";

/**
 * The main logic of the simulator. Trough this class, the CPU cores and execution is controlled.
 */
export class SimulationController {
    public readonly core: CPUCore;
    public readonly mainMemory: RAM;
    private static _instance: SimulationController | null = null;
    private _assembler: Assembler;
    private _programmLoaded: boolean;

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
        this.autoScrollForPageTableEnabled = true;
        this.inDevMode = devMode;
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
    public static getInstanceOrCreate(capacityOfMainMemory: number, pathToLanguageDefinition: string, pathToOSFilesystem: string, devMode: boolean = false): SimulationController {
        if (SimulationController._instance === null) {
            SimulationController._instance = new SimulationController(capacityOfMainMemory, pathToLanguageDefinition, pathToOSFilesystem, DataSizes.DOUBLEWORD, devMode);
            SimulationController._instance.bootKernel();
        }
        return SimulationController._instance;
    }

    /**
     * This method boots the operating system by loading its data into main memory. The address space,
     * where the operating system is located in memory is sometimes called kernel space.
     */
    public assemblyKernel(): void {

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
    private bootKernel(): void {
        this.core.performanceTimerStart(0)
        // Enter kernel mode.
        this.core.flags.enterKernelMode();
        // Enable real mode and disable memory virtualization.
        this.core.mmu.disableMemoryVirtualization();

        if (!existsSync(this.pathToOSFilesystem + "/os/bin/ihmeOS.bin") || this.inDevMode)
        {
            this.assemblyKernel();
        }

        const buffer = readFileSync(this.pathToOSFilesystem + "/os/bin/ihmeOS.bin");

        const lenght =  buffer.length - (buffer.length % 4);

        for (let i = 0; i < lenght; i+=4) {
            const value: DoubleWord = DoubleWord.fromNumber(buffer.readUint32BE(i));
            this.mainMemory.writeDoubleWordTo(PhysicalAddress.fromNumber(SimulationController.KERNEL_SPACE_START + i), value)
        }

        if (buffer.length % 4 !== 0)
        {
            const value: DoubleWord = DoubleWord.fromBytes(
                Byte.fromNumber(buffer[lenght]), 
                Byte.fromNumber(buffer.length % 4 >= 2 ? buffer[lenght+1] : 0), 
                Byte.fromNumber(buffer.length % 4 === 3 ? buffer[lenght+2] : 0), 
                Byte.ZERO);

            this.mainMemory.writeDoubleWordTo(PhysicalAddress.fromNumber(SimulationController.KERNEL_SPACE_START + lenght), value)
        }
        
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
        
        getMainWindow()?.webContents.send('clear_log');

        getMainWindow()?.webContents.send('update_log', "OS Initialized");

        return;
    }



    /**
     * This method is used to initialize a process and prepare its execution.
     * @param pathToProgramCode 
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
     * @param pathToProgramCode 
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
        pathToProgramCode = pathToProgramCode.replace(".asm", ".bin");;

        writeFileSync(pathToProgramCode, buffer);
    }

    /**
     * This method is used to assemble os code
     * @param pathToProgramCode 
     * @param [name=null] 
     * @param [baseOffeset=0] 
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

        const zeroFramePath = this.pathToOSFilesystem + "/os/util/empty_frame.bin"

        if (!existsSync(zeroFramePath))
        {
            const buffer = Buffer.alloc((2**FrameOffset.NUMBER_OF_BITS) * 4);

            writeFileSync(zeroFramePath, buffer);
        }

        const pageTablePath = this.pathToOSFilesystem + "/os/util/page_table.bin"

        if (!existsSync(pageTablePath)) {

            const USER_SPACE_ENTRIES = 786432;
            const KERNEL_SPACE_ENTRIES = 262144;
            const OS_CODE_SPACE_SIZE = 65536;
            const ENTRY_SIZE = 4;

            const buffer = Buffer.alloc((USER_SPACE_ENTRIES + KERNEL_SPACE_ENTRIES) * ENTRY_SIZE);

            // First region
            for (let i = 0; i < USER_SPACE_ENTRIES; i++) {
                buffer.writeUInt32BE(0x40000000, i * ENTRY_SIZE);
            }

            // Second region
            const baseOffset = USER_SPACE_ENTRIES * ENTRY_SIZE;

            for (let i = 0; i < KERNEL_SPACE_ENTRIES; i++) {
                const index = baseOffset + i * ENTRY_SIZE;

                const value = i < OS_CODE_SPACE_SIZE
                    ? 0xB0000000 + i + USER_SPACE_ENTRIES
                    : 0x90000000 + i + USER_SPACE_ENTRIES;

                buffer.writeUInt32BE(value, index);
            }

            writeFileSync(pageTablePath, buffer);
        }
    }

    /**
     * This method triggers execution of the next instruction
     */
    public cycle(): void {
        
        this.core.cycle();
    }
}