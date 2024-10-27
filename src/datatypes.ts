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
