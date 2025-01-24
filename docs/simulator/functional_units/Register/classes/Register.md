[**ihme-core-x1-simulator**](../../../../README.md)

***

[ihme-core-x1-simulator](../../../../modules.md) / [simulator/functional\_units/Register](../README.md) / Register

# Class: `abstract` Register\<T\>

Defined in: [src/simulator/functional\_units/Register.ts:5](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/functional_units/Register.ts#L5)

This class represents a generic register.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Extended by

- [`EFLAGS`](../../EFLAGS/classes/EFLAGS.md)
- [`GeneralPurposeRegister`](../../GeneralPurposeRegister/classes/GeneralPurposeRegister.md)
- [`InstructionRegister`](../../InstructionRegister/classes/InstructionRegister.md)
- [`PointerRegister`](../../PointerRegister/classes/PointerRegister.md)

## Type Parameters

• **T**

## Constructors

### new Register()

> **new Register**\<`T`\>(`name`, `content`): [`Register`](Register.md)\<`T`\>

Defined in: [src/simulator/functional\_units/Register.ts:23](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/functional_units/Register.ts#L23)

This method constructs an instance of the Register class.

#### Parameters

##### name

`string`

The name of the register.

##### content

`T`

The initial content of the register.

#### Returns

[`Register`](Register.md)\<`T`\>

## Properties

### \_content

> `protected` **\_content**: `T`

Defined in: [src/simulator/functional\_units/Register.ts:9](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/functional_units/Register.ts#L9)

The registers content.

***

### name

> `readonly` **name**: `string`

Defined in: [src/simulator/functional\_units/Register.ts:15](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/functional_units/Register.ts#L15)

The name of the register.

## Accessors

### content

#### Get Signature

> **get** `abstract` **content**(): `T`

Defined in: [src/simulator/functional\_units/Register.ts:32](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/functional_units/Register.ts#L32)

Accessor for retrieving a copy of the current registers content.

##### Returns

`T`

A copy of the current registers content.

#### Set Signature

> **set** `abstract` **content**(`newValue`): `void`

Defined in: [src/simulator/functional\_units/Register.ts:37](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/functional_units/Register.ts#L37)

Accessor for setting a new value as registers content.

##### Parameters

###### newValue

`T`

##### Returns

`void`
