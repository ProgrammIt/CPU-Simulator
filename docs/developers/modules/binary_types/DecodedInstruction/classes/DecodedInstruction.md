[**ihme-core-x1-simulator**](../../../README.md)

***

[ihme-core-x1-simulator](../../../modules.md) / [binary\_types/DecodedInstruction](../README.md) / DecodedInstruction

# Class: DecodedInstruction

Defined in: [src/binary\_types/DecodedInstruction.ts:9](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DecodedInstruction.ts#L9)

This class represents a decoded (non-binary) instruction, ready for execution.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Constructors

### new DecodedInstruction()

> **new DecodedInstruction**(`type`, `operation`): [`DecodedInstruction`](DecodedInstruction.md)

Defined in: [src/binary\_types/DecodedInstruction.ts:30](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DecodedInstruction.ts#L30)

Constructs a new instance from the given arguments.

#### Parameters

##### type

[`EncodedInstructionTypes`](../../../enumerations/EncodedInstructionTypes/enumerations/EncodedInstructionTypes.md)

The instructions type.

##### operation

[`EncodedOperations`](../../../enumerations/EncodedOperations/enumerations/EncodedOperations.md)

The instructions operation.

#### Returns

[`DecodedInstruction`](DecodedInstruction.md)

## Properties

### operands

> **operands**: `undefined` \| \[[`InstructionOperand`](../../InstructionOperand/classes/InstructionOperand.md), `undefined` \| [`InstructionOperand`](../../InstructionOperand/classes/InstructionOperand.md)\]

Defined in: [src/binary\_types/DecodedInstruction.ts:23](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DecodedInstruction.ts#L23)

A list of the operations operands or undefined, if no operand is present.

***

### operation

> **operation**: [`EncodedOperations`](../../../enumerations/EncodedOperations/enumerations/EncodedOperations.md)

Defined in: [src/binary\_types/DecodedInstruction.ts:18](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DecodedInstruction.ts#L18)

The instructions operation.

***

### type

> **type**: [`EncodedInstructionTypes`](../../../enumerations/EncodedInstructionTypes/enumerations/EncodedInstructionTypes.md)

Defined in: [src/binary\_types/DecodedInstruction.ts:13](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DecodedInstruction.ts#L13)

The instructions type.
