import { AbstractBatchLogger } from "./AbstractBatchLogger";

export class DebugLogger extends AbstractBatchLogger {

    private static readonly logging: boolean = false;

    private indention: string = "";

    public static isLoggingEnabled(): boolean {

        return DebugLogger.logging;
    }

    public push(message: string) {
        if (!DebugLogger.logging) {
            return
        }

        super.push(this.indention + message)
    }

    public addIndentation() {
        this.indention += "  ";
    }

    public removeIndentation() {
        this.indention = this.indention.length === 0 ? "" : this.indention.substring(0, this.indention.length - 2);
    }

    /**
    * This Method sends a batch of logs to the GUI log widget.
    * @param logBatch The batch of logs that should be sent to the GUI log widget.
    */
    protected sendBatchToLog(logBatch: string[]): void {
        if (DebugLogger.logging) {
            console.log(logBatch.join("\n"));
        }
    }
}