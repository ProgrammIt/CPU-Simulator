import { Byte, Doubleword, PhysicalAddress, VirtualAddress } from "../../types";
import { RAM } from "../functional_units/RAM";

export class MemoryManagementUnit {
    private _tlb: Map<VirtualAddress, PhysicalAddress>; // TODO: limit size of tlb to 64
    private _memoryVirtualizationEnabled: boolean;
    private _mainMemory: RAM;

    public constructor(mainMemory: RAM) {
        this._tlb = new Map<VirtualAddress, PhysicalAddress>();
        this._memoryVirtualizationEnabled = false;
        this._mainMemory = mainMemory;
    }

    /**
     * This method enables memory virtualization.
     */
    // TODO: When memory virtualization is implemented, make public.
    private enableMemoryVirtualization() {
        this._memoryVirtualizationEnabled = true;
    }

    /**
     * This method disables memory virtualization.
     */
    // TODO: When memory virtualization is implemented, make public.
    private disableMemoryVirtualization() {
        this._memoryVirtualizationEnabled = false;
    }

    /**
     * This methods writes a doubleword (4-byte) value to memory to the specified memory address.
     * @param physicalAddress A binary virtual memory address to write the doubleword-sized data to.
     * @param doubleword Doubleword-sized data to write.
     */
    public writeDoublewordTo(virtualAddress: VirtualAddress, doubleword: Doubleword) {
        const physicalAddress: PhysicalAddress = this.translate(virtualAddress);
        this._mainMemory.writeDoublewordTo(physicalAddress, doubleword);
        return;
    }

    /**
     * This method reads doubleword sized data from the main memory starting at the specified physical memory address.
     * @param virtualAddress A binary virtual memory address to read the doubleword-sized data from.
     * @returns Doubleword-sized binary data.
     */
    public readDoublewordFrom(virtualAddress: VirtualAddress): Doubleword {
        const physicalAddress: PhysicalAddress = this.translate(virtualAddress);
        return this._mainMemory.readDoublewordFrom(physicalAddress);
    }

    /**
     * This method writes a specified byte of data to the specified address in
     * in the main memory. Throws an error, if the data exeeds a byte.
     * @param virtualAddress A binary value representing a virtual memory address to write the data to.
     * @param data Byte-sized data to write to the specified pyhsical memory address.
     */
    public writeByteTo(virtualAddress: VirtualAddress, data: Byte) {
        const physicalAddress: PhysicalAddress = this.translate(virtualAddress);
        this._mainMemory.writeByteTo(physicalAddress, data);
        return;
    }

    /**
     * This method tries to read a byte from the specified memory address.
     * Returns a binary zero for address not conatined in the
     * map in order to simulate a full size memory.
     * @param virtualAddress A binary value representing a virtual memory address to write the data to.
     * @returns The byte-sized data found at the specified address.
     */
    public readByteFrom(virtualAddress: VirtualAddress): Byte {
        const physicalAddress: PhysicalAddress = this.translate(virtualAddress);
        return this._mainMemory.readByteFrom(physicalAddress);
    }

    /**
     * This method translates a given virtual memory address to a physical memory address according to the TLB
     * or NPT.
     * @param virtualAddress A binary value representing a virtual memory address.
     */
    private translate(virtualAddress: VirtualAddress): PhysicalAddress {
        // TODO: Because the simulator currently does not support memory virtualization, the virtual memory address is treated as a physical memory address.
        return virtualAddress;
    }
}