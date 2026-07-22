export class DebugLogger {

    private static readonly logging: boolean = false;

    private static indention: string = "";

    public static isLoggingEnabled(): boolean {

        return DebugLogger.logging;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static log(message?: any): void {

        if (this.logging) {
            console.log(DebugLogger.indention + message);
        }
    }

    public static addIndentation() {
        DebugLogger.indention += "  ";
    }

    public static removeIndentation() {
        DebugLogger.indention = DebugLogger.indention.length === 0 ? "" : DebugLogger.indention.substring(0, DebugLogger.indention.length - 2);
    }
}