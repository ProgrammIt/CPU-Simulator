import { createWriteStream, mkdirSync, rmdirSync, WriteStream } from "node:fs";
import { AbstractBatchLogger } from "./AbstractBatchLogger";
import { dirname } from "node:path";

export class DebugLogger extends AbstractBatchLogger {

    private static readonly logging: boolean = false;

    private indention: string = "";

    private stream: WriteStream | undefined;

    private readonly filename: string = `./logs/debug-${process.pid}.log`;



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
        if (DebugLogger.logging&& logBatch.length !== 0) {
            if (!this.stream) {
                const filename = `./logs/debug-${new Date().toISOString().slice(0, 19).replace("T", "_").replace(/:/g, "-")}_pid-${process.pid}.log`;

                mkdirSync(dirname(filename), { recursive: true });

                this.stream = createWriteStream(filename, {
                    flags: "w"
                });
            }
            this.stream.write(logBatch.join("\n"));
        }
    }

    /**
     * Disposes the logger and closes the file stream.
     */
public override async dispose(): Promise<void> {
    super.dispose();

    if (!this.stream) {
        return;
    }

    const stream = this.stream;
    this.stream = undefined;

    await new Promise<void>((resolve, reject) => {
        stream.end((error?: Error | null) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}
}


