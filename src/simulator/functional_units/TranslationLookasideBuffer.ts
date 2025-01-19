import { PageTableEntry } from "../../types/PageTableEntry";
import { VirtualAddress } from "../../types/VirtualAddress";

export class TranslationLookasideBuffer {
    private _data: [number, [VirtualAddress, PageTableEntry]][];
    private _capacity: number;

    public constructor(capacity: number) {
        this._data = [];
        this._capacity = capacity;
    }
    
    public insert(item: [VirtualAddress, PageTableEntry]): void {
        if (this.has(item[0])) {
            return;
        }
        if (this._data.length === this._capacity) {
            this._data.pop();
        }
        this._data.push([1, item]);
        this.sort();
        return;
    }

    public get data(): [number, [VirtualAddress, PageTableEntry]][] {
        return this._data;
    }

    private sort() {
        this._data.sort((current, successor) => (current[0] < successor[0]) ? current[0] : successor[0]);
    }

    public peek(): [number, [VirtualAddress, PageTableEntry]] | undefined {
        return (this._data.length === 0) 
            ? undefined
            : this._data[0];
    }

    public pop(): [number, [VirtualAddress, PageTableEntry]] | undefined {
        return (this._data.length === 0) ? undefined : this._data.pop();
    }
    
    public size(): number {
        return this._data.length;
    }
    
    public isEmpty(): boolean {
        return this._data.length === 0;
    }

    public has(virtualAddress: VirtualAddress): boolean {
        var includes: boolean = false;
        for (let i = 0; i < this._data.length; ++i) {
            if (this._data[i][1][0].equal(virtualAddress)) {
                includes = true;
            }
        }
        return includes;
    }

    public get(virtualAddress: VirtualAddress): PageTableEntry | undefined {
        var pageTableEntry: PageTableEntry | undefined = undefined;
        for (let i = 0; i < this._data.length; ++i) {
            if (this._data[i][1][0].equal(virtualAddress)) {
                pageTableEntry = this._data[i][1][1];
                this._data[i][0] += 1;
            }
        }
        this.sort();
        return pageTableEntry;
    }

    public toString(): string {
        return this._data.toString();
    }
}