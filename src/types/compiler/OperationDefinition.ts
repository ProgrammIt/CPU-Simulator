export interface InstructionDefinition {
	mnemonic: string;
	opcode: string;
	type: string;
	regexes: [
		{
			name: string;
			regex: string;
		}
	];
}