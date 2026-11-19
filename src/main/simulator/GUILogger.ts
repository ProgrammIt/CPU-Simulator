import { getMainWindow } from "..";
import { AbstractBatchLogger } from "./AbstractBatchLogger";
/**
 * This class implements the AbstractBatchLogger and is used to batch logs together to send them to the GUI log widget.
 */
export class GUILogger extends AbstractBatchLogger {

    /**
     * This Method sends a batch of logs to the GUI log widget.
     * @param logBatch The batch of logs that should be sent to the GUI log widget.
     */
    protected sendBatchToLog(logBatch: string[]): void {
        getMainWindow()?.webContents.send('update_log', logBatch);
    }















}