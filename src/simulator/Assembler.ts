class Assembler {
    private _langDefinition: Object;
    private _instance: Assembler;

    private constructor() {};
    private split(): string {};
    private parse(): Bit[][] {};
    public get instance(): Assembler {};
    public loadLanguageDefinition(f: File): void {};
    public compile(f: File): void {};
}