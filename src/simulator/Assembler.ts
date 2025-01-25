import { readFileSync } from "node:fs";
import UnrecognizedInstructionError from "../error_types/UnrecognizedInstructionError";
import Bit from "../binary_types/Bit";
import AssemblyLanguageDefinition from "./compiler/AssemblyLanguageDefinition";
import { DataSizes } from "../enumerations/DataSizes";
import DoubleWord from "../binary_types/DoubleWord";
import VirtualAddress from "../binary_types/VirtualAddress";

export default class Assembler {
  	private static readonly NEW_LINE_REGEX: RegExp = /\r?\n|\r/gim;
  	public readonly languageDefinition: AssemblyLanguageDefinition;
	public readonly translations: Map<string, DoubleWord[]>;
	public readonly processingWidth: DataSizes;

	/**
	 * Constructs a new assembler object with the given processing width.
	 * @param processingWidth The processing width of the computer system the assembler is used for.
	 * @param pathToLanguageDefinition The path to the language definition file of the assembly language used by this assembler.
	 */
  	public constructor(processingWidth: DataSizes, pathToLanguageDefinition: string = "./settings/language_definition.json") {
		this.processingWidth = processingWidth;
		this.languageDefinition = JSON.parse(readFileSync(pathToLanguageDefinition, "utf-8"));
		this.translations = new Map<string, DoubleWord[]>();
  	}

	/**
	 * This method preprocesses the file contents of a computer program written in assembly language.
	 * It removes all comments, leading and trailing whitespace and splits the file contents into seperate lines of code.
	 * The line order is preserved.
	 * @param fileContents A string containing the contents of a computer program written in assembly language.
	 * @returns A map, which maps line numbers to strings representing the original programs lines of code.
	 */
	private preprocess(fileContents: string): Map<number, string> {
		var lines: Map<number, string> = new Map();
		// Split file contents into lines of code, remove comments and mark empty lines for deletion
		var linesMarkedForDeletion: number[] = [];
		const commentRegex = new RegExp(this.languageDefinition.comment_format, "gim");
		fileContents.split(Assembler.NEW_LINE_REGEX).forEach((line, lineNo) => {
			var lineWithoutComment: string = line.trim().replace(commentRegex, "");
			if (lineWithoutComment.length === 0) {
				linesMarkedForDeletion.push(lineNo);
			}
			// Store line of code in map regardless whether its an empty line or not.
			lines.set(lineNo, lineWithoutComment);
		});
		// Delete empty lines.
		for (let lineNo of linesMarkedForDeletion) {
			lines.delete(lineNo);
		}
		return lines;
	}

	/**
	 * This method locates and removes the jump labels from the assembly code.
	 * @param lines The lines of code to search for jump labels.
	 * @returns The lines of code without jump labels.
	 */
	private removeJumpLabels(lines: Map<number, string>): Map<number, string> {
		// Locate jump labels and put them into the list of lines to delete.
		var lineNumbersMarkedForDeletion: number[] = [];
		for (let [lineNo, line] of lines.entries()) {	
			if (line.match(this.languageDefinition.label_formats.declaration)) {
				lineNumbersMarkedForDeletion.push(lineNo);
			}
		}
		// Remove jump labels from the list of lines.
		for (let lineNo of lineNumbersMarkedForDeletion) {
			lines.delete(lineNo);
		}
		return lines;
	}

	/**
	 * This method encodes the reduced assembly program to its binary equivalent.
	 * @param lines A map, which maps line numbers to strings representing the original programs lines of code.
	 * @returns An array of doublewords representing the encoded instructions and their operands of the assembly program.
	 */
	private encode(lines: Map<number, string>): DoubleWord[] {
		var lineEncoded: boolean = false;
		var encodedInstructions: DoubleWord[] = [];
		var jumpLabels: Map<string, string> = this.locateJumpLabels(lines);	

		// Remove jump labels as they will not be encoded.
		lines = this.removeJumpLabels(lines);
		
		// Iterate lines of code.
		for (let [lineNo, line] of lines.entries()) {
			
			lineEncoded = false;
			
			// For every line of code, search for a contained instruction.
			for (let instruction of this.languageDefinition.instructions) {
				const illegalCombosOfOperandTypes: {__SOURCE__: string, __TARGET__: string}[] | undefined 
					= instruction.illegal_combinations_of_operand_types;
				
				if (instruction.operands !== undefined && instruction.operands.length === 2) {
					const operand1: {name: string, allowed_types: string[]} = instruction.operands[0];
					const operand2: {name: string, allowed_types: string[]} = instruction.operands[1];
					/*
					 * The instruction expects two operands. Iterate over all possible combinations of operand types
					 * and check if the resulting regex matches the current line of code.
					 */
					for (let operand1TypeString of operand1.allowed_types) {
						for (let operand2TypeString of operand2.allowed_types) {
							const regexInstructionString: string = instruction.regex;
							// Create a combination of operand types.
							const typeCombination: { __SOURCE__: string, __TARGET__: string } 
									= { __SOURCE__ : operand1TypeString, __TARGET__ : operand2TypeString };
							// Check if the combination of operand types is forbidden for this instruction.
							if (illegalCombosOfOperandTypes !== undefined && illegalCombosOfOperandTypes.includes(typeCombination)) {
								continue;
							}
							// Locate the operand type of the first operand in the language definition.
							const operand1TypeDefinition: {name: string; code: string; regex: string;}
								= this.languageDefinition.operand_types.find((current) => current.name === operand1TypeString)!;
							// Locate the operand type of the second operand in the language definition.
							const operand2TypeDefinition: {name: string; code: string; regex: string;}
								= this.languageDefinition.operand_types.find((current) => current.name === operand2TypeString)!;
							// Create a regex for the current combination of operand types.
							const regexInstruction: RegExp = new RegExp(
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
								// Store the instruction along its encoded representation in the translations map.
								this.translations.set(regexMatchArrayInstruction[0].toString(), encodedInstruction);
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
					const operand: {name: string, allowed_types: string[]} = instruction.operands[0];
					/**
					 * This instruction expects only one operand. Iterate over all possible types of the operand.
					 */
					for (let operandTypeString of operand.allowed_types) {
						const regexInstructionString: string = instruction.regex;
						// Locate the operand type of the first operand in the language definition.
						const operandTypeDefinition: {name: string; code: string; regex: string;}
							= this.languageDefinition.operand_types.find((current) => current.name === operandTypeString)!;
						// Create a regex for the current operand type.
						const regexInstruction: RegExp = new RegExp(
							regexInstructionString.replace(operand.name, operandTypeDefinition.regex), 
							"gim"
						);
						// Check if the current line of code matches the created regex.
						const regexMatchArrayInstruction: RegExpMatchArray | null = regexInstruction.exec(line);
						if (regexMatchArrayInstruction !== null) {
							// Instruction found. Encode it.
							const encodedInstruction: DoubleWord[] = this.encodeInstruction(regexMatchArrayInstruction, lineNo, jumpLabels);
							// Store the instruction along its encoded representation in the translations map.
							this.translations.set(regexMatchArrayInstruction[0].toString(), encodedInstruction);
							encodedInstructions.push(...encodedInstruction);
							lineEncoded = true;
							break;
						}
					}
				} else {
					// Instruction has no operands.
					const regexInstruction: RegExp = new RegExp(instruction.regex, "gim");
					const regexMatchArrayInstruction: RegExpMatchArray | null = regexInstruction.exec(line);
					if (regexMatchArrayInstruction !== null) {
						// Instruction found. Encode it.
						const encodedInstruction: DoubleWord[] = this.encodeInstruction(regexMatchArrayInstruction, lineNo, jumpLabels);
						// Store the instruction along its encoded representation in the translations map.
						this.translations.set(regexMatchArrayInstruction[0].toString(), encodedInstruction);
						encodedInstructions.push(...encodedInstruction);
						lineEncoded = true;
					}
				}
			}
			if (!lineEncoded) {
				throw new UnrecognizedInstructionError(`Unrecognized or invalid instruction found in line ${lineNo + 1}: ${line}`);
			}
		}
		return encodedInstructions;
	}

	/**
	 * This methods locates jump labels in the assembly code and creates a map between a jump label and a (virtual) memory address.
	 * This mpa is later used to replace the label in instructions with their (virtual) memory address.
	 * @param lines A map, which maps line numbers to strings representing the original programs lines of code.
	 * @returns A map of jump labels and their associated (virtual) memory address.
	 */
	private locateJumpLabels(lines: Map<number, string>) : Map<string, string> {
		var jumpLabels: Map<string, string> = new Map();
		/**
		 * Use this variable in order to count the instructions, that need to be encoded
		 * later, because the keys in the map do not have to be consecutive, as blank lines 
		 * have been removed from the original source text.
		 */
		var virtualAddressOfInstructionFollowingLabel: number = 0;
		for (let [lineNo, line] of lines.entries()) {
			if (line.match(/\.[\S]+:/gim)) {
				let jumpLabel = line.replace(/\.|:/gim, "");
				jumpLabels.set(
					jumpLabel, 
					VirtualAddress.fromInteger(virtualAddressOfInstructionFollowingLabel).toString()
				);
			} else {
				virtualAddressOfInstructionFollowingLabel += 12;
			}
		}
		return jumpLabels;
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
		var encodedInstruction: DoubleWord = new DoubleWord();
		var addressingModeOperand1: Array<Bit> = new Array<Bit>(2);
		var typeOperand1: Array<Bit> = new Array<Bit>(7);
		var addressingModeOperand2: Array<Bit> = new Array<Bit>(2);
		var typeOperand2: Array<Bit> = new Array<Bit>(7);
		var encodedOperandValue1: DoubleWord = new DoubleWord();
		var encodedOperandValue2: DoubleWord = new DoubleWord();
		var instructionType: Array<Bit> = new Array<Bit>(3);
		var opcode: Array<Bit> = new Array<Bit>(7);
		var instructionMnemonic: string = regexMatchArrayInstruction[1];
		const delimeter: Array<Bit> = new Array<Bit>(1, 1);

		for (let instruction of this.languageDefinition.instructions) {
			if (instructionMnemonic.toLowerCase() === instruction.mnemonic.toLowerCase()) {
				instructionType = this.encodeInstructionType(instruction.type, line);
				instruction.opcode.split("").forEach((bit, index) => {
					opcode[index] = (bit === "0") ? 0 : 1;
				});
				break;
			}
		}
			
		// Check for second operand
		if (regexMatchArrayInstruction.length > 3) {
			// A second operand given
			addressingModeOperand2 = this.encodeOperandAddressingMode(regexMatchArrayInstruction[3], line);
			typeOperand2 = this.encodeOperandType(regexMatchArrayInstruction[3], line);
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
			typeOperand1 = this.encodeOperandType(regexMatchArrayInstruction[2], line);
			encodedOperandValue1 = this.encodeOperandValue(regexMatchArrayInstruction[2], line, jumpLabels);
		} else {
			// No operand given
			addressingModeOperand1 = this.encodeOperandAddressingMode("", line);
			typeOperand1 = this.encodeOperandType("", line);
			encodedOperandValue1 = this.encodeOperandValue("", line, jumpLabels);
		}

		encodedInstruction.value = [
			...instructionType, ... delimeter, ... opcode, ... delimeter, 
			... addressingModeOperand1, ... typeOperand1, 
			... addressingModeOperand2, ... typeOperand2
		];
		
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
	 * the opcodes definition, this part of the instruction serves as an indicator for the datatype of the oerand.
	 * The second one represents the actual value encoded as a 32-bit value.
	 * @param operand The operand to encode binary.
	 * @param line The original computer programs line of code which is currently encoded.
	 * @returns The binary encoded operand
	 */
	private encodeOperandValue(operand: string, line: number, jumpLabels: Map<string, string>): DoubleWord {
		var operand32BitEncoded: DoubleWord;
		if (operand.length === 0) {
			operand32BitEncoded = new DoubleWord();
		} else if (jumpLabels.has(operand)) {
			// Operand is jump label.
			operand32BitEncoded = VirtualAddress.fromInteger(parseInt(jumpLabels.get(operand)!, 2));
		} else if (operand.startsWith("$0b")) {
			// Binary immediate found.
			operand32BitEncoded = this.encodeBinaryValue(operand.replace("$0b", ""), line);
		} else if (operand.startsWith("$-0x") || operand.startsWith("$0x")) {
			// Hexadecimal immediate found.
			operand32BitEncoded = this.encodeHexadecimalValue(operand.replace("$", ""), line);
		} else if (operand.startsWith("$-") || operand.startsWith("$")) {
			// Decimal immediate found.
			operand32BitEncoded = this.encodeDecimalValue(operand.replace("$", ""), line);
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
			throw Error(`In line ${line + 1}: Unrecognized operand type and value.`);
		}
		return operand32BitEncoded;
	}

	/**
	 * This method encodes an operands binary value into its 32-bit representation.
	 * @param operand The binary value to encode.
	 * @param line The line of code which this operand originates from.
	 * @returns The 32-bit binary representation of the given immediate operand.
	 */
	private encodeBinaryValue(operand: string, line: number): DoubleWord {
		if (operand.length > this.processingWidth) {
			throw Error(`In line ${line + 1}: Binary immediate consists of more than ${this.processingWidth} bits.`);
		}
		// Sign extend binary value.
		operand = operand.padStart(this.processingWidth, operand.charAt(0));
		const binaryValue: DoubleWord = new DoubleWord();
		operand.split("").map((bit, index) => {
			binaryValue.value[index] = (bit === "0") ? 0 : 1;
		})
		return binaryValue;
	}

	/**
	 * This method encodes an operands hexadecimal value into its 32-bit binary representation.
	 * @param operand The hexadecimal value to encode.
	 * @param line The line of code which this operand originates from.
	 * @returns The 32-bit binary representation of the given immediate operand.
	 */
	private encodeHexadecimalValue(operand: string, line: number): DoubleWord {
		let operandDec: number = 0;
		if (operand.startsWith("-")) {
			// Negative hex value.
			operandDec = (parseInt(operand.replace("-", ""), 16) * -1);
		} else {
			// Positive hex value.
			operandDec = parseInt(operand, 16);
		}
		return DoubleWord.fromInteger(operandDec);
	}

	/**
	 * This method encodes an operands decimal value into its 32-bit binary representation.
	 * @param operand The decimal value to encode.
	 * @param line The line of code which this operand originates from.
	 * @returns The 32-bit binary representation of the given immediate operand.
	 */
	private encodeDecimalValue(operand: string, line: number): DoubleWord {
		let operandDec: number = 0;
		if (operand.startsWith("-")) {
			// Negative dec value.
			operandDec = (parseInt(operand.replace("-", ""), 10) * -1);
		} else {
			// Positive dec value.
			operandDec = parseInt(operand, 10);
		}
		return DoubleWord.fromInteger(operandDec);
	}

	/**
	 * This method encodes an operands virtual, binary memory address into its 32-bit binary representation.
	 * @param operand The virtual memory address to encode.
	 * @param line The line of code which this operand originates from.
	 * @returns The 32-bit binary representation of the given virtual memory address.
	 * @throws An error if the given operands binary memory address is invalid.
	 */
	private encodeBinaryAddress(operand: string, line: number): VirtualAddress {
		if (operand.length > this.processingWidth) {
			throw Error(`In line ${line + 1}: Binary memory address consists of more than ${this.processingWidth} bits.`);
		}
		// Extend binary address with zeros if necessary.
		operand = operand.padStart(this.processingWidth, "0");
		return VirtualAddress.fromInteger(parseInt(operand, 2));
	}

	/**
	 * This method encodes an operands virtual, hexadecimal memory address into its 32-bit binary representation.
	 * @param operand The virtual memory address to encode.
	 * @param line The line of code which this operand originates from.
	 * @returns The 32-bit binary representation of the given virtual memory address.
	 * @throws An error if the given operands hexadecimal memory address is invalid.
	 */
	private encodeHexadecimalAddress(operand: string, line: number): VirtualAddress {
		var virtualAddress: VirtualAddress;
		try {
			virtualAddress = VirtualAddress.fromInteger(parseInt(operand, 16));
		} catch (error) {
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
	private encodeDecimalAddress(operand: string, line: number): VirtualAddress {
		var virtualAddress: VirtualAddress;
		try {
			virtualAddress = VirtualAddress.fromInteger(parseInt(operand, 10));
		} catch (error) {
			throw Error(`In line ${line + 1}: Invalid hexadecimal memory address.`);
		}
		return virtualAddress;
	}

	/**
	 * This method encodes the given operands type.
	 * @param operand An operand whichs type will be encoded.
	 * @param line The original computer programs line of code which is currently encoded.
	 * @returns The binary encoded operands type.
	 */
	private encodeOperandType(operand: string, line: number): Array<Bit> {
		var encodedType: Array<Bit> = new Array<Bit>(7);
		if (operand.length === 0) {
			encodedType = new Array<Bit>(7).fill(0);
		} else if (operand.startsWith("*%") || operand.startsWith("%")) {
			encodedType = new Array<Bit>(1, 1, 0, 0, 0, 0, 0);
		} else if (operand.startsWith("$")) {
			encodedType = new Array<Bit>(1, 0, 1, 0, 0, 0, 0);
		} else if (operand.startsWith("@") || operand.match(this.languageDefinition.label_formats.usage)) {
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
				const tmp: string = reg.code.padStart(this.processingWidth, "0");
				const encodedRegister: DoubleWord = new DoubleWord();
				tmp.split("").forEach((bit, index) => {
					encodedRegister.value[index] = (bit === "0") ? 0 : 1;
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
		var encodedType: Array<Bit> = new Array<Bit>(3).fill(0);
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
	 * This method compiles a given computer program written in assembly language into its binary representation.
	 * The instructions will be encoded using the opcodes defined in the language definition.
	 * The order in which the instructions appear in the input program is preserved during the compilation process.
	 * @param s File contents of an .asm file containing a computer program written in assembly language.
	 * @returns An array of strings representing the binary encoded instructions of the given computer program.
	 */
	public compile(s: string): DoubleWord[] {
		const lines: Map<number, string> = this.preprocess(s);
		return this.encode(lines);
	}
}