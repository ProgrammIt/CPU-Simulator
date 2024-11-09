export class MainMemory {
    private _cells: Map<string, string>;
    private _capacity: number;
    private _freeMemory: number;
    private _usedMemory: number;    // Counter for written memory cells. Only the memory cells that have been actively written to by a process will increase the count.
    private highAddressDec: number;
    private lowAddressDec: number;
    private static _instance: MainMemory;
    private static CELL_CAPACITY: number = 8;

    /**
     * This method constructs an instance of the MainMemory class.
     * @param capacity The max. capacity of this instance of the MainMemory class.
     */
    private constructor(capacity: number) {
        this._cells = new Map<string, string>();
        this._capacity = capacity;
        this._freeMemory = capacity;
        this.highAddressDec = capacity;
        this.lowAddressDec = 0;
        this._usedMemory = 0;
    }

    /**
     * This method returns a refference to the single instance of the 
     * MainMemory class. If the instance was initialized beforehand,
     * this instance will be returned. Otherwise a single new instance 
     * will be created.
     * @param capacity A power of two numerical value.
     * @returns The single instance of the MainMemory class.
     */
    public static instance(capacity: number): MainMemory {
        if (MainMemory._instance === null || MainMemory._instance === undefined) {
            MainMemory._instance = new MainMemory(capacity);
        }
        return MainMemory._instance;
    }

    /**
     * This method returns the max. capacity of the MainMemory instance.
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
     * This methods writes a quadword (32-bit- or 4-byte-) value to memory to the specified memory address.
     * @param physicalAddress A physical memory address to write the quadword-sized data to.
     * @param quadword Quadword-sized data to write.
     */
    public writeQuadwordTo(physicalAddress: string, quadword: string) {
        this.validatePhysicalAddress(physicalAddress);
        const startAddressDec: number = parseInt(physicalAddress, 2);
        var currentAddressDec: number = startAddressDec;
        this.writeByteTo(currentAddressDec.toString(2), quadword.slice(0, 8));
        this.writeByteTo((++currentAddressDec).toString(2), quadword.slice(8, 16));
        this.writeByteTo((++currentAddressDec).toString(2), quadword.slice(16, 24));
        this.writeByteTo((++currentAddressDec).toString(2), quadword.slice(24));
        return;
    }

    /**
     * This method reads quadword sized data from the main memory starting at the specified physical memory address.
     * @param physicalAddress A binary physical memory address to read the quadword-sized data from.
     * @returns Quadword-sized binary data.
     */
    public readQuadwordFrom(physicalAddress: string): string {
        this.validatePhysicalAddress(physicalAddress);
        const startAddressDec: number = parseInt(physicalAddress, 2);
        var currentAddressDec: number = startAddressDec;
        var result: string =
            this.readByteFrom(currentAddressDec.toString(2)) +
            this.readByteFrom((++currentAddressDec).toString(2)) +
            this.readByteFrom((++currentAddressDec).toString(2)) + 
            this.readByteFrom((++currentAddressDec).toString(2));
        return result;
    }

    /**
     * This method writes a specified byte of data to the specified address in
     * in the main memory. Throws an error, if the data exeeds a byte.
     * @param physicalAddress A binary value representing a physical memory address to write the data to.
     * @param data Byte-sized data to write to the specified pyhsical memory address.
     */
    public writeByteTo(physicalAddress: string, data: string) {
        this.validatePhysicalAddress(physicalAddress);
        if (data.length === 0) {
            throw Error("Nothing to write to main memory.");
        }
        if (data.length > 8) {
            throw Error("Data attempted to write exeeds write limit of one byte.")
        }
        // Write byte to memory.
        this._cells.set(physicalAddress, data);
        --this._freeMemory;
        ++this._usedMemory;
        return;
    }

    /**
     * This method tries to read a byte from the specified memory address.
     * Returns a binary zero for address not conatined in the
     * map in order to simulate a full size memory.
     * @param physicalAddress A binary value representing a physical memory address to write the data to.
     * @returns The byte-sized data found at the specified address.
     */
    public readByteFrom(physicalAddress: string): string {
        this.validatePhysicalAddress(physicalAddress);
        var result = this._cells.has(physicalAddress) ? this._cells.get(physicalAddress)! : "0".padStart(MainMemory.CELL_CAPACITY, "0");
        return result;
    }

    /**
     * This method delets a memory address key from the cells map of this MemoryInstance.
     * This is equivalent to clear all bits at the specified memory address to 0.
     * Using this approach reduces memory consumption of the simulator.
     * @param physicalAddress A binary value representing a physical memory address to write the data to.
     */
    public clearByte(physicalAddress: string) {
        this.validatePhysicalAddress(physicalAddress);
        this._cells.delete(physicalAddress);
        ++this._freeMemory;
        --this._usedMemory;
        return;
    }

    /**
     * This method adds a memory address key to the cells map of this MemoryInstance and 
     * sets all bits at the specified memory address to 1.
     * @param physicalAddress A physical memory address.
     */
    public setByte(physicalAddress: string) {
        this.validatePhysicalAddress(physicalAddress);
        this._cells.set(physicalAddress, "1".padStart(MainMemory.CELL_CAPACITY, "1"));
        --this._freeMemory;
        ++this._usedMemory;
        return;
    }

    /**
     * This method validates a given physical memory address. If the address is invalid, an error will be thrown, preventing further processing.
     * @param physicalAddress A phyiscal memory address to validate.
     */
    private validatePhysicalAddress(physicalAddress: string) {
        if (physicalAddress.length === 0) {
            throw Error("Memory address given is empty.");
        }

        var physicalAddressDec = parseInt(physicalAddress, 2);

        if (physicalAddressDec > this.highAddressDec || physicalAddressDec < this.lowAddressDec) {
            throw Error(`Memory address out of range [${this.lowAddressDec.toString(2)}, ${this.highAddressDec.toString(2)}].`)
        }
        return;
    }

    /**
     * A public accessable getter for the memory cells.
     * This method will be used by the GUI in order to
     * display the contents of the main memory.
     * @returns The current content of this MainMemory instance.
     */
    public get cells(): Map<string, string>{
        return this._cells;
    }
}