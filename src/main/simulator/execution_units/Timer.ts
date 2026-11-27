import { InterruptNumbers } from "../../../types/enumerations/InterruptNumbers";
import { CPUCore } from "./CPUCore";


/**
 * This class represents a Timer. This specialized unit is responsible
 * for Timed interrupts 
 */
export class Timer {

    public readonly core: CPUCore;
    
    private readonly timers: Map<number, number>;

    private readyID: number = 0;

    public constructor(core: CPUCore) {
        this.core = core;
        this.timers = new Map<number, number>();
    }

    public addTimer(id: number, time: number) {
        
        this.timers.set(id, time);
    }

    public countDown() {
        for (const [k, v] of this.timers) {
            if (v === 1) {
                this.readyID = k;
                this.timers.delete(k);
                this.core.triggertExternalInterrupt(InterruptNumbers.TIMER);
                continue;
            }
            this.timers.set(k, v - 1);
        }
    }

    public getReadyID():number {
        return this.readyID;
    }
}