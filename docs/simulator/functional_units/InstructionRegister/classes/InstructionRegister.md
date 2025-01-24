[**ihme-core-x1-simulator**](../../../../README.md)

***

[ihme-core-x1-simulator](../../../../modules.md) / [simulator/functional\_units/InstructionRegister](../README.md) / InstructionRegister

# Class: InstructionRegister

Defined in: [src/simulator/functional\_units/InstructionRegister.ts:10](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/simulator/functional_units/InstructionRegister.ts#L10)

This class represents the instruction register (EIR).

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Extends

- [`Register`](../../Register/classes/Register.md)\<[`Instruction`](../../../../binary_types/Instruction/classes/Instruction.md)\>

## Constructors

### new InstructionRegister()

> **new InstructionRegister**(): [`InstructionRegister`](InstructionRegister.md)

Defined in: [src/simulator/functional\_units/InstructionRegister.ts:15](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/simulator/functional_units/InstructionRegister.ts#L15)

Constructs a new instance.

#### Returns

[`InstructionRegister`](InstructionRegister.md)

#### Overrides

[`Register`](../../Register/classes/Register.md).[`constructor`](../../Register/classes/Register.md#constructors)

## Properties

### \_content

> `protected` **\_content**: [`Instruction`](../../../../binary_types/Instruction/classes/Instruction.md)

Defined in: [src/simulator/functional\_units/Register.ts:9](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/simulator/functional_units/Register.ts#L9)

The registers content.

#### Inherited from

[`Register`](../../Register/classes/Register.md).[`_content`](../../Register/classes/Register.md#_content)

***

### name

> `readonly` **name**: `string`

Defined in: [src/simulator/functional\_units/Register.ts:15](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/simulator/functional_units/Register.ts#L15)

The name of the register.

#### Inherited from

[`Register`](../../Register/classes/Register.md).[`name`](../../Register/classes/Register.md#name-1)

## Accessors

### content

#### Get Signature

> **get** **content**(): [`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Defined in: [src/simulator/functional\_units/InstructionRegister.ts:24](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/simulator/functional_units/InstructionRegister.ts#L24)

Accessor for retrieving a copy of the current registers content.

##### Returns

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

A copy of the current registers content.

#### Set Signature

> **set** **content**(`newValue`): `void`

Defined in: [src/simulator/functional\_units/InstructionRegister.ts:32](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/simulator/functional_units/InstructionRegister.ts#L32)

Accessor for setting the current registers content to a new value.

##### Parameters

###### newValue

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The new value.

##### Returns

`void`

#### Overrides

[`Register`](../../Register/classes/Register.md).[`content`](../../Register/classes/Register.md#content-1)
