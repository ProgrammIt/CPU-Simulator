[**ihme-core-x1-simulator**](../../../../README.md)

***

[ihme-core-x1-simulator](../../../../modules.md) / [simulator/functional\_units/RAM](../README.md) / RAM

# Class: RAM

Defined in: [src/simulator/functional\_units/RAM.ts:7](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/functional_units/RAM.ts#L7)

## Constructors

### new RAM()

> **new RAM**(`capacity`): [`RAM`](RAM.md)

Defined in: [src/simulator/functional\_units/RAM.ts:17](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/functional_units/RAM.ts#L17)

This method constructs an instance of the RAM class.

#### Parameters

##### capacity

`number`

The max. capacity of this instance of the RAM class.

#### Returns

[`RAM`](RAM.md)

## Properties

### capacity

> `readonly` **capacity**: `number`

Defined in: [src/simulator/functional\_units/RAM.ts:8](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/functional_units/RAM.ts#L8)

## Accessors

### cells

#### Get Signature

> **get** **cells**(): `Map`\<`string`, [`Byte`](../../../../binary_types/Byte/classes/Byte.md)\>

Defined in: [src/simulator/functional\_units/RAM.ts:146](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/functional_units/RAM.ts#L146)

A public accessable getter for the memory cells.
This method will be used by the GUI in order to
display the contents of the main memory.

##### Returns

`Map`\<`string`, [`Byte`](../../../../binary_types/Byte/classes/Byte.md)\>

The current content of this RAM instance.

## Methods

### clearByte()

> **clearByte**(`physicalAddress`): `void`

Defined in: [src/simulator/functional\_units/RAM.ts:118](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/functional_units/RAM.ts#L118)

This method clears all bits at the specified location and removes the entry with the given physical memory
address from the cells map. Both is done only if there is an entry in cells map.

#### Parameters

##### physicalAddress

[`PhysicalAddress`](../../../../binary_types/PhysicalAddress/classes/PhysicalAddress.md)

A binary value representing a physical memory address to write the data to.

#### Returns

`void`

#### Throws

AddressOutOfRangeError - If the physical memory address is out of range.

***

### readByteFrom()

> **readByteFrom**(`physicalAddress`): [`Byte`](../../../../binary_types/Byte/classes/Byte.md)

Defined in: [src/simulator/functional\_units/RAM.ts:100](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/functional_units/RAM.ts#L100)

This method tries to read a byte from the specified memory address.
Returns a binary zero for address not conatined in the
map in order to simulate a full size memory.

#### Parameters

##### physicalAddress

[`PhysicalAddress`](../../../../binary_types/PhysicalAddress/classes/PhysicalAddress.md)

A binary value representing a physical memory address to write the data to.

#### Returns

[`Byte`](../../../../binary_types/Byte/classes/Byte.md)

The byte-sized data found at the specified address.

#### Throws

AddressOutOfRangeError - If the physical memory address is out of range.

***

### readDoublewordFrom()

> **readDoublewordFrom**(`physicalAddress`): [`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Defined in: [src/simulator/functional\_units/RAM.ts:78](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/functional_units/RAM.ts#L78)

This method reads doubleword sized data from the main memory starting at the specified physical memory address.

#### Parameters

##### physicalAddress

[`PhysicalAddress`](../../../../binary_types/PhysicalAddress/classes/PhysicalAddress.md)

A binary physical memory address to read the doubleword-sized data from.

#### Returns

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Doubleword-sized binary data.

#### Throws

AddressOutOfRangeError - If the physical memory address is out of range.

***

### writeByteTo()

> **writeByteTo**(`physicalAddress`, `data`): `void`

Defined in: [src/simulator/functional\_units/RAM.ts:59](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/functional_units/RAM.ts#L59)

This method writes a specified byte of data to the specified address in
in the main memory. Throws an error, if the data exeeds a byte.

#### Parameters

##### physicalAddress

[`PhysicalAddress`](../../../../binary_types/PhysicalAddress/classes/PhysicalAddress.md)

A binary value representing a physical memory address to write the data to.

##### data

[`Byte`](../../../../binary_types/Byte/classes/Byte.md)

Byte-sized data to write to the specified pyhsical memory address.

#### Returns

`void`

#### Throws

AddressOutOfRangeError - If the physical memory address is out of range.

***

### writeDoublewordTo()

> **writeDoublewordTo**(`physicalAddress`, `doubleword`): `void`

Defined in: [src/simulator/functional\_units/RAM.ts:30](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/functional_units/RAM.ts#L30)

This methods writes a doubleword (32-bit- or 4-byte-) value to memory to the specified memory address.

#### Parameters

##### physicalAddress

[`PhysicalAddress`](../../../../binary_types/PhysicalAddress/classes/PhysicalAddress.md)

A physical memory address to write the doubleword-sized data to.

##### doubleword

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Doubleword-sized data to write.

#### Returns

`void`

#### Throws

AddressOutOfRangeError - If the physical memory address is out of range.
