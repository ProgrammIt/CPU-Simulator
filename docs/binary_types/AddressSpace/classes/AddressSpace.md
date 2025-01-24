[**ihme-core-x1-simulator**](../../../README.md)

***

[ihme-core-x1-simulator](../../../modules.md) / [binary\_types/AddressSpace](../README.md) / AddressSpace

# Class: AddressSpace\<T\>

Defined in: [src/binary\_types/AddressSpace.ts:7](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/binary_types/AddressSpace.ts#L7)

This class represents an address space or a range of addresses.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Type Parameters

• **T** *extends* [`Address`](../../Address/classes/Address.md)

## Constructors

### new AddressSpace()

> **new AddressSpace**\<`T`\>(`lowAddress`, `highAddress`): [`AddressSpace`](AddressSpace.md)\<`T`\>

Defined in: [src/binary\_types/AddressSpace.ts:25](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/binary_types/AddressSpace.ts#L25)

Constructs a new address space from the given boundries.

#### Parameters

##### lowAddress

`T`

The lower boundry of the address space.

##### highAddress

`T`

The upper boundry of the address space.

#### Returns

[`AddressSpace`](AddressSpace.md)\<`T`\>

## Properties

### highAddress

> `readonly` **highAddress**: `T`

Defined in: [src/binary\_types/AddressSpace.ts:12](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/binary_types/AddressSpace.ts#L12)

This member stores the upper boundry of the address space.

***

### lowAddress

> `readonly` **lowAddress**: `T`

Defined in: [src/binary\_types/AddressSpace.ts:18](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/binary_types/AddressSpace.ts#L18)

This member stores the lower boundry of the address space.

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/binary\_types/AddressSpace.ts:61](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/binary_types/AddressSpace.ts#L61)

This accessor calculates and returns the size of this range.

##### Returns

`number`

## Methods

### highAddressToDecimal()

> **highAddressToDecimal**(): `number`

Defined in: [src/binary\_types/AddressSpace.ts:46](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/binary_types/AddressSpace.ts#L46)

This method returns the decimal representation of the address spaces highest address.

#### Returns

`number`

The decimal representation of the upper boundry.

***

### inRange()

> **inRange**(`address`): `boolean`

Defined in: [src/binary\_types/AddressSpace.ts:35](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/binary_types/AddressSpace.ts#L35)

This method tests whether a given address is in range of the address space.

#### Parameters

##### address

`T`

#### Returns

`boolean`

True, if the given address is in range, false otherwise.

***

### lowAddressToDecimal()

> **lowAddressToDecimal**(): `number`

Defined in: [src/binary\_types/AddressSpace.ts:54](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/binary_types/AddressSpace.ts#L54)

This method returns the decimal representation of the address spaces lowest address.

#### Returns

`number`

The decimal representation of the upper boundry.
