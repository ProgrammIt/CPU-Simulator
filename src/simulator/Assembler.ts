import { readFileSync } from "node:fs";
import { UnrecognizedInstructionError } from "../types/errors/UnrecognizedInstructionError";
import { Bit } from "../types/binary/Bit";
import { AssemblyLanguageDefinition } from "./compiler/AssemblyLanguageDefinition";
import { DataSizes } from "../types/enumerations/DataSizes";
import { DoubleWord } from "../types/binary/DoubleWord";
import { Byte } from "../types/binary/Byte";

export class Assembler {
	private static readonly NEW_LINE_REGEX: RegExp = /\r?\n|\r/gim;
	public readonly languageDefinition: AssemblyLanguageDefinition;
 	public readonly pathToOSFilesystem: string
	private encodedInstructions: DoubleWord[] = [];
	private encodedConstants: DoubleWord[] = [];
	private encodedVariables: DoubleWord[] = [];
	private metadata: DoubleWord[] = [];


	/**
	 * Constructs a new assembler object with the given processing width.
	 * @param pathToLanguageDefinition The path to the language definition file of the assembly language used by this assembler.
	 * @param pathToOSFilesystem 
	 */
	public constructor(pathToLanguageDefinition: string, pathToOSFilesystem: string) {
		this.languageDefinition = JSON.parse(readFileSync(pathToLanguageDefinition, "utf-8"));
		this.pathToOSFilesystem = pathToOSFilesystem;
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
				let fileName: string = regexMatch[0].toString();
				fileName = fileName.substring(fileName.indexOf("\"") + 1, fileName.lastIndexOf("\""));

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
	private encode(lines: Map<number, string>, baseOffset: number = 0): void {
		const constants: Map<string, number> = new Map();
		const variables: Map<string, number> = new Map();
		const jumpLabels: Map<string, string> = new Map();
		const numericalConstants: Map<string, string> = new Map();

		const counters = this.locateSymbols(lines, jumpLabels, constants, variables, numericalConstants, baseOffset);
		const textSizeBytes: number = counters[0];
		const constantsSizeBytes: number = counters[1];
		const variablesSizeBytes: number = counters[2];
		
		//calculate important offsets and sizes
		const pageSize: number = 4096;
		const pageTableEntries: number = 1024;
		const numberOfPagesText: number = Math.ceil(textSizeBytes / pageSize);
		const numberOfPagesRoData: number = Math.ceil(constantsSizeBytes / pageSize);
		const numberOfPagesData: number = Math.ceil(variablesSizeBytes / pageSize);

		const totalNeededPages: number = numberOfPagesText + numberOfPagesRoData + numberOfPagesData;

		const neededL2PageTables: number = Math.ceil(totalNeededPages / pageTableEntries);

		// calculate base addresses
		const roDataBaseAddress: number = (numberOfPagesText * pageSize) + baseOffset;
		const dataBaseAddress: number = ((numberOfPagesText + numberOfPagesRoData) * pageSize) + baseOffset;


		this.writeMetadata(neededL2PageTables, baseOffset, roDataBaseAddress, dataBaseAddress, counters);
		this.replaceSymbols(lines, constants, variables, numericalConstants, roDataBaseAddress, dataBaseAddress);
		
		// Iterate lines of code.
		for (const [lineNo, line] of lines.entries()) {
			const encodedInstruction: DoubleWord[] = this.encodeLine(lineNo, line, jumpLabels, constants, variables);
			if (encodedInstruction.length !== 0) {
				this.encodedInstructions.push(...encodedInstruction);	
			}
		}
	}

	/**
	 * Metadata Layout
	 * ICE header 32 byte (8 dwords)
	 * byte 0x0-0x4 magic number
	 * byte 0x5-0x8 program header byte offset
	 * 6 dwords free
	 * 
	 * Program header (16 dwords)
	 * 1 DWORD Total_L2_Tables
	 * 
	 * 1 DWORD Text segment virtual start address
	 * 1 DWORD Text segment file offset
	 * 1 DWORD Text segment size
	 * 
	 * 1 DWORD RoData segment virtual start address
	 * 1 DWORD RoData segment file offset
	 * 1 DWORD RoData segment size
	 * 
	 * 1 DWORD Data segment virtual start address
	 * 1 DWORD Data segment file offset
	 * 1 DWORD Data segment size
	 * 
	 
	 * 6 dwords free
	 */
	private writeMetadata(neededL2PageTables: number, baseOffset: number, roDataBaseAddress: number, dataBaseAddress: number, sizes: number[]): void {
		const textSizeBytes: number = sizes[0];
		const roDataSizeBytes: number = sizes[1];
		const dataSizeBytes: number = sizes[2];

		// prepare ice header
		const magicNumber: DoubleWord = DoubleWord.fromNumber(0x7F_49_43_45) // 0x7F followed by ICE in ASCII
		const programHeaderOffset: DoubleWord = DoubleWord.fromNumber(32);
		this.metadata.push(magicNumber);
		this.metadata.push(programHeaderOffset);

		//fill unused space with zero
		for (let i = 0; i < 6; ++i) {
			this.metadata.push(DoubleWord.fromNumber(0));
		}

		// calculate file offsets
		const textFileOffset: number = 96; //32 byte ice header + 64 byte program header
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
		
		for (let i = 0; i < 6; ++i) {
			this.metadata.push(DoubleWord.fromNumber(0));
		}
	}

	/**
	 * This method encodes a single line of assembly code.
	 * @param lineNo The original computer programs line number of code which is currently encoded.
	 * @param line The original computer programs line of code which is currently encoded.
	 * @param jumpLabels The jump labels found in the assembly code.
	 * @param constants The constants found in the assembly code.
	 * @param variables The constants found in the assembly code.
	 * @returns An array of doublewords representing the encoded instructions and their operands of the assembly program.
	 */
	private encodeLine(lineNo: number, line: string, jumpLabels: Map<string, string>, constants: Map<string, number>, variables: Map<string, number>) : DoubleWord[] {
		const encodedInstructions: DoubleWord[] = [];
		let lineEncoded = false;
		lineEncoded = false;

		// For every line of code, search for a contained instruction.
		for (const instruction of this.languageDefinition.instructions) {
			const illegalCombosOfOperandTypes: { __SOURCE__: string, __TARGET__: string }[] | undefined
				= instruction.illegal_combinations_of_operand_types;

			if (instruction.operands !== undefined && instruction.operands.length === 2) {
				const operand1: { name: string, allowed_types: string[] } = instruction.operands[0];
				const operand2: { name: string, allowed_types: string[] } = instruction.operands[1];
				/*
					* The instruction expects two operands. Iterate over all possible combinations of operand types
					* and check if the resulting regex matches the current line of code.
					*/
				for (const operand1TypeString of operand1.allowed_types) {
					for (const operand2TypeString of operand2.allowed_types) {
						const regexInstructionString: string = instruction.regex;
						// Create a combination of operand types.
						const typeCombination: { __SOURCE__: string, __TARGET__: string }
							= { __SOURCE__: operand1TypeString, __TARGET__: operand2TypeString };
						// Check if the combination of operand types is forbidden for this instruction.
						if (illegalCombosOfOperandTypes !== undefined && illegalCombosOfOperandTypes.includes(typeCombination)) {
							continue;
						}
						// Locate the operand type of the first operand in the language definition.
						const operand1TypeDefinition: { name: string; code: string; regex: string; }
							= this.languageDefinition.operand_types.find((current) => current.name === operand1TypeString)!;
						// Locate the operand type of the second operand in the language definition.
						const operand2TypeDefinition: { name: string; code: string; regex: string; }
							= this.languageDefinition.operand_types.find((current) => current.name === operand2TypeString)!;
						// Create a regex for the current combination of operand types.
						const regexInstruction = new RegExp(
							regexInstructionString
								.replace(operand1.name, operand1TypeDefinition.regex)
								.replace(operand2.name, operand2TypeDefinition.regex),
							"gim"
						);
						// Check if the current line of code matches the created regex.
						const regexMatchArrayInstruction: RegExpMatchArray | null = regexInstruction.exec(line);
						if (regexMatchArrayInstruction !== null) {
							// Instruction found. Encode it.							
							const encodedInstruction: DoubleWord[] = this.encodeInstruction(regexMatchArrayInstruction, lineNo, jumpLabels);
							encodedInstructions.push(...encodedInstruction);
							lineEncoded = true;
							break;
						}
					}
					if (lineEncoded) {
						break;
					}
				}
			} else if (instruction.operands !== undefined && instruction.operands.length === 1) {
				const operand: { name: string, allowed_types: string[] } = instruction.operands[0];
				/**
				 * This instruction expects only one operand. Iterate over all possible types of the operand.
				 */
				for (const operandTypeString of operand.allowed_types) {
					const regexInstructionString: string = instruction.regex;
					// Locate the operand type of the first operand in the language definition.
					const operandTypeDefinition: { name: string; code: string; regex: string; }
						= this.languageDefinition.operand_types.find((current) => current.name === operandTypeString)!;
					// Create a regex for the current operand type.
					const regexInstruction = new RegExp(
						regexInstructionString.replace(operand.name, operandTypeDefinition.regex),
						"gim"
					);
					// Check if the current line of code matches the created regex.
					const regexMatchArrayInstruction: RegExpMatchArray | null = regexInstruction.exec(line);
					if (regexMatchArrayInstruction !== null) {
						// Instruction found. Encode it.
						const encodedInstruction: DoubleWord[] = this.encodeInstruction(regexMatchArrayInstruction, lineNo, jumpLabels);
						encodedInstructions.push(...encodedInstruction);
						lineEncoded = true;
						break;
					}
				}
				if (lineEncoded) {
					break;
				}
			} else {
				// Instruction has no operands.
				const regexInstruction = new RegExp(instruction.regex, "gim");
				const regexMatchArrayInstruction: RegExpMatchArray | null = regexInstruction.exec(line);
				if (regexMatchArrayInstruction !== null) {
					// Instruction found. Encode it.
					const encodedInstruction: DoubleWord[] = this.encodeInstruction(regexMatchArrayInstruction, lineNo, jumpLabels);
					encodedInstructions.push(...encodedInstruction);
					lineEncoded = true;
				}
			}
		}
		if (line.match(new RegExp(this.languageDefinition.constant_formats.declarationString, "gim"))) {
			const regexExp = new RegExp(this.languageDefinition.constant_formats.declarationString, "gim");
			const regexMatch = regexExp.exec(line);
			if (regexMatch !== null) {
				const value: string = regexMatch[0].toString().trim();
				const stringParts: string[] = regexMatch[0].toString().trim().split(" ");
				const constantName = stringParts[1];
				const constantValue = value.substring(value.indexOf("\"") + 1, value.lastIndexOf("\"")) + "\0";
				if (constants.has(constantName)) {
					const encodedInstruction: DoubleWord[] = this.encodeString(lineNo, line, constantValue);
					this.encodedConstants.push(...encodedInstruction);
					lineEncoded = true;
				}
			}
		} else if (line.match(new RegExp(this.languageDefinition.variable_formats.declarationBuffer, "gim"))) {
			const regexExp = new RegExp(this.languageDefinition.variable_formats.declarationBuffer, "gim");
			const regexMatch = regexExp.exec(line);
			if (regexMatch !== null) {
				const stringParts: string[] = regexMatch[0].toString().trim().split(" ");
				const bufferName = stringParts[2];
				const bufferSize: number = parseInt(stringParts[1], 10);
				if (variables.has(bufferName)) {
					const encodedInstruction: DoubleWord[] = this.initializeBuffer(lineNo, line, bufferSize);
					this.encodedVariables.push(...encodedInstruction);
					lineEncoded = true;
				}
			}
		} else if (line.match(new RegExp(this.languageDefinition.variable_formats.declarationString, "gim"))) {
			const regexExp = new RegExp(this.languageDefinition.variable_formats.declarationString, "gim");
			const regexMatch = regexExp.exec(line);
			if (regexMatch !== null) {
				const value: string = regexMatch[0].toString().trim();
				const variableName = value.substring(value.indexOf(".") + 1, value.indexOf(" ")).trim();
				const variableValue = value.substring(value.indexOf("\"") + 1, value.lastIndexOf("\"")) + "\0";
				if (variables.has(variableName)) {
					const encodedInstruction: DoubleWord[] = this.encodeString(lineNo, line, variableValue);
					this.encodedVariables.push(...encodedInstruction);
					lineEncoded = true;
				}
			}
		} else if (line.match(new RegExp(this.languageDefinition.variable_formats.declarationBinary, "gim"))) {
			const regexExp = new RegExp(this.languageDefinition.variable_formats.declarationBinary, "gim");
			const regexMatch = regexExp.exec(line);
			if (regexMatch !== null) {
				const value: string = regexMatch[0].toString().trim();
				const variableName = value.substring(value.indexOf(".") + 1, value.lastIndexOf(" ")).trim();
				const variableValue = value.substring(value.lastIndexOf(" ") + 1).trim();
				if (variables.has(variableName)) {
					const encodedInstruction: DoubleWord[] = [];
					if (variableValue !== "") {
						encodedInstruction.push(this.encodeBinaryValue(variableValue));
					} else {
						encodedInstruction.push(this.encodeDecimalValue("0"));
					}
					this.encodedVariables.push(...encodedInstruction);
					lineEncoded = true;
				}
			}
		} else if (line.match(new RegExp(this.languageDefinition.variable_formats.declarationDecimal, "gim"))) {
			const regexExp = new RegExp(this.languageDefinition.variable_formats.declarationDecimal, "gim");
			const regexMatch = regexExp.exec(line);
			if (regexMatch !== null) {
				const value: string = regexMatch[0].toString().trim();
				const variableName = value.substring(value.indexOf(".") + 1, value.lastIndexOf(" ")).trim();
				const variableValue = value.substring(value.lastIndexOf(" ") + 1).trim();
				if (variables.has(variableName)) {
					const encodedInstruction: DoubleWord[] = [];
					if (variableValue !== "") {
						encodedInstruction.push(this.encodeDecimalValue(variableValue));
					} else {
						encodedInstruction.push(this.encodeDecimalValue("0"));
					}
					this.encodedVariables.push(...encodedInstruction);
					lineEncoded = true;
				}
			}
		} else if (line.match(new RegExp(this.languageDefinition.variable_formats.declarationHexadecimal, "gim"))) {
			const regexExp = new RegExp(this.languageDefinition.variable_formats.declarationHexadecimal, "gim");
			const regexMatch = regexExp.exec(line);
			if (regexMatch !== null) {
				const value: string = regexMatch[0].toString().trim();
				const variableName = value.substring(value.indexOf(".") + 1, value.lastIndexOf(" ")).trim();
				const variableValue = value.substring(value.lastIndexOf(" ") + 1).trim();
				if (variables.has(variableName)) {
					const encodedInstruction: DoubleWord[] = [];
					if (variableValue !== "") {
						encodedInstruction.push(this.encodeHexadecimalValue(variableValue));
					} else {
						encodedInstruction.push(this.encodeDecimalValue("0"));
					}
					this.encodedVariables.push(...encodedInstruction);
					lineEncoded = true;
				}
			}
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
	 * @param jumpLabels An empty map, which will be used to store jump labels and their associated (virtual) memory address.
	 * @param constants An empty map, which will be used to store constants and their associated (virtual) memory address or value.
	 * @param variables An empty map, which will be used to store variables and their associated (virtual) memory addresses.
	 * @returns An array containing the programLocationCounter, constantCounter and variableCounter.
	 */
	private locateSymbols(lines: Map<number, string>, jumpLabels: Map<string, string>, constants: Map<string, number>, variables: Map<string, number>, numericalConstants: Map<string, string>, baseOffset: number = 0) : number[] {
		/**
		 * Use this variable in order to count the instructions, that need to be encoded
		 * later, because the keys in the map do not have to be consecutive, as blank lines 
		 * have been removed from the original source text.
		 */
		let programLocationCounter = 0;

		/**
		 * This variable is used to track the offset of variables to later calculate the actual virtual memory address.
		 */
		let constantCounter = 0;

		/**
		 * This variable is used to track the offset of constants to later calculate the actual virtual memory address.
		 */
		let variableCounter = 0;

		for (const [lineNo, line] of lines.entries()) {
			if (line.match(new RegExp(this.languageDefinition.variable_formats.dataSegmentStart)) || line.match(new RegExp(this.languageDefinition.variable_formats.dataSegmentEnd))) {
				lines.delete(lineNo);
			} else if (line.match(new RegExp(this.languageDefinition.constant_formats.declarationBinary, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.constant_formats.declarationBinary, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					const value: string = regexMatch[0].toString().trim();
					const constantName = value.substring(value.indexOf(".CONST") + 6, value.lastIndexOf(" ")).trim();
					const constantValue = value.substring(value.lastIndexOf(" ") + 1).trim();
					numericalConstants.set(
						constantName, 
						constantValue
					);
					lines.delete(lineNo);
				}
			} else if (line.match(new RegExp(this.languageDefinition.constant_formats.declarationDecimal, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.constant_formats.declarationDecimal, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					const value: string = regexMatch[0].toString().trim();
					const constantName = value.substring(value.indexOf(".CONST") + 6, value.lastIndexOf(" ")).trim();
					const constantValue = value.substring(value.lastIndexOf(" ") + 1).trim();
					numericalConstants.set(
						constantName, 
						constantValue
					);
					lines.delete(lineNo);
				}
			} else if (line.match(new RegExp(this.languageDefinition.constant_formats.declarationHexadecimal, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.constant_formats.declarationHexadecimal, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					const value: string = regexMatch[0].toString().trim();
					const constantName = value.substring(value.indexOf(".CONST") + 6, value.lastIndexOf(" ")).trim();
					const constantValue = value.substring(value.lastIndexOf(" ") + 1).trim();
					numericalConstants.set(
						constantName, 
						constantValue
					);
					lines.delete(lineNo);
				}
			} else if (line.match(new RegExp(this.languageDefinition.constant_formats.declarationString, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.constant_formats.declarationString, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					const value: string = regexMatch[0].toString().trim();
					const stringParts: string[] = regexMatch[0].toString().trim().split(" ");
					const constantName = stringParts[1];
					const constantValue = value.substring(value.indexOf("\"") + 1, value.lastIndexOf("\"")) + "\0";
					constants.set(
						constantName, 
						constantCounter
					);
					//Calculate the size the string will use in memory including null termination and round up to the next size that
					//is divisible by four. This insures the string always fits into multiple double words.
					const stringMemSize = Math.ceil((Buffer.byteLength(constantValue) / 4)) * 4;
					constantCounter += stringMemSize;
				}
			} else if (line.match(new RegExp(this.languageDefinition.variable_formats.declarationBuffer, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.variable_formats.declarationBuffer, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					const stringParts: string[] = regexMatch[0].toString().trim().split(" ");
					const bufferName = stringParts[2];
					const bufferSize: number = parseInt(stringParts[1], 10);
					variables.set(
						bufferName, 
						variableCounter
					);
					//Calculate the size the buffer will take up in memory. Since the system is based on fixed 32 bit instructions, the buffer size needs to fit into
					//multiple of double words.
					const bufferMemSize = Math.ceil((bufferSize / 4)) * 4;
					variableCounter += bufferMemSize;
				}
			} else if (line.match(new RegExp(this.languageDefinition.variable_formats.declarationBinary, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.variable_formats.declarationBinary, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					const value: string = regexMatch[0].toString().trim();
					const variableName = value.substring(value.indexOf(".") + 1, value.lastIndexOf(" ")).trim();
					variables.set(
						variableName, 
						variableCounter
					);
					variableCounter += 4;
				}
			} else if (line.match(new RegExp(this.languageDefinition.variable_formats.declarationDecimal, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.variable_formats.declarationDecimal, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					const value: string = regexMatch[0].toString().trim();
					const variableName = value.substring(value.indexOf(".") + 1, value.lastIndexOf(" ")).trim();
					variables.set(
						variableName, 
						variableCounter
					);
					variableCounter += 4;
				}
			} else if (line.match(new RegExp(this.languageDefinition.variable_formats.declarationHexadecimal, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.variable_formats.declarationHexadecimal, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					const value: string = regexMatch[0].toString().trim();
					const variableName = value.substring(value.indexOf(".") + 1, value.lastIndexOf(" ")).trim();
					variables.set(
						variableName, 
						variableCounter
					);
					variableCounter += 4;
				}
			} else if (line.match(new RegExp(this.languageDefinition.variable_formats.declarationString, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.variable_formats.declarationString, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					const value: string = regexMatch[0].toString().trim();
					const variableName = value.substring(value.indexOf(".") + 1, value.indexOf(" ")).trim();
					const variableValue = value.substring(value.indexOf("\"") + 1, value.lastIndexOf("\"")) + "\0";
					variables.set(
						variableName, 
						variableCounter
					);
					//Calculate the size the string will use in memory including null termination and round up to the next size that
					//is divisible by four. This insures the string always fits into multiple double words.
					const stringMemSize = Math.ceil((Buffer.byteLength(variableValue) / 4)) * 4;
					variableCounter += stringMemSize;
				}
			} else if (line.match(new RegExp(this.languageDefinition.label_formats.declaration, "gim"))) {
				const regexExp = new RegExp(this.languageDefinition.label_formats.declaration, "gim");
				const regexMatch = regexExp.exec(line);
				if (regexMatch !== null) {
					const value: string = regexMatch[0].toString().trim();
					const jumpLabel = value.substring(value.indexOf(".") + 1, value.lastIndexOf(":")).trim();
					jumpLabels.set(
						jumpLabel, 
						(programLocationCounter + baseOffset).toString(2)
					);
					lines.delete(lineNo);
				}
			} else {
				programLocationCounter += 12;
			}
		}
		return [programLocationCounter, constantCounter, variableCounter];
	}

	/**
	 * This method replaces the symbolic names of variables or constants in the assembly code with their associated value or 
	 * (virtual) memory address.
	 * Symbolic integer constants get replaced by their value.
	 * Symbolic strings and symbolic variables get replaced by their associated (virtual) memory address.
	 * @param lines A map, which maps line numbers to strings representing the original programs lines of code.
	 * @param constants A map, which maps the symbolic name of constants to their value or (virtual) memory offset.
	 * @param variables A map, which maps the symbolic name of variables to their (virtual) memory offset.
	 * @param numericalConstants A map, which maps the symbolic name of variables to their value.
	 * @param constantBaseAddress The virtual memory base address oi constants.
	 * @param variableBaseAddress The virtual memory base address of the data segment.
	 * @returns 
	 */
	private replaceSymbols(lines: Map<number, string>, constants: Map<string, number>, variables: Map<string, number>, numericalConstants: Map<string, string>, constantBaseAddress: number, variableBaseAddress: number) : Map<number, string> {
		for (const [lineNo, line] of lines.entries()) {	
			if (line.match(new RegExp(this.languageDefinition.constant_formats.usage, "gim"))) {
				//Test if constant name is included in line and replace it with its value
				numericalConstants.forEach((constantValue, constantName) => {
					const regex = new RegExp("[$%@]" + constantName , "m");
					if (line.match(regex) !== null) {
						const replacedLine = line.replace(constantName,constantValue);
						lines.set(lineNo, replacedLine);
					}
				});
				constants.forEach((constantLocalOffset, constantName) => {
					const regex = new RegExp("[$%@]" + constantName , "m");
					if (line.match(regex) !== null) {
						const replacedLine = line.replace(constantName,"0b" + (constantLocalOffset + constantBaseAddress).toString(2).padStart(DataSizes.DOUBLEWORD, "0"));
						lines.set(lineNo, replacedLine);
					}
				});
			}
			if (line.match(new RegExp(this.languageDefinition.variable_formats.usage, "gim"))) {
				//Test if variable name is included in line and replace it with its value
				variables.forEach((variableLocalOffset, variableName) => {
					const regex = new RegExp("[$%@]" + variableName , "m");
					if (line.match(regex) !== null) {
						const replacedLine = line.replace(variableName,"0b" + (variableLocalOffset + variableBaseAddress).toString(2).padStart(DataSizes.DOUBLEWORD, "0"));
						lines.set(lineNo, replacedLine);
					}
				});
			}
		}
		return lines;
	}

	/**
	 * This method reserves empty memory space for a buffer.
	 * @param lineNo The original computer programs line number of code which is currently encoded.
	 * @param line The original computer programs line of code which is currently encoded.
	 * @returns 
	 */
	private initializeBuffer(lineNo: number, line: string, bufferSize: number) : DoubleWord[] {
		const encodedInstructions: DoubleWord[] = [];
		let bufferEncoded = false;
		const bufferDoubleWordSize = Math.ceil(bufferSize / 4);
		//Create empty double words to reserve space for the buffer
		for (let i = 0; i < bufferDoubleWordSize; ++i) {
			encodedInstructions.push(DoubleWord.fromNumber(0));
		}

		bufferEncoded = true;
		
		if (!bufferEncoded) {
			throw new Error(`Error encoding string in line: ${lineNo + 1}: ${line}`);
		}
		return encodedInstructions;
	}

	/**
	 * This method encodes a null terminated string by writing it to memory and adding a jump instruction to the first memory address after the string.
	 * @param lineNo The original computer programs line number of code which is currently encoded.
	 * @param line The original computer programs line of code which is currently encoded.
	 * @param stringValue The string content.
	 * @returns An array containing the binary equivalent of the given instruction and its operand values.
	 */
	private encodeString(lineNo: number, line: string, stringValue: string) : DoubleWord[] {
		const encodedInstructions: DoubleWord[] = [];
		let stringEncoded = false; 
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
				const byte2 = Byte.fromNumber(stringBuffer[i + 1]);
				const byte3 = Byte.fromNumber(stringBuffer[i + 2]);
				const byte4 = Byte.fromNumber(stringBuffer[i + 3]);
				const encodedStringPart = DoubleWord.fromBytes(byte1, byte2, byte3, byte4);
				encodedInstructions.push(encodedStringPart);
			}
		}
		//Get the last bytes from the buffer
		if (restOfBufferSize > 0) {
			const byte1 = Byte.fromNumber(stringBuffer[continuousBufferSegmentSize]);
			const byte2 = Byte.fromNumber(restOfBufferSize > 1 ? stringBuffer[continuousBufferSegmentSize + 1] : 0);
			const byte3 = Byte.fromNumber(restOfBufferSize > 2 ? stringBuffer[continuousBufferSegmentSize + 2] : 0);
			const byte4 = Byte.ZERO;
			const encodedStringPart = DoubleWord.fromBytes(byte1, byte2, byte3, byte4);
			encodedInstructions.push(encodedStringPart);
		}
		stringEncoded = true;

		if (!stringEncoded) {
			throw new Error(`Error encoding string in line: ${lineNo + 1}: ${line}`);
		}
		return encodedInstructions;
	}

	/**
	 * This method binary encodes a given instruction and its operands values.
	 * It is used for insructions that contain no indirect access to a register with an offset.
	 * @param regexMatchArrayInstruction An array containing the results of a match of a regular expression on an instruction.
	 * @param line The original computer programs line of code which is currently encoded.
	 * @param jumpLabels The jump labels found in the assembly code.
	 * @returns An array containing the binary equivalent of the given instruction and its operand values.
	 */
	private encodeInstruction(regexMatchArrayInstruction: RegExpMatchArray, line: number, jumpLabels: Map<string, string>): DoubleWord[] {
		let addressingModeOperand1: Array<Bit> = new Array<Bit>(2);
		let typeOperand1: Array<Bit> = new Array<Bit>(7);
		let addressingModeOperand2: Array<Bit> = new Array<Bit>(2);
		let typeOperand2: Array<Bit> = new Array<Bit>(7);
		let encodedOperandValue1: DoubleWord;
		let encodedOperandValue2: DoubleWord;
		let instructionType: Array<Bit> = new Array<Bit>(3);
		const opcode: Array<Bit> = new Array<Bit>(7);
		const instructionMnemonic: string = regexMatchArrayInstruction[1];
		const delimeter: Array<Bit> = new Array<Bit>(1, 1);

		for (const instruction of this.languageDefinition.instructions) {
			if (instructionMnemonic.toLowerCase() === instruction.mnemonic.toLowerCase()) {
				instructionType = this.encodeInstructionType(instruction.type, line);
				instruction.opcode.split("").forEach((bit, index) => {
					opcode[index] = (bit === "0") ? 0 : 1;
				});
				break;
			}
		}

		let handleLabelsAsImmediate = false;
		if (instructionMnemonic == "MOV") {
			handleLabelsAsImmediate = true;
		}

		// Check for second operand
		if (regexMatchArrayInstruction.length > 3) {
			// A second operand given
			addressingModeOperand2 = this.encodeOperandAddressingMode(regexMatchArrayInstruction[3], line);
			typeOperand2 = this.encodeOperandType(regexMatchArrayInstruction[3], line, handleLabelsAsImmediate);
			encodedOperandValue2 = this.encodeOperandValue(regexMatchArrayInstruction[3], line, jumpLabels);
		} else {
			// No second operand given
			addressingModeOperand2 = this.encodeOperandAddressingMode("", line);
			typeOperand2 = this.encodeOperandType("", line);
			encodedOperandValue2 = this.encodeOperandValue("", line, jumpLabels);
		}

		// Check for first operand
		if (regexMatchArrayInstruction.length > 2) {
			// A single operand given
			addressingModeOperand1 = this.encodeOperandAddressingMode(regexMatchArrayInstruction[2], line);
			typeOperand1 = this.encodeOperandType(regexMatchArrayInstruction[2], line, handleLabelsAsImmediate);
			encodedOperandValue1 = this.encodeOperandValue(regexMatchArrayInstruction[2], line, jumpLabels);
		} else {
			// No operand given
			addressingModeOperand1 = this.encodeOperandAddressingMode("", line);
			typeOperand1 = this.encodeOperandType("", line);
			encodedOperandValue1 = this.encodeOperandValue("", line, jumpLabels);
		}

		let finalInstruction: Array<Bit> = new Array<Bit>();
		finalInstruction = [
			...instructionType, ...delimeter, ...opcode, ...delimeter,
			...addressingModeOperand1, ...typeOperand1,
			...addressingModeOperand2, ...typeOperand2
		];


		const encodedInstruction = DoubleWord.fromNumber(parseInt(finalInstruction.join(""), 2));

		return [encodedInstruction, encodedOperandValue1, encodedOperandValue2];
	}

	/**
	 * This method extracts the addressing mode from the given operand and returns the binary encoded version.
	 * @param operand The operand to extract the addressing mode from.
	 * @param line The original computer programs line of code which is currently encoded.
	 * @returns The binary encoded addressing mode.
	 */
	private encodeOperandAddressingMode(operand: string, line: number): Array<Bit> {
		if (operand.startsWith("*%")) {
			return new Array<Bit>(2).fill(1);
		}

		if (operand.startsWith("*@") || operand.startsWith("*$")) {
			throw new Error(
				`In line ${line + 1}: Indirect addressing mode is only supported for usage with registers.`
			);
		}

		return new Array<Bit>(1, 0);
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
	private encodeOperandValue(operand: string, line: number, jumpLabels: Map<string, string>): DoubleWord {
		let operand32BitEncoded: DoubleWord;
		if (operand.length === 0) {
			operand32BitEncoded = DoubleWord.ZERO;
		} else if (jumpLabels.has(operand)) {
			// Operand is jump label.
			operand32BitEncoded = DoubleWord.fromNumber(parseInt(jumpLabels.get(operand)!, 2));
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
			operand32BitEncoded = this.encodeBinaryAddress(operand.replace("@0b", ""), line);
		} else if (operand.startsWith("@0x")) {
			// Hex virtual memory address found.
			operand32BitEncoded = this.encodeHexadecimalAddress(operand.replace("@", ""), line);
		} else if (operand.startsWith("@")) {
			// Decimal virtual memory address found.
			operand32BitEncoded = this.encodeDecimalAddress(operand.replace("@", ""), line);
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

		let operandDec = 0;
		operand = operand.replace("0b", "");

		const negative = operand.startsWith("-");
		operand = negative ? operand.replace("-", "") : operand;

		// Sign extend binary value.
		operand = operand.padStart(DataSizes.DOUBLEWORD, operand.charAt(0));

		if (negative) {
			// Negative binary value.
			operandDec = parseInt(operand, 2) * -1;
		} else {
			// Positive binary value.
			operandDec = parseInt(operand, 2);
		}
		return DoubleWord.fromNumber(operandDec);
	}

	/**
	 * This method encodes an operands hexadecimal value into its 32-bit binary representation.
	 * @param operand The hexadecimal value to encode.
	 * @returns The 32-bit binary representation of the given immediate operand.
	 */
	private encodeHexadecimalValue(operand: string): DoubleWord {
		let operandDec = 0;
		operand = operand.replace("0x", "");
		if (operand.startsWith("-")) {
			// Negative hex value.
			operandDec = parseInt(operand.replace("-", ""), 16) * -1;
		} else {
			// Positive hex value.
			operandDec = parseInt(operand, 16);
		}
		return DoubleWord.fromNumber(operandDec);
	}

	/**
	 * This method encodes an operands decimal value into its 32-bit binary representation.
	 * @param operand The decimal value to encode.
	 * @returns The 32-bit binary representation of the given immediate operand.
	 */
	private encodeDecimalValue(operand: string): DoubleWord {
		let operandDec = 0;
		if (operand.startsWith("-")) {
			// Negative dec value.
			operandDec = parseInt(operand.replace("-", ""), 10) * -1;
		} else {
			// Positive dec value.
			operandDec = parseInt(operand, 10);
		}
		return DoubleWord.fromNumber(operandDec);
	}

	/**
	 * This method encodes an operands virtual, binary memory address into its 32-bit binary representation.
	 * @param operand The virtual memory address to encode.
	 * @param line The line of code which this operand originates from.
	 * @returns The 32-bit binary representation of the given virtual memory address.
	 * @throws An error if the given operands binary memory address is invalid.
	 */
	private encodeBinaryAddress(operand: string, line: number): DoubleWord {
		if (operand.length > DataSizes.DOUBLEWORD) {
			throw Error(`In line ${line + 1}: Binary memory address consists of more than ${DataSizes.DOUBLEWORD} bits.`);
		}
		// Extend binary address with zeros if necessary.
		operand = operand.padStart(DataSizes.DOUBLEWORD, "0");
		return DoubleWord.fromNumber(parseInt(operand, 2));
	}

	/**
	 * This method encodes an operands virtual, hexadecimal memory address into its 32-bit binary representation.
	 * @param operand The virtual memory address to encode.
	 * @param line The line of code which this operand originates from.
	 * @returns The 32-bit binary representation of the given virtual memory address.
	 * @throws An error if the given operands hexadecimal memory address is invalid.
	 */
	private encodeHexadecimalAddress(operand: string, line: number): DoubleWord {
		let virtualAddress: DoubleWord;
		try {
			virtualAddress = DoubleWord.fromNumber(parseInt(operand, 16));
		} catch {
			throw Error(`In line ${line + 1}: Invalid hexadecimal memory address.`);
		}
		return virtualAddress;
	}

	/**
	 * This method encodes an operands virtual, decimal memory address into its 32-bit binary representation.
	 * @param operand The virtual memory address to encode.
	 * @param line The line of code which this operand originates from.
	 * @returns The 32-bit binary representation of the given virtual memory address.
	 * @throws An error if the given operands decimal memory address is invalid.
	 */
	private encodeDecimalAddress(operand: string, line: number): DoubleWord {
		let virtualAddress: DoubleWord;
		try {
			virtualAddress = DoubleWord.fromNumber(parseInt(operand, 10));
		} catch {
			throw Error(`In line ${line + 1}: Invalid hexadecimal memory address.`);
		}
		return virtualAddress;
	}

	/**
	 * This method encodes the given operands type.
	 * @param operand An operand whichs type will be encoded.
	 * @param line The original computer programs line of code which is currently encoded.
	 * @param handleLabelsAsImmediate By default labels will be interpreted as addresses. Set to true to use the label address as immediate value.
	 * @returns The binary encoded operands type.
	 */
	private encodeOperandType(operand: string, line: number, handleLabelsAsImmediate: boolean = false): Array<Bit> {
		let encodedType: Array<Bit> = new Array<Bit>(7);
		if (operand.length === 0) {
			encodedType = new Array<Bit>(7).fill(0);
		} else if (operand.startsWith("*%") || operand.startsWith("%")) {
			encodedType = new Array<Bit>(1, 1, 0, 0, 0, 0, 0);
		} else if (operand.startsWith("$") || (operand.match(this.languageDefinition.label_formats.usage) && handleLabelsAsImmediate)) {
			encodedType = new Array<Bit>(1, 0, 1, 0, 0, 0, 0);
		} else if (operand.startsWith("@") || (operand.match(this.languageDefinition.label_formats.usage) && !handleLabelsAsImmediate)) {
			encodedType = new Array<Bit>(1, 1, 1, 0, 0, 0, 0);
		} else {
			throw Error(`In line ${line + 1}: Unrecognized type of operand.`);
		}
		return encodedType;
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
		register = register.replace("%", "").toLowerCase().trim();
		for (const reg of this.languageDefinition.addressable_registers) {
			if (register === reg.name.toLowerCase()) {
				const tmp: string = reg.code.padStart(DataSizes.DOUBLEWORD, "0");
				let encodedRegister: DoubleWord = DoubleWord.ZERO;
				tmp.split("").forEach((bit, index) => {
					encodedRegister = DoubleWord.setBit(encodedRegister, index as DoubleWord.BitIndex, (bit === "0") ? 0 : 1);
				});
				return encodedRegister;
			}
		}
		throw Error(`In line ${line}: Unrecognized register.`);
	}

	/**
	 * This method encodes a command type as a sequence of bits. Throws
	 * @param type The type of the instruction. Can be either "R", "I" or "J".
	 * @param line The original computer programs line of code which is currently encoded.
	 * @returns A string of zeros and ones representing the instructions type.
	 */
	private encodeInstructionType(type: string, line: number): Array<Bit> {
		let encodedType: Array<Bit> = new Array<Bit>(3).fill(0);
		switch (type.toUpperCase()) {
			case "R":
				encodedType = new Array<Bit>(1, 0, 0);
				break;
			case "I":
				encodedType = new Array<Bit>(1, 1, 0);
				break;
			case "J":
				encodedType = new Array<Bit>(1, 1, 1);
				break;
			default:
				throw Error(`In line ${line}: Unrecognized instruction type.`);
		}
		return encodedType;
	}

	/**
	 * This method assembles a given computer program written in assembly language into its binary representation.
	 * The instructions will be encoded using the opcodes defined in the language definition.
	 * The order in which the instructions appear in the input program is preserved during the compilation process.
	 * @param s File contents of an .asm file containing a computer program written in assembly language.
	 * @param baseOffset Base address where the program will be in memory. Needed to adjust static addresses in jump labels. Default is 0.
	 * @returns An array of DoubleWords representing the binary encoded instructions of the given computer program.
	 */
	public assemble(s: string, baseOffset: number = 0): DoubleWord[] {
		this.encodedInstructions = [];
		this.encodedVariables = [];
		this.encodedConstants = [];
		this.metadata = [];
		const lines: Map<number, string> = this.preprocess(s);
		this.encode(lines, baseOffset);
		const encodedInstructions: DoubleWord[] = this.metadata.concat(this.encodedInstructions, this.encodedConstants, this.encodedVariables);
		return encodedInstructions;
	}
}