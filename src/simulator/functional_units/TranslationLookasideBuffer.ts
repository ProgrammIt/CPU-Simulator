import { PageTableEntry } from "../../types/binary/PageTableEntry";
import { PageNumber } from "../../types/binary/PageNumber";

export class TranslationLookasideBuffer {
    private _data: Map<PageNumber, [PageTableEntry, number]>;
    private _oldest: [PageNumber, number] | undefined;
    private _capacity: number;

    public constructor(capacity: number) {
        this._data = new Map();
        this._oldest = undefined;
        this._capacity = capacity;
    }

    public insert(item: [PageNumber, PageTableEntry]): void {

        if (this.has(item[0])) {
            return;
        }
        if (this._data.size === this._capacity) {
            this.deleteOldest();
        }
        this._data.set(item[0], [item[1], 1]);
        this.updateOldest([item[0], 1]);
        return;
    }


    private deleteOldest(): boolean {

        if (this._oldest === undefined)
        {
            return false;
        }

        this._data.delete(this._oldest[0]);
        this.updateOldest(this._oldest);

        return true;
    }

    private updateOldest(updatedElement: [PageNumber, number]): void {
       
        if (this._oldest !== undefined && this._oldest[0] === updatedElement[0])
        {
            if (this._data.size === 0)
            {
                this._oldest = undefined;
                return;
            }

            this._oldest = updatedElement;

            for (const [key, [, count]] of this._data.entries()) {
                if (count < this._oldest[1]) {
                    this._oldest = [key, count];

                    if (this._oldest[1] === 1) { //Minimum count is 1
                        break;
                    }
                }
          }

            return;
        }

        this._oldest = this._oldest === undefined ? updatedElement : this._oldest[1] > updatedElement[1] ? updatedElement : this._oldest;
    }
    
    public size(): number {
        return this._data.size;
    }
    
    public isEmpty(): boolean {
        return this._data.size === 0;
    }

    public has(pageNumber: PageNumber): boolean {
        return this._data.has(pageNumber);
    }

    public get(pageNumber: PageNumber): PageTableEntry | undefined {
        const entry = this._data.get(pageNumber);

        if (entry === undefined)
        {
            return undefined;
        }

        entry[1]++;
        this.updateOldest([pageNumber, entry[1]]);

        return entry[0] as PageTableEntry;
    }

    public clear(): void {
        this._data.clear();
        this._oldest = undefined;
    }

    public toString(): string {
        return [...this._data.entries()]
            .map(([key, [a, b]]) => `${key},${a},${b}`)
            .join(",");
    }
}