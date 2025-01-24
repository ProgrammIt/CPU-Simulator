[**ihme-core-x1-simulator**](../../../../README.md)

***

[ihme-core-x1-simulator](../../../../modules.md) / [simulator/functional\_units/PointerRegister](../README.md) / PointerRegister

# Class: PointerRegister

Defined in: [src/simulator/functional\_units/PointerRegister.ts:10](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/functional_units/PointerRegister.ts#L10)

This class represents a special tpye of register,
which can hold a single address.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Extends

- [`Register`](../../Register/classes/Register.md)\<[`Address`](../../../../binary_types/Address/classes/Address.md)\>

## Constructors

### new PointerRegister()

> **new PointerRegister**(`name`): [`PointerRegister`](PointerRegister.md)

Defined in: [src/simulator/functional\_units/PointerRegister.ts:15](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/functional_units/PointerRegister.ts#L15)

Constructs a new instance.

#### Parameters

##### name

`string`

#### Returns

[`PointerRegister`](PointerRegister.md)

#### Overrides

[`Register`](../../Register/classes/Register.md).[`constructor`](../../Register/classes/Register.md#constructors)

## Properties

### \_content

> `protected` **\_content**: [`Address`](../../../../binary_types/Address/classes/Address.md)

Defined in: [src/simulator/functional\_units/Register.ts:9](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/functional_units/Register.ts#L9)

The registers content.

#### Inherited from

[`Register`](../../Register/classes/Register.md).[`_content`](../../Register/classes/Register.md#_content)

***

### name

> `readonly` **name**: `string`

Defined in: [src/simulator/functional\_units/Register.ts:15](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/functional_units/Register.ts#L15)

The name of the register.

#### Inherited from

[`Register`](../../Register/classes/Register.md).[`name`](../../Register/classes/Register.md#name-1)

## Accessors

### content

#### Get Signature

> **get** **content**(): [`Address`](../../../../binary_types/Address/classes/Address.md)

Defined in: [src/simulator/functional\_units/PointerRegister.ts:24](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/functional_units/PointerRegister.ts#L24)

Accessor for retrieving a copy of the current registers content.

##### Returns

[`Address`](../../../../binary_types/Address/classes/Address.md)

A copy of the current registers content.

#### Set Signature

> **set** **content**(`newValue`): `void`

Defined in: [src/simulator/functional\_units/PointerRegister.ts:33](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/functional_units/PointerRegister.ts#L33)

Accessor for setting the current registers content to a new value.

##### Parameters

###### newValue

[`Address`](../../../../binary_types/Address/classes/Address.md)

The new value.

##### Returns

`void`

#### Overrides

[`Register`](../../Register/classes/Register.md).[`content`](../../Register/classes/Register.md#content-1)
