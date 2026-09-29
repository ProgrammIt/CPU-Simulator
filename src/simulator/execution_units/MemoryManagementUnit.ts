import { Byte } from "../../types/binary/Byte";
import { DoubleWord } from "../../types/binary/DoubleWord";
import { PageTableEntry } from "../../types/binary/PageTableEntry";
import { TranslationLookasideBuffer } from "../functional_units/TranslationLookasideBuffer";
import { CPUCore } from "./CPUCore";
import { InterruptNumbers } from "../../types/enumerations/InterruptNumbers";
import { ExceptionError } from "../../types/errors/ExceptionError";
import { PageNumber } from "../../types/binary/PageNumber";
import { PageTableEntryFlags } from "../../types/binary/PageTableEntryFlags";
import { VirtualAddress } from "../../types/binary/VirtualAddress";
import { PhysicalAddress } from "../../types/binary/PhysicalAddress";
import { FrameNumber } from "../../types/binary/FrameNumber";

interface memoryMapEntry {
        pageTableId: number;
        pageNumber: number;
}

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
    private readonly _tlb: TranslationLookasideBuffer = new TranslationLookasideBuffer();

    /**
     * This member stores a reference to the Page Table Pointer register of the CPU core, this MMU
     * instance is associated with.
     * @readonly
     */
    private readonly _cpu: CPUCore;

    /**
     * This member indicates whether memory virtualization is enabled.
     */
    private _memoryVirtualizationEnabled: boolean = false;

    public pageFaultAddress: DoubleWord | undefined = undefined;

    /**
     * This array stores a mapping between the physical frame number and virtual page numbers along with the associated pid.
     * Each entry is an array of objects. The Entries are only populated if a vpn is mapped to that frame number.
     * {
     *  pageTableId: number
     *  pageNumber: number
     * }
     */
    public reverseMemoryMap: memoryMapEntry[][] = [];

    /**
     * Constructs a new instance from the given references of the RAM, Page Table Pointer (PTP) register, the ALU and the EFLAGS register.
     * @param cpu A reference to the cpu.
     */
    public constructor(cpu: CPUCore) {
        this._cpu = cpu;
    }

    /**
     * This method retruns if memory virtualization is enabled 1 = eabled | 0 = disabled.
     * @returns
     */
    public isMemoryVirtualizationEnabled(): number {
        return this._memoryVirtualizationEnabled ? 1 : 0;
    }

    /**
     * This method enables memory virtualization.
     */
    public enableMemoryVirtualization(): void {
        this._memoryVirtualizationEnabled = true;
    }

    /**
     * This method disables memory virtualization.
     */
    public disableMemoryVirtualization(): void {
        this._memoryVirtualizationEnabled = false;
    }

    /**
     * This method invalidates the TLB.
     */
    public invalidateTLB(): void {
        this._tlb.clear();
    }

    /**
     * This methods writes a doubleword (4-byte) value to memory to the specified memory address.
     * @param virtualAddress A binary virtual memory address to write the doubleword-sized data to.
     * @param doubleword Doubleword-sized data to write.
     * @param attemptsToExecute 
     * @throws {ExceptionError} If an exception was generated
     */
    public writeDoublewordTo(virtualAddress: VirtualAddress, doubleword: DoubleWord, attemptsToExecute: boolean): void {
        const physicalAddress: PhysicalAddress = this.translate(virtualAddress, true, attemptsToExecute);
        this._cpu.mainMemory.writeDoubleWordTo(physicalAddress, doubleword);
    }

    /**
     * This method reads doubleword sized data from the main memory starting at the specified physical memory address.
     * @param virtualAddress A binary virtual memory address to read the doubleword-sized data from.
     * @param attemptsToExecute Whether the reading process attempts to execute the content to read.
     * @throws {ExceptionError} If an exception was generated
     * @returns Doubleword-sized binary data.
     */
    public readDoublewordFrom(virtualAddress: VirtualAddress, attemptsToExecute: boolean): DoubleWord {
        const physicalAddress: PhysicalAddress = this.translate(virtualAddress, false, attemptsToExecute);
        return this._cpu.mainMemory.readDoublewordFrom(physicalAddress);
    }

    /**
     * This method writes a specified byte of data to the specified address in
     * in the main memory. Throws an error, if the data exeeds a byte.
     * @param virtualAddress A binary value representing a virtual memory address to write the data to.
     * @param data Byte-sized data to write to the specified pyhsical memory address.
     * @throws {ExceptionError} If an exception was generated
     */
    public writeByteTo(virtualAddress: VirtualAddress, data: Byte): void {
        const physicalAddress: PhysicalAddress = this.translate(virtualAddress, true, false);
        this._cpu.mainMemory.writeByteTo(physicalAddress, data);
    }

    /**
     * This method tries to read a byte from the specified memory address.
     * Returns a binary zero for address not conatined in the
     * map in order to simulate a full size memory.
     * @param virtualAddress A binary value representing a virtual memory address to write the data to.
     * @throws {ExceptionError} If an exception was generated
     * @returns The byte of data found at the specified address.
     */
    public readByteFrom(virtualAddress: VirtualAddress): Byte {
        const physicalAddress: PhysicalAddress = this.translate(virtualAddress, false, false);
        return this._cpu.mainMemory.readByteFrom(physicalAddress);
    }

    /**
     * This method clears all bits at the specified locations, depending on the given number of bytes.
     * @param virtualAddress The virtual address to clear all bits at.
     * @throws {ExceptionError} If an exception was generated
     */
    public clearDoubleWord(virtualAddress: VirtualAddress): void {
        const physicalAddress: PhysicalAddress = this.translate(virtualAddress, false, false);
        this._cpu.mainMemory.writeDoubleWordTo(physicalAddress, DoubleWord.ZERO);
    }

    /**
     * This method translates a given virtual memory address to an associated physical memory address according to the TLB or NPT.
     * If the virtual address was not translated recently and its associated physical address is not present in the TLB, the page 
     * table is searched for the virtual address. 
     * @param virtualAddress A binary value representing a virtual memory address.
     * @param attemptsToWrite Indicates whether the process attempts to execute the data located at the page frame associated with the given virtual address.
     * @param attemptsToExecute Indicates whether the process attempts to write data to the page frame associated with the given virtual address.
     * @param ignorePermissionFlags Disables the privilege violation check with the EFLAGS.
     * @param disableTlb Disables the usage of the TLB while translating an address.
     * @throws {ExceptionError} If the page the given virtual address is part of, is currently not associated with a page frame.
     * @returns The physical memory address associated with the given virtual address.
     */
    public translate(virtualAddress: VirtualAddress, attemptsToWrite: boolean, attemptsToExecute: boolean, ignorePermissionFlags: boolean = false, disableTlb: boolean = false): PhysicalAddress {
        if (!this._memoryVirtualizationEnabled) {
            return virtualAddress as PhysicalAddress;
        }

        const pageNumber = PageNumber.fromVirtualAddress(virtualAddress);
        const pageTableEntry: PageTableEntry = disableTlb ? this.findPageTableEntry(virtualAddress) : this._tlb.get(pageNumber) ?? this.findPageTableEntry(virtualAddress);
        const pageTableEntryFlags: PageTableEntryFlags = PageTableEntry.getFlags(pageTableEntry);

        // Check if a page frame is connected to the page to which the specified virtual address refers.
        if (!PageTableEntryFlags.isPresent(pageTableEntryFlags)) {
            this.pageFaultAddress = virtualAddress;
            throw new ExceptionError(InterruptNumbers.PAGE_FAULT);
        }

        if (!ignorePermissionFlags) {
            // Check if the page frame is accessable only in kernel mode.
            if (!this._cpu.flags.isInKernelMode() && PageTableEntryFlags.isKernelModeOnly(pageTableEntryFlags)) {
                throw new ExceptionError(InterruptNumbers.GENERAL_PROTECTION_FAULT);
            }
            // Check if the page frames contents are executable.
            if (attemptsToExecute && !PageTableEntryFlags.isExecutable(pageTableEntryFlags)) {
                throw new ExceptionError(InterruptNumbers.GENERAL_PROTECTION_FAULT);
            }
            // Check if the page frames contents are writable.
            if (attemptsToWrite && !PageTableEntryFlags.isWritable(pageTableEntryFlags)) {
                throw new ExceptionError(InterruptNumbers.GENERAL_PROTECTION_FAULT);
            }
        }
        
        if (attemptsToWrite) {
            // Set changed flag bit.
            PageTableEntryFlags.setChangedFlagBit(pageTableEntryFlags, 1);
            // Update flag bits of page table entry in memory as well.
            this._cpu.mainMemory.writeDoubleWordTo(this.findPageTableEntryPhysicalAddress(virtualAddress), pageTableEntry);
        }

        // Update or insert the physical memory address into the Translation Lookaside Buffer.
        if (!disableTlb) {
            this._tlb.insert([pageNumber, pageTableEntry]);
        }

        return PhysicalAddress.fromPageTableEntryAndVirtualAddress(pageTableEntry, virtualAddress);
    }

    /**
     * This method takes a virtual address and finds the physical address of the matching L2 page table entry.
     * To find the matching L2 page table the method looks up the L2 page table by using the page directory index of the virtual memory address.
     * If the page directory entry is empty, meaning the L2 page table, which contains the wanted entry, is not mapped, then a page fault is thrown.
     * Once the L2 page table is located the physical address of the entry in the L2 page table is calculated and returned.
     * @param virtualAddress The virtual address of the wanted page table entry physical address.
     * @returns The physical address of the wanted L2 page table entry.
     */
    private findPageTableEntryPhysicalAddress(virtualAddress: VirtualAddress): PhysicalAddress {
        const pageDirectoryIndex: number = (virtualAddress >>> 22) & 0x3FF;
        const pageTableIndex: number = (virtualAddress >>> 12) & 0x3FF;

        const pageDirectoryEntryPhysical: PhysicalAddress = PhysicalAddress.fromNumber(this._cpu.ptp.content + pageDirectoryIndex * 4);
        const pageDirectoryEntry: PageTableEntry = this._cpu.mainMemory.readDoublewordFrom(pageDirectoryEntryPhysical) as PageTableEntry;

        const pageDirectoryEntryFlags: PageTableEntryFlags = PageTableEntry.getFlags(pageDirectoryEntry);

        if (!PageTableEntryFlags.isPresent(pageDirectoryEntryFlags)) {

            this.pageFaultAddress = virtualAddress;
            
            throw new ExceptionError(InterruptNumbers.PAGE_FAULT);
        }

        //Level 2 Page Table
        const pageTableBase = (PageTableEntry.getFrameNumber(pageDirectoryEntry) << MemoryManagementUnit.NUMBER_BITS_OFFSET) >>> 0;
        const pageTableEntryPhysicalAddress: PhysicalAddress = PhysicalAddress.fromNumber(pageTableBase + (pageTableIndex * 4));
        return pageTableEntryPhysicalAddress;
    }

    /**
     * This method takes a virtual address and returns the L2 page table entry, which maps the virtual address to a physical frame.
     * @param virtualAddress The virtual address to find the L2 page table entry for.
     * @returns The page table entry that was searched for.
     */
    private findPageTableEntry(virtualAddress: VirtualAddress): PageTableEntry {
        const pageTableEntry: DoubleWord = this._cpu.mainMemory.readDoublewordFrom(this.findPageTableEntryPhysicalAddress(virtualAddress)) as PageTableEntry;
        return pageTableEntry;
    }

    /**
     * This method extracts the frame number and the virtual page number from the physical and virtual address passed to the function.
     * The frame number is used as index in the reverse memory map and the virtual page number and process id are used to create an object as entry.
     * This method also checks if a virtual page number for the same id is already mapped to a different frame number and deletes the existing entry.
     * It prevents silent remaps of a virtual page number to a different frame number without explicitly calling the frame unmap first.
     * @param physicalAddress The physical address of a page frame.
     * @param virtualAddress The virtual address the page frame gets mapped to.
     * @param processId The process id of the process that caused a new frame to get mapped.
     */
    public insertReverseMemoryMapping(physicalAddress: PhysicalAddress, virtualAddress: VirtualAddress, processId: DoubleWord): void {
        const frameNumber: FrameNumber = FrameNumber.fromPhysicalAddress(physicalAddress);
        const virtualPageNumber: PageNumber = PageNumber.fromVirtualAddress(virtualAddress);
        const id: number = processId;

        // Check if entry exists in case of silent remapping virtual address to new frame without unmap
        // If mapping for vpn exists, delete it
        for (const frameNumber in this.reverseMemoryMap) {
            const mappings = this.reverseMemoryMap[frameNumber];
            if (mappings) {
                const existingIndex = mappings.findIndex(
                    (entry) => entry.pageTableId === id && entry.pageNumber === virtualPageNumber
                );
                if (existingIndex !== -1) {
                    mappings.splice(existingIndex, 1);
                    break;
                }
            }
        }
        (this.reverseMemoryMap[frameNumber] ??= []).push({pageTableId: id, pageNumber: virtualPageNumber});            
    }

    /**
     * This method extracts the frame number and the virtual page number from the physical and virtual address passed to the function.
     * The frame number is used as index in the reverse memory map and the virtual page number and process id are used to identify an entry.
     * If the entry for the frame number exists, then all entries matching the virtual page number and process id get deleted.
     * @param physicalAddress The physical address of a page frame.
     * @param virtualAddress The virtual address the page frame gets mapped to.
     * @param processId The process id of the process that caused a new frame to get unmapped.
     */
    public removeReverseMemoryMapping(physicalAddress: PhysicalAddress, virtualAddress: VirtualAddress, processId: DoubleWord): void {
        const frameNumber: FrameNumber = FrameNumber.fromPhysicalAddress(physicalAddress);
        const virtualPageNumber: PageNumber = PageNumber.fromVirtualAddress(virtualAddress);
        const id: number = processId;
        if (this.reverseMemoryMap[frameNumber]) {
                this.reverseMemoryMap[frameNumber] = this.reverseMemoryMap[frameNumber].filter(
                    (entry) => !(entry.pageTableId === id && entry.pageNumber === virtualPageNumber)
            );
        }
    }

    /**
     * This method takes a physical address and finds all virtual addresses that are mapped to the physical address.
     * @param physicalAddress Physical address to find all virtual addresses for.
     * @returns Array of virtual addresses that are mapped to the searched physical address.
     */
    public findVirtualFromPhysical(physicalAddress: PhysicalAddress): VirtualAddress[] {
        const frameNumber: FrameNumber = FrameNumber.fromPhysicalAddress(physicalAddress);
        const reverseMemoryMapEntry: memoryMapEntry[] = this.reverseMemoryMap[frameNumber] ?? [];
        const virtualAddresses: VirtualAddress[] = [];
        for (const entry of reverseMemoryMapEntry) {
            const pNumber: number = entry.pageNumber << 12;
            const offset: number = physicalAddress & 0xFFF;
            const virtualAddress: VirtualAddress = VirtualAddress.fromNumber(pNumber | offset);
            virtualAddresses.push(virtualAddress);
        }
        return virtualAddresses;
    }

}
