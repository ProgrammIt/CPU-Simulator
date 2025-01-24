[**ihme-core-x1-simulator**](../../../README.md)

***

[ihme-core-x1-simulator](../../../modules.md) / [binary\_types/BinaryValue](../README.md) / BinaryValue

# Class: BinaryValue

Defined in: [src/binary\_types/BinaryValue.ts:8](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/BinaryValue.ts#L8)

This class represents a generic binary value.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Extended by

- [`Byte`](../../Byte/classes/Byte.md)
- [`DoubleWord`](../../DoubleWord/classes/DoubleWord.md)
- [`QuadWord`](../../QuadWord/classes/QuadWord.md)

## Constructors

### new BinaryValue()

> **new BinaryValue**(`value`): [`BinaryValue`](BinaryValue.md)

Defined in: [src/binary\_types/BinaryValue.ts:18](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/BinaryValue.ts#L18)

Constructs a new binary value from the given array of bits.

#### Parameters

##### value

[`Bit`](../../Bit/type-aliases/Bit.md)[]

An array of bits representing a binary value.

#### Returns

[`BinaryValue`](BinaryValue.md)

## Properties

### \_value

> `protected` **\_value**: [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:12](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/BinaryValue.ts#L12)

An array of bits, representing a binary value.

## Accessors

### value

#### Get Signature

> **get** **value**(): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:25](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/BinaryValue.ts#L25)

Accessor for reading the binary value.

##### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

#### Set Signature

> **set** **value**(`newValue`): `void`

Defined in: [src/binary\_types/BinaryValue.ts:33](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/BinaryValue.ts#L33)

Accessor for setting the binary value.

##### Parameters

###### newValue

[`Bit`](../../Bit/type-aliases/Bit.md)[]

The new value.

##### Returns

`void`

## Methods

### getLeastSignificantBit()

> **getLeastSignificantBit**(): [`Bit`](../../Bit/type-aliases/Bit.md)

Defined in: [src/binary\_types/BinaryValue.ts:44](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/BinaryValue.ts#L44)

This method returns the least significant bit of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)

The least significant bit.

***

### getLeastSignificantBits()

> **getLeastSignificantBits**(`nbrOfBits`): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:84](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/BinaryValue.ts#L84)

This method returns the last bits of the binary value.
The number of bits returned depends on the argument passed.

#### Parameters

##### nbrOfBits

`number`

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

***

### getLeastSignificantByte()

> **getLeastSignificantByte**(): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:60](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/BinaryValue.ts#L60)

This method returns the least significant byte of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

The least significant byte.

***

### getMostSignificantBit()

> **getMostSignificantBit**(): [`Bit`](../../Bit/type-aliases/Bit.md)

Defined in: [src/binary\_types/BinaryValue.ts:52](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/BinaryValue.ts#L52)

This method returns the most significant bit of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)

The most significant bit.

***

### getMostSignificantBits()

> **getMostSignificantBits**(`nbrOfBits`): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:97](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/BinaryValue.ts#L97)

This method returns the first bits of the binary value.
The number of bits returned depends on the argument passed.

#### Parameters

##### nbrOfBits

`number`

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

***

### getMostSignificantByte()

> **getMostSignificantByte**(): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:71](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/BinaryValue.ts#L71)

This method returns the least significant byte of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

The least significant byte.
