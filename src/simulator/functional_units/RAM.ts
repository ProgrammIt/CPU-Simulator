import { Byte } from "../../types/binary/Byte";
import { DoubleWord } from "../../types/binary/DoubleWord";
import { FrameNumber } from "../../types/binary/FrameNumber";
import { FrameOffset } from "../../types/binary/FrameOffset";
import { PhysicalAddress } from "../../types/binary/PhysicalAddress";
import { AddressOutOfRangeError } from "../../types/errors/AddressOutOfRangeError";

export class RAM {
    private readonly capacity: number;
    private readonly _cells: Map<FrameNumber, DataView>

    /**
     * This method constructs an instance of the RAM class.
     * @param capacity The max. capacity of this instance of the RAM class.
     */
    public constructor(capacity: number) {
        this._cells = new Map<FrameNumber, DataView>();
        this.capacity = capacity;
    }

    /**
     * This methods writes a doubleword (32-bit- or 4-byte-) value to memory to the specified memory address.
     * @param physicalAddress A physical memory address to write the doubleword-sized data to.
     * @throws AddressOutOfRangeError - If the physical memory address is out of range.
     * @param data Doubleword-sized data to write.
     */
    public writeDoubleWordTo(physicalAddress: PhysicalAddress, data: DoubleWord): void {
        if ((physicalAddress + 3) >>> 0 >= this.capacity) {
            throw new AddressOutOfRangeError(`Memory address out of range [0, ${this.capacity.toString()}].`)
        }

        const frameOffset = FrameOffset.fromPhysicalAddress(physicalAddress);
        if (frameOffset + 3 >= FrameOffset.MAX_POSITIVE_NUMBER) {
            this.writeByteTo(physicalAddress, DoubleWord.getFirstByte(data));
            this.writeByteTo(PhysicalAddress.fromNumber(physicalAddress+1), DoubleWord.getSecondByte(data));
            this.writeByteTo(PhysicalAddress.fromNumber(physicalAddress+2), DoubleWord.getThirdByte(data));
            this.writeByteTo(PhysicalAddress.fromNumber(physicalAddress+3), DoubleWord.getFourthByte(data));
            return;
        }

        const frameNumber = FrameNumber.fromPhysicalAddress(physicalAddress);
        let frame = this._cells.get(frameNumber);

        if (frame === undefined) {
            if (data === DoubleWord.ZERO) {
                return;
            }
            frame = new DataView(new ArrayBuffer(2**FrameOffset.NUMBER_OF_BITS));
            this._cells.set(frameNumber, frame);
        }

        frame.setUint32(frameOffset, data);
    }

    /**
     * This method writes a specified byte of data to the specified address in
     * in the main memory. Throws an error, if the data exeeds a byte.
     * @param physicalAddress A binary value representing a physical memory address to write the data to.
     * @param data Byte-sized data to write to the specified pyhsical memory address.
     */
    public writeByteTo(physicalAddress: PhysicalAddress, data: Byte): void {
        if (physicalAddress >= this.capacity) {
            throw new AddressOutOfRangeError(`Memory address out of range [0, ${this.capacity.toString()}].`)
        }

        const frameNumber = FrameNumber.fromPhysicalAddress(physicalAddress);
        let frame = this._cells.get(frameNumber);

        if (frame === undefined) {
            if (data === Byte.ZERO) {
                return;
            }
            frame = new DataView(new ArrayBuffer(2**FrameOffset.NUMBER_OF_BITS));
            this._cells.set(frameNumber, frame);
        }

        frame.setUint8(FrameOffset.fromPhysicalAddress(physicalAddress), data);
    }

    /**
     * This method reads doubleword sized data from the main memory starting at the specified physical memory address.
     * @param physicalAddress A binary physical memory address to read the doubleword-sized data from.
     * @throws AddressOutOfRangeError - If the physical memory address is out of range.
     * @returns Doubleword-sized binary data.
     */
    public readDoublewordFrom(physicalAddress: PhysicalAddress): DoubleWord {
        if ((physicalAddress + 3) >>> 0 >= this.capacity) {
            throw new AddressOutOfRangeError(`Memory address out of range [0, ${this.capacity.toString()}].`)
        }

        const frameOffset = FrameOffset.fromPhysicalAddress(physicalAddress)
        if (frameOffset + 3 >= FrameOffset.MAX_POSITIVE_NUMBER) {
            const b1 = this.readByteFrom(physicalAddress);
            const b2 = this.readByteFrom(PhysicalAddress.fromNumber(physicalAddress+1));
            const b3 = this.readByteFrom(PhysicalAddress.fromNumber(physicalAddress+2));
            const b4 = this.readByteFrom(PhysicalAddress.fromNumber(physicalAddress+3));
            return DoubleWord.fromBytes(b1, b2, b3, b4);        
        }

        const frame = this._cells.get(FrameNumber.fromPhysicalAddress(physicalAddress));
        return frame?.getUint32(frameOffset) as DoubleWord ?? DoubleWord.ZERO
    }

    /**
     * This method tries to read a byte from the specified memory address.
     * Returns a binary zero for address not conatined in the
     * map in order to simulate a full size memory.
     * @param physicalAddress A binary value representing a physical memory address to write the data to.
     * @returns The byte-sized data found at the specified address.
     */
    public readByteFrom(physicalAddress: PhysicalAddress): Byte {
        if ((physicalAddress + 3) >>> 0 >= this.capacity) {
            throw new AddressOutOfRangeError(`Memory address out of range [0, ${this.capacity.toString()}].`)
        }

        const frame = this._cells.get(FrameNumber.fromPhysicalAddress(physicalAddress));
        return frame?.getUint8(FrameOffset.fromPhysicalAddress(physicalAddress)) as Byte ?? Byte.ZERO
    }

    /**
     * Removes a frame from memory.
     */
    public clearFrame(frameNumber: FrameNumber): void {
        this.cells.delete(frameNumber);
    }

    /**
     * A public accessable getter for the memory cells.
     * This method will be used by the GUI in order to
     * display the contents of the main memory.
     * @returns The current content of this RAM instance.
     */
    public get cells(): Map<FrameNumber, DataView> {
        return this._cells;
    }
}