[**ihme-core-x1-simulator**](../../../README.md)

***

[ihme-core-x1-simulator](../../../modules.md) / [binary\_types/Word](../README.md) / Word

# Class: Word

Defined in: [src/binary\_types/Word.ts:4](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/binary_types/Word.ts#L4)

## Constructors

### new Word()

> **new Word**(`value`?): [`Word`](Word.md)

Defined in: [src/binary\_types/Word.ts:19](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/binary_types/Word.ts#L19)

Instantiates a new object.

#### Parameters

##### value?

[`Bit`](../../Bit/type-aliases/Bit.md)[] = `...`

The binary data to initialize the new object with.

#### Returns

[`Word`](Word.md)

## Properties

### \_value

> `protected` **\_value**: [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/Word.ts:12](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/binary_types/Word.ts#L12)

The binary data this object holds.

***

### MAX\_NEGATIVE\_NUMBER\_DEC

> `protected` `readonly` `static` **MAX\_NEGATIVE\_NUMBER\_DEC**: `number` = `-32_768`

Defined in: [src/binary\_types/Word.ts:6](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/binary_types/Word.ts#L6)

***

### MAX\_POSITIVE\_NUMBER\_DEC

> `protected` `readonly` `static` **MAX\_POSITIVE\_NUMBER\_DEC**: `number` = `32_767`

Defined in: [src/binary\_types/Word.ts:5](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/binary_types/Word.ts#L5)

***

### NUMBER\_OF\_BITS\_DEC

> `readonly` `static` **NUMBER\_OF\_BITS\_DEC**: `number` = `16`

Defined in: [src/binary\_types/Word.ts:7](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/binary_types/Word.ts#L7)

## Accessors

### value

#### Get Signature

> **get** **value**(): [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/Word.ts:29](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/binary_types/Word.ts#L29)

##### Returns

[`Bit`](../../Bit/type-aliases/Bit.md)[]

#### Set Signature

> **set** **value**(`newValue`): `void`

Defined in: [src/binary\_types/Word.ts:33](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/binary_types/Word.ts#L33)

##### Parameters

###### newValue

[`Bit`](../../Bit/type-aliases/Bit.md)[]

##### Returns

`void`

## Methods

### equal()

> **equal**(`word`): `boolean`

Defined in: [src/binary\_types/Word.ts:46](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/binary_types/Word.ts#L46)

For comparison, both binary values are converted to strings.
Conversion presarves the order of items, which is important for the comparison.

#### Parameters

##### word

[`Word`](Word.md)

The binary value to compare to.

#### Returns

`boolean`

True, when both binary values are identical, false otherwise.

***

### toString()

> **toString**(`groupBytes`): `string`

Defined in: [src/binary\_types/Word.ts:55](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/binary_types/Word.ts#L55)

Converts the binary value into a string representation.

#### Parameters

##### groupBytes

`boolean`

When true, the bytes are grouped into two groups with 8 bits each.

#### Returns

`string`

***

### fromInteger()

> `static` **fromInteger**(`integer`): [`Word`](Word.md)

Defined in: [src/binary\_types/Word.ts:72](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/binary_types/Word.ts#L72)

This method creates an instance from the given number.
Throws an error, if the given number is not an integer.

#### Parameters

##### integer

`number`

The number to initialize the new instances value with.

#### Returns

[`Word`](Word.md)

A new instance.
