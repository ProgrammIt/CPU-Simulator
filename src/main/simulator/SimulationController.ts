import { Assembler } from "./Assembler";
import { CPUCore } from "./execution_units/CPUCore";
import { RAM } from "./functional_units/RAM";
import { DoubleWord } from "../../types/binary/DoubleWord";
import { PhysicalAddress } from "../../types/binary/PhysicalAddress";
import { VirtualAddress } from "../../types/binary/VirtualAddress";
import { Bit } from "../../types/binary/Bit";
import { MemoryManagementUnit } from "./execution_units/MemoryManagementUnit";
import { DataSizes } from "../../types/enumerations/DataSizes";
import { PageFaultError } from "../../types/errors/PageFaultError";
import { readFileSync } from "fs";
import { PageTableEntry } from "../../types/binary/PageTableEntry";
import { InstructionOperand } from "../../types/binary/InstructionOperand";
import { EncodedAddressingModes } from "../../types/enumerations/EncodedAdressingModes";
import { AddressSpace } from "../../types/binary/AddressSpace";
import { EncodedOperandTypes } from "../../types/enumerations/EncodedOperandTypes";
import { Address } from "../../types/binary/Address";
import { disassemble } from "./Disassembler";
import { exit } from "process";

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
    private static readonly KERNEL_SPACE:  AddressSpace<PhysicalAddress> = 
        new AddressSpace<PhysicalAddress>(
            PhysicalAddress.fromInteger(0x40000000),
            PhysicalAddress.fromInteger(0x7FFFFFFF)
        );

    /**
     * This field stores the physical address space used to store the list with available page frames.
     */
    private _physicalAddressSpaceListOfAvailablePageFrames: AddressSpace<PhysicalAddress> | undefined;

    /**
     * This field stores the physical address space used to store the list with used page frames.
     */
    private _physicalAddressSpaceListOfUsedPageFrames: AddressSpace<PhysicalAddress> | undefined;

    /**
     * This field stores the physical address space used to store the interrupt handlers.
     */
    private _physicalAddressSpaceForInterruptHandlers: AddressSpace<PhysicalAddress> | undefined;

    /**
     * This field stores the physical address sapce used to store the systems functions.
     */
    private _physicalAddressSpaceForSystemFunctions: AddressSpace<PhysicalAddress> | undefined;

    /**
     * This field stores the physical address sapce used to store the systems functions.
     */
    private _physicalAddressSpaceForInterruptTable: AddressSpace<PhysicalAddress> | undefined;

    /**
     * This field stores the physical address sapce used to store the systems functions.
     */
    private _physicalAddressSpaceForPageTable: AddressSpace<PhysicalAddress> | undefined;

    /**
     * This field stores the virtual address space used to store an compiled assembly program.
     */
    private _virtualAddressSpaceCodeSegment: AddressSpace<VirtualAddress> | undefined;

    /**
     * This field stores the path to the assembly files.
     */
    private _pathToAssemblyFiles: string;

    /**
     * This field represents a flag, which enables automatic scroll for the GUIs virtual RAM widget.
     */
    public autoScrollForVirtualRAMEnabled: boolean;

    /**
     * This field represents a flag, which enables automatic scroll for the GUIs physical RAM widget.
     */
    public autoScrollForPhysicalRAMEnabled: boolean;

    /**
     * This field represents a flag, which enables automatic scroll for the GUIs Page Table widget.
     */
    public autoScrollForPageTableEnabled: boolean;

    /**
     * Creates a new instance.
     * @param capacityOfMainMemory The initial capacity of the main memory. This value can not be modified after the simulator started.
     * @param pathToLanguageDefinition The path to the language definition file.
     * @param pathToAssemblyFiles The path to the assembly files.
     * @param [processingWidth=DataSizes.DOUBLEWORD] The processing width of the simulated CPU.
     */
    private constructor(capacityOfMainMemory: number, pathToLanguageDefinition: string, pathToAssemblyFiles: string, processingWidth: DataSizes = DataSizes.DOUBLEWORD) {
        this.mainMemory = new RAM(capacityOfMainMemory);
        this.core = new CPUCore(this.mainMemory, processingWidth);
        this._assembler = new Assembler(pathToLanguageDefinition);
        this._programmLoaded = false;
        this._physicalAddressSpaceListOfAvailablePageFrames =  undefined;
        this._physicalAddressSpaceListOfUsedPageFrames = undefined;
        this._virtualAddressSpaceCodeSegment = undefined;
        this._physicalAddressSpaceForInterruptHandlers = undefined;
        this._physicalAddressSpaceForSystemFunctions = undefined;
        this._physicalAddressSpaceForInterruptTable = undefined;
        this._physicalAddressSpaceForPageTable = undefined;
        this.autoScrollForPageTableEnabled = true;
        this.autoScrollForPhysicalRAMEnabled = true;
        this.autoScrollForVirtualRAMEnabled = true;
        this._pathToAssemblyFiles = pathToAssemblyFiles;
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
     * @param pathToLanguageDefinition
     * @param pathToAssemblyFiles
     * @returns 
     */
    public static getInstance(capacityOfMainMemory: number, pathToLanguageDefinition: string, pathToAssemblyFiles: string): SimulationController {
        if (SimulationController._instance === null) {
            SimulationController._instance = new SimulationController(capacityOfMainMemory, pathToLanguageDefinition, pathToAssemblyFiles);
            SimulationController._instance.bootKernel();
        }
        return SimulationController._instance;
    }

    /**
     * This method boots the operating system by loading its data into main memory. The address space,
     * where the operating system is located in memory is sometimes called kernel space.
     */
    private bootKernel(): void {
        // Enter kernel mode.
        this.core.eflags.enterKernelMode();
        // Enable real mode and disable memory virtualization.
        this.core.mmu.disableMemoryVirtualization();

        // Reserve space for interrupt table with 4 entries at 0x40000000 (start of kernel space)
        const numberOfInterrupts = 4;
        const interruptTableLengthInBytes = numberOfInterrupts * DoubleWord.SIZE_IN_BYTES; // 4 entries at 4 bytes each (Doubleword size)
        const startOfKernelSpace = SimulationController.KERNEL_SPACE.lowAddressToDecimal();
        this._physicalAddressSpaceForInterruptTable = new AddressSpace( // TODO use startOfKernelSpace instead of 0xFFFF once assembly supports high addresses
            PhysicalAddress.fromInteger(0x40000000), PhysicalAddress.fromInteger(startOfKernelSpace + interruptTableLengthInBytes))
        // Load kernel code into memory rigth after the interrup table
        const kernelCodeStartAddress = startOfKernelSpace + interruptTableLengthInBytes // 0x40000010
        if (kernelCodeStartAddress != 0x40000010) {
            throw new EvalError("Unexpected begin of OS memory")
        }
        const compiledOS: DoubleWord[] = this._assembler.compile(readFileSync(`${this._pathToAssemblyFiles}/os/os.asm`, "utf-8"), kernelCodeStartAddress)
        disassemble(compiledOS, kernelCodeStartAddress)
        //exit(1)
        for (let i = 0; i < compiledOS.length; i++) {
            this.mainMemory.writeDoublewordTo(PhysicalAddress.fromInteger(kernelCodeStartAddress + i*DoubleWord.SIZE_IN_BYTES), compiledOS[i])
        }
        this._physicalAddressSpaceForInterruptHandlers = new AddressSpace(
            PhysicalAddress.fromInteger(kernelCodeStartAddress), PhysicalAddress.fromInteger(kernelCodeStartAddress + compiledOS.length))
        // Run kernel to fill interrupt table
        this.core.setEIP(Address.fromInteger(kernelCodeStartAddress))
        while (this.core.cycle()) {}
        this.core.setEIP(Address.fromInteger(0))

        /**
         * Write list with available page frames into physical memory.
         * The next lower physical address following the base address of the interrupt table is the highest physical address of the list with
         * available page frames.
         */
        const highestAddressOfListWithAvailablePageFrames: PhysicalAddress = PhysicalAddress.fromInteger(0xFFFFFFFF);
        const baseAddressOfListWithAvailablePageFrames: PhysicalAddress = 
            this.initializeListOfAvailablePageFrames(highestAddressOfListWithAvailablePageFrames);
        /**
         * Write list with used page frame into physical memory.
         * The next lower physical address following the the list with available page frames is the highest address of the list with used page frames.
         */
        const nextLowerAddressFollowingBaseAddressListOfAvailablePageFramesDec: number = parseInt(baseAddressOfListWithAvailablePageFrames.toString(), 2) - 1;
        const highestAddressOfListWithUsedPageFrames: PhysicalAddress = PhysicalAddress.fromInteger(nextLowerAddressFollowingBaseAddressListOfAvailablePageFramesDec);
        this.initializeListOfUsedPageFrames(highestAddressOfListWithUsedPageFrames);
        // Disable real mode and enable memory virtualization.
        this.core.mmu.enableMemoryVirtualization();
        // Exit kernel mode.
        this.core.eflags.enterUserMode();
        return;
    }


    /**
     * This method initializes the list of available page frames and loads it into the physical memory space of the operating system.
     * The list contains physical base addresses page frames, that are not associated with a page. When the Simulator starts, all page frames are available.
     * The list of used page frames is currently not dynamic. This list is always of the same size.
     * Page frames that become unavailable are removed from the list of available page frames by clearing the associated entry to a zero entry. Afterwards, 
     * the page frames base address is added to the list of unavailable page frames by writing it to a zero entry.
     * @param highestPhysicalAddress The highest physical address of the list.
     * @returns The physical base address of the list with available page frames.
     */
    private initializeListOfAvailablePageFrames(highestPhysicalAddress: PhysicalAddress): PhysicalAddress {
        /**
         * Calculate the number of available page frames.
         * This number is calculated by dividing the total number of available physical addresses by the size of a page or page frame.
         * It is specified that page and page frames are the same size.
         * The size depends on the number of bits of a virtual memory address used as an offset.
         * The operating system uses some of the available memory for storing interrupt handlers, system subroutines and more. Therefore,
         * the consumed memory needs to be subtracted from the number of available physical addresses.
         */
        const numberPhysicalAddressesPerPageFrameDec: number = Math.pow(2, MemoryManagementUnit.NUMBER_BITS_OFFSET);
        const availablePhysicalAddressesDec: number = (Math.pow(2, DataSizes.DOUBLEWORD) - SimulationController.KERNEL_SPACE.size);
        const numberOfAvailablePageFrames: number = Math.floor(availablePhysicalAddressesDec/numberPhysicalAddressesPerPageFrameDec);
        // Create a local variable, which represents the physical address of the next list entry to write a page frames base address to.
        let addressOfListEntryDec: number = parseInt(highestPhysicalAddress.toString(), 2);
        // Create a local variable, which represents the physical base address of the page frame.
        let pageFrameBaseAddressDec: number = numberPhysicalAddressesPerPageFrameDec * (numberOfAvailablePageFrames - 1);
        // Loop, until all available page frames have been added to the list.
        for (let i = numberOfAvailablePageFrames - 1; i >= 0; --i) {
            // Increment the physical address of the lists entry to create the next one during the next loop cycle.
            addressOfListEntryDec -= 4;
            // Add page frame base address to the list of availabe page frames.
            this.mainMemory.writeDoublewordTo(
                PhysicalAddress.fromInteger(addressOfListEntryDec), 
                PhysicalAddress.fromInteger(pageFrameBaseAddressDec)
            );
            // Increment page frame base address by the number of physical address per frame.
            pageFrameBaseAddressDec -= numberPhysicalAddressesPerPageFrameDec;
        }
        const baseAddressList: PhysicalAddress = PhysicalAddress.fromInteger(addressOfListEntryDec);
        // Set the boundries for the physical address range of the list with available page frames.
        this._physicalAddressSpaceListOfAvailablePageFrames = new AddressSpace<PhysicalAddress>(
            baseAddressList,
            highestPhysicalAddress
        );
        return baseAddressList;
    }

    /**
     * This method initializes the list of used page frames and loads it into the physical memory space of the operating system.
     * The list contains physical base addresses page frames, that are not associated with a page. When the Simulator starts, all page frames are used.
     * The list of used page frames is currently not dynamic. This list is always of the same size.
     * Page frames that become unavailable are removed from the list of used page frames by clearing the associated entry to a zero entry. Afterwards, 
     * the page frames base address is added to the list of unavailable page frames by writing it to a zero entry.
     * @param highestPhysicalAddress The highest physical address of the list.
     * @returns The physical base address of the list with used page frames.
     */
    private initializeListOfUsedPageFrames(highestPhysicalAddress: PhysicalAddress): PhysicalAddress {
        /**
         * Calculate the number of used page frames.
         * This number is calculated by dividing the total number of available physical addresses by the size of a page or page frame.
         * It is specified that page and page frames are the same size.
         * The size depends on the number of bits of a virtual memory address used as an offset.
         * The operating system uses some of the available memory for storing interrupt handlers, system subroutines and more. Therefore,
         * the consumed memory needs to be subtracted from the number of available physical addresses.
         */
        const numberPhysicalAddressesPerPageFrameDec: number = Math.pow(2, MemoryManagementUnit.NUMBER_BITS_OFFSET);
        const numberTotalAvailablePhysicalAddressesDec: number = Math.pow(2, DataSizes.DOUBLEWORD); // TODO: Use variable!
        const numberOfAvailablePageFrames: number = Math.floor((numberTotalAvailablePhysicalAddressesDec - SimulationController.KERNEL_SPACE.size)/numberPhysicalAddressesPerPageFrameDec);
        // Create a local variable, which represents the physical address of the next list entry to write a page frames base address to.
        let addressOfListEntryDec: number = parseInt(highestPhysicalAddress.toString(), 2) - 4;
        // Loop, until all available page frames have been added to the list.
        for (let i = numberOfAvailablePageFrames - 1; i >= 0; --i) {
            // Add page frame base address to the list of availabe page frames.
            // TODO: Find better solution!
            // this.mainMemory.writeDoublewordTo(
            //     PhysicalAddress.fromInteger(addressOfListEntryDec), 
            //     new Doubleword()
            // );
            // Increment the physical address of the lists entry to create the next one during the next loop cycle.
            addressOfListEntryDec -= 4;
        }
        const baseAddressList: PhysicalAddress = PhysicalAddress.fromInteger(addressOfListEntryDec);
        // Set the boundries for the physical address range of the list with available page frames.
        this._physicalAddressSpaceListOfUsedPageFrames = new AddressSpace<PhysicalAddress>(
            baseAddressList,
            highestPhysicalAddress
        );
        return baseAddressList;
    }

    /**
     * This method is used to initialize a process and prepare its execution.
     * @param pathToProgramCode 
     * @returns 
     */
    public bootProcess(pathToProgramCode: string): void {
        // Enable kernel mode.
        this.core.eflags.enterKernelMode();
        // Enable real mode and disable memory virtualization. Safetyguard.
        this.core.mmu.disableMemoryVirtualization();
        // Read the program code.
        const fileContents: string = readFileSync(pathToProgramCode, "utf-8");
        // Compile the program code.
        const compiledProgram: Array<DoubleWord> = this._assembler.compile(fileContents);
        // -> TODO: Create process control block.
        /**
         * Retrieve the size of the compiled program. The program code is loaded to a specific 
         * location in a virtual address space that is exclusively assigned to the process to 
         * be created. The code will be loaded into the lowest section of this virtual address
         * space. The first instruction of the program will be loaded into the lowest available
         * address (the binary zero). A single instruction consists out of three doubleword sized 
         * binary values. The first binary value represents the encoded instruction, its operation, 
         * operand types and their addressing modes. The second and third doubleword represents the
         * operands binary encoded values. The working memory defined here can store a single 
         * byte at each address. To calculate the number of addresses required to store a series 
         * of instructions, the size of the compiled program must be multiplied by the number of 
         * bits that make up a double word. This value is divided by the number of bits that make 
         * up a byte value to calculate the number of addresses required to write the compiled 
         * assembler program to memory.
         */
        const numberAddressesNeededForCompiledProgram: number = 
            (compiledProgram.length * DataSizes.DOUBLEWORD)/DataSizes.BYTE - 1;
        // Set lowest and highest virtual memory address, which will be used for storing the compiled program.
        this._virtualAddressSpaceCodeSegment = new AddressSpace<VirtualAddress>(
            VirtualAddress.fromInteger(0),
            VirtualAddress.fromInteger(numberAddressesNeededForCompiledProgram)
        );
        // Calculate some important values.
        const pageFrameSizeBytesDec: number = Math.pow(2, MemoryManagementUnit.NUMBER_BITS_OFFSET);
        const pageSizeBytesDec: number = Math.pow(2, MemoryManagementUnit.NUMBER_BITS_OFFSET);
        /*
         * In order to map the kernel space into the virtual address space of a process 
         * a page table needs to be created that maps high virtual memory addresses to 
         * the kernel space. The page table itself is written to the kernel space.
         */
        this.initializePageTable(
            this._physicalAddressSpaceListOfUsedPageFrames!.lowAddress,
            pageSizeBytesDec,
            pageFrameSizeBytesDec
        );
        // Disable real mode and enable memory virtualization. Safetyguard.
        this.core.mmu.enableMemoryVirtualization();
        
        // This line is commented since the OS now sets the initial esp address
        //this.core.esp.content = VirtualAddress.fromInteger(parseInt(this.core.ptp.content.toString(), 2) - 4);
        
        // Disable kernel mode.
        this.core.eflags.enterUserMode();
        // Load compiled program into virtual address space starting at the lowest possible address.
        this.loadProgramm(compiledProgram, 0);
        return;
    }

    /**
     * This method initializes the page table for a process.
     * @param highestPhysicalAddress The highest physical address of the page table.
     * @param pageSizeBytesDec The size (in bytes) or number of addresses per page.
     * @param pageFrameSizeBytesDec The size (in bytes) or number of addresses per page frame.
     */
    private initializePageTable(highestPhysicalAddress: PhysicalAddress, pageSizeBytesDec: number, pageFrameSizeBytesDec: number): void {
        /*
         * Create the page table entries.
         * The page table is not shared between processes. The table is unique to a process. 
         * Each table is located and maintained in kernel space. To read the table, a process 
         * needs access to it. Since the process has its own virtual address space, the kernel 
         * space should be mapped to this virtual space. To achieve this, the page table must 
         * contain entries that map the highest virtual memory addresses to the kernel space. 
         * The kernel space is located at the highest 1 GiB in physical memory. The mapped kernel
         * space needs to be write protected.
         */
        /*
         * There are three kind of addresses, we need to consider:
         * 1. The physical address of the page table entry, we want to create.
         * 2. The virtual address of the page, we want to create an entry in the page table for.
         * 3. The physical address of the page frame, we want to associate to a page.
         */
        const pageTable: Array<PageTableEntry> = new Array<PageTableEntry>();
        let virtualAddressOfCurrentPage: VirtualAddress = VirtualAddress.fromInteger(0);
        let physicalAddressOfCurrentPageFrame: PhysicalAddress = PhysicalAddress.fromInteger(0);
        // Calculate the total number of pages.
        const totalNumberOfPageTableEntries: number = Math.pow(2, MemoryManagementUnit.NUMBER_BITS_PAGE_ADDRESS); // 2^20
        let numberOfPageTableEntriesCreated = 0;
        // Create the page table entries.
        while (numberOfPageTableEntriesCreated < totalNumberOfPageTableEntries) {
            if (numberOfPageTableEntriesCreated > 0) {
                const physicalAddressOfCurrentPageFrameDec: number = physicalAddressOfCurrentPageFrame.toUnsignedNumber();
                physicalAddressOfCurrentPageFrame = PhysicalAddress.fromInteger(physicalAddressOfCurrentPageFrameDec + pageFrameSizeBytesDec);
                const virtualAddressOfCurrentPageDec: number = virtualAddressOfCurrentPage.toUnsignedNumber();
                virtualAddressOfCurrentPage = VirtualAddress.fromInteger(virtualAddressOfCurrentPageDec + pageSizeBytesDec);
            }
            let pageTableEntry: PageTableEntry;
            let presentFlag = false;
            let writableFlag = false;
            let executableFlag = false;
            let accessibleOnlyInKernelModeFlag = false;
            let changedFlag = false;
            let pinnedFlag = true;
            if (SimulationController.KERNEL_SPACE.inRange(virtualAddressOfCurrentPage)) {
                /**
                 * This is the part of the virtual address space, where the kernel space is mapped to.
                 * The kernel space can only be accessed in kernel mode and is read-only. Some parts of
                 * the kernel space are executable, other not.
                 */
                presentFlag = true;
                if (
                    this._physicalAddressSpaceForInterruptHandlers!.inRange(virtualAddressOfCurrentPage)
                    // -> TODO: If there are system functions, the following code needs to be commented out.
                    // || this._physicalAddressSpaceForSystemFunctions.inRange(virtualAddressOfCurrentPage)
                ) {
                    writableFlag = false;
                    executableFlag = true;
                } else if ( this._physicalAddressSpaceForInterruptTable!.inRange(virtualAddressOfCurrentPage)) {
                    writableFlag = false;
                    executableFlag = false;
                } else {
                    writableFlag = true;
                    executableFlag = false;
                }
                accessibleOnlyInKernelModeFlag = true;
                changedFlag = false;
                pinnedFlag = true;
                pageTableEntry = new PageTableEntry(
                    this.createPageFlagBits(
                        presentFlag, 
                        writableFlag, 
                        executableFlag, 
                        accessibleOnlyInKernelModeFlag, 
                        changedFlag, 
                        pinnedFlag
                    ),
                    physicalAddressOfCurrentPageFrame.getMostSignificantBits(MemoryManagementUnit.NUMBER_BITS_PAGE_FRAME_ADDRESS)
                );
            } else if (this._virtualAddressSpaceCodeSegment!.inRange(virtualAddressOfCurrentPage)) {
                /**
                 * This is the part of the virtual address space, where the CODE segment resides.
                 * All binary values in here are treated as instructions. Instructions can be
                 * executed. This segment is read-only.
                 */
                presentFlag = true;
                writableFlag = false;
                executableFlag = true;
                accessibleOnlyInKernelModeFlag = false;
                changedFlag = false;
                pinnedFlag = true;
                pageTableEntry = new PageTableEntry(
                    this.createPageFlagBits(
                        presentFlag, 
                        writableFlag, 
                        executableFlag, 
                        accessibleOnlyInKernelModeFlag, 
                        changedFlag, 
                        pinnedFlag
                    ),
                    physicalAddressOfCurrentPageFrame.getMostSignificantBits(MemoryManagementUnit.NUMBER_BITS_PAGE_FRAME_ADDRESS)
                );
            } else {
                /**
                 * This is the part of the virtual address space, where the STACK segment resides.
                 * All binary values in here are treated as numerical values. These values are not
                 * executable, but can be overwritten.
                 */
                presentFlag = true;
                writableFlag = true;
                executableFlag = false;
                accessibleOnlyInKernelModeFlag = false;
                changedFlag = false;
                pinnedFlag = true;
                pageTableEntry = new PageTableEntry(
                    this.createPageFlagBits(
                        presentFlag, 
                        writableFlag, 
                        executableFlag, 
                        accessibleOnlyInKernelModeFlag, 
                        changedFlag, 
                        pinnedFlag
                    ),
                    physicalAddressOfCurrentPageFrame.getMostSignificantBits(MemoryManagementUnit.NUMBER_BITS_PAGE_FRAME_ADDRESS)
                );
            }
            pageTable.push(pageTableEntry);
            ++numberOfPageTableEntriesCreated;
        }
        let physicalAddressOfCurrentPageTableEntryDec: number = parseInt(highestPhysicalAddress.toString(), 2);
        for (const entry of Array.from(pageTable).reverse()) {
            physicalAddressOfCurrentPageTableEntryDec -= 4;
            this.mainMemory.writeDoublewordTo(
                PhysicalAddress.fromInteger(physicalAddressOfCurrentPageTableEntryDec), 
                entry.toDoubleword()
            );
        }
        /**
         * Point PTP register to base address of the page table.
         * As the kernel space is mapped into the virtual address space of a process, the physical 
         * address corresponds to the virtual address of the page table.
         */
        this.core.ptp.content = PhysicalAddress.fromInteger(physicalAddressOfCurrentPageTableEntryDec);
        return;
    }

    /**
     * This method triggers execution of the next instruction of a loaded programm.
     * @returns True, if the cycle was performed normally and false, if the cycle could not be performed because the programm has ended.
     */
    public cycle(): boolean {
        let resultOfCycle = false;
        try {
            resultOfCycle = this.core.cycle();
        } catch(error) {
            console.log(error)
            if (error instanceof PageFaultError) {
                /**
                 * Load the address of the page table entry into the EAX tab for 
                 * which a page frame is to be found.
                 */
                this.core.eax.content = error.addressOfPageTableEntry;
                // Load physical base address of list with available page frames into EBX register.
                this.core.ebx.content = this._physicalAddressSpaceListOfAvailablePageFrames!.lowAddress;
                // Load phyiscal base address of list with used page frames into ECX register.
                this.core.ecx.content = this._physicalAddressSpaceListOfUsedPageFrames!.lowAddress;
                // Call interrupt handler.
                this.core.int(new InstructionOperand(
                    EncodedAddressingModes.DIRECT,
                    EncodedOperandTypes.IMMEDIATE,
                    DoubleWord.fromInteger(1)
                ));
                // Retry instruction.
                resultOfCycle = this.core.cycle();
            } else {
                // Load error code into EAX register.
                this.core.eax.content = DoubleWord.fromInteger(-1);
                /**
                 * Call the first interrupt handler, as this interrupt handler suspends the process,
                 * which caused this error.
                 */
                this.core.int(new InstructionOperand(
                    EncodedAddressingModes.DIRECT,
                    EncodedOperandTypes.IMMEDIATE,
                    DoubleWord.fromInteger(0)
                ));
            }
            // Rethrow error and pass it to the next higher instance (main.ts).
            // throw error;
        }
        return resultOfCycle;
    }

    /**
     * This method loads the given and compiled assembly program into the main memory based on 
     * the given base address.
     * @param compiledProgram The compiled assembly program.
     * @param [virtualBaseAddressDec=0] The virtual base address of the program in decimal representation.
     * @throws — {PrivilegeViolationError} If the page frame associated with this page is not accessable in user mode.
     * @throws — {PageFrameNotExecutableError} If the page frame associated with this page is not executable.
     * @throws — {PageFrameNotWritableError} If the page frame associated with this page is not writable.
     */
    public loadProgramm(compiledProgram: Array<DoubleWord>, virtualBaseAddressDec = 0): void {
        // Enter kernel mode in order to ignore the write-protection for the CODE segment.
        this.core.eflags.enterKernelMode();
        // Load compiled programm into main memory.
        let currentAddressDec: number = virtualBaseAddressDec;
        for (const binaryValue of compiledProgram) {
            const virtualAddress: VirtualAddress = VirtualAddress.fromInteger(currentAddressDec);
            try {
                this.core.mmu.writeDoublewordTo(virtualAddress, binaryValue, true);
            } catch (error) {
                if (error instanceof PageFaultError) {
                    /**
                     * Load the address of the page table entry into the EAX tab for 
                     * which a page frame is to be found.
                     */
                    this.core.eax.content = error.addressOfPageTableEntry;
                    // Load physical base address of list with available page frames into EBX register.
                    this.core.ebx.content = this._physicalAddressSpaceListOfAvailablePageFrames!.lowAddress;
                    // Load phyiscal base address of list with used page frames into ECX register.
                    this.core.ecx.content = this._physicalAddressSpaceListOfUsedPageFrames!.lowAddress;
                    // Call interrupt handler.
                    this.core.int(new InstructionOperand(
                        EncodedAddressingModes.DIRECT,
                        EncodedOperandTypes.IMMEDIATE,
                        DoubleWord.fromInteger(1)
                    ));
                    // Retry to write to address.
                    this.core.mmu.writeDoublewordTo(virtualAddress, binaryValue, true);
                } else {
                    throw error;
                }
            }
            currentAddressDec += 4;
        }
        // Reset the instruction pointer.
        this.core.eip.content = VirtualAddress.fromInteger(virtualBaseAddressDec);        
        this._programmLoaded = true;
        // Exit kernel mode.
        this.core.eflags.enterUserMode();
        return;
    }

    /**
     * This method creates the flag bits for a new page.
     * @param present This flag indicates whether the page is currently mounted to a page frame.
     * @param writable This flag indicates whether the page is writable or read-only.
     * @param executable This flag indicates whether the page is executable or not.
     * @param accessableOnlyInKernelMode This flag indicates whether the page can only be accessed in kernel mode.
     * @param changed This flag indicates whether the page was changed since it was mounted to a page frame.
     * @param pinned This flag indicates whether the page is protected against attempts to write it to a background memory.
     * @returns 
     */
    private createPageFlagBits(
        present: boolean,
        writable: boolean,
        executable: boolean,
        accessableOnlyInKernelMode: boolean,
        changed: boolean,
        pinned: boolean
    ): Array<Bit> {
        const flagBits: Array<Bit> = new Array<Bit>(MemoryManagementUnit.NUMBER_FLAG_BITS).fill(0);
        flagBits[MemoryManagementUnit.PRESENT_FLAG_INDEX] = (present) ? 1 : 0;
        flagBits[MemoryManagementUnit.WRITABLE_FLAG_INDEX] = (writable) ? 1 : 0;
        flagBits[MemoryManagementUnit.EXECUTABLE_FLAG_INDEX] = (executable) ? 1 : 0;
        flagBits[MemoryManagementUnit.ACCESSABLE_ONLY_IN_KERNEL_MODE_FLAG_INDEX] = (accessableOnlyInKernelMode) ? 1 : 0;
        flagBits[MemoryManagementUnit.PINNED_FLAG_INDEX] = 1; // TODO: The given argument pinned is currently ignored because there is no background memory.
        flagBits[MemoryManagementUnit.CHANGED_FLAG_INDEX] = (changed) ? 1 : 0;
        // All other bits are currently unused.
        return flagBits;
    }
}