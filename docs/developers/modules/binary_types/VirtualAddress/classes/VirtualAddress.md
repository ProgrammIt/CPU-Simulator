[**ihme-core-x1-simulator**](../../../README.md)

***

[ihme-core-x1-simulator](../../../modules.md) / [binary\_types/VirtualAddress](../README.md) / VirtualAddress

# Class: VirtualAddress

Defined in: [src/binary\_types/VirtualAddress.ts:8](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/VirtualAddress.ts#L8)

This class represents a virtual memory address.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Extends

- [`Address`](../../Address/classes/Address.md)

## Constructors

### new VirtualAddress()

> **new VirtualAddress**(`value`): [`VirtualAddress`](VirtualAddress.md)

Defined in: [src/binary\_types/VirtualAddress.ts:12](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/VirtualAddress.ts#L12)

Constructs a new instance.

#### Parameters

##### value

[`Bit`](../../Bit/type-aliases/Bit.md)[] = `...`

#### Returns

[`VirtualAddress`](VirtualAddress.md)

#### Overrides

[`Address`](../../Address/classes/Address.md).[`constructor`](../../Address/classes/Address.md#constructors)

## Properties

### \_value

> `protected` **\_value**: [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:12](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/BinaryValue.ts#L12)

An array of bits, representing a binary value.

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`_value`](../../Address/classes/Address.md#_value)

***

### MAX\_NEGATIVE\_NUMBER\_DEC

> `readonly` `static` **MAX\_NEGATIVE\_NUMBER\_DEC**: `number` = `-2_147_483_648`

Defined in: [src/binary\_types/DoubleWord.ts:8](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L8)

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`MAX_NEGATIVE_NUMBER_DEC`](../../Address/classes/Address.md#max_negative_number_dec)

***

### MAX\_NUMBER\_UNSIGNED\_DEC

> `readonly` `static` **MAX\_NUMBER\_UNSIGNED\_DEC**: `number` = `4_294_967_295`

Defined in: [src/binary\_types/Address.ts:10](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/Address.ts#L10)

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`MAX_NUMBER_UNSIGNED_DEC`](../../Address/classes/Address.md#max_number_unsigned_dec)

***

### MAX\_POSITIVE\_NUMBER\_DEC

> `readonly` `static` **MAX\_POSITIVE\_NUMBER\_DEC**: `number` = `2_147_483_647`

Defined in: [src/binary\_types/DoubleWord.ts:7](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L7)

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`MAX_POSITIVE_NUMBER_DEC`](../../Address/classes/Address.md#max_positive_number_dec)

***

### NUMBER\_OF\_BITS\_DEC

> `readonly` `static` **NUMBER\_OF\_BITS\_DEC**: `number` = `32`

Defined in: [src/binary\_types/DoubleWord.ts:9](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L9)

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`NUMBER_OF_BITS_DEC`](../../Address/classes/Address.md#number_of_bits_dec)

## Accessors

### value

#### Get Signature

> **get** **value**(): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/Address.ts:34](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/Address.ts#L34)

Accessor for reading the binary value.

##### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

#### Set Signature

> **set** **value**(`newValue`): `void`

Defined in: [src/binary\_types/Address.ts:43](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/Address.ts#L43)

Accessor for setting the binary value.

##### Parameters

###### newValue

[`Bit`](../../Bit/type-aliases/Bit.md)[]

The new value.

##### Returns

`void`

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`value`](../../Address/classes/Address.md#value-1)

## Methods

### equal()

> **equal**(`other`): `boolean`

Defined in: [src/binary\_types/DoubleWord.ts:58](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L58)

This method checks whethter the current binary value is equal to the given one or not.
For comparison, both binary values are converted to strings.
Conversion presarves the order of items, which is important for the comparison.

#### Parameters

##### other

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md)

The binary value to compare to.

#### Returns

`boolean`

True, if both binary values are identical, false otherwise.

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`equal`](../../Address/classes/Address.md#equal)

***

### getLeastSignificantBit()

> **getLeastSignificantBit**(): [`Bit`](../../Bit/type-aliases/Bit.md)

Defined in: [src/binary\_types/BinaryValue.ts:44](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/BinaryValue.ts#L44)

This method returns the least significant bit of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)

The least significant bit.

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`getLeastSignificantBit`](../../Address/classes/Address.md#getleastsignificantbit)

***

### getLeastSignificantBits()

> **getLeastSignificantBits**(`nbrOfBits`): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:84](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/BinaryValue.ts#L84)

This method returns the last bits of the binary value.
The number of bits returned depends on the argument passed.

#### Parameters

##### nbrOfBits

`number`

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`getLeastSignificantBits`](../../Address/classes/Address.md#getleastsignificantbits)

***

### getLeastSignificantByte()

> **getLeastSignificantByte**(): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:60](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/BinaryValue.ts#L60)

This method returns the least significant byte of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

The least significant byte.

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`getLeastSignificantByte`](../../Address/classes/Address.md#getleastsignificantbyte)

***

### getMostSignificantBit()

> **getMostSignificantBit**(): [`Bit`](../../Bit/type-aliases/Bit.md)

Defined in: [src/binary\_types/BinaryValue.ts:52](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/BinaryValue.ts#L52)

This method returns the most significant bit of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)

The most significant bit.

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`getMostSignificantBit`](../../Address/classes/Address.md#getmostsignificantbit)

***

### getMostSignificantBits()

> **getMostSignificantBits**(`nbrOfBits`): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:97](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/BinaryValue.ts#L97)

This method returns the first bits of the binary value.
The number of bits returned depends on the argument passed.

#### Parameters

##### nbrOfBits

`number`

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`getMostSignificantBits`](../../Address/classes/Address.md#getmostsignificantbits)

***

### getMostSignificantByte()

> **getMostSignificantByte**(): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:71](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/BinaryValue.ts#L71)

This method returns the least significant byte of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

The least significant byte.

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`getMostSignificantByte`](../../Address/classes/Address.md#getmostsignificantbyte)

***

### isGreaterThan()

> **isGreaterThan**(`other`): `boolean`

Defined in: [src/binary\_types/DoubleWord.ts:76](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L76)

This method checks whether the current binary value is greater than the given one.

#### Parameters

##### other

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md)

The binary value to compare to.

#### Returns

`boolean`

True, if this value is greater than the one compared to, false otherwise.

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`isGreaterThan`](../../Address/classes/Address.md#isgreaterthan)

***

### isNegative()

> **isNegative**(): `boolean`

Defined in: [src/binary\_types/DoubleWord.ts:100](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L100)

This method checks whether this binary value represents a negative number.

#### Returns

`boolean`

True, if the most significant bit is set to 1, false otherwise.

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`isNegative`](../../Address/classes/Address.md#isnegative)

***

### isNotZero()

> **isNotZero**(): `boolean`

Defined in: [src/binary\_types/DoubleWord.ts:92](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L92)

This method checks whether the current binary value is not a binary zero or not.

#### Returns

`boolean`

True, if the binary value is not zero, false otherwise.

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`isNotZero`](../../Address/classes/Address.md#isnotzero)

***

### isPositive()

> **isPositive**(): `boolean`

Defined in: [src/binary\_types/DoubleWord.ts:108](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L108)

This method checks whether this binary value represents a positive number.

#### Returns

`boolean`

True, if the most significant bit is set to 0, false otherwise.

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`isPositive`](../../Address/classes/Address.md#ispositive)

***

### isSmallerThan()

> **isSmallerThan**(`other`): `boolean`

Defined in: [src/binary\_types/DoubleWord.ts:67](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L67)

This method checks whether the current binary value is smaller than the given one.

#### Parameters

##### other

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md)

The binary value to compare to.

#### Returns

`boolean`

True, if this value is less than the one compared to, false otherwise.

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`isSmallerThan`](../../Address/classes/Address.md#issmallerthan)

***

### isZero()

> **isZero**(): `boolean`

Defined in: [src/binary\_types/DoubleWord.ts:84](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L84)

This method checks whether the current binary value is a binary zero or not.

#### Returns

`boolean`

True, if the binary value is zero, false otherwise.

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`isZero`](../../Address/classes/Address.md#iszero)

***

### toString()

> **toString**(`groupBytes`): `string`

Defined in: [src/binary\_types/Address.ts:54](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/Address.ts#L54)

Converts the binary value into a string representation.

#### Parameters

##### groupBytes

`boolean` = `false`

#### Returns

`string`

The string representation of the binary value.

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`toString`](../../Address/classes/Address.md#tostring)

***

### fromInteger()

> `static` **fromInteger**(`integer`): [`Address`](../../Address/classes/Address.md)

Defined in: [src/binary\_types/Address.ts:71](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/Address.ts#L71)

This method creates an instance from the given number.
Throws an error, if the given number is not an integer.

#### Parameters

##### integer

`number`

The number to initialize the new instances value with.

#### Returns

[`Address`](../../Address/classes/Address.md)

A new instance.

#### Inherited from

[`Address`](../../Address/classes/Address.md).[`fromInteger`](../../Address/classes/Address.md#frominteger)
