/**
 * See https://stackoverflow.com/questions/66152989/contextbridge-exposeinmainworld-and-ipc-with-typescript-in-electron-app-cannot.
 */

import { mainMemory } from "./preload";

declare global {
	interface Window {mainMemory: typeof mainMemory}
}

interface LanguageDefinition {
	instructions: Instruction[];
	addressable_registers: Register[];
}

interface Instruction {
	mnemonic: string;
	opcode: string;
	type: string;
	regexes: string[];
}

interface Register {
	name: string;
	aliases: string[];
	code: string;
}