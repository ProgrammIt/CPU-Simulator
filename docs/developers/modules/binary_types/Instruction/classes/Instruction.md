[**ihme-core-x1-simulator**](../../../README.md)

***

[ihme-core-x1-simulator](../../../modules.md) / [binary\_types/Instruction](../README.md) / Instruction

# Class: Instruction

Defined in: [src/binary\_types/Instruction.ts:8](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/Instruction.ts#L8)

This class represents an 32-bit instruction.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Extends

- [`DoubleWord`](../../DoubleWord/classes/DoubleWord.md)

## Constructors

### new Instruction()

> **new Instruction**(`value`): [`Instruction`](Instruction.md)

Defined in: [src/binary\_types/Instruction.ts:13](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/Instruction.ts#L13)

Instantiates a new object.

#### Parameters

##### value

[`Bit`](../../Bit/type-aliases/Bit.md)[]

#### Returns

[`Instruction`](Instruction.md)

#### Overrides

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`constructor`](../../DoubleWord/classes/DoubleWord.md#constructors)

## Properties

### \_value

> `protected` **\_value**: [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:12](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/BinaryValue.ts#L12)

An array of bits, representing a binary value.

#### Inherited from

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`_value`](../../DoubleWord/classes/DoubleWord.md#_value)

***

### MAX\_NEGATIVE\_NUMBER\_DEC

> `readonly` `static` **MAX\_NEGATIVE\_NUMBER\_DEC**: `number` = `-2_147_483_648`

Defined in: [src/binary\_types/DoubleWord.ts:8](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L8)

#### Inherited from

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`MAX_NEGATIVE_NUMBER_DEC`](../../DoubleWord/classes/DoubleWord.md#max_negative_number_dec)

***

### MAX\_POSITIVE\_NUMBER\_DEC

> `readonly` `static` **MAX\_POSITIVE\_NUMBER\_DEC**: `number` = `2_147_483_647`

Defined in: [src/binary\_types/DoubleWord.ts:7](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L7)

#### Inherited from

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`MAX_POSITIVE_NUMBER_DEC`](../../DoubleWord/classes/DoubleWord.md#max_positive_number_dec)

***

### NUMBER\_OF\_BITS\_DEC

> `readonly` `static` **NUMBER\_OF\_BITS\_DEC**: `number` = `32`

Defined in: [src/binary\_types/DoubleWord.ts:9](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L9)

#### Inherited from

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`NUMBER_OF_BITS_DEC`](../../DoubleWord/classes/DoubleWord.md#number_of_bits_dec)

## Accessors

### value

#### Get Signature

> **get** **value**(): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/Instruction.ts:21](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/Instruction.ts#L21)

Accessor for reading the binary value.

##### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

#### Set Signature

> **set** **value**(`newValue`): `void`

Defined in: [src/binary\_types/Instruction.ts:30](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/Instruction.ts#L30)

Accessor for setting the binary value.

##### Parameters

###### newValue

[`Bit`](../../Bit/type-aliases/Bit.md)[]

The new value.

##### Returns

`void`

#### Overrides

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`value`](../../DoubleWord/classes/DoubleWord.md#value-1)

## Methods

### equal()

> **equal**(`other`): `boolean`

Defined in: [src/binary\_types/Instruction.ts:43](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/Instruction.ts#L43)

For comparison, both binary values are converted to strings.
Conversion presarves the order of items, which is important for the comparison.

#### Parameters

##### other

[`Instruction`](Instruction.md)

The instruction to compare to.

#### Returns

`boolean`

True, when both binary values are identical, false otherwise.

#### Overrides

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`equal`](../../DoubleWord/classes/DoubleWord.md#equal)

***

### getLeastSignificantBit()

> **getLeastSignificantBit**(): [`Bit`](../../Bit/type-aliases/Bit.md)

Defined in: [src/binary\_types/BinaryValue.ts:44](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/BinaryValue.ts#L44)

This method returns the least significant bit of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)

The least significant bit.

#### Inherited from

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`getLeastSignificantBit`](../../DoubleWord/classes/DoubleWord.md#getleastsignificantbit)

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

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`getLeastSignificantBits`](../../DoubleWord/classes/DoubleWord.md#getleastsignificantbits)

***

### getLeastSignificantByte()

> **getLeastSignificantByte**(): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:60](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/BinaryValue.ts#L60)

This method returns the least significant byte of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

The least significant byte.

#### Inherited from

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`getLeastSignificantByte`](../../DoubleWord/classes/DoubleWord.md#getleastsignificantbyte)

***

### getMostSignificantBit()

> **getMostSignificantBit**(): [`Bit`](../../Bit/type-aliases/Bit.md)

Defined in: [src/binary\_types/BinaryValue.ts:52](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/BinaryValue.ts#L52)

This method returns the most significant bit of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)

The most significant bit.

#### Inherited from

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`getMostSignificantBit`](../../DoubleWord/classes/DoubleWord.md#getmostsignificantbit)

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

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`getMostSignificantBits`](../../DoubleWord/classes/DoubleWord.md#getmostsignificantbits)

***

### getMostSignificantByte()

> **getMostSignificantByte**(): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:71](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/BinaryValue.ts#L71)

This method returns the least significant byte of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

The least significant byte.

#### Inherited from

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`getMostSignificantByte`](../../DoubleWord/classes/DoubleWord.md#getmostsignificantbyte)

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

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`isGreaterThan`](../../DoubleWord/classes/DoubleWord.md#isgreaterthan)

***

### isNegative()

> **isNegative**(): `boolean`

Defined in: [src/binary\_types/DoubleWord.ts:100](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L100)

This method checks whether this binary value represents a negative number.

#### Returns

`boolean`

True, if the most significant bit is set to 1, false otherwise.

#### Inherited from

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`isNegative`](../../DoubleWord/classes/DoubleWord.md#isnegative)

***

### isNotZero()

> **isNotZero**(): `boolean`

Defined in: [src/binary\_types/DoubleWord.ts:92](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L92)

This method checks whether the current binary value is not a binary zero or not.

#### Returns

`boolean`

True, if the binary value is not zero, false otherwise.

#### Inherited from

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`isNotZero`](../../DoubleWord/classes/DoubleWord.md#isnotzero)

***

### isPositive()

> **isPositive**(): `boolean`

Defined in: [src/binary\_types/DoubleWord.ts:108](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L108)

This method checks whether this binary value represents a positive number.

#### Returns

`boolean`

True, if the most significant bit is set to 0, false otherwise.

#### Inherited from

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`isPositive`](../../DoubleWord/classes/DoubleWord.md#ispositive)

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

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`isSmallerThan`](../../DoubleWord/classes/DoubleWord.md#issmallerthan)

***

### isZero()

> **isZero**(): `boolean`

Defined in: [src/binary\_types/DoubleWord.ts:84](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L84)

This method checks whether the current binary value is a binary zero or not.

#### Returns

`boolean`

True, if the binary value is zero, false otherwise.

#### Inherited from

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`isZero`](../../DoubleWord/classes/DoubleWord.md#iszero)

***

### toString()

> **toString**(`groupBytes`): `string`

Defined in: [src/binary\_types/Instruction.ts:51](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/Instruction.ts#L51)

Converts the binary value into a string representation.

#### Parameters

##### groupBytes

`boolean` = `false`

#### Returns

`string`

The string representation of the binary value.

#### Overrides

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`toString`](../../DoubleWord/classes/DoubleWord.md#tostring)

***

### fromInteger()

> `static` **fromInteger**(`integer`): [`DoubleWord`](../../DoubleWord/classes/DoubleWord.md)

Defined in: [src/binary\_types/DoubleWord.ts:133](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/DoubleWord.ts#L133)

This method creates an instance from the given number. 
Throws an error, if the given number is not an integer.

#### Parameters

##### integer

`number`

The number to initialize the new instances value with.

#### Returns

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md)

A new instance.

#### Inherited from

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md).[`fromInteger`](../../DoubleWord/classes/DoubleWord.md#frominteger)
