import { InterruptNumbers } from "../../types/enumerations/InterruptNumbers";
import { CPUCore } from "./CPUCore";

/**
 * This class represents a periodic timer. It is part of the time slice management.
 * It is responsible for periodic interrupts.
 */
export class PeriodicTimer {
    private readonly core: CPUCore;
    private counter: number = 1;
    private timerSize: number = 1;

    public constructor(core: CPUCore) {
        this.core = core;
    }

    public setupTimer(counter: number) {
        this.counter = counter;
        this.timerSize = counter;
    }

    public countDown() {
        --this.counter;
        if (this.counter === 0) {
            this.counter = this.timerSize;
            this.core.triggertExternalInterrupt(InterruptNumbers.PERIODIC_TIMER);
        }
    }
}