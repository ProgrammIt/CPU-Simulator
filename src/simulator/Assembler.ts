class Assembler {
    private _langDefinition: Object;
    private static _instance: Assembler | null | undefined = null;

    private constructor() {};
    private split(): string {};
    private parse(): Bit[][] {};

    public static get instance(): Assembler {
        if (Assembler._instance == null || Assembler._instance == undefined) {
            Assembler._instance = new Assembler();
        }
        return Assembler._instance;
    }
    
    public loadLanguageDefinition(f: File): void {};
    public compile(f: File): void {};
}