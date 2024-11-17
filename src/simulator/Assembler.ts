import { Bit, DataSize, Doubleword, LanguageDefinition } from "../types";

export class Assembler {
  private static WORD_WIDTH: number = 32;
  private static _regexComment: RegExp = /[\s]*;.*/gim;
  private static _regexNewLine: RegExp = /\r?\n|\r/gim;
  private static _regexLabel: RegExp = /[a-zA-Z][a-zA-Z\-_0-9]/gim;
  private static _instance: Assembler | null | undefined = null;
  private static _langDefinition: LanguageDefinition | null | undefined;

  private constructor() {}

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
	fileContents.split(Assembler._regexNewLine).forEach((line, lineNo) => {
    	var lineWithoutComment: string = line.replace(Assembler._regexComment, "").trim();
		if (lineWithoutComment.length === 0) {
			linesMarkedForDeletion.push(lineNo);
		}
	  	lines.set(lineNo, lineWithoutComment);
	});

	for (let lineNo of linesMarkedForDeletion) {
		lines.delete(lineNo);
	}

	return lines;
  }

	/**
	 * This method encodes the reduced assembly program to its binary equivalent.
	 * @param lines A map, which maps line numbers to strings representing the original programs lines of code.
	 * @returns An array of doublewords representing the encoded instructions and their operands of the assembly program.
	 */
  	private encode(lines: Map<number, string>): Doubleword[] {
	  	var encodedInstructions: Doubleword[] = [];
	  	var jumpLabels: Map<string, string> = this.locateJumpLabels(lines);	

		// Remove jump labels as they will not be encoded.
		var lineNumbersMarkedForDeletion: number[] = [];

		for (let [lineNo, line] of lines.entries()) {	
			if (line.match(/.[\S]*:/gim)) {
				lineNumbersMarkedForDeletion.push(lineNo);
			}
		}

		for (let lineNo of lineNumbersMarkedForDeletion) {
			lines.delete(lineNo);
		}
	
		for (let [lineNo, line] of lines.entries()) {		
			
			// For every line of code, search for a contained instruction.
			for (let instruction of Assembler._langDefinition!.instructions) {
				
				// Some instructions come in variants. Test all of them on a single line.
				for (let instructionRegex of instruction.regexes) {
					// Test whether the line of code matches the regex of an instruction.
					let result: RegExpExecArray | null = RegExp(instructionRegex, "i").exec(line);
					
					if (result != null) {
						// Line of code did match the regex of an instruction. The regex returns an array containing matches and groups.

						/**
						 * Each of these arrays contains the following items in the specified order. Optional items are marked with `[]`.
						 * 1. Instruction as is: mnemonic [and operands]
						 * 2. Mnemonic
						 * [3. First operand]
						 * [4. Second operand]
						 */
						
						// Pass the resulting array to the instruction encoding.
						let encodedResults: Doubleword[] = this.encodeInstruction(result, lineNo, jumpLabels);					
						let encodedInstruction: Doubleword = encodedResults[0];
						let encodedOperand1: Doubleword = encodedResults[1];
						let encodedOperand2: Doubleword = encodedResults[2];
						encodedInstructions.push(encodedInstruction, encodedOperand1, encodedOperand2);

						// If one variant did match, do not test the others too.
						break;
					}
				}
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
		var instructionCounter: number = 0;

		for (let [lineNo, line] of lines.entries()) {
			if (line.match(/.[\S]*:/gim)) {
				const memoryCellsPerInstruction: number = 4;
				let virtualAddressOfInstructionFollowingLabel: number = (instructionCounter * memoryCellsPerInstruction) + 1;
				let jumpLabel = line.replace(/\.|:/gim, "");
				jumpLabels.set(
					jumpLabel, 
					(virtualAddressOfInstructionFollowingLabel).toString(2).padStart(Assembler.WORD_WIDTH, "0")
				);
			}
			++instructionCounter;
		}
		
		return jumpLabels;
	}

  /**
   * This method binary encodes a given instruction.
   * @param regexMatchArrayInstruction An array containing the results of a match of a regular expression on an instruction.
   * @param line The original computer programs line of code which is currently encoded.
   * @returns A string containing the binary equivalent of the given instruction.
   */
	private encodeInstruction(regexMatchArrayInstruction: RegExpMatchArray, line: number, jumpLabels: Map<string, string>): Doubleword[] {
		var encodedInstruction: Doubleword = new Doubleword();
		var addressingModeOperand1: Array<Bit> = new Array<Bit>(2);
		var typeOperand1: Array<Bit> = new Array<Bit>(7);
		var addressingModeOperand2: Array<Bit> = new Array<Bit>(2);
		var typeOperand2: Array<Bit> = new Array<Bit>(7);
		var encodedOperandValue1: Doubleword = new Doubleword();
		var encodedOperandValue2: Doubleword = new Doubleword();
		var instructionType: Array<Bit> = new Array<Bit>(3);
		var opcode: Array<Bit> = new Array<Bit>(7);
		var instructionMnemonic: string = regexMatchArrayInstruction[1];
		const delimeter: Array<Bit> = new Array<Bit>(new Bit(1), new Bit(1));

		for (let instruction of Assembler._langDefinition!.instructions) {
			if (instructionMnemonic.toLowerCase() === instruction.mnemonic.toLowerCase()) {
				instructionType = this.encodeInstructionType(instruction.type, line);
				instruction.opcode.split("").forEach((bit, index) => {
					opcode[index] = (bit === "0") ? new Bit(0) : new Bit(1);
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
			return new Array<Bit>(2).fill(new Bit(1));
		}

		if (operand.startsWith("*@") || operand.startsWith("*$")) {
			throw new Error(
				`In line ${line}: Indirect addressing mode is only supported for usage with registers.`
			);
		}

		return new Array<Bit>(new Bit(1), new Bit(0));
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
	private encodeOperandValue(operand: string, line: number, jumpLabels: Map<string, string>): Doubleword {
		var operand32BitEncoded: Doubleword = new Doubleword();
		var binaryValueString: string = "";

		if (operand.length === 0) {
			binaryValueString = "0";
		} else if (jumpLabels.has(operand)) {
			// Check if operand is jump label
			binaryValueString = jumpLabels.get(operand)!;
		} else if (operand.startsWith("$0b")) {
			// Binary immediate
			binaryValueString = operand.replace("$0b", "");
		} else if (operand.startsWith("$0x")) {
			// Hex immediate
			binaryValueString = parseInt(operand.replace("$", ""), 16).toString(2);
		} else if (operand.startsWith("$")) {
			binaryValueString = parseInt(operand.replace("$", ""), 10).toString(2);
		} else if (operand.startsWith("@0b")) {
			// Binary memory address
			binaryValueString = operand.replace("@0b", "");
		} else if (operand.startsWith("@0x")) {
			// Hex memory address
			binaryValueString = parseInt(operand.replace("@", ""), 16).toString(2);
		} else if (operand.startsWith("@")) {
			// Decimal memory address
			binaryValueString = parseInt(operand.replace("@", ""), 10).toString(2);
		} else if (operand.startsWith("*%")) {
			// Register used with indirect addressing mode
			binaryValueString = this.encodeRegister(operand.replace("*%", ""), line);
		} else if (operand.startsWith("%")) {
			// Register used with direct addressing mode
			binaryValueString = this.encodeRegister(operand.replace("%", ""), line);
		} else {
			throw Error(`In line ${line}: Unrecognized operand type and value.`);
		}

		if (binaryValueString.length > Assembler.WORD_WIDTH) {
			/**
			 * Overflow handling: discard surplus bits
			 * Example:
			 *   1111 10010010 00101011 10111010 01011011 (36 bit) -> 10010010 00101011 10111010 01011011 (32 bit)
			 */
			binaryValueString = binaryValueString.slice(binaryValueString.length - 32);
		}
		
		// Pad binary value to fit WORD_WIDTH
		binaryValueString = binaryValueString.padStart(DataSize.DOUBLEWORD, "0");

		binaryValueString.split("").forEach((bit, index) => {
			// Create deepcopy of current value, because value is readonly.
			const tmp: Array<Bit> = operand32BitEncoded.value.slice();
			// Manipulate copy.
			tmp[index] = (bit === "0") ? new Bit(0) : new Bit(1);
			// Set copy as new value.
			operand32BitEncoded.value = tmp;
		});

		return operand32BitEncoded;
 	}

	/**
	 * This method encodes the given operands type.
	 * @param operand An operand whichs type will be encoded.
	 * @param line The original computer programs line of code which is currently encoded.
	 * @returns The binary encoded operands type.
	 */
	private encodeOperandType(operand: string, line: number): Array<Bit> {
		var encodedType: Array<Bit> = new Array<Bit>(7);
		
		if (operand === null || operand === undefined || operand.length === 0) {
			encodedType = new Array<Bit>(7).fill(new Bit(0));
		} else if (operand.startsWith("*%") || operand.startsWith("%")) {
			encodedType = new Array<Bit>(new Bit(1), new Bit(1), new Bit(0), new Bit(0), new Bit(0), new Bit(0), new Bit(0));
		} else if (operand.startsWith("$")) {
			encodedType = new Array<Bit>(new Bit(1), new Bit(0), new Bit(1), new Bit(0), new Bit(0), new Bit(0), new Bit(0));
		} else if (operand.startsWith("@") || operand.match(Assembler._regexLabel)) {
			encodedType = new Array<Bit>(new Bit(1), new Bit(1), new Bit(1), new Bit(0), new Bit(0), new Bit(0), new Bit(0));
		} else {
			throw Error(`In line ${line}: Unrecognized type of operand.`);
		}

		return encodedType;
	}

	/**
	 * This method encodes the given register into a its binary representation according to the assembly language definition.
	 * An error is thrown if the register could not be found in the language definition.
	 * @param register A string containing the register to encode.
	 * @param line The original computer programs line of code which is currently encoded.
	 * @returns An array of bits representing the register.
	 */
	private encodeRegister(register: string, line: number): string {
		register = register.replace("%", "").toLowerCase();
		for (const reg of Assembler._langDefinition!.addressable_registers) {
			if (register === reg.name.toLowerCase()) {
				return reg.code.padStart(DataSize.DOUBLEWORD, "0");
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
		var encodedType: Array<Bit> = new Array<Bit>(3).fill(new Bit(0));
		switch (type.toUpperCase()) {
		case "R":
			encodedType = new Array<Bit>(new Bit(1), new Bit(0), new Bit(0));
			break;
		case "I":
			encodedType = new Array<Bit>(new Bit(1), new Bit(1), new Bit(0));
			break;
		case "J":
			encodedType = new Array<Bit>(new Bit(1), new Bit(1), new Bit(1));
			break;
		default:
			throw Error(`In line ${line}: Unrecognized instruction type.`);
		}
		return encodedType;
	}

  /**
   * This method returns the single instance of the Assembler class.
   * If there is no such instance, one and one is created. Otherwise, the exisiting one is returned.
   * @returns An instance of the Assembler class.
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
   * @param s The file contents of a .json file containing the assembly language definition.
   * @returns
   */
  public loadLanguageDefinition(s: string): void {
	Assembler._langDefinition = JSON.parse(s);
	return;
  }

  /**
   * This method compiles a given computer program written in assembly language into its binary representation.
   * The instructions will be encoded using the opcodes defined in the language definition.
   * The order in which the instructions appear in the input program is preserved during the compilation process.
   * @param s File contents of an .asm file containing a computer program written in assembly language.
   * @returns An array of strings representing the binary encoded instructions of the given computer program.
   */
  public compile(s: string): Doubleword[] {
	const lines: Map<number, string> = this.preprocess(s);
	return this.encode(lines);
  }
}