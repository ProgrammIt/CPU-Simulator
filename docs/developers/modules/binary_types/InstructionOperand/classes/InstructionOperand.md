[**ihme-core-x1-simulator**](../../../README.md)

***

[ihme-core-x1-simulator](../../../modules.md) / [binary\_types/InstructionOperand](../README.md) / InstructionOperand

# Class: InstructionOperand

Defined in: [src/binary\_types/InstructionOperand.ts:12](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/InstructionOperand.ts#L12)

A class representing a decoded (non-binary) operand of an instruction.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Constructors

### new InstructionOperand()

> **new InstructionOperand**(`addressingMode`, `type`, `value`): [`InstructionOperand`](InstructionOperand.md)

Defined in: [src/binary\_types/InstructionOperand.ts:38](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/InstructionOperand.ts#L38)

Creates a new instance from the given arguments.

#### Parameters

##### addressingMode

[`EncodedAddressingModes`](../../../enumerations/EncodedAdressingModes/enumerations/EncodedAddressingModes.md)

The operands addressing mode.

##### type

[`EncodedOperandTypes`](../../../enumerations/EncodedOperandTypes/enumerations/EncodedOperandTypes.md)

The operands type.

##### value

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md)

The operands value in binary representation.

#### Returns

[`InstructionOperand`](InstructionOperand.md)

## Properties

### addressingMode

> `readonly` **addressingMode**: [`EncodedAddressingModes`](../../../enumerations/EncodedAdressingModes/enumerations/EncodedAddressingModes.md)

Defined in: [src/binary\_types/InstructionOperand.ts:17](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/InstructionOperand.ts#L17)

The operands addressing mode. Can be either direct or indirect. Indirect mode is only valid for registers.

***

### type

> `readonly` **type**: [`EncodedOperandTypes`](../../../enumerations/EncodedOperandTypes/enumerations/EncodedOperandTypes.md)

Defined in: [src/binary\_types/InstructionOperand.ts:23](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/InstructionOperand.ts#L23)

The operands type. Can be either a constant/immediate, a memory address or a register.

***

### value

> `readonly` **value**: [`DoubleWord`](../../DoubleWord/classes/DoubleWord.md)

Defined in: [src/binary\_types/InstructionOperand.ts:29](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/InstructionOperand.ts#L29)

The operands value in binary representation.
