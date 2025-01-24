[**ihme-core-x1-simulator**](../../../README.md)

***

[ihme-core-x1-simulator](../../../modules.md) / [binary\_types/Byte](../README.md) / Byte

# Class: Byte

Defined in: [src/binary\_types/Byte.ts:9](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/binary_types/Byte.ts#L9)

This class represents a byte sized binary value.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Extends

- [`BinaryValue`](../../BinaryValue/classes/BinaryValue.md)

## Constructors

### new Byte()

> **new Byte**(`value`): [`Byte`](Byte.md)

Defined in: [src/binary\_types/Byte.ts:19](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/binary_types/Byte.ts#L19)

Instantiates a new object.

#### Parameters

##### value

[`Bit`](../../Bit/type-aliases/Bit.md)[] = `...`

The initial value of the byte.

#### Returns

[`Byte`](Byte.md)

#### Overrides

[`BinaryValue`](../../BinaryValue/classes/BinaryValue.md).[`constructor`](../../BinaryValue/classes/BinaryValue.md#constructors)

## Properties

### \_value

> `protected` **\_value**: [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:12](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/binary_types/BinaryValue.ts#L12)

An array of bits, representing a binary value.

#### Inherited from

[`BinaryValue`](../../BinaryValue/classes/BinaryValue.md).[`_value`](../../BinaryValue/classes/BinaryValue.md#_value)

***

### MAX\_NEGATIVE\_NUMBER\_DEC

> `readonly` `static` **MAX\_NEGATIVE\_NUMBER\_DEC**: `number` = `-128`

Defined in: [src/binary\_types/Byte.ts:11](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/binary_types/Byte.ts#L11)

***

### MAX\_POSITIVE\_NUMBER\_DEC

> `readonly` `static` **MAX\_POSITIVE\_NUMBER\_DEC**: `number` = `127`

Defined in: [src/binary\_types/Byte.ts:10](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/binary_types/Byte.ts#L10)

***

### NUMBER\_OF\_BITS\_DEC

> `readonly` `static` **NUMBER\_OF\_BITS\_DEC**: `number` = `8`

Defined in: [src/binary\_types/Byte.ts:12](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/binary_types/Byte.ts#L12)

## Accessors

### value

#### Get Signature

> **get** **value**(): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/Byte.ts:32](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/binary_types/Byte.ts#L32)

Accessor for reading the binary value.

##### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

#### Set Signature

> **set** **value**(`newValue`): `void`

Defined in: [src/binary\_types/Byte.ts:41](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/binary_types/Byte.ts#L41)

Accessor for setting the binary value.

##### Parameters

###### newValue

[`Bit`](../../Bit/type-aliases/Bit.md)[]

The new value.

##### Returns

`void`

#### Overrides

[`BinaryValue`](../../BinaryValue/classes/BinaryValue.md).[`value`](../../BinaryValue/classes/BinaryValue.md#value-1)

## Methods

### equal()

> **equal**(`byte`): `boolean`

Defined in: [src/binary\_types/Byte.ts:54](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/binary_types/Byte.ts#L54)

For comparison, both binary values are converted to strings.
Conversion presarves the order of items, which is important for the comparison.

#### Parameters

##### byte

[`Byte`](Byte.md)

The binary value to compare to.

#### Returns

`boolean`

True, when both binary values are identical, false otherwise.

***

### getLeastSignificantBit()

> **getLeastSignificantBit**(): [`Bit`](../../Bit/type-aliases/Bit.md)

Defined in: [src/binary\_types/BinaryValue.ts:44](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/binary_types/BinaryValue.ts#L44)

This method returns the least significant bit of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)

The least significant bit.

#### Inherited from

[`BinaryValue`](../../BinaryValue/classes/BinaryValue.md).[`getLeastSignificantBit`](../../BinaryValue/classes/BinaryValue.md#getleastsignificantbit)

***

### getLeastSignificantBits()

> **getLeastSignificantBits**(`nbrOfBits`): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:84](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/binary_types/BinaryValue.ts#L84)

This method returns the last bits of the binary value.
The number of bits returned depends on the argument passed.

#### Parameters

##### nbrOfBits

`number`

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

#### Inherited from

[`BinaryValue`](../../BinaryValue/classes/BinaryValue.md).[`getLeastSignificantBits`](../../BinaryValue/classes/BinaryValue.md#getleastsignificantbits)

***

### getLeastSignificantByte()

> **getLeastSignificantByte**(): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:60](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/binary_types/BinaryValue.ts#L60)

This method returns the least significant byte of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

The least significant byte.

#### Inherited from

[`BinaryValue`](../../BinaryValue/classes/BinaryValue.md).[`getLeastSignificantByte`](../../BinaryValue/classes/BinaryValue.md#getleastsignificantbyte)

***

### getMostSignificantBit()

> **getMostSignificantBit**(): [`Bit`](../../Bit/type-aliases/Bit.md)

Defined in: [src/binary\_types/BinaryValue.ts:52](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/binary_types/BinaryValue.ts#L52)

This method returns the most significant bit of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)

The most significant bit.

#### Inherited from

[`BinaryValue`](../../BinaryValue/classes/BinaryValue.md).[`getMostSignificantBit`](../../BinaryValue/classes/BinaryValue.md#getmostsignificantbit)

***

### getMostSignificantBits()

> **getMostSignificantBits**(`nbrOfBits`): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:97](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/binary_types/BinaryValue.ts#L97)

This method returns the first bits of the binary value.
The number of bits returned depends on the argument passed.

#### Parameters

##### nbrOfBits

`number`

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

#### Inherited from

[`BinaryValue`](../../BinaryValue/classes/BinaryValue.md).[`getMostSignificantBits`](../../BinaryValue/classes/BinaryValue.md#getmostsignificantbits)

***

### getMostSignificantByte()

> **getMostSignificantByte**(): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:71](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/binary_types/BinaryValue.ts#L71)

This method returns the least significant byte of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

The least significant byte.

#### Inherited from

[`BinaryValue`](../../BinaryValue/classes/BinaryValue.md).[`getMostSignificantByte`](../../BinaryValue/classes/BinaryValue.md#getmostsignificantbyte)

***

### toString()

> **toString**(): `string`

Defined in: [src/binary\_types/Byte.ts:62](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/binary_types/Byte.ts#L62)

Converts the binary value into a string representation.

#### Returns

`string`

***

### fromInteger()

> `static` **fromInteger**(`integer`): [`Byte`](Byte.md)

Defined in: [src/binary\_types/Byte.ts:77](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/binary_types/Byte.ts#L77)

This method creates an instance from the given number. Throws an error, if the given number is not an integer.
It uses the second parameter as an indicator whether to convert the integer value into a signed or unsigned binary value.
This parameter is needed, because not all values in the context of a CPU can be treated as signed binary values.
For example a memory address can never be a negative value. Therefore, such a binary value should always be considered unsigned.
Depending on the second parameter, the range of allowed values is slightly different. This method throws an error, if
the value to be converted is too large or too small.

#### Parameters

##### integer

`number`

The number to initialize the new instances value with.

#### Returns

[`Byte`](Byte.md)

A new instance.
