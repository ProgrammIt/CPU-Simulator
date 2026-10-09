import { readFileSync } from "node:fs";
import { UnrecognizedInstructionError } from "../../types/errors/UnrecognizedInstructionError";
import { AssemblyInstruction, AssemblyLanguageDefinition } from "./compiler/AssemblyLanguageDefinition";
import { DoubleWord } from "../../types/binary/DoubleWord";
import { Byte } from "../../types/binary/Byte";
import { OpCode } from "../../types/enumerations/OpCode";
import { EncodedOperandTypes } from "../../types/enumerations/EncodedOperandTypes";
import { ProgramMetadata } from "../../types/enumerations/ProgramMetadata";
import { Word } from "../../types/binary/Word";

export class Assembler {
	private static readonly NEW_LINE_REGEX: RegExp = /\r?\n|\r/gim;
	public readonly languageDefinition: AssemblyLanguageDefinition;
 	public readonly pathToOSFilesystem: string

	private readonly nopInstruction: DoubleWord[];

	private encodingType: ProgramMetadata.InstructionEncodingType = ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS;
	private instructionAlignment: number = 0;
	private metadata: ProgramMetadata = [] as ProgramMetadata;
	private jumpLabels: Map<string, [number, number | null]> = new Map();
	private aliases: Map<string, DoubleWord> = new Map();
	private constants: Map<string, DoubleWord[]> = new Map();
	private initializedData: Map<string, DoubleWord[]> = new Map();
	private uninitializedData: Map<string, number> = new Map();
	
	/**
	 * Constructs a new assembler object with the given processing width.
	 * @param pathToLanguageDefinition The path to the language definition file of the assembly language used by this assembler.
	 * @param pathToOSFilesystem 
	 */
	public constructor(pathToLanguageDefinition: string, pathToOSFilesystem: string) {
		this.languageDefinition = JSON.parse(readFileSync(pathToLanguageDefinition, "utf-8"));
		this.pathToOSFilesystem = pathToOSFilesystem;
		this.nopInstruction = this.encodeLine(0, "NOP", 1) as DoubleWord[];
	}

	/**
	 * This method preprocesses the file contents of a computer program written in assembly language.
	 * It removes all comments, leading and trailing whitespace and splits the file contents into seperate lines of code.
	 * It also replaces all include labels with the file content.
	 * The line order is preserved.
	 * @param fileContents A string containing the contents of a computer program written in assembly language.
	 * @returns A map, which maps line numbers to strings representing the original programs lines of code.
	 */
	private preprocess(fileContents: string): Map<number, string> {
		const lines: Map<number, string> = new Map();

		const includedContent: string = this.replaceIncludeLabels(fileContents);

		// Split file contents into lines of code, remove comments and mark empty lines for deletion
		const commentRegex = new RegExp(this.languageDefinition.comment_format, "gim");
		includedContent.split(Assembler.NEW_LINE_REGEX).forEach((line, lineNo) => {
			const lineWithoutComment: string = line.trim().replace(commentRegex, "");
			if (lineWithoutComment.length !== 0) {
				// Store line of code in map.
				lines.set(lineNo, lineWithoutComment);
			}
			
		});
		return lines;
	}

	/**
	 * This preprocesses method replaces a include label with the contents of the declared file.
	 * Include labels present in the declared assembly file are also replaced recursively.
	 * @param fileContents A string containing the include label.
	 * @returns A string, which contains the content of the file referenced in the include label.
	 */
	private replaceIncludeLabels(fileContents: string): string {

		let includedContent: string = "";

		// Replace the Include with the content
		const includeRegex = new RegExp(this.languageDefinition.include_format, "gim");
		fileContents.split(Assembler.NEW_LINE_REGEX).forEach((line) => {
			
			let lineContent: string = line;
			const regexMatch: RegExpMatchArray | null = includeRegex.exec(line);
			if (regexMatch !== null) {
				// Include found.
				const fileName: string = regexMatch[1];

				let fileContents: string = readFileSync(this.pathToOSFilesystem + "/" + fileName + ".asm", "utf-8");
				fileContents = this.replaceIncludeLabels(fileContents)

				lineContent = line.replace(includeRegex, () => fileContents);
			}

			if (lineContent.length !== 0) {
				includedContent += lineContent + "\n";
			}			
		});

		return includedContent;
	}

	/**
	 * This method encodes the reduced assembly program to its binary equivalent.
	 * @param lines A map, which maps line numbers to strings representing the original programs lines of code.
	 * @param baseOffset Base address where the program will be in memory. Default is 0.
	 * @returns An array of doublewords representing the encoded instructions and their operands of the assembly program.
	 */
	private encode(lines: Map<number, string>, baseOffset: number = 0): DoubleWord[] {
		
		// First pass (Locate all symbols (constants, global variables, labels))

		this.locateSymbols(lines);

		let instructionSize = 0;
		let alignmentOffset = 0;

		// Second pass (encode all possible lines)
		let byteCount = 0;
		const encodedInstructionsWithSymbols: Map<number, DoubleWord[] | string> = new Map();
		for (const [lineNo, line] of lines.entries()) {

			for (const [jumpLabel, [jumpLineNo, jumpAddress]] of this.jumpLabels.entries()) {
				if (lineNo < jumpLineNo) {
					break;
				}
				if (jumpAddress !== null) {
					continue;
				}
				this.jumpLabels.set(jumpLabel, [jumpLineNo, byteCount + baseOffset]);
			}

			const encodedLine = this.encodeLine(lineNo, line, 1);
			if (typeof encodedLine === "number") {
				encodedInstructionsWithSymbols.set(lineNo, line);
				instructionSize = encodedLine * DoubleWord.NUMBER_OF_BYTES;
			} else {
				encodedInstructionsWithSymbols.set(lineNo, encodedLine);
				instructionSize = encodedLine.length * DoubleWord.NUMBER_OF_BYTES;
			}

			if (this.instructionAlignment !== Byte.ZERO && (instructionSize % this.instructionAlignment) + alignmentOffset > this.instructionAlignment) { //This breaks alignemnt
				//Insert NOPs to preserve alignment
				if (typeof encodedLine !== "number") {
					const padding: DoubleWord[] = [];
					for (let i = alignmentOffset; i < this.instructionAlignment; i += DoubleWord.NUMBER_OF_BYTES) {
						padding.push(...this.nopInstruction);
					}
					padding.push(...encodedLine);
					encodedInstructionsWithSymbols.set(lineNo, padding);
				}

				instructionSize += this.instructionAlignment - alignmentOffset;
			}

			alignmentOffset += instructionSize;
			alignmentOffset = this.instructionAlignment === Byte.ZERO ? 0 : alignmentOffset % this.instructionAlignment;

			byteCount += instructionSize;
		}

		for (const [jumpLabel, [jumpLineNo,]] of this.jumpLabels.entries()) {
			if ([...lines.keys()].at(-1)! < jumpLineNo) {
				this.jumpLabels.set(jumpLabel, [jumpLineNo, byteCount + baseOffset]);
			}
		}

		if (alignmentOffset !== 0)
		{
			const padding: DoubleWord[] = [];
			for (let i = alignmentOffset; i < this.instructionAlignment; i += DoubleWord.NUMBER_OF_BYTES) {
				padding.push(...this.nopInstruction);
			}
			encodedInstructionsWithSymbols.set(Math.max(...encodedInstructionsWithSymbols.keys()) + 1, padding);
			byteCount += padding.length * DoubleWord.NUMBER_OF_BYTES;
		}
 
		this.writeMetadata(baseOffset, byteCount);

		// Third pass (decode all lines with unresolved dependencies)
		if (Array.from(encodedInstructionsWithSymbols.values()).some(v => typeof v === "string")) {
			byteCount = 0;
			alignmentOffset = 0;
			instructionSize = 0
			for (const [lineNo, line] of encodedInstructionsWithSymbols.entries()) {

				if (typeof line !== "string") {
					instructionSize = line.length * DoubleWord.NUMBER_OF_BYTES;
				} else {
					const encodedLine = this.encodeLine(lineNo, line, 2);
					if (typeof encodedLine === "number") {
						throw new Error("Could not encode the line:" + line);
					} else {
						encodedInstructionsWithSymbols.set(lineNo, encodedLine);
						instructionSize = encodedLine.length * DoubleWord.NUMBER_OF_BYTES;
					}
					
					if (this.instructionAlignment !== Byte.ZERO && (instructionSize % this.instructionAlignment) + alignmentOffset > this.instructionAlignment) { //This breaks alignemnt
						//Insert NOPs to preserve alignment
						const padding: DoubleWord[] = [];
						for (let i = alignmentOffset; i < this.instructionAlignment; i += DoubleWord.NUMBER_OF_BYTES) {
							padding.push(...this.nopInstruction);
						}
						padding.push(...encodedLine);
						encodedInstructionsWithSymbols.set(lineNo, padding);

						instructionSize += this.instructionAlignment - alignmentOffset;
					}
				}

				alignmentOffset += instructionSize;
				alignmentOffset = this.instructionAlignment === Byte.ZERO ? 0 : alignmentOffset % this.instructionAlignment;

				byteCount += instructionSize
			}
		}

		if (byteCount !== ProgramMetadata.getTextSegmentSize(this.metadata)) {
			throw new Error("The actual Program size differs from the precomputed size: " + byteCount + " vs " + this.metadata[11]);
		}

		return this.metadata.concat(Array.from(encodedInstructionsWithSymbols.values())
				.filter((v): v is DoubleWord[] => Array.isArray(v))
				.flat());
	}

	private writeMetadata(baseOffset: number, byteCount: number): void {

		const textSizeBytes: number = byteCount;
		const roDataSizeBytes: number = [...this.constants.values()].flat().length * DoubleWord.NUMBER_OF_BYTES;
		const dataSizeBytes: number = [...this.initializedData.values()].flat().length * DoubleWord.NUMBER_OF_BYTES;
		const uninitializedDataSizeBytes: number = [...this.uninitializedData.values()].reduce((sum, size) => sum + size, 0);

		//calculate important offsets and sizes
		const pageSize: number = 4096;
		const pageTableEntries: number = 1024;
		const numberOfPagesText: number = Math.ceil(textSizeBytes / pageSize);
		const numberOfPagesRoData: number = Math.ceil(roDataSizeBytes / pageSize);
		const numberOfPagesData: number = Math.ceil(dataSizeBytes / pageSize);
		const numberOfPagesUninitializedData: number = Math.ceil(uninitializedDataSizeBytes / pageSize);

		const totalNeededPages: number = numberOfPagesText + numberOfPagesRoData + numberOfPagesData + numberOfPagesUninitializedData;

		const neededL2PageTables: number = Math.ceil(totalNeededPages / pageTableEntries);

		// calculate base addresses
		const roDataBaseAddress: number = (numberOfPagesText * pageSize) + baseOffset;
		const dataBaseAddress: number = ((numberOfPagesText + numberOfPagesRoData) * pageSize) + baseOffset;
		const uninitializedDataBaseAddress: number = ((numberOfPagesText + numberOfPagesRoData + numberOfPagesData) * pageSize) + baseOffset;

		// prepare elf header
		const magicNumber: DoubleWord = ProgramMetadata.ICE_MAGIC_NUMBER;
		const programHeaderOffset: DoubleWord = DoubleWord.fromNumber(ProgramMetadata.ICE_HEADER_SIZE_IN_DOUBLEWORDS * DoubleWord.NUMBER_OF_BYTES);

		this.metadata.push(magicNumber);
		this.metadata.push(programHeaderOffset);
		this.metadata.push(DoubleWord.fromWords(ProgramMetadata.ISA_VERSION, Word.fromBytes(this.encodingType as Byte, this.instructionAlignment / DoubleWord.NUMBER_OF_BYTES as Byte)));
		this.metadata.push(DoubleWord.ZERO);


		// calculate file offsets
		const textFileOffset: number = ProgramMetadata.SIZE_IN_BYTES;
		const roDataFileOffset: number = textFileOffset + textSizeBytes;
		const dataFileOffset: number = roDataFileOffset + roDataSizeBytes;

		// write metadata
		this.metadata.push(DoubleWord.fromNumber(neededL2PageTables));

		// text metadata
		this.metadata.push(DoubleWord.fromNumber(baseOffset));
		this.metadata.push(DoubleWord.fromNumber(textFileOffset));
		this.metadata.push(DoubleWord.fromNumber(textSizeBytes));

		// roData metadata
		this.metadata.push(DoubleWord.fromNumber(roDataBaseAddress));
		this.metadata.push(DoubleWord.fromNumber(roDataFileOffset));
		this.metadata.push(DoubleWord.fromNumber(roDataSizeBytes));

		// data metadata
		this.metadata.push(DoubleWord.fromNumber(dataBaseAddress));
		this.metadata.push(DoubleWord.fromNumber(dataFileOffset));
		this.metadata.push(DoubleWord.fromNumber(dataSizeBytes));

		// uninitialized data metadata
		this.metadata.push(DoubleWord.fromNumber(uninitializedDataBaseAddress));
		this.metadata.push(DoubleWord.fromNumber(uninitializedDataSizeBytes));
	
	}

	/**
	 * This method encodes a single line of assembly code.
	 * @param lineNo The original computer programs line number of code which is currently encoded.
	 * @param line The original computer programs line of code which is currently encoded.
	 * @returns An array of doublewords representing the encoded instructions and their operands of the assembly program or the number of required DoubleWords.
	 */
	private encodeLine(lineNo: number, line: string, encodingPassCount: number) : DoubleWord[] | number {	
		let encodedInstructions: DoubleWord[] | number = 0;
		let lineEncoded = false;

		for (const instruction of this.languageDefinition.instructions) {

			if (!line.trim().startsWith(instruction.mnemonic + " ") && line.trim() !== instruction.mnemonic)
			{
				continue;
			}
			encodedInstructions = this.encodeInstruction(instruction, line, lineNo, encodingPassCount);
			lineEncoded = true;
			break;
		}

		if (!lineEncoded) {
			throw new UnrecognizedInstructionError(`Unrecognized or invalid instruction found in line ${lineNo + 1}: ${line}`);
		}

		return encodedInstructions;
	}

	/**
	 * This method locates symbols in the assembly code and stores them in the appropriate map.
	 * For jump labels a map between a jump label and a (virtual) memory address is created and the jump label is removed from the code,
	 * since they won't be translated.
	 * For symbolic integer constants their value is mapped to their symbolic name and for string constants the (virtual) memory start address gets
	 * mapped to their symbolic name.
	 * The lines with symbolic integer constants get removed, since their symbolic name gets replaced by their value later.
	 * For symbolic variables their (virtual) memory start address gets mapped to their symbolic name.
	 * @param lines A map, which maps line numbers to strings representing the original programs lines of code.
	 */
	private locateSymbols(lines: Map<number, string>) : void {
		for (const [lineNo, line] of lines.entries()) {

			if (line.match(new RegExp(this.languageDefinition.constant_formats.declarationBinary, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.constant_formats.declarationBinary, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					this.aliases.set(regexMatch[1], this.encodeBinaryValue(regexMatch[2]));
					lines.delete(lineNo);
				}
				continue;
			}
			
			if (line.match(new RegExp(this.languageDefinition.constant_formats.declarationDecimal, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.constant_formats.declarationDecimal, "gim");
				const	regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					this.aliases.set(regexMatch[1], this.encodeDecimalValue(regexMatch[2]));
					lines.delete(lineNo);
				}
				continue;
			} 
			
			if (line.match(new RegExp(this.languageDefinition.constant_formats.declarationHexadecimal, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.constant_formats.declarationHexadecimal, "gim");
				const	regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					this.aliases.set(regexMatch[1], this.encodeHexadecimalValue(regexMatch[2]));
					lines.delete(lineNo);
				}
				continue;
			}
			
			if (line.match(new RegExp(this.languageDefinition.constant_formats.declarationString, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.constant_formats.declarationString, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					this.constants.set(regexMatch[1], this.encodeString(lineNo, line, regexMatch[2]));
					lines.delete(lineNo);
				}
				continue;
			} 
			
			if (line.match(new RegExp(this.languageDefinition.variable_formats.declarationBinary, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.variable_formats.declarationBinary, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					this.initializedData.set(regexMatch[1], [this.encodeBinaryValue(regexMatch[2])]);
					lines.delete(lineNo);
				}
				continue;
			} 
			
			if (line.match(new RegExp(this.languageDefinition.variable_formats.declarationDecimal, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.variable_formats.declarationDecimal, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					this.initializedData.set(regexMatch[1], [this.encodeDecimalValue(regexMatch[2])]);
					lines.delete(lineNo);
				}
				continue;
			} 
			
			if (line.match(new RegExp(this.languageDefinition.variable_formats.declarationHexadecimal, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.variable_formats.declarationHexadecimal, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					this.initializedData.set(regexMatch[1], [this.encodeHexadecimalValue(regexMatch[2])]);
					lines.delete(lineNo);			
				}
				continue;
			} 
			
			if (line.match(new RegExp(this.languageDefinition.variable_formats.declarationString, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.variable_formats.declarationString, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					this.initializedData.set(regexMatch[1], this.encodeString(lineNo, line, regexMatch[2]));
					lines.delete(lineNo);						
				}
				continue;
			}
									
			if (line.match(new RegExp(this.languageDefinition.variable_formats.declarationBuffer, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.variable_formats.declarationBuffer, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					this.uninitializedData.set(regexMatch[2], this.encodeDecimalValue(regexMatch[1]));
					lines.delete(lineNo);					
				}
				continue;
			}
			
			if (line.match(new RegExp(this.languageDefinition.label_formats.declaration, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.label_formats.declaration, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					this.jumpLabels.set(regexMatch[1], [lineNo+1, null]);
					lines.delete(lineNo);
				}
				continue;
			}
		}
	}

	/**
	 * This method encodes a null terminated string by writing it to memory and adding a jump instruction to the first memory address after the string.
	 * @param lineNo The original computer programs line number of code which is currently encoded.
	 * @param line The original computer programs line of code which is currently encoded.
	 * @param stringValue The string content.
	 * @returns An array containing the binary equivalent of the given instruction and its operand values.
	 */
	private encodeString(lineNo: number, line: string, stringValue: string) : DoubleWord[] {
		const encodedString: DoubleWord[] = [];
		let stringEncoded = false; 

		if (!stringValue.endsWith("\0")) {
			stringValue += "\0";
		}

		//Create a buffer from the string in utf8 encoding and calculate some important values.
		const stringBuffer = Buffer.from(stringValue, "utf8");
		const stringByteLength = stringBuffer.length;
		const continuousBufferSegmentSize = stringByteLength - (stringByteLength % 4);
		const restOfBufferSize = stringByteLength % 4;
		//Slice the part of the buffer that is divisible by four (in byte) into 32 bit big segments
		//and encode each segment into binary values.
		if (continuousBufferSegmentSize > 0) {
			for (let i = 0; i < continuousBufferSegmentSize; i += 4) {
				const byte1 = Byte.fromNumber(stringBuffer[i]);
				const byte2 = Byte.fromNumber(stringBuffer[i+1]);
				const byte3 = Byte.fromNumber(stringBuffer[i+2]);
				const byte4 = Byte.fromNumber(stringBuffer[i+3]);
				const encodedStringPart = DoubleWord.fromBytes(byte1, byte2, byte3, byte4);
				encodedString.push(encodedStringPart);
			}
		}
		//Get the last bytes from the buffer
		if (restOfBufferSize > 0) {
			const byte1 = Byte.fromNumber(stringBuffer[continuousBufferSegmentSize]);
			const byte2 = Byte.fromNumber(restOfBufferSize > 1 ? stringBuffer[continuousBufferSegmentSize+1] : 0);
			const byte3 = Byte.fromNumber(restOfBufferSize > 2 ? stringBuffer[continuousBufferSegmentSize+2] : 0);
			const byte4 = Byte.ZERO;
			const encodedStringPart = DoubleWord.fromBytes(byte1, byte2, byte3, byte4);
			encodedString.push(encodedStringPart);
		}
		stringEncoded = true;
		
		if (!stringEncoded) {
			throw new Error(`Error encoding string in line: ${lineNo + 1}: ${line}`);
		}
		return encodedString;
	}

	/**
	 * This method binary encodes a given instruction and its operands values.
	 * It is used for insructions that contain no indirect access to a register with an offset.
	 * @param regexMatchArrayInstruction An array containing the results of a match of a regular expression on an instruction.
	 * @param lineNo The original computer programs line of code which is currently encoded.
	 * @returns An array containing the binary equivalent of the given instruction and its operand values or the number of required DoubleWords.
	 */
	private encodeInstruction(instruction: AssemblyInstruction, line: string, lineNo: number, encodingPassCount: number): DoubleWord[] | number {
		let allowFirstOperandPacking = true;
		let allowSecondOperandPacking = true;
		let unresolvable = false;

		if (line.match(new RegExp(this.languageDefinition.constant_formats.usage, "gim"))) {
			const regexExp = new RegExp(this.languageDefinition.constant_formats.usage, "gim");
			const regexMatch = regexExp.exec(line);

			if (regexMatch !== null && this.aliases.has(regexMatch[2])) {
				line = line.replace(regexMatch[2], this.aliases.get(regexMatch[2])!.toString());
			} else if (regexMatch !== null && this.constants.has(regexMatch[2])) {
				unresolvable = unresolvable || this.metadata.length === 0;
				let address = unresolvable ? DoubleWord.ZERO : ProgramMetadata.getRoDataSegmentVirtualStartAddress(this.metadata);
				for (const [name, data] of this.constants) {
					if (regexMatch[2] === name || unresolvable)
					{
						break;
					}
					address = DoubleWord.fromNumber(address + data.length * DoubleWord.NUMBER_OF_BYTES);
				}

				const operands = line.replace(",", "").split(" ");
				line = line.replace(regexMatch[2], address.toString());
				allowFirstOperandPacking = allowFirstOperandPacking && operands.indexOf(regexMatch[0]) !== 1;
				allowSecondOperandPacking = allowSecondOperandPacking && !allowFirstOperandPacking;
			}
		}

		while (line.match(new RegExp(this.languageDefinition.variable_formats.usage, "gim"))) {
			const regexExp = new RegExp(this.languageDefinition.variable_formats.usage, "gim");
			const regexMatch = regexExp.exec(line);

			if (regexMatch !== null && (this.initializedData.has(regexMatch[2]) || this.uninitializedData.has(regexMatch[2]))) {

				let address = DoubleWord.ZERO;
				if (this.initializedData.has(regexMatch[2])) {
					unresolvable = unresolvable || this.metadata.length === 0;
					address = unresolvable ? DoubleWord.ZERO : ProgramMetadata.getRoDataSegmentVirtualStartAddress(this.metadata);
					for (const [name, data] of this.initializedData) {
						if (regexMatch[2] === name || unresolvable)
						{
							break;
						}
						address = DoubleWord.fromNumber(address + data.length * DoubleWord.NUMBER_OF_BYTES);
					}
				} else if (this.uninitializedData.has(regexMatch[2])) {
					unresolvable = unresolvable || this.metadata.length === 0;
					address = unresolvable ? DoubleWord.ZERO : ProgramMetadata.getUninitializedDataSegmentVirtualStartAddress(this.metadata);
					for (const [name, size] of this.uninitializedData) {
						if (regexMatch[2] === name || unresolvable)
						{
							break;
						}
						address = DoubleWord.fromNumber(address + size);
					}
				}

				const operands = line.replace(",", "").split(" ");
				line = line.replace(regexMatch[2], address.toString());
				allowFirstOperandPacking = allowFirstOperandPacking && operands.indexOf(regexMatch[0]) !== 1;
				allowSecondOperandPacking = allowSecondOperandPacking && !allowFirstOperandPacking;
			} else {
				break;
			}
		}

		const operand1: {name: string, allowed_types: string[]} | null = instruction.operands?.[0] ?? null;
		const operand2: {name: string, allowed_types: string[]} | null = instruction.operands?.[1] ?? null;
		let regexMatch: RegExpMatchArray | null = null;
		if (operand1 !== null) {
			/*
			* Iterate over all possible combinations of operand types
			* and check if the resulting regex matches the current line of code.
			*/
			outer: for (const operand1TypeString of operand1.allowed_types) {

				if (operand2 === null) {
					// Locate the operand type of the first operand in the language definition.
					const operand1TypeDefinition: {name: string; code: string; regex: string;}
						= this.languageDefinition.operand_types.find((current) => current.name === operand1TypeString)!;

					const regexInstruction = new RegExp(
						instruction.regex.replace(operand1.name, operand1TypeDefinition.regex),
						"gim"
					);
					// Check if the current line of code matches the created regex.
					regexMatch = regexInstruction.exec(line);
					if (regexMatch !== null) {
						break;
					}
					continue;
				}

				for (const operand2TypeString of operand2.allowed_types) {
					// Create a combination of operand types.
					const typeCombination: { __SOURCE__: string, __TARGET__: string } 
							= { __SOURCE__ : operand1TypeString, __TARGET__ : operand2TypeString };
					// Check if the combination of operand types is forbidden for this instruction.
					if (instruction.illegal_combinations_of_operand_types !== undefined && instruction.illegal_combinations_of_operand_types.includes(typeCombination)) {
						throw new UnrecognizedInstructionError(`Invalid instruction found in line ${lineNo + 1}: ${line}`);
					}
					// Locate the operand type of the first operand in the language definition.
					const operand1TypeDefinition: {name: string; code: string; regex: string;}
						= this.languageDefinition.operand_types.find((current) => current.name === operand1TypeString)!;
					// Locate the operand type of the second operand in the language definition.
					const operand2TypeDefinition: {name: string; code: string; regex: string;}
						= this.languageDefinition.operand_types.find((current) => current.name === operand2TypeString)!;
					// Create a regex for the current combination of operand types.
					const regexInstruction = new RegExp(
						instruction.regex
							.replace(operand1.name, operand1TypeDefinition.regex)
							.replace(operand2.name, operand2TypeDefinition.regex), 
						"gim"
					);
					// Check if the current line of code matches the created regex.
					regexMatch = regexInstruction.exec(line);
					if (regexMatch !== null) {
						break outer;
					}
					continue;
				}
			}
		}
		else {
			regexMatch = new RegExp(instruction.regex, "gim").exec(line);
		}
		
		if (regexMatch === null) { 
			throw new UnrecognizedInstructionError(`Unrecognized or invalid instruction found in line ${lineNo + 1}: ${line}`);
		}

		const opcode: number = parseInt(instruction.opcode, 2);
		if (!(opcode in OpCode)) {
			throw new UnrecognizedInstructionError(`Unrecognized or invalid instruction found in line ${lineNo + 1}: ${regexMatch[1]}`);
		}
			
		const handleLabelsAsImmediate = opcode === OpCode.MOV;

		let typeOperand1: EncodedOperandTypes = EncodedOperandTypes.NO;
		let encodedOperandValue1: DoubleWord | null = null;

		if (regexMatch.length > 2) { // Check for first operand
			typeOperand1 = this.encodeOperandType(regexMatch[2], lineNo, handleLabelsAsImmediate);
			if (this.jumpLabels.has(regexMatch[2])) {
				unresolvable = unresolvable || this.jumpLabels.get(regexMatch[2])![1] === null;
				encodedOperandValue1 = unresolvable ? DoubleWord.ZERO : DoubleWord.fromNumber(this.jumpLabels.get(regexMatch[2])![1] as number);
				allowFirstOperandPacking = encodingPassCount === 1 && !unresolvable;
			} else {
				encodedOperandValue1 = this.encodeOperandValue(regexMatch[2], lineNo);
			}
		}

		let embeddedOperand1 = 0;
		let embeddedOperand2 = 0;

		switch (typeOperand1) {
			case EncodedOperandTypes.NO:
				switch (this.encodingType) {
					case ProgramMetadata.InstructionEncodingType.FIXED_SIZE:
						typeOperand1 ^= 0b1000;
						encodedOperandValue1 = DoubleWord.ZERO;
						break;
					case ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE:
					case ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS:
						break;
				}
				break;
			case EncodedOperandTypes.REGISTER_DIRECT:
			case EncodedOperandTypes.REGISTER_INDIRECT:
				switch (this.encodingType) {
					case ProgramMetadata.InstructionEncodingType.FIXED_SIZE:
					case ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE:
						typeOperand1 ^= 0b1000;
						break;
					case ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS:
						embeddedOperand1 = encodedOperandValue1!;
						encodedOperandValue1 = null
						break;
				}
				break;
			case EncodedOperandTypes.IMMEDIATE:
			case EncodedOperandTypes.MEMORY_ADDRESS:
				switch (this.encodingType) {
					case ProgramMetadata.InstructionEncodingType.FIXED_SIZE:
					case ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE:
						break;
					case ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS:
						if (encodedOperandValue1! < 2**Byte.NUMBER_OF_BITS && allowFirstOperandPacking)
						{
							typeOperand1 ^= 0b1000;
							embeddedOperand1 = encodedOperandValue1!;
							encodedOperandValue1 = null;
						}
						break;
				}
				break;
			default:
				break;
		}


		let typeOperand2: EncodedOperandTypes = EncodedOperandTypes.NO;
		let encodedOperandValue2: DoubleWord | null = null;

		if (regexMatch.length > 3) { // Check for second operand
			typeOperand2 = this.encodeOperandType(regexMatch[3], lineNo, handleLabelsAsImmediate);
			if (this.jumpLabels.has(regexMatch[3])) {
				unresolvable = unresolvable || this.jumpLabels.get(regexMatch[3])![1] === null;
				encodedOperandValue2 = unresolvable ? DoubleWord.ZERO : DoubleWord.fromNumber(this.jumpLabels.get(regexMatch[3])![1] as number);
				allowSecondOperandPacking = encodingPassCount === 1 && !unresolvable;
			} else {
				encodedOperandValue2 = this.encodeOperandValue(regexMatch[3], lineNo);
			}
		}

		switch (typeOperand2) {
			case EncodedOperandTypes.NO:
				switch (this.encodingType) {
					case ProgramMetadata.InstructionEncodingType.FIXED_SIZE:
						typeOperand2 ^= 0b1000;
						encodedOperandValue2 = DoubleWord.ZERO;
						break;
					case ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE:
					case ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS:
						break;
				}
				break;
			case EncodedOperandTypes.REGISTER_DIRECT:
			case EncodedOperandTypes.REGISTER_INDIRECT:
				switch (this.encodingType) {
					case ProgramMetadata.InstructionEncodingType.FIXED_SIZE:
					case ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE:
						typeOperand2 ^= 0b1000;
						break;
					case ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS:
						embeddedOperand2 = encodedOperandValue2!;
						encodedOperandValue2 = null
						break;
				}
				break;
			case EncodedOperandTypes.IMMEDIATE:
			case EncodedOperandTypes.MEMORY_ADDRESS:
				switch (this.encodingType) {
					case ProgramMetadata.InstructionEncodingType.FIXED_SIZE:
					case ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE:
						break;
					case ProgramMetadata.InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS:
						if (encodedOperandValue2! < 2**Byte.NUMBER_OF_BITS && allowSecondOperandPacking)
						{
							typeOperand2 ^= 0b1000;
							embeddedOperand2 = encodedOperandValue2!;
							encodedOperandValue2 = null;
						}
						break;
				}
				break;
			default:
				break;
		}

		const finalInstruction: DoubleWord = DoubleWord.fromNumber(0
			+ (opcode << (8 * 3))
			+ (typeOperand1 << (8 * 2 + 4))
			+ (typeOperand2 << (8 * 2))
			+ (embeddedOperand1 << 8)
			+ (embeddedOperand2)
		);
		
  		const result: DoubleWord[] = [finalInstruction];

		if (encodedOperandValue1 !== null) {
			result.push(encodedOperandValue1);
		}

		if (encodedOperandValue2 !== null) {
			result.push(encodedOperandValue2);
		}

		if (unresolvable)
		{
			return result.length;
		}

		return result;
	}

	/**
	 * This method requires an operand that is coded into its binary form.
	 * It extracts the addressing mode and converts the given decimal, hexadecimal or binary value into an 32-bit value.
	 * The method returns a tupel of binary lists. The first one contains the operand as part of the instruction. According to
	 * the opcodes definition, this part of the instruction serves as an indicator for the datatype of the operand.
	 * The second one represents the actual value encoded as a 32-bit value.
	 * @param operand The operand to encode binary.
	 * @param line The original computer programs line of code which is currently encoded.
	 * @returns The binary encoded operand
	 */
	private encodeOperandValue(operand: string, line: number): DoubleWord {
		let operand32BitEncoded: DoubleWord;
		if (operand.length === 0) {
			operand32BitEncoded = DoubleWord.ZERO;
		} else if (operand.startsWith("$0b") || operand.startsWith("$-0b")) {
			// Binary immediate found.
			operand32BitEncoded = this.encodeBinaryValue(operand.replace("$", ""));
		} else if (operand.startsWith("$-0x") || operand.startsWith("$0x")) {
			// Hexadecimal immediate found.
			operand32BitEncoded = this.encodeHexadecimalValue(operand.replace("$", ""));
		} else if (operand.startsWith("$-") || operand.startsWith("$")) {
			// Decimal immediate found.
			operand32BitEncoded = this.encodeDecimalValue(operand.replace("$", ""));
		} else if (operand.startsWith("@0b")) {
			// Binary virtual memory address found.
			operand32BitEncoded = this.encodeBinaryValue(operand.replace("@", ""));
		} else if (operand.startsWith("@0x")) {
			// Hex virtual memory address found.
			operand32BitEncoded = this.encodeHexadecimalValue(operand.replace("@", ""),);
		} else if (operand.startsWith("@")) {
			// Decimal virtual memory address found.
			operand32BitEncoded = this.encodeDecimalValue(operand.replace("@", ""));
		} else if (operand.startsWith("*%")) {
			// Register used with indirect addressing mode
			operand32BitEncoded = this.encodeRegister(operand.replace("*%", ""), line);
		} else if (operand.startsWith("%")) {
			// Register used with direct addressing mode
			operand32BitEncoded = this.encodeRegister(operand.replace("%", ""), line);
		} else {
			throw Error(`In line ${line + 1}: Unrecognized operand type and value. Caused by: ` + operand);
		}
		return operand32BitEncoded;
	}

	/**
	 * This method encodes an operands binary value into its 32-bit representation.
	 * @param operand The binary value to encode.
	 * @param line The line of code which this operand originates from.
	 * @returns The 32-bit binary representation of the given immediate operand.
	 */
	private encodeBinaryValue(operand: string): DoubleWord {
		operand = operand.replace("0b", "");
		if (operand.startsWith("-")) {
			// Negative value.
			return DoubleWord.fromNumber(parseInt(operand.replace("-", ""), 2) * -1);
		}
	
		// Positive value.
		return DoubleWord.fromNumber(parseInt(operand, 2));
	}

	/**
	 * This method encodes an operands hexadecimal value into its 32-bit binary representation.
	 * @param operand The hexadecimal value to encode.
	 * @returns The 32-bit binary representation of the given immediate operand.
	 */
	private encodeHexadecimalValue(operand: string): DoubleWord {
		operand = operand.replace("0x", "");
		if (operand.startsWith("-")) {
			// Negative value.
			return DoubleWord.fromNumber(parseInt(operand.replace("-", ""), 16) * -1);
		}
	
		// Positive value.
		return DoubleWord.fromNumber(parseInt(operand, 16));
	}

	/**
	 * This method encodes an operands decimal value into its 32-bit binary representation.
	 * @param operand The decimal value to encode.
	 * @returns The 32-bit binary representation of the given immediate operand.
	 */
	private encodeDecimalValue(operand: string): DoubleWord {
		if (operand.startsWith("-")) {
			// Negative value.
			return DoubleWord.fromNumber(parseInt(operand.replace("-", ""), 10) * -1);
		}
	
		// Positive value.
		return DoubleWord.fromNumber(parseInt(operand, 10));
	}

	/**
	 * This method encodes the given operands type.
	 * @param operand An operand whichs type will be encoded.
	 * @param line The original computer programs line of code which is currently encoded.
	 * @param handleLabelsAsImmediate By default labels will be interpreted as addresses. Set to true to use the label address as immediate value.
	 * @returns The binary encoded operands type.
	 */
	private encodeOperandType(operand: string, line: number, handleLabelsAsImmediate: boolean = false): EncodedOperandTypes {
		if (operand.length === 0) {
			return EncodedOperandTypes.NO;
		} 
		if (operand.startsWith("%")) {
			return EncodedOperandTypes.REGISTER_DIRECT;
		} 
		if (operand.startsWith("*%")) {
			return EncodedOperandTypes.REGISTER_INDIRECT;
		}
		if (operand.startsWith("$") || (operand.match(this.languageDefinition.label_formats.usage) && handleLabelsAsImmediate)) {
			return EncodedOperandTypes.IMMEDIATE;
		}
		if (operand.startsWith("@") || (operand.match(this.languageDefinition.label_formats.usage) && !handleLabelsAsImmediate)) {
			return EncodedOperandTypes.MEMORY_ADDRESS;
		}
		throw Error(`In line ${line + 1}: Unrecognized type of operand: ${operand}`);
	}

	/**
	 * This method encodes the given register into a its binary representation according to the assembly language definition.
	 * An error is thrown if the register could not be found in the language definition.
	 * @param register A string containing the register to encode.
	 * @param line The original computer programs line of code which is currently encoded.
	 * @returns The 32-bit encoded register.
	 * @throws An error if the given register is not recognized.
	 */
	private encodeRegister(register: string, line: number): DoubleWord {
		const reg = this.languageDefinition.addressable_registers
			.find(e => e.name.toLowerCase() === register.trim().toLowerCase());

		if (reg === undefined) {
			throw Error(`In line ${line}: Unrecognized register: ${register}`);
		}

		return DoubleWord.fromNumber(parseInt(reg.code, 2));
	}

	/**
	 * This method assembles a given computer program written in assembly language into its binary representation.
	 * The instructions will be encoded using the opcodes defined in the language definition.
	 * The order in which the instructions appear in the input program is preserved during the compilation process.
	 * @param code File contents of an .asm file containing a computer program written in assembly language.
	 * @param baseOffset Base address where the program will be in memory. Needed to adjust static addresses in jump labels. Default is 0.
	 * @param [encodingType=ProgramMetadata.InstructionEncodingType.FIXED_SIZE] 
	 * @param [instructionAlignment=Byte.fromNumber(3)] Instruction alignment in doublewords (must be >= 3 or 0). If 0, no alignment is enforced.
	 * @returns An array of DoubleWords representing the binary encoded instructions of the given computer program.
	 */
	public assemble(code: string, 
		baseOffset: number = 0, 
		encodingType: ProgramMetadata.InstructionEncodingType = ProgramMetadata.InstructionEncodingType.FIXED_SIZE,
		instructionAlignment: Byte = Byte.fromNumber(3)): DoubleWord[] {

		this.encodingType = encodingType;
		this.instructionAlignment = instructionAlignment * DoubleWord.NUMBER_OF_BYTES;

		if (instructionAlignment !== Byte.ZERO && instructionAlignment < Byte.fromNumber(3)) {
			throw new Error(`An alignment of only ${instructionAlignment} doublewords is not possible. Must be 0 or >= 3.`);
		}

		this.metadata = [] as ProgramMetadata;
		this.jumpLabels = new Map();
		this.aliases = new Map();
		this.constants = new Map();
		this.initializedData = new Map();
		this.uninitializedData = new Map();

		let machineCode: DoubleWord[] = [];

		const lines: Map<number, string> = this.preprocess(code);
		machineCode = machineCode.concat(this.encode(lines, baseOffset));
		machineCode = machineCode.concat([...this.constants.values()].flat());
		machineCode = machineCode.concat([...this.initializedData.values()].flat());
		return machineCode;
	}
}