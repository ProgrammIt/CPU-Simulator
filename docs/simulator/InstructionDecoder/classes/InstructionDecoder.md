[**ihme-core-x1-simulator**](../../../README.md)

***

[ihme-core-x1-simulator](../../../modules.md) / [simulator/InstructionDecoder](../README.md) / InstructionDecoder

# Class: InstructionDecoder

Defined in: [src/simulator/InstructionDecoder.ts:12](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/InstructionDecoder.ts#L12)

This class is dedicated to decoding a binary instruction.
It offers an interface for decoding different parts of an instruction.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Constructors

### new InstructionDecoder()

> **new InstructionDecoder**(): [`InstructionDecoder`](InstructionDecoder.md)

#### Returns

[`InstructionDecoder`](InstructionDecoder.md)

## Methods

### decodeAddressingMode()

> `static` **decodeAddressingMode**(`encodedAddressingMode`): [`EncodedAddressingModes`](../../../enumerations/EncodedAdressingModes/enumerations/EncodedAddressingModes.md)

Defined in: [src/simulator/InstructionDecoder.ts:45](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/InstructionDecoder.ts#L45)

This method decodes the addressing mode of an instructions operand.

#### Parameters

##### encodedAddressingMode

[`Bit`](../../../binary_types/Bit/type-aliases/Bit.md)[]

#### Returns

[`EncodedAddressingModes`](../../../enumerations/EncodedAdressingModes/enumerations/EncodedAddressingModes.md)

***

### decodeInstructionType()

> `static` **decodeInstructionType**(`encodedInstructionType`): [`EncodedInstructionTypes`](../../../enumerations/EncodedInstructionTypes/enumerations/EncodedInstructionTypes.md)

Defined in: [src/simulator/InstructionDecoder.ts:66](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/InstructionDecoder.ts#L66)

This methods decodes an instructions type.

#### Parameters

##### encodedInstructionType

[`Bit`](../../../binary_types/Bit/type-aliases/Bit.md)[]

The binary encoded instructions type.

#### Returns

[`EncodedInstructionTypes`](../../../enumerations/EncodedInstructionTypes/enumerations/EncodedInstructionTypes.md)

A decoded representation of the type.

***

### decodeIOperation()

> `static` **decodeIOperation**(`encodedOperation`): [`EncodedOperations`](../../../enumerations/EncodedOperations/enumerations/EncodedOperations.md)

Defined in: [src/simulator/InstructionDecoder.ts:83](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/InstructionDecoder.ts#L83)

This methods decodes an I-type instructions operation.

#### Parameters

##### encodedOperation

[`Bit`](../../../binary_types/Bit/type-aliases/Bit.md)[]

The binary encoded I-type operation.

#### Returns

[`EncodedOperations`](../../../enumerations/EncodedOperations/enumerations/EncodedOperations.md)

A decoded representation of the operation.

***

### decodeJOperation()

> `static` **decodeJOperation**(`encodedOperation`): [`EncodedOperations`](../../../enumerations/EncodedOperations/enumerations/EncodedOperations.md)

Defined in: [src/simulator/InstructionDecoder.ts:116](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/InstructionDecoder.ts#L116)

This methods decodes a J-type instructions operation.

#### Parameters

##### encodedOperation

[`Bit`](../../../binary_types/Bit/type-aliases/Bit.md)[]

The binary encoded J-type operation.

#### Returns

[`EncodedOperations`](../../../enumerations/EncodedOperations/enumerations/EncodedOperations.md)

A decoded representation of the operation.

***

### decodeOperandType()

> `static` **decodeOperandType**(`encodedOperandType`): [`EncodedOperandTypes`](../../../enumerations/EncodedOperandTypes/enumerations/EncodedOperandTypes.md)

Defined in: [src/simulator/InstructionDecoder.ts:18](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/InstructionDecoder.ts#L18)

This method decodes the type of an instructions operand.

#### Parameters

##### encodedOperandType

[`Bit`](../../../binary_types/Bit/type-aliases/Bit.md)[]

#### Returns

[`EncodedOperandTypes`](../../../enumerations/EncodedOperandTypes/enumerations/EncodedOperandTypes.md)

***

### decodeROperation()

> `static` **decodeROperation**(`encodedOperation`): [`EncodedOperations`](../../../enumerations/EncodedOperations/enumerations/EncodedOperations.md)

Defined in: [src/simulator/InstructionDecoder.ts:179](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/InstructionDecoder.ts#L179)

This methods decodes a R-type instructions operation.

#### Parameters

##### encodedOperation

[`Bit`](../../../binary_types/Bit/type-aliases/Bit.md)[]

The binary encoded R-type operation.

#### Returns

[`EncodedOperations`](../../../enumerations/EncodedOperations/enumerations/EncodedOperations.md)

A decoded representation of the operation.
