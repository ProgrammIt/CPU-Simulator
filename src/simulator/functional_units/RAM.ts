import { Bit } from "../../types/Bit";
import { Byte } from "../../types/Byte";
import { Doubleword } from "../../types/Doubleword";
import { PhysicalAddress } from "../../types/PhysicalAddress";

export class RAM {
    public readonly capacity: number;
    private readonly _cells: Map<string, Byte>;
    private readonly _highAddressDec: number;
    private readonly _lowAddressDec: number;

    /**
     * This method constructs an instance of the RAM class.
     * @param capacity The max. capacity of this instance of the RAM class.
     */
    public constructor(capacity: number) {
        this._cells = new Map<string, Byte>();
        this.capacity = capacity;
        this._highAddressDec = capacity;
        this._lowAddressDec = 0;
    }

    /**
     * This methods writes a doubleword (32-bit- or 4-byte-) value to memory to the specified memory address.
     * @param physicalAddress A physical memory address to write the doubleword-sized data to.
     * @param doubleword Doubleword-sized data to write.
     */
    public writeDoublewordTo(physicalAddress: PhysicalAddress, doubleword: Doubleword) {
        this.validatePhysicalAddress(physicalAddress);
        const startAddressDec: number = parseInt(physicalAddress.value.join(""), 2);
        // Bit 0 - 7
        const firstByte: Byte = new Byte(doubleword.value.slice(0, 8));
        // Bit 8 - 15
        const secondByte: Byte = new Byte(doubleword.value.slice(8, 16));
        // Bit 16 - 24
        const thirdByte: Byte = new Byte(doubleword.value.slice(16, 24));
        // Bit 24 - 32
        const fourthByte: Byte = new Byte(doubleword.value.slice(24));
        // Only write byte, if it is not a zero byte.
        this.writeByteTo(PhysicalAddress.fromInteger(startAddressDec), firstByte);
        // Only write byte, if it is not a zero byte.
        this.writeByteTo(PhysicalAddress.fromInteger(startAddressDec + 1), secondByte);
        // Only write byte, if it is not a zero byte.
        this.writeByteTo(PhysicalAddress.fromInteger(startAddressDec + 2), thirdByte);
        // Only write byte, if it is not a zero byte.
        this.writeByteTo(PhysicalAddress.fromInteger(startAddressDec + 3), fourthByte);
        return;
    }

    /**
     * This method writes a specified byte of data to the specified address in
     * in the main memory. Throws an error, if the data exeeds a byte.
     * @param physicalAddress A binary value representing a physical memory address to write the data to.
     * @param data Byte-sized data to write to the specified pyhsical memory address.
     */
    public writeByteTo(physicalAddress: PhysicalAddress, data: Byte) {
        this.validatePhysicalAddress(physicalAddress);
        if (data.equal(new Byte())) {
            this.clearByte(physicalAddress);
            return;
        }
        const physicalAddressHex: string = 
            `0x${parseInt(physicalAddress.value.join(""), 2).toString(16).toUpperCase()}`;
        // Write byte to "memory".
        this._cells.set(physicalAddressHex, data);
        return;
    }

    /**
     * This method reads doubleword sized data from the main memory starting at the specified physical memory address.
     * @param physicalAddress A binary physical memory address to read the doubleword-sized data from.
     * @returns Doubleword-sized binary data.
     */
    public readDoublewordFrom(physicalAddress: PhysicalAddress): Doubleword {
        this.validatePhysicalAddress(physicalAddress);
        const startAddressDec: number = parseInt(physicalAddress.value.join(""), 2);
        const doubleword = new Doubleword();
        var firstByte: Byte = this.readByteFrom(PhysicalAddress.fromInteger(startAddressDec));
        var secondByte: Byte = this.readByteFrom(PhysicalAddress.fromInteger(startAddressDec + 1));
        var thirdByte: Byte =  this.readByteFrom(PhysicalAddress.fromInteger(startAddressDec + 2));
        var fourthByte: Byte = this.readByteFrom(PhysicalAddress.fromInteger(startAddressDec + 3));
        doubleword.value = new Array<Bit>().concat(
            firstByte.value, secondByte.value, thirdByte.value, fourthByte.value
        );
        return doubleword;
    }

    /**
     * This method tries to read a byte from the specified memory address.
     * Returns a binary zero for address not conatined in the
     * map in order to simulate a full size memory.
     * @param physicalAddress A binary value representing a physical memory address to write the data to.
     * @returns The byte-sized data found at the specified address.
     */
    public readByteFrom(physicalAddress: PhysicalAddress): Byte {
        this.validatePhysicalAddress(physicalAddress);
        const physicalAddressHex: string = `0x${parseInt(physicalAddress.value.join(""), 2).toString(16).toUpperCase()}`;
        var result: Byte;
        if (this._cells.has(physicalAddressHex)) {
            result = this._cells.get(physicalAddressHex)!;
        } else {
            result = new Byte()
        }
        return result;
    }

    /**
     * This method clears all bits at the specified location and removes the entry with the given physical memory
     * address from the cells map. Both is done only if there is an entry in cells map.
     * @param physicalAddress A binary value representing a physical memory address to write the data to.
     */
    public clearByte(physicalAddress: PhysicalAddress) {
        this.validatePhysicalAddress(physicalAddress);
        const physicalAddressHexString: string = `0x${parseInt(physicalAddress.toString(), 2).toString(16).toUpperCase()}`;
        if (this._cells.has(physicalAddressHexString)) {
            this._cells.delete(physicalAddressHexString);
        }
        return;
    }

    /**
     * This method clears all bits at the specified location.
     * @param physicalAddress The physical address to clear all bits at.
     */
    public clearMemory(physicalAddress: PhysicalAddress): void {
        this.validatePhysicalAddress(physicalAddress);
        const physicalAddressDec: number = parseInt(physicalAddress.toString(), 2);
        this._cells.delete(`0x${(physicalAddressDec).toString(16).toUpperCase()}`);
        return;
    }

    /**
     * This method adds a memory address key to the cells map of this MemoryInstance and 
     * sets all bits at the specified memory address to 1.
     * @param physicalAddress A physical memory address.
     */
    public setByte(physicalAddress: PhysicalAddress) {
        this.validatePhysicalAddress(physicalAddress);
        const physicalAddressHex: string = 
            `0x${parseInt(physicalAddress.toString(), 2).toString(16).toUpperCase()}`;
        const byte = new Byte();
        byte.value = new Array<Bit>(8).fill(1);
        this._cells.set(physicalAddressHex, byte);
        return;
    }

    /**
     * This method validates a given physical memory address. If the address is invalid, an error will be thrown, preventing further processing.
     * @param physicalAddress A phyiscal memory address to validate.
     */
    private validatePhysicalAddress(physicalAddress: PhysicalAddress) {
        var physicalAddressDec = parseInt(physicalAddress.value.join(""), 2);
        if (physicalAddressDec > this._highAddressDec || physicalAddressDec < this._lowAddressDec) {
            throw Error(`Memory address out of range [${this._lowAddressDec.toString(2)}, ${this._highAddressDec.toString(2)}].`)
        }
        return;
    }

    /**
     * A public accessable getter for the memory cells.
     * This method will be used by the GUI in order to
     * display the contents of the main memory.
     * @returns The current content of this RAM instance.
     */
    public get cells(): Map<string, Byte>{
        return this._cells;
    }
}