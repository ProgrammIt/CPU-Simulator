import { Bit } from "../../types/Bit";
import { Byte } from "../../types/Byte";
import { Doubleword } from "../../types/Doubleword";
import { Instruction } from "../../types/Instruction";
import { PhysicalAddress } from "../../types/PhysicalAddress";

export class RAM {
    private _cells: Map<string, Byte>;
    private _capacity: number;
    private _freeMemory: number;
    private _usedMemory: number;    // Counter for written memory cells. Only the memory cells that have been actively written to by a process will increase the count.
    private _highAddressDec: number;
    private _lowAddressDec: number;
    private static _instance: RAM;

    /**
     * This method constructs an instance of the RAM class.
     * @param capacity The max. capacity of this instance of the RAM class.
     */
    private constructor(capacity: number) {
        this._cells = new Map<string, Byte>();
        this._capacity = capacity;
        this._freeMemory = capacity;
        this._highAddressDec = capacity;
        this._lowAddressDec = 0;
        this._usedMemory = 0;
    }

    /**
     * This method returns a refference to the single instance of the 
     * RAM class. If the instance was initialized beforehand,
     * this instance will be returned. Otherwise a single new instance 
     * will be created.
     * @returns The single instance of the RAM class.
     */
    public static getInstance(capacity: number): RAM {
        if (RAM._instance === null || RAM._instance === undefined) {
            RAM._instance = new RAM(capacity);
        }
        return RAM._instance;
    }

    /**
     * This method returns the max. capacity of the RAM instance.
     * @returns The total number of available memory cells.
     */
    public get capacity(): number {
        return this._capacity;
    }

    /**
     * This method returns the current number of unused memory cells.
     * @returns The total number of unused memory cells.
     */
    public get freeMemory(): number {
        return this._freeMemory;
    }

    /**
     * This method returns the current number of used memory cells.
     * @returns The total number of used memory cells.
     */
    public get usedMemory(): number {
        return this._usedMemory;
    }

    /**
     * This methods writes a doubleword (32-bit- or 4-byte-) value to memory to the specified memory address.
     * @param physicalAddress A physical memory address to write the doubleword-sized data to.
     * @param doubleword Doubleword-sized data to write.
     */
    public writeDoublewordTo(physicalAddress: PhysicalAddress, doubleword: Doubleword|Instruction) {
        this.validatePhysicalAddress(physicalAddress);
        const startAddressDec: number = parseInt(physicalAddress.value.join(""), 2);
        const firstByte: Byte = new Byte();
        // Bit 0 - 7
        firstByte.value = doubleword.value.slice(0, 8);
        const secondByte: Byte = new Byte();
        // Bit 8 - 15
        secondByte.value = doubleword.value.slice(8, 16);
        const thirdByte: Byte = new Byte();
        // Bit 16 - 24
        thirdByte.value = doubleword.value.slice(16, 24);
        const fourthByte: Byte = new Byte();
        // Bit 24 - 32
        fourthByte.value = doubleword.value.slice(24);
        this.writeByteTo(PhysicalAddress.fromInteger(startAddressDec), firstByte);
        this.writeByteTo(PhysicalAddress.fromInteger(startAddressDec + 1), secondByte);
        this.writeByteTo(PhysicalAddress.fromInteger(startAddressDec + 2), thirdByte);
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
        const physicalAddressHex: string = 
            `0x${parseInt(physicalAddress.value.join(""), 2).toString(16).toUpperCase()}`;
        // Write byte to memory.
        this._cells.set(physicalAddressHex, data);
        --this._freeMemory;
        ++this._usedMemory;
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
        var result: Byte = new Byte();
        if (this._cells.has(physicalAddressHex)) {
            result = this._cells.get(physicalAddressHex)!;
        } else {
            result.value = new Array<Bit>(8).fill(0);
        }
        return result;
    }

    /**
     * This method delets a memory address key from the cells map of this MemoryInstance.
     * This is equivalent to clear all bits at the specified memory address to 0.
     * Using this approach reduces memory consumption of the simulator.
     * @param physicalAddress A binary value representing a physical memory address to write the data to.
     */
    public clearByte(physicalAddress: PhysicalAddress) {
        this.validatePhysicalAddress(physicalAddress);
        const physicalAddressHex: string = `0x${parseInt(physicalAddress.value.join(""), 2).toString(16).toUpperCase()}`;
        this._cells.delete(physicalAddressHex);
        ++this._freeMemory;
        --this._usedMemory;
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
            `0x${parseInt(physicalAddress.value.join(""), 2).toString(16).toUpperCase()}`;
        const byte = new Byte();
        byte.value = new Array<Bit>(8).fill(1);
        this._cells.set(physicalAddressHex, byte);
        --this._freeMemory;
        ++this._usedMemory;
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