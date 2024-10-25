import { readFileSync } from "fs";

class Assembler {
    private _langDefinition: Object;
    private static _instance: Assembler | null | undefined = null;

    private constructor() {};
    private split(): string {};
    private parse(): Bit[][] {};

    /**
     * This method returns the single instance of the Assembler class.
     * If there is no such instance, one and one is created. Otherwise, the exisiting one is returned.
     */
    public static get instance(): Assembler {
        if (Assembler._instance == null || Assembler._instance == undefined) {
            Assembler._instance = new Assembler();
        }
        return Assembler._instance;
    }
    
    /**
     * This method loads the assmebly language definition from the specified .json file. 
     * It must (!) be called before a computer program written in assembly can be compiled.
     * @param f A .json file containing the assembly language definition.
     * @returns
     */
    public async loadLanguageDefinition(f: File): Promise<void> {
        const data: string = readFileSync(f.path).toString();
        this._langDefinition = JSON.parse(data);
        return;
    }

    public compile(f: File): void {}
}