export interface AssemblyLanguageDefinition {
    variable_formats: {
        declarationDecimal: string;
        declarationHexadecimal: string;
        declarationBinary: string;
        declarationString: string;
        declarationBuffer: string;
        usage: string;
    }
    
    constant_formats: {
        declarationDecimal: string;
        declarationHexadecimal: string;
        declarationBinary: string;
        declarationString: string;
        usage: string;
    };

    comment_format: string;
    include_format: string;
    
    label_formats: {
        declaration: string;
        usage: string;
    };

    number_formats: {
        decimal: string;
        hexadecimal: string;
        binary: string;
    };

    addressable_registers: AssemblyAddressableRegisters[];

    operand_types: AssemblyOperandType[];

    instructions: AssemblyInstruction[];
}

export type AssemblyAddressableRegisters = {
        name: string;
        aliases: string[] | undefined;
        code: string;
    };

export type AssemblyOperandType = {
        name: string;
        code: string;
        regex: string;
    };

export type AssemblyInstruction = {
        mnemonic: string;
        opcode: string;
        regex: string;
        operands: {
            name: string;
            allowed_types: string[];
        }[] | undefined;
        illegal_combinations_of_operand_types: {
            __SOURCE__: string;
            __TARGET__: string;
        }[] | undefined;
    };