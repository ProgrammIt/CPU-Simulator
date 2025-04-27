import { Bit } from "../../binary_types/Bit";
import { Byte } from "../../binary_types/Byte";
import { DataSizes } from "../../enumerations/DataSizes";
import { DoubleWord } from "../../binary_types/DoubleWord";
import { PageFaultError } from "../../error_types/PageFaultError";
import { PageFrameNotExecutableError } from "../../error_types/PageFrameNotExecutableError";
import { PageFrameNotWritableError } from "../../error_types/PageFrameNotWritableError";
import { PrivilegeViolationError } from "../../error_types/PrivilegeViolationError";
import { PageTableEntry } from "../../binary_types/PageTableEntry";
import { PhysicalAddress } from "../../binary_types/PhysicalAddress";
import { VirtualAddress } from "../../binary_types/VirtualAddress";
import { EFLAGS } from "../functional_units/EFLAGS";
import { PointerRegister } from "../functional_units/PointerRegister";
import { RAM } from "../functional_units/RAM";
import { TranslationLookasideBuffer } from "../functional_units/TranslationLookasideBuffer";
import { ArithmeticLogicUnit } from "./ArithmeticLogicUnit";

/**
 * This class represents a Memory Management Unit (MMU). This specialized execution unit is responsible
 * for translating virtual memory addresses into physical memory addresses.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class MemoryManagementUnit {
    /**
     * This class member stores the number of bits used for the offset in pages and page frames.
     * @readonly
     */
    public static readonly NUMBER_BITS_OFFSET: number = 12;

    /**
     * This class member stores the number of bits used for the page table entries flag bits.
     * @readonly
     */
    public static readonly NUMBER_FLAG_BITS: number = 12;

    /**
     * This class member stores the number of bits representing the page number.
     * The page number can be extracted from a virtual memory address by removing the offset bits from the right.
     * @readonly
     */
    public static readonly NUMBER_BITS_PAGE_ADDRESS: number = DataSizes.DOUBLEWORD - MemoryManagementUnit.NUMBER_BITS_OFFSET;

    /**
     * This class member stores the number of bits representing the page frame number.
     * The page frame number can be extracted from a phyiscal memory address by removing the offset bits from the right.
     * @readonly
     */
    public static readonly NUMBER_BITS_PAGE_FRAME_ADDRESS: number = MemoryManagementUnit.NUMBER_BITS_PAGE_ADDRESS;

    /**
     * This class member stores the index of the present flag bit.
     * @readonly
     */
    public static readonly PRESENT_FLAG_INDEX: number = 0;

    /**
     * This class member stores the index of the writable flag bit.
     * @readonly
     */
    public static readonly WRITABLE_FLAG_INDEX: number = 1;

    /**
     * This class member stores the index of the executable flag bit.
     * @readonly
     */
    public static readonly EXECUTABLE_FLAG_INDEX: number = 2;

    /**
     * This class member stores the index of the flag bit, which indicates whether a page frame can be accessed
     * only on kernel mode.
     * @readonly
     */
    public static readonly ACCESSABLE_ONLY_IN_KERNEL_MODE_FLAG_INDEX: number = 3;

    /**
     * This class member stores the index of the pinned flag bit.
     * @readonly
     */
    public static readonly PINNED_FLAG_INDEX: number = 4;

    /**
     * This class member stores the index of the changed flag bit.
     * @readonly
     */
    public static readonly CHANGED_FLAG_INDEX: number = 5;

    /**
     * This member stores a reference to the Translation Lookaside Buffer.
     * @readonly
     */
    private readonly _tlb: TranslationLookasideBuffer;

    /**
     * This member stores a reference to the Page Table Pointer register of the CPU core, this MMU
     * instance is associated with.
     * @readonly
     */
    private readonly _ptp: PointerRegister;

    /**
     * This member stores a reference to the main memory.
     * @readonly
     */
    private readonly _mainMemory: RAM;

    /**
     * This member stores a reference to the status register (EFLAGS) of the CPU core, this MMU
     * instance is associated with.
     * @readonly
     */
    private readonly _flags: EFLAGS;

    /**
     * This member indicates whether memory virtualization is enabled.
     */
    private _memoryVirtualizationEnabled: boolean;

    /**
     * Constructs a new instance from the given references of the RAM, Page Table Pointer (PTP) register, the ALU and the EFLAGS register.
     * @param mainMemory A reference to the main memory of this computer system.
     * @param ptp A reference to the Page Table Pointer of the CPU core, this MMU is associated with.
     * @param alu A reference to the ALU of the CPU core, this MMU is associated with.
     * @param eflags A reference to the EFLAGS register of the CPU core, this MMU is associated with.
     * @constructor
     */
    public constructor(mainMemory: RAM, ptp: PointerRegister, alu: ArithmeticLogicUnit, eflags: EFLAGS) {
        this._tlb = new TranslationLookasideBuffer(64);
        this._memoryVirtualizationEnabled = false;
        this._mainMemory = mainMemory;
        this._ptp = ptp;
        this._flags = eflags;
    }

    /**
     * This method enables memory virtualization.
     */
    public enableMemoryVirtualization() {
        this._memoryVirtualizationEnabled = true;
    }

    /**
     * This method disables memory virtualization.
     */
    public disableMemoryVirtualization() {
        this._memoryVirtualizationEnabled = false;
    }

    /**
     * This methods writes a doubleword (4-byte) value to memory to the specified memory address.
     * @param physicalAddress A binary virtual memory address to write the doubleword-sized data to.
     * @param doubleword Doubleword-sized data to write.
     * @throws {PageFaultError} If the page the given virtual address is part of, is currently not associated with a page frame.
     * @throws {PrivilegeViolationError} If the page frame associated with this page is not accessable in user mode.
     * @throws {PageFrameNotExecutableError} If the page frame associated with this page is not executable.
     * @throws {PageFrameNotWritableError} If the page frame associated with this page is not writable.
     */
    public writeDoublewordTo(virtualAddress: VirtualAddress, doubleword: DoubleWord, attemptsToExecute: boolean): void {
        const physicalAddress: PhysicalAddress = this.translate(virtualAddress, true, attemptsToExecute);
        this._mainMemory.writeDoublewordTo(physicalAddress, doubleword);
        return;
    }

    /**
     * This method reads doubleword sized data from the main memory starting at the specified physical memory address.
     * @param virtualAddress A binary virtual memory address to read the doubleword-sized data from.
     * @param attemptsToExecute Whether the reading process attempts to execute the content to read.
     * @throws {PageFaultError} If the page the given virtual address is part of, is currently not associated with a page frame.
     * @throws {PrivilegeViolationError} If the page frame associated with this page is not accessable in user mode.
     * @throws {PageFrameNotExecutableError} If the page frame associated with this page is not executable.
     * @throws {PageFrameNotWritableError} If the page frame associated with this page is not writable.
     * @returns Doubleword-sized binary data.
     */
    public readDoublewordFrom(virtualAddress: VirtualAddress, attemptsToExecute: boolean): DoubleWord {
        const physicalAddress: PhysicalAddress = this.translate(virtualAddress, false, attemptsToExecute);
        return this._mainMemory.readDoublewordFrom(physicalAddress);
    }

    /**
     * This method writes a specified byte of data to the specified address in
     * in the main memory. Throws an error, if the data exeeds a byte.
     * @param virtualAddress A binary value representing a virtual memory address to write the data to.
     * @param data Byte-sized data to write to the specified pyhsical memory address.
     * @throws {PageFaultError} If the page the given virtual address is part of, is currently not associated with a page frame.
     * @throws {PrivilegeViolationError} If the page frame associated with this page is not accessable in user mode.
     * @throws {PageFrameNotExecutableError} If the page frame associated with this page is not executable.
     * @throws {PageFrameNotWritableError} If the page frame associated with this page is not writable.
     */
    public writeByteTo(virtualAddress: VirtualAddress, data: Byte): void {
        const physicalAddress: PhysicalAddress = this.translate(virtualAddress, true, false);
        this._mainMemory.writeByteTo(physicalAddress, data);
        return;
    }

    /**
     * This method tries to read a byte from the specified memory address.
     * Returns a binary zero for address not conatined in the
     * map in order to simulate a full size memory.
     * @param virtualAddress A binary value representing a virtual memory address to write the data to.
     * @throws {PageFaultError} If the page the given virtual address is part of, is currently not associated with a page frame.
     * @throws {PrivilegeViolationError} If the page frame associated with this page is not accessable in user mode.
     * @throws {PageFrameNotExecutableError} If the page frame associated with this page is not executable.
     * @throws {PageFrameNotWritableError} If the page frame associated with this page is not writable.
     * @returns The byte of data found at the specified address.
     */
    public readByteFrom(virtualAddress: VirtualAddress): Byte {
        /**
         * Translate virtual memory address into physical memory address.
         * As one single byte can not be executed, the parameter, which indicats whether the process
         * wants to execute the retrieved binary value, is set to false.
         */
        const physicalAddress: PhysicalAddress = this.translate(virtualAddress, false, false);
        // Read byte from main memory.
        return this._mainMemory.readByteFrom(physicalAddress);
    }

    /**
     * This method clears all bits at the specified locations, depending on the given number of bytes.
     * @param virtualAddress The virtual address to clear all bits at.
     * @param length The number of bytes to clear, starting at the given physical address.
     * @throws {PageFaultError} If the page the given virtual address is part of, is currently not associated with a page frame.
     * @throws {PrivilegeViolationError} If the page frame associated with this page is not accessable in user mode.
     * @throws {PageFrameNotExecutableError} If the page frame associated with this page is not executable.
     * @throws {PageFrameNotWritableError} If the page frame associated with this page is not writable.
     */
    public clearMemory(virtualAddress: VirtualAddress, length: DataSizes): void {
        // The first virtual memory address to translate and to clear all bits at.
        const startVirtualAddress: number = parseInt(virtualAddress.toString(), 2);
        // Calculate the number of cells, which should get cleared.
        const numberOfCellsToClear : number = length/DataSizes.BYTE;
        for (let i = 0; i < numberOfCellsToClear; ++i) {
            // Create virtual memory address from 
            let currentVirtualAddress: VirtualAddress = VirtualAddress.fromInteger(startVirtualAddress + i);
            /**
             * Translate virtual memory address to physical memory address.
             * As this method attempts to clear all bits at the specified address, the corresponding parameter is set to true.
             */
            let physicalAddress: PhysicalAddress | null = this.translate(currentVirtualAddress, true, false);
            // Clear all bits at the resulting physical memory address.
            this._mainMemory.clearByte(physicalAddress);
        }
    }

    /**
     * This method translates a given virtual memory address to an associated physical memory address according to the TLB or NPT.
     * If the virtual address was not translated recently and its associated physical address is not present in the TLB, the page 
     * table is searched for the virtual address. 
     * @param virtualAddress A binary value representing a virtual memory address.
     * @param attemptsToWrite Indicates whether the process attempts to execute the data located at the page frame associated with the given virtual address.
     * @param attemptsToExecute Indicates whether the process attempts to write data to the page frame associated with the given virtual address.
     * @throws {PageFaultError} If the page the given virtual address is part of, is currently not associated with a page frame.
     * @throws {PrivilegeViolationError} If the page frame associated with this page is not accessable in user mode.
     * @throws {PageFrameNotExecutableError} If the page frame associated with this page is not executable.
     * @throws {PageFrameNotWritableError} If the page frame associated with this page is not writable.
     * @returns The physical memory address associated with the given virtual address.
     */
    private translate(virtualAddress: VirtualAddress, attemptsToWrite: boolean, attemptsToExecute: boolean): PhysicalAddress {
        if (!this._memoryVirtualizationEnabled) {
            return virtualAddress;
        }
        var pageTableEntry: PageTableEntry;
        if (this._tlb.has(virtualAddress)) {
            pageTableEntry = this._tlb.get(virtualAddress)!;
        } else {
            pageTableEntry = this.searchPageTable(virtualAddress);
        }
        // Check if a page frame is connected to the page to which the specified virtual address refers.
        if (!pageTableEntry.isPresent()) {
            // There is currently no page frame associated with the page.
            throw new PageFaultError(
                `The page associated with the virtual memory address ${virtualAddress} is currently not present.`,
                pageTableEntry.flagBits,
                new PhysicalAddress(virtualAddress
                    .getMostSignificantBits(MemoryManagementUnit.NUMBER_BITS_PAGE_FRAME_ADDRESS)
                    .concat(new Array<Bit>(MemoryManagementUnit.NUMBER_BITS_OFFSET).fill(0))
                )
            );
        }
        // Check if the page frame is accessable only in kernel mode.
        if (pageTableEntry.isAccessableOnlyInKernelMode() && !this._flags.isInKernelMode()) {
            throw new PrivilegeViolationError("Process tries to access a page frame, which is accessible only in kernel mode.");
        }
        // Check if the page frames contents are executable.
        if (attemptsToExecute && !pageTableEntry.isExecutable()) {
            throw new PageFrameNotExecutableError("The process tries to execute a page frames contents that are marked as not executable.");
        }
        // Check if the page frames contents are writable.
        if (attemptsToWrite && (!this._flags.isInKernelMode() && !pageTableEntry.isWritable())) {
            throw new PageFrameNotWritableError("The process tries to write to a page frame, which is marked as read-only.");
        }
        if (attemptsToWrite) {
            // Set changed flag bit.
            pageTableEntry.setChangedFlag();
            // Copy the flag bits.
            const tmpFlagBits = pageTableEntry.flagBits.slice();
            // Update flag bits of page table entry in memory as well.
            this._mainMemory.writeDoublewordTo(virtualAddress, new DoubleWord(tmpFlagBits.concat(pageTableEntry.frameNbr)));
        }
        // Page frame is present and operation is permitted.
        // Create a valid physical memory address from the page frame number and the offset extracted from the given virtual memory address.
        var physicalAddress: PhysicalAddress = new PhysicalAddress(
            pageTableEntry.frameNbr.concat(virtualAddress.getLeastSignificantBits(MemoryManagementUnit.NUMBER_BITS_OFFSET))
        );
        // Update or insert the physical memory address into the Translation Lookaside Buffer.
        this._tlb.insert([virtualAddress, pageTableEntry]);
        return physicalAddress;
    }

    /**
     * This method computes the physical address of the page table entry, which is associated with the given virtual address.
     * The page table entry is located at a specific physical address, which is calculated by adding the page number to the page tables base address.
     * @param virtualAddress The virtual address to compute the physical address of the page table entry for.
     * @returns The physical address of the page table entry.
     */
    private calcPhysicalAddressOfPageTableEntry(virtualAddress: VirtualAddress): PhysicalAddress {
        // Extract the page number from the given virtual address, which represents the index in the page table where the entry is located.
        const pageNbr: Array<Bit> = virtualAddress.getMostSignificantBits(MemoryManagementUnit.NUMBER_BITS_PAGE_ADDRESS);
        const pageNbrDec: number = parseInt(pageNbr.toString(), 2) * 4;
        // Read the page table base address from the page table pointer register and convert it to a decimal value.
        const pageTableBaseAddressDec: number = parseInt(this._ptp.content.toString(), 2);
        /* 
         * Add the result to the physical page table base address to get the address of the page table entry.
         * Because every page table entry is 4 bytes long, the page number needs to be multiplied by 4 before 
         * adding it to the page tables base address.
         */
        return PhysicalAddress.fromInteger(pageTableBaseAddressDec + pageNbrDec);
    }

    /**
     * This method searches the page table for a specific entry. To do this, the page number and an offset are 
     * extracted from the given virtual address. The page number is filled with zero bits on the right. The offset 
     * is discarded as part of this method. The padded page number is added to the physical base address of the 
     * page table. The entry you are looking for is located at the resulting physical address. This entry corresponds 
     * to the page to which the given virtual memory address is assigned. The page table entry includes some status 
     * bits and possibly the physical base address of a page frame.
     * @param virtualAddress The virtual memory address to look up in the page table.
     * @returns The page table entry.
     */
    private searchPageTable(virtualAddress: VirtualAddress): PageTableEntry {
        const wasInKernelMode: boolean = this._flags.isInKernelMode();
        // Enter kernel mode in order to be able to search the page table.
        this._flags.enterKernelMode();
        // Compute the physical address, where the page table resides in the page table.
        const addressOfPageTableEntry: PhysicalAddress = this.calcPhysicalAddressOfPageTableEntry(virtualAddress);
        // Read page table entry from memory.
        const contentOfPageTableEntry: DoubleWord = this._mainMemory.readDoublewordFrom(addressOfPageTableEntry);
        // Create object from this content.
        const pageTableEntry: PageTableEntry = new PageTableEntry(
            contentOfPageTableEntry.value.slice(0, MemoryManagementUnit.NUMBER_FLAG_BITS),
            contentOfPageTableEntry.value.slice(-MemoryManagementUnit.NUMBER_BITS_PAGE_FRAME_ADDRESS)
        );
        if (!wasInKernelMode) {
            // Enter user mode.
            this._flags.enterUserMode();
        }
        return pageTableEntry;
    }
}