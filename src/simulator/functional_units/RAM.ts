import { Byte } from "../../types/binary/Byte";
import { DoubleWord } from "../../types/binary/DoubleWord";
import { AddressOutOfRangeError } from "../../types/errors/AddressOutOfRangeError";

export class RAM {
    private readonly capacity: number;
    private readonly _cells: Map<DoubleWord, Byte>

    /**
     * This method constructs an instance of the RAM class.
     * @param capacity The max. capacity of this instance of the RAM class.
     */
    public constructor(capacity: number) {
        this._cells = new Map<DoubleWord, Byte>();
        this.capacity = capacity;
    }

    /**
     * This methods writes a doubleword (32-bit- or 4-byte-) value to memory to the specified memory address.
     * @param physicalAddress A physical memory address to write the doubleword-sized data to.
     * @throws AddressOutOfRangeError - If the physical memory address is out of range.
     * @param doubleword Doubleword-sized data to write.
     */
    public writeDoubleWordTo(physicalAddress: DoubleWord, doubleword: DoubleWord): void {
        if (physicalAddress >= this.capacity) {
            throw new AddressOutOfRangeError(`Memory address out of range [0, ${this.capacity.toString()}].`)
        }
        // Only write byte, if it is not a zero byte.
        this.writeByteTo(physicalAddress, DoubleWord.getFirstByte(doubleword));
        // Only write byte, if it is not a zero byte.
        this.writeByteTo(DoubleWord.fromNumber(physicalAddress + 1), DoubleWord.getSecondByte(doubleword));
        // Only write byte, if it is not a zero byte.
        this.writeByteTo(DoubleWord.fromNumber(physicalAddress + 2), DoubleWord.getThirdByte(doubleword));
        // Only write byte, if it is not a zero byte.
        this.writeByteTo(DoubleWord.fromNumber(physicalAddress + 3), DoubleWord.getFourthByte(doubleword));
    }

    /**
     * This method writes a specified byte of data to the specified address in
     * in the main memory. Throws an error, if the data exeeds a byte.
     * @param physicalAddress A binary value representing a physical memory address to write the data to.
     * @throws AddressOutOfRangeError - If the physical memory address is out of range.
     * @param data Byte-sized data to write to the specified pyhsical memory address.
     */
    public writeByteTo(physicalAddress: DoubleWord, data: Byte): void {
        if (physicalAddress >= this.capacity) {
            throw new AddressOutOfRangeError(`Memory address out of range [0, ${this.capacity.toString()}].`)
        }

        if (data === 0) {
            this.clearByte(physicalAddress);
            return;
        }
        // Write byte to "memory".
        this._cells.set(physicalAddress, data);
    }

    /**
     * This method reads doubleword sized data from the main memory starting at the specified physical memory address.
     * @param physicalAddress A binary physical memory address to read the doubleword-sized data from.
     * @throws AddressOutOfRangeError - If the physical memory address is out of range.
     * @returns Doubleword-sized binary data.
     */
    public readDoublewordFrom(physicalAddress: DoubleWord): DoubleWord {
        if (physicalAddress >= this.capacity) {
            throw new AddressOutOfRangeError(`Memory address out of range [0, ${this.capacity.toString()}].`)
        }

        // Only write byte, if it is not a zero byte.
        const firstByte: Byte = this.readByteFrom(DoubleWord.fromNumber(physicalAddress));
        // Only write byte, if it is not a zero byte.
        const secondByte: Byte = this.readByteFrom(DoubleWord.fromNumber(physicalAddress + 1));
        // Only write byte, if it is not a zero byte.
        const thirdByte: Byte = this.readByteFrom(DoubleWord.fromNumber(physicalAddress + 2));
        // Only write byte, if it is not a zero byte.
        const fourthByte: Byte = this.readByteFrom(DoubleWord.fromNumber(physicalAddress + 3));

        return DoubleWord.fromBytes(firstByte, secondByte, thirdByte, fourthByte);
    }

    /**
     * This method tries to read a byte from the specified memory address.
     * Returns a binary zero for address not conatined in the
     * map in order to simulate a full size memory.
     * @param physicalAddress A binary value representing a physical memory address to write the data to.
     * @throws AddressOutOfRangeError - If the physical memory address is out of range.
     * @returns The byte-sized data found at the specified address.
     */
    public readByteFrom(physicalAddress: DoubleWord): Byte {
        if (physicalAddress >= this.capacity) {
            throw new AddressOutOfRangeError(`Memory address out of range [0, ${this.capacity.toString()}].`)
        }
        return this._cells.has(physicalAddress) ? this._cells.get(physicalAddress)! : Byte.ZERO;
    }

    /**
     * This method clears all bits at the specified location and removes the entry with the given physical memory
     * address from the cells map. Both is done only if there is an entry in cells map.
     * @param physicalAddress A binary value representing a physical memory address to write the data to.
     * @throws AddressOutOfRangeError - If the physical memory address is out of range.
     */
    public clearByte(physicalAddress: DoubleWord): void {
        if (this._cells.has(physicalAddress)) {
            this._cells.delete(physicalAddress);
        }
        return;
    }

    /**
     * A public accessable getter for the memory cells.
     * This method will be used by the GUI in order to
     * display the contents of the main memory.
     * @returns The current content of this RAM instance.
     */
    public get cells(): Map<DoubleWord, Byte> {
        return this._cells;
    }
}