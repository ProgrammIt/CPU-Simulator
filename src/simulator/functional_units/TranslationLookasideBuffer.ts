import { PageNumber } from "../../types/binary/PageNumber";
import { PageTableEntry } from "../../types/binary/PageTableEntry";

export class TranslationLookasideBuffer {

    private readonly TLB_ENTRIES = 64;

    private tlb = new Uint32Array(this.TLB_ENTRIES * 2);

    public constructor() {
        this.tlb[0] = 1;
    }

    public insert([pageNumber, entry]: [PageNumber, PageTableEntry]): void {
        const index = (pageNumber & (this.TLB_ENTRIES - 1)) * 2;

        this.tlb[index] = pageNumber;
        this.tlb[index + 1] = entry;
    }

    public get(pageNumber: PageNumber): PageTableEntry | undefined {
        const index = (pageNumber & (this.TLB_ENTRIES - 1)) * 2;

        return this.tlb[index] === pageNumber
            ? ((this.tlb[index + 1] >>> 0) as PageTableEntry)
            : undefined;
    }

    public has(pageNumber: PageNumber): boolean {
        return this.tlb[(pageNumber & (this.TLB_ENTRIES - 1)) * 2] === pageNumber;
    }

    public clear(): void {
        this.tlb.fill(0);
        this.tlb[0] = 1;
    }
}