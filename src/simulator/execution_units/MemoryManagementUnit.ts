import { Byte } from "../../types/binary/Byte";
import { DataSizes } from "../../types/enumerations/DataSizes";
import { DoubleWord } from "../../types/binary/DoubleWord";
import { PageTableEntry } from "../../types/binary/PageTableEntry";
import { TranslationLookasideBuffer } from "../functional_units/TranslationLookasideBuffer";
import { CPUCore } from "./CPUCore";
import { InterruptNumbers } from "../../types/enumerations/InterruptNumbers";
import { ExceptionError } from "../../types/errors/ExceptionError";
import { PageNumber } from "../../types/binary/PageNumber";
import { PageTableEntryFlags } from "../../types/binary/PageTableEntryFlags";
import { VirtualAddress } from "../../../types/binary/VirtualAddress";
import { PhysicalAddress } from "../../../types/binary/PhysicalAddress";
import { PageTableEntry } from "../../../types/binary/PageTableEntry";
import { FrameNumber } from "../../../types/binary/FrameNumber";

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
        this.updateReverseMemoryMap(physicalAddress, doubleword as PageTableEntry)
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
        const pageTableEntry: PageTableEntry = disableTlb ? this.searchPageTable(virtualAddress)
                : this._tlb.get(pageNumber) ?? this.searchPageTable(virtualAddress);

        const pageTableEntryFlags: PageTableEntryFlags = PageTableEntryFlags.fromPageTableEntry(pageTableEntry);

        // Check if a page frame is connected to the page to which the specified virtual address refers.
        if (!PageTableEntryFlags.isPresent(pageTableEntryFlags)) {
            this.pageFaultAddress = virtualAddress;
            throw new ExceptionError(InterruptNumbers.PAGE_FAULT);
        }

        if (!ignorePermissionFlags && !this._cpu.flags.isInKernelMode()) {
            // Check if the page frame is accessable only in kernel mode.
            if (PageTableEntryFlags.isKernelModeOnly(pageTableEntryFlags)) {
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
            this._cpu.mainMemory.writeDoubleWordTo(this.calcPhysicalAddressOfPageTableEntry(virtualAddress), pageTableEntry);
        }

        // Update or insert the physical memory address into the Translation Lookaside Buffer.
        if (!disableTlb) {
            this._tlb.insert([pageNumber, pageTableEntry]);
        }

        return PhysicalAddress.fromPageTableEntryAndVirtualAddress(pageTableEntry, virtualAddress);
    }

    /**
     * This method computes the physical address of the page table entry, which is associated with the given virtual address.
     * The page table entry is located at a specific physical address, which is calculated by adding the page number to the page tables base address.
     * @param virtualAddress The virtual address to compute the physical address of the page table entry for.
     * @returns The physical address of the page table entry.
     */
    private calcPhysicalAddressOfPageTableEntry(virtualAddress: VirtualAddress): PhysicalAddress {
        /* 
         * Add the page number * 4 to the physical page table base address to get the address of the page table entry.
         * Because every page table entry is 4 bytes long, the page number needs to be multiplied by 4 before 
         * adding it to the page tables base address.
         */
        return PhysicalAddress.fromNumber(this._cpu.ptp.content + PageNumber.fromVirtualAddress(virtualAddress) * 4);
    }

    /**
     * This method searches the page table for a specific entry. To do this, the page number and an offset are 
     * extracted from the given virtual address. The page number is filled with zero bits on the right. The offset 
     * is discarded as part of this method. The padded page number is added to the physical base address of the 
     * page table. The entry you are looking for is located at the resulting physical address. This entry corresponds 
     * to the page to which the given virtual memory address is assigned. The page table entry includes some status 
     * bits and possibly the physical base address of a page frame.
     * @param virtualAddress The virtual memory address to look up in the page table.
     */
    private searchPageTable(virtualAddress: VirtualAddress): PageTableEntry {
        // Compute the physical address, where the page table resides in the page table.
        const addressOfPageTableEntry: PhysicalAddress = this.calcPhysicalAddressOfPageTableEntry(virtualAddress);
        // Read page table entry from memory.
        return this._cpu.mainMemory.readDoublewordFrom(addressOfPageTableEntry) as PageTableEntry;
    }

    /**
     * This method updates the reverse memory map based on the present bit of the given page table entry.
     * The reverse memory map maps a physical frame number to an object which contains the mapped virtual page number and the page table id, which the virtual page number belongs to.
     * Each index in the reverse memory map represents the physical frame number.
     * If the present bit of the page table entry changes from zero to one, then a new entry is created.
     * If the present bit of the page table entry changes from one to zero, then all entries that match the virtual page number and page table id at the entry of the physical frame number in the
     * reverse memory map get removed.
     * If the present bit stays at one and the physical frame number changes, then the old entry gets removed and a new entry is written.
     * @param ptEntryAddress The memory address of the page table entry.
     * @param ptEntry The page table entry.
     */
    private updateReverseMemoryMap(ptEntryAddress: PhysicalAddress, ptEntry: PageTableEntry): void {
        const pageTablesStartAddress: number = 0xD0000000;
        const pageTablesEndAddress: number = 0xDFFFFFFF;
        if (ptEntryAddress < pageTablesStartAddress || ptEntryAddress > pageTablesEndAddress) {
            return
        }
        const newPtEntry: PageTableEntry = ptEntry;
        const oldPtEntry: PageTableEntry = this._cpu.mainMemory.readDoublewordFrom(ptEntryAddress) as PageTableEntry;

        const newPtPresentBit: number = PageTableEntry.getFlags(newPtEntry) >> 11;
        const oldPtPresentBit: number = PageTableEntry.getFlags(oldPtEntry) >> 11;
        const newFrameNumber: number = PageTableEntry.getFrameNumber(newPtEntry);
        const oldFrameNumber: number = PageTableEntry.getFrameNumber(oldPtEntry);

        const ptMemoryOffset: number = ptEntryAddress - pageTablesStartAddress;
        
        //Divide by four
        const globalEntryIndex: number = ptMemoryOffset >> 2;
        //Bitwise modulo 2^20 to find the page number since a page table has 2^20 entries
        const pageNumber: number = globalEntryIndex & 0xFFFFF;
        const pageTableId: number = globalEntryIndex >> 20;

        if (newPtPresentBit === 1 && oldPtPresentBit === 0) {
            (this.reverseMemoryMap[newFrameNumber] ??= []).push({pageTableId: pageTableId, pageNumber: pageNumber});
        }

        if (newPtPresentBit === 0 && oldPtPresentBit === 1) {
            if (!this.reverseMemoryMap[newFrameNumber]) {
                return;
            }
            this.reverseMemoryMap[newFrameNumber] = this.reverseMemoryMap[newFrameNumber].filter(
                (entry) => !(entry.pageTableId === pageTableId && entry.pageNumber === pageNumber)
            );
        }

        if (oldPtPresentBit === 1 && newPtPresentBit === 1) {
            if (newFrameNumber === oldFrameNumber) {
                return
            }
            this.reverseMemoryMap[oldFrameNumber] = this.reverseMemoryMap[oldFrameNumber].filter(
                (entry) => !(entry.pageTableId === pageTableId && entry.pageNumber === pageNumber)
            );
            (this.reverseMemoryMap[newFrameNumber] ??= []).push({pageTableId: pageTableId, pageNumber: pageNumber});
        }
    }

    public findVirtualFromPhysical(physicalAddress: PhysicalAddress): VirtualAddress[] {
        const frameNumber: FrameNumber = FrameNumber.fromPhysicalAddress(physicalAddress);
        const reverseMemoryMapEntry: memoryMapEntry[] = this.reverseMemoryMap[frameNumber];
        const virtualAddresses: VirtualAddress[] = [];
        for (const entry of reverseMemoryMapEntry) {
            const pNumber: number = entry.pageNumber;
            const offset: number = physicalAddress & 0xFFF;
            const virtualAddress: VirtualAddress = VirtualAddress.fromNumber(pNumber | offset);
            virtualAddresses.push(virtualAddress);
        }
        return virtualAddresses;
    }

}