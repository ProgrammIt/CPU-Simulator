import { MainMemory } from "../functional_units/MainMemory";

export class MemoryManagementUnit {
    private _tlb: Map<string, string>;
    private static _instance: MemoryManagementUnit | null = null;

    private constructor() {
        this._tlb = new Map<string, string>();
    }

    /**
     * This method returns the single instance of the MemoryManagementUnit class.
     * If there is no such instance, one and one is created. Otherwise, the exisiting one is returned.
     * @returns An instance of the MemoryManagementUnit class.
     */
    public static get instance(): MemoryManagementUnit {
        if (MemoryManagementUnit._instance === null) {
            MemoryManagementUnit._instance = new MemoryManagementUnit();
        }
        return MemoryManagementUnit._instance;
    }

    /**
     * This methods writes a doubleword (4-byte) value to memory to the specified memory address.
     * @param physicalAddress A binary virtual memory address to write the doubleword-sized data to.
     * @param doubleword Doubleword-sized data to write.
     */
    public writeDoublewordTo(virtualAddress: string, doubleword: string) {
        const physicalAddress: string = this.translate(virtualAddress);
        MainMemory.instance.writeDoublewordTo(physicalAddress, doubleword);
        return;
    }

    /**
     * This method reads doubleword sized data from the main memory starting at the specified physical memory address.
     * @param virtualAddress A binary virtual memory address to read the doubleword-sized data from.
     * @returns Doubleword-sized binary data.
     */
    public readDoublewordFrom(virtualAddress: string): string {
        const physicalAddress: string = this.translate(virtualAddress);
        return MainMemory.instance.readDoublewordFrom(physicalAddress);
    }

    /**
     * This method writes a specified byte of data to the specified address in
     * in the main memory. Throws an error, if the data exeeds a byte.
     * @param virtualAddress A binary value representing a virtual memory address to write the data to.
     * @param data Byte-sized data to write to the specified pyhsical memory address.
     */
    public writeByteTo(virtualAddress: string, data: string) {
        const physicalAddress: string = this.translate(virtualAddress);
        MainMemory.instance.writeByteTo(physicalAddress, data);
        return;
    }

    /**
     * This method tries to read a byte from the specified memory address.
     * Returns a binary zero for address not conatined in the
     * map in order to simulate a full size memory.
     * @param virtualAddress A binary value representing a virtual memory address to write the data to.
     * @returns The byte-sized data found at the specified address.
     */
    public readByteFrom(virtualAddress: string): string {
        const physicalAddress: string = this.translate(virtualAddress);
        return MainMemory.instance.readByteFrom(physicalAddress);
    }

    /**
     * This method translates a given virtual memory address to a physical memory address according to the TLB
     * or NPT.
     * @param virtualAddress A binary value representing a virtual memory address.
     */
    private translate(virtualAddress: string): string {
        // TODO: Because the simulator currently does not support memory virtualization, the virtual memory address is treated as a physical memory address.
        return virtualAddress;
    }
}