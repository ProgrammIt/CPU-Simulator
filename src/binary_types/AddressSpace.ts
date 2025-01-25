import { Address } from "./Address";

/**
 * This class represents an address space or a range of addresses.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class AddressSpace<T extends Address> {
    /**
     * This member stores the upper boundry of the address space.
     * @readonly
     */
    public readonly highAddress: T;

    /**
     * This member stores the lower boundry of the address space.
     * @readonly
     */
    public readonly lowAddress: T;

    /**
     * Constructs a new address space from the given boundries.
     * @param lowAddress The lower boundry of the address space.
     * @param highAddress The upper boundry of the address space.
     */
    public constructor(lowAddress: T, highAddress: T) {
        this.lowAddress = lowAddress;
        this.highAddress = highAddress;
    }

    /**
     * This method tests whether a given address is in range of the address space.
     * @param element The address to test.
     * @returns True, if the given address is in range, false otherwise.
     */
    public inRange(address: T): boolean {
        const upperBoundryDec: number = parseInt(this.highAddress.toString(), 2);
        const lowerBoundryDec: number = parseInt(this.lowAddress.toString(), 2);
        const addressDec: number = parseInt(address.toString(), 2);
        return (lowerBoundryDec <= addressDec && addressDec <= upperBoundryDec);
    }

    /**
     * This method returns the decimal representation of the address spaces highest address.
     * @returns The decimal representation of the upper boundry.
     */
    public highAddressToDecimal(): number {
        return parseInt(this.highAddress.toString(), 2);
    }

    /**
     * This method returns the decimal representation of the address spaces lowest address.
     * @returns The decimal representation of the upper boundry.
     */
    public lowAddressToDecimal(): number {
        return parseInt(this.lowAddress.toString(), 2);
    }

    /**
     * This accessor calculates and returns the size of this range.
     */
    public get size(): number {
        return this.highAddressToDecimal() - this.lowAddressToDecimal();
    }
}