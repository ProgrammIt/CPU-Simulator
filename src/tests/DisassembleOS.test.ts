import { readFileSync } from "node:fs";
import { DoubleWord } from "../types/binary/DoubleWord";
import { Assembler } from "../main/simulator/Assembler";
import { Byte } from "../types/binary/Byte";
import { disassemble } from "../main/simulator/Disassembler";

describe("Disassemble OS.asm", () => {

    test("Disassemble OS.asm", () => {
        const pathToLanguageDefinition = "./settings/language_definition.json";
		const pathToAssembly = "./assembly/";
        const compiledOS: DoubleWord[] = (new Assembler(pathToLanguageDefinition)).compile(readFileSync(`${pathToAssembly}/os/os.asm`, "utf-8"), 0)
        disassemble(compiledOS)
    });
});