[**ihme-core-x1-simulator**](../../../../README.md)

***

[ihme-core-x1-simulator](../../../../modules.md) / [simulator/functional\_units/GeneralPurposeRegister](../README.md) / GeneralPurposeRegister

# Class: GeneralPurposeRegister

Defined in: [src/simulator/functional\_units/GeneralPurposeRegister.ts:9](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/GeneralPurposeRegister.ts#L9)

This class represents a general purpose register.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Extends

- [`Register`](../../Register/classes/Register.md)\<[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)\>

## Constructors

### new GeneralPurposeRegister()

> **new GeneralPurposeRegister**(`name`): [`GeneralPurposeRegister`](GeneralPurposeRegister.md)

Defined in: [src/simulator/functional\_units/GeneralPurposeRegister.ts:15](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/GeneralPurposeRegister.ts#L15)

This method constructs an instance.

#### Parameters

##### name

`string`

The name of the register.

#### Returns

[`GeneralPurposeRegister`](GeneralPurposeRegister.md)

#### Overrides

[`Register`](../../Register/classes/Register.md).[`constructor`](../../Register/classes/Register.md#constructors)

## Properties

### \_content

> `protected` **\_content**: [`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Defined in: [src/simulator/functional\_units/Register.ts:9](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/Register.ts#L9)

The registers content.

#### Inherited from

[`Register`](../../Register/classes/Register.md).[`_content`](../../Register/classes/Register.md#_content)

***

### name

> `readonly` **name**: `string`

Defined in: [src/simulator/functional\_units/Register.ts:15](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/Register.ts#L15)

The name of the register.

#### Inherited from

[`Register`](../../Register/classes/Register.md).[`name`](../../Register/classes/Register.md#name-1)

## Accessors

### content

#### Get Signature

> **get** **content**(): [`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Defined in: [src/simulator/functional\_units/GeneralPurposeRegister.ts:24](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/GeneralPurposeRegister.ts#L24)

Accessor for retrieving a copy of the current registers content.

##### Returns

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

A copy of the current registers content.

#### Set Signature

> **set** **content**(`newValue`): `void`

Defined in: [src/simulator/functional\_units/GeneralPurposeRegister.ts:32](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/GeneralPurposeRegister.ts#L32)

Accessor for setting the current registers content to a new value.

##### Parameters

###### newValue

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The new value.

##### Returns

`void`

#### Overrides

[`Register`](../../Register/classes/Register.md).[`content`](../../Register/classes/Register.md#content-1)
