/**
 * This class represents the base logic for batched logging.
 */
export abstract class AbstractBatchLogger {
    /**
     * This field acts as log buffer.
     */
    private _buffer: string[] = [];

    /**
     * This field  stores the current timer to flush the buffer once it times ou.
     */
    private _timer: NodeJS.Timeout | null = null;

    /**
     * This field stores the maximum size the buffer can grow to until it gets flushed automatically.
     */
    private _maxBatchSize: number;

    /**
     * This field stores the time in milliseconds it takes until the _timer runs out.
     */
    private _flushIntervalMs: number;

    /**
     * This boolean is used to enable or disable debounce mode.
     * _debounceMode = true -> The timer gets reset on each incoming message, timer only flushes buffer when no log activity is present.
     * _debounceMode = false -> The log flushes either if the timer runs out or if the _myxBatchSize is reached.
     */
    private _debounceMode: boolean;

    /**
     * This constructor creates an abstract batch logger.
     * @param maxBatchSize The maximum batch size of logs that get collected before a flush is triggered.
     * @param flushInterval The interval in ms in which the log buffer gets flushed.
     * @param debounceMode Turns debounce mode on or off. In debounce mode the timer gets reset each time a message comes in.
     */
    public constructor(maxBatchSize: number = 50, flushInterval: number = 100, debounceMode: boolean = false) {
        this._maxBatchSize = maxBatchSize;
        this._flushIntervalMs = flushInterval;
        this._debounceMode = debounceMode;

        // Sets permanent interval timer if debounce mode is disabled.
        if (!this._debounceMode) {
            this._timer = setInterval(() => this.flush(), this._flushIntervalMs);
        }
    }

    /**
     * This function adds a new message to the internal buffer and flushes it once the maxBatchSize is exceeded.
     * It also resets the timer if debounce mode is enabled.
     * @param message The message to put into the log buffer.
     */
    public push(message: string) {
        this._buffer.push(message);

        if (this._buffer.length >= this._maxBatchSize) {
            this.flush();
        }

        if (this._debounceMode) {
            if (this._timer) {
                clearTimeout(this._timer);
            }
            this._timer = setTimeout(() => this.flush(), this._flushIntervalMs);
        }
    }

    /**
     * This method flushes the internal batch buffer to the log destination.
     * @returns 
     */
    public flush() {
        if (this._buffer.length === 0) {
            return;
        }

        // In debounce mode the timer only runs and gets reset when a new message arrives. It does not need to run anymore when a manual flush was called.
        if (this._debounceMode && this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }

        const batchToSend = [...this._buffer];
        this._buffer = [];
        this.sendBatchToLog(batchToSend);
    }

    /**
     * This method is used to implement where the logs should be sent and how the data should be processed first.
     * @param logBatch The batch of logs that should be sent to the log destination.
     */
    protected abstract sendBatchToLog(logBatch: string[]): void;

}