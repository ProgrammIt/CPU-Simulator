export interface AssemblyLanguageDefinition {
    constant_formats: {
        declarationInteger: string;
        declarationString: string;
        usage: string;
    };

    comment_format: string;
    
    label_formats: {
        declaration: string;
        usage: string;
    };

    number_formats: {
        decimal: string;
        hexadecimal: string;
        binary: string;
    };

    addressable_registers: {
        name: string;
        aliases: string[] | undefined;
        code: string;
    }[];

    operand_types: {
        name: string;
        code: string;
        regex: string;
    }[];

    addressModes: {
        name: string;
        code: string;
    }[];

    instruction_types: {
        name: string;
        code: string;
    }[];

    instructions: {
        mnemonic: string;
        opcode: string;
        type: string;
        regex: string;
        operands: {
            name: string;
            allowed_types: string[];
        }[] | undefined;
        address_modes: string[];
        illegal_combinations_of_operand_types: {
            __SOURCE__: string;
            __TARGET__: string;
        }[] | undefined;
    }[];
}