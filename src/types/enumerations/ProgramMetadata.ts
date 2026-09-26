import { Byte } from "../binary/Byte";
import { DoubleWord } from "../binary/DoubleWord";
import { Word } from "../binary/Word";


export type ProgramMetadata = DoubleWord[];


/**
 * Program Metadata
 * 
 * ELF header 16 bytes (4 dwords)
 * 0x00-0x03 magic number
 * 0x04-0x07 program header file offset (in bytes, currently 32)
 * 0x08-0x09 ISA version
 * 0x10-0x10 Program encoding type (0 = fixed-size instructions, 1 = variable-size instructions, 2 = embeddable variable-size instructions)
 * 0x11-0x11 program instruction alignment (in dwords, 0 = not aligned)
 * 0x12-0x15 padding
 * 
 * Program header (currently 12 dwords)
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
 * 1 DWORD Uninitialized Data segment virtual start address
 * 1 DWORD Uninitialized Data segment size
 * 
 */
export namespace ProgramMetadata {

	export const SIZE_IN_BYTES: number = (4 + 12) * DoubleWord.NUMBER_OF_BYTES;
    export const SIZE_IN_DOUBLEWORDS: number = 4 + 12;
    export const ICE_HEADER_SIZE_IN_DOUBLEWORDS: number = 4;
    export const PROGRAM_HEADER_SIZE_IN_DOUBLEWORDS: number = 12;

	export const ICE_MAGIC_NUMBER: DoubleWord = 0x7F_49_43_45 as DoubleWord // 0x7F followed by ICE in ASCII as Word;

	export const ISA_VERSION: Word = Word.fromNumber(1);

	export const enum InstructionEncodingType {
		FIXED_SIZE = 0,
		VARIABLE_SIZE = 1,
		VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS = 2
	}

	/**
	 * This method creates the ProgramMetadata from a buffer.
	 * @param buffer 
	 * @returns
	 */
	export function fromBuffer(buffer: Buffer): ProgramMetadata {
        if (buffer.length < ProgramMetadata.SIZE_IN_BYTES) {
            throw new Error("Buffer is not a valid executable. Buffer too small.")
        }
        if (buffer.readUInt32BE(0) !== ICE_MAGIC_NUMBER) {
            throw new Error("Buffer is not a valid executable.")
        }

		if (buffer.readUInt16BE(8) > ISA_VERSION) {
            throw new Error("Program is writen for a newer version of the simulator. Please update the simulator")
        } else if (buffer.readUInt16BE(8) < ISA_VERSION) {
            throw new Error("Program is writen for an older version of the simulator. Please reassemble the program")
        }

		const metadata: DoubleWord[] = [];

        for (let i = 0; i < ICE_HEADER_SIZE_IN_DOUBLEWORDS * DoubleWord.NUMBER_OF_BYTES; i += 4) {
            metadata.push(DoubleWord.fromNumber(buffer.readUInt32BE(i)));
        }

        for (let i = metadata[1]; i < metadata[1] + PROGRAM_HEADER_SIZE_IN_DOUBLEWORDS * DoubleWord.NUMBER_OF_BYTES; i = DoubleWord.fromNumber(i + 4)) {
            metadata.push(DoubleWord.fromNumber(buffer.readUInt32BE(i)));
        }

        return metadata as ProgramMetadata;
	}

    /**
	 * This method creates the ProgramMetadata from the file content array.
	 * @param buffer 
	 * @returns
	 */
	export function fromFileArray(content: DoubleWord[]): ProgramMetadata {
        if (content.length < ProgramMetadata.SIZE_IN_DOUBLEWORDS) {
            throw new Error("Array is not a valid executable. Array too small.")
        }
        if (content[0] !== ICE_MAGIC_NUMBER) {
            throw new Error("File is not a valid executable.")
        }

		if (DoubleWord.getUpperWord(content[2]) > ISA_VERSION) {
            throw new Error("Program is writen for a newer version of the simulator. Please update the simulator")
        } else if (DoubleWord.getUpperWord(content[2]) < ISA_VERSION) {
            throw new Error("Program is writen for an older version of the simulator. Please reassemble the program")
        }

		const metadata: DoubleWord[] = [];

        for (let i = 0; i < ICE_HEADER_SIZE_IN_DOUBLEWORDS; i++) {
            metadata.push(content[i]);
        }

        for (let i = metadata[1] / DoubleWord.NUMBER_OF_BYTES; i < metadata[1] + PROGRAM_HEADER_SIZE_IN_DOUBLEWORDS; i++) {
            metadata.push(content[i]);
        }

        return metadata as ProgramMetadata;
	}

    /**
	 * This method gets the program header offset
	 * @param metadata 
	 * @returns
	 */
	export function getProgramHeaderOffset(metadata: ProgramMetadata): DoubleWord {
        return metadata[1];
	}

	/**
	 * This method gets the ISA version
	 * @param metadata 
	 * @returns
	 */
	export function getIsaVersion(metadata: ProgramMetadata): Word {
        return DoubleWord.getUpperWord(metadata[2]);
	}

	/**
	 * This method instruction encoding type
	 * @param metadata 
	 * @returns
	 */
	export function getInstructionEncodingType(metadata: ProgramMetadata): InstructionEncodingType {

		const value = DoubleWord.getThirdByte(metadata[2]);

		if (value > InstructionEncodingType.VARIABLE_SIZE_WITH_EMBEDDABLE_OPERANDS) {
			throw new Error(`Invalid instruction encoding type: ${value}`);
		}

		return value as InstructionEncodingType;
	}

	/**
	 * This method instruction alignment in DoubleWords
	 * @param metadata 
	 * @returns
	 */
	export function getInstructionAlignment(metadata: ProgramMetadata): Byte {
        return DoubleWord.getFourthByte(metadata[2]);
	}

    /**
	 * This method gets the total l2 tables that are needed
	 * @param metadata 
	 * @returns
	 */
	export function getTotalL2Tables(metadata: ProgramMetadata): DoubleWord {
        return metadata[ICE_HEADER_SIZE_IN_DOUBLEWORDS];
	}

    /**
	 * This method gets the Text segment virtual start address
	 * @param metadata 
	 * @returns
	 */
	export function getTextSegmentVirtualStartAddress(metadata: ProgramMetadata): DoubleWord {
        return metadata[ICE_HEADER_SIZE_IN_DOUBLEWORDS + 1];
	}

    /**
	 * This method gets the Text segment file offset
	 * @param metadata 
	 * @returns
	 */
	export function getTextSegmentFileOffset(metadata: ProgramMetadata): DoubleWord {
        return metadata[ICE_HEADER_SIZE_IN_DOUBLEWORDS + 2];
	}

    /**
	 * This method gets the Text segment size
	 * @param metadata 
	 * @returns
	 */
	export function getTextSegmentSize(metadata: ProgramMetadata): DoubleWord {
        return metadata[ICE_HEADER_SIZE_IN_DOUBLEWORDS + 3];
	}

    /**
	 * This method gets the RoData segment virtual start address
	 * @param metadata 
	 * @returns
	 */
	export function getRoDataSegmentVirtualStartAddress(metadata: ProgramMetadata): DoubleWord {
        return metadata[ICE_HEADER_SIZE_IN_DOUBLEWORDS + 4];
	}

    /**
	 * This method gets the RoData segment file offset
	 * @param metadata 
	 * @returns
	 */
	export function getRoDataSegmentFileOffset(metadata: ProgramMetadata): DoubleWord {
        return metadata[ICE_HEADER_SIZE_IN_DOUBLEWORDS + 5];
	}

    /**
	 * This method gets the RoData segment size
	 * @param metadata 
	 * @returns
	 */
	export function getRoDataSegmentSize(metadata: ProgramMetadata): DoubleWord {
        return metadata[ICE_HEADER_SIZE_IN_DOUBLEWORDS + 6];
	}

    /**
	 * This method gets the Data segment virtual start address
	 * @param metadata 
	 * @returns
	 */
	export function getDataSegmentVirtualStartAddress(metadata: ProgramMetadata): DoubleWord {
        return metadata[ICE_HEADER_SIZE_IN_DOUBLEWORDS + 7];
	}

    /**
	 * This method gets the Data segment file offset
	 * @param metadata 
	 * @returns
	 */
	export function getDataSegmentFileOffset(metadata: ProgramMetadata): DoubleWord {
        return metadata[ICE_HEADER_SIZE_IN_DOUBLEWORDS + 8];
	}

    /**
	 * This method gets the Data segment size
	 * @param metadata 
	 * @returns
	 */
	export function getDataSegmentSize(metadata: ProgramMetadata): DoubleWord {
        return metadata[ICE_HEADER_SIZE_IN_DOUBLEWORDS + 9];
	}

    /**
	 * This method gets the Uninitialized Data segment virtual start address
	 * @param metadata 
	 * @returns
	 */
	export function getUninitializedDataSegmentVirtualStartAddress(metadata: ProgramMetadata): DoubleWord {
        return metadata[ICE_HEADER_SIZE_IN_DOUBLEWORDS + 10];
	}

    /**
	 * This method gets the Uninitialized Data segment size
	 * @param metadata 
	 * @returns
	 */
	export function getUninitializedDataSegmentSize(metadata: ProgramMetadata): DoubleWord {
        return metadata[ICE_HEADER_SIZE_IN_DOUBLEWORDS +11];
	}
}