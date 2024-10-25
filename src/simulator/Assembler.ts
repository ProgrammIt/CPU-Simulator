import { readFileSync } from "fs";

class Assembler {
  private _langDefinition: Object;
  private static _instance: Assembler | null | undefined = null;

  private constructor() {}

  /**
   * This method preprocesses the file contents of a computer program written in assembly language.
   * It takes a string holding the contents as an argument.
   * It removes all comments, leading and trailing whitespace
   * and splits the string into lines of code. The line order is preserved.
   * @param fileContents A string containing the contents of a computer program written in assembly language.
   * @returns A list of strings representing the original programs lines of code.
   */
  private preprocess(fileContents: string): string[] {
    const regexComment: RegExp = /[\s]*;.*/gim;
    const regexNewLine: RegExp = /\r?\n|\r/gim;
    var lines: string[] = fileContents
      .replace(regexComment, "")
      .split(regexNewLine);
    lines.forEach((elem, index) => {
      lines[index] = elem.trim();
    });
    return lines;
  }

  private parse(lines: string[]): DoubleWord[] {}

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

  /**
   * This method compiles a given computer program written in assembly language into its binary representation.
   * The instructions will be encoded using the opcodes defined in the language definition.
   * The order in which the instructions appear in the input program is preserved during the compilation process.
   * @param f An .asm file containing a computer program written in assembly language.
   * @returns A list of the binary encoded instructions of the given computer program.
   */
  public compile(f: File): DoubleWord[] {
    const data: string = readFileSync(f.path).toString();
    const elements: string[] = this.preprocess(data);
    return this.parse(elements);
  }
}