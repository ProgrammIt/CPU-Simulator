import { Bit } from "./Bit";
import { Doubleword } from "./Doubleword";

/**
 * This class represents a page table entry.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class PageTableEntry {
    /**
     * The number of bits used for the flags.
     */
    public static readonly NUMBER_OF_BITS_FOR_FLAGS: number = 12;

    /**
     * The number of bits used for the page frame number.
     */
    public static readonly NUMBER_OF_BITS_FOR_PAGE_FRAME_NUMBER: number = 20;

    /**
     * This field stores the flag bits of the page table entry.
     */
    public readonly flagBits: Array<Bit>;

    /**
     * This field stores the number of the associated page frame.
     */
    public readonly frameNbr: Array<Bit>;
    
    /**
     * This constructor creates a new page table entry with the given flag bits, page number and frame number.
     * @param flagBits The flag bits of the page table entry.
     * @param frameNbr The number of the associated page frame.
     * @constructor
     */
    public constructor(flagBits: Array<Bit>, frameNbr: Array<Bit>) {
        this.flagBits = flagBits;
        this.frameNbr = frameNbr;
    }

    /**
     * This method returns a string representation of the page table entry.
     * @returns A string representation of the page table entry.
     */
    public toString(): string {
        return this.flagBits.concat(this.frameNbr).join("").toString();
    }

    /**
     * This method converts the page table entry to a doubleword.
     * @returns A doubleword representing the page table entry.
     */
    public toDoubleword(): Doubleword {
        return new Doubleword(this.flagBits.concat(this.frameNbr));
    }

    /**
     * This method sets the present flag of the page table entry.
     */
    public setPresentFlag(): void {
        this.flagBits[0] = 1;
        return;
    }

    /**
     * This method clears the present flag of the page table entry.
     */
    public clearPresentFlag(): void {
        this.flagBits[0] = 0;
        return;
    }

    /**
     * This method checks whether the page is present (whether a page frame is associated to it).
     * @returns True if the page is present, false otherwise.
     */
    public isPresent(): boolean {
        return this.flagBits[0] === 1;
    }

    /**
     * This method sets the writable flag of the page table entry.
     */
    public setWritableFlag(): void {
        this.flagBits[1] = 1;
        return;
    }

    /**
     * This method clears the writable flag of the page table entry.
     */
    public clearWritableFlag(): void {
        this.flagBits[1] = 0;
        return;
    }

    /**
     * This method checks whether the page is writable.
     * @returns True if the page is writable, false otherwise.
     */
    public isWritable(): boolean {
        return this.flagBits[1] === 1;
    }

    /**
     * This method sets the executable flag of the page table entry.
     */
    public setExecutableFlag(): void {
        this.flagBits[2] = 1;
        return;
    }

    /**
     * This method clears the executable flag of the page table entry.
     */
    public clearExecutableFlag(): void {
        this.flagBits[2] = 0;
        return;
    }

    /**
     * This method checks whether the page is executable.
     * @returns True if the page is executable, false otherwise.
     */
    public isExecutable(): boolean {
        return this.flagBits[2] === 1;
    }

    /**
     * This method sets the flag that indicates that this page can only be accessed in kernel mode.
     */
    public setAccessableOnlyInKernelModeFlag(): void {
        this.flagBits[3] = 1;
        return;
    }

    /**
     * This method clears the flag that indicates that this page can only be accessed in kernel mode.
     */
    public clearAccessableOnlyInKernelModeFlag(): void {
        this.flagBits[3] = 0;
        return;
    }

    /**
     * This method checks whether the page is accessable only in kernel mode.
     * @returns True if the page is accessable only in kernel mode, false otherwise.
     */
    public isAccessableOnlyInKernelMode(): boolean {
        return this.flagBits[3] === 1;
    }

    /**
     * This method sets the pinned flag of the page table entry.
     */
    public setPinnedFlag(): void {
        this.flagBits[4] = 1;
        return;
    }

    /**
     * This method clears the pinned flag of the page table entry.
     */
    public clearPinnedFlag(): void {
        this.flagBits[4] = 0;
        return;
    }

    /**
     * This method checks whether the page is pinned.
     * @returns True if the page is pinned, false otherwise.
     */
    public pinned(): boolean {
        return this.flagBits[4] === 1;
    };

    /**
     * This method sets the changed flag of the page table entry.
     */
    public setChangedFlag(): void {
        this.flagBits[5] = 1;
        return;
    }

    /**
     * This method clears the changed flag of the page table entry.
     */
    public clearChangedFlag(): void {
        this.flagBits[5] = 0;
        return;
    }

    /**
     * This method checks whether the page was changed.
     * @returns True if the page was changed, false otherwise.
     */
    public isChanged(): boolean {
        return this.flagBits[5] === 1;
    }
}