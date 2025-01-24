[**ihme-core-x1-simulator**](../../../README.md)

***

[ihme-core-x1-simulator](../../../modules.md) / [binary\_types/QuadWord](../README.md) / QuadWord

# Class: QuadWord

Defined in: [src/binary\_types/QuadWord.ts:5](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/QuadWord.ts#L5)

This class represents a generic binary value.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Extends

- [`BinaryValue`](../../BinaryValue/classes/BinaryValue.md)

## Constructors

### new QuadWord()

> **new QuadWord**(`value`): [`QuadWord`](QuadWord.md)

Defined in: [src/binary\_types/QuadWord.ts:14](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/QuadWord.ts#L14)

Instantiates a new object.

#### Parameters

##### value

[`Bit`](../../Bit/type-aliases/Bit.md)[] = `...`

#### Returns

[`QuadWord`](QuadWord.md)

#### Overrides

[`BinaryValue`](../../BinaryValue/classes/BinaryValue.md).[`constructor`](../../BinaryValue/classes/BinaryValue.md#constructors)

## Properties

### \_value

> `protected` **\_value**: [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:12](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/BinaryValue.ts#L12)

An array of bits, representing a binary value.

#### Inherited from

[`BinaryValue`](../../BinaryValue/classes/BinaryValue.md).[`_value`](../../BinaryValue/classes/BinaryValue.md#_value)

***

### MAX\_NEGATIVE\_NUMBER\_DEC

> `readonly` `static` **MAX\_NEGATIVE\_NUMBER\_DEC**: `bigint` = `-9_223_372_036_854_775_808n`

Defined in: [src/binary\_types/QuadWord.ts:7](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/QuadWord.ts#L7)

***

### MAX\_POSITIVE\_NUMBER\_DEC

> `readonly` `static` **MAX\_POSITIVE\_NUMBER\_DEC**: `bigint` = `9_223_372_036_854_775_807n`

Defined in: [src/binary\_types/QuadWord.ts:6](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/QuadWord.ts#L6)

***

### NUMBER\_OF\_BITS\_DEC

> `readonly` `static` **NUMBER\_OF\_BITS\_DEC**: `number` = `64`

Defined in: [src/binary\_types/QuadWord.ts:8](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/QuadWord.ts#L8)

## Accessors

### value

#### Get Signature

> **get** **value**(): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/QuadWord.ts:41](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/QuadWord.ts#L41)

Accessor for reading the binary value.

##### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

#### Set Signature

> **set** **value**(`newValue`): `void`

Defined in: [src/binary\_types/QuadWord.ts:50](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/QuadWord.ts#L50)

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

> **equal**(`other`): `boolean`

Defined in: [src/binary\_types/QuadWord.ts:64](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/QuadWord.ts#L64)

This method checks whethter the current binary value is equal to the given one or not.
For comparison, both binary values are converted to strings.
Conversion presarves the order of items, which is important for the comparison.

#### Parameters

##### other

[`QuadWord`](QuadWord.md)

The binary value to compare to.

#### Returns

`boolean`

True, if both binary values are identical, false otherwise.

***

### getLeastSignificantBit()

> **getLeastSignificantBit**(): [`Bit`](../../Bit/type-aliases/Bit.md)

Defined in: [src/binary\_types/BinaryValue.ts:44](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/BinaryValue.ts#L44)

This method returns the least significant bit of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)

The least significant bit.

#### Inherited from

[`BinaryValue`](../../BinaryValue/classes/BinaryValue.md).[`getLeastSignificantBit`](../../BinaryValue/classes/BinaryValue.md#getleastsignificantbit)

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

[`BinaryValue`](../../BinaryValue/classes/BinaryValue.md).[`getLeastSignificantBits`](../../BinaryValue/classes/BinaryValue.md#getleastsignificantbits)

***

### getLeastSignificantByte()

> **getLeastSignificantByte**(): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:60](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/BinaryValue.ts#L60)

This method returns the least significant byte of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

The least significant byte.

#### Inherited from

[`BinaryValue`](../../BinaryValue/classes/BinaryValue.md).[`getLeastSignificantByte`](../../BinaryValue/classes/BinaryValue.md#getleastsignificantbyte)

***

### getMostSignificantBit()

> **getMostSignificantBit**(): [`Bit`](../../Bit/type-aliases/Bit.md)

Defined in: [src/binary\_types/BinaryValue.ts:52](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/BinaryValue.ts#L52)

This method returns the most significant bit of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)

The most significant bit.

#### Inherited from

[`BinaryValue`](../../BinaryValue/classes/BinaryValue.md).[`getMostSignificantBit`](../../BinaryValue/classes/BinaryValue.md#getmostsignificantbit)

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

[`BinaryValue`](../../BinaryValue/classes/BinaryValue.md).[`getMostSignificantBits`](../../BinaryValue/classes/BinaryValue.md#getmostsignificantbits)

***

### getMostSignificantByte()

> **getMostSignificantByte**(): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/BinaryValue.ts:71](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/BinaryValue.ts#L71)

This method returns the least significant byte of this value.

#### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

The least significant byte.

#### Inherited from

[`BinaryValue`](../../BinaryValue/classes/BinaryValue.md).[`getMostSignificantByte`](../../BinaryValue/classes/BinaryValue.md#getmostsignificantbyte)

***

### isNegative()

> **isNegative**(): `boolean`

Defined in: [src/binary\_types/QuadWord.ts:88](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/QuadWord.ts#L88)

This method checks whether this binary value represents a negative number.

#### Returns

`boolean`

True, if the most significant bit is set to 1, false otherwise.

***

### isNotZero()

> **isNotZero**(): `boolean`

Defined in: [src/binary\_types/QuadWord.ts:80](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/QuadWord.ts#L80)

This method checks whether the current binary value is not a binary zero or not.

#### Returns

`boolean`

True, if the binary value is not zero, false otherwise.

***

### isPositive()

> **isPositive**(): `boolean`

Defined in: [src/binary\_types/QuadWord.ts:96](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/QuadWord.ts#L96)

This method checks whether this binary value represents a positive number.

#### Returns

`boolean`

True, if the most significant bit is set to 0, false otherwise.

***

### isZero()

> **isZero**(): `boolean`

Defined in: [src/binary\_types/QuadWord.ts:72](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/QuadWord.ts#L72)

This method checks whether the current binary value is a binary zero or not.

#### Returns

`boolean`

True, if the binary value is zero, false otherwise.

***

### toString()

> **toString**(`groupBytes`?): `string`

Defined in: [src/binary\_types/QuadWord.ts:105](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/QuadWord.ts#L105)

Converts the binary value into a string representation.

#### Parameters

##### groupBytes?

`boolean` = `false`

If set to true, the string representation of the binary value is grouped into bytes.

#### Returns

`string`

The string representation of the binary value.

***

### fromInteger()

> `static` **fromInteger**(`integer`): [`QuadWord`](QuadWord.md)

Defined in: [src/binary\_types/QuadWord.ts:128](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/binary_types/QuadWord.ts#L128)

This method creates an instance from the given number. 
Throws an error, if the given number is not an integer.

#### Parameters

##### integer

`number`

The number to initialize the new instances value with.

#### Returns

[`QuadWord`](QuadWord.md)

A new instance.
