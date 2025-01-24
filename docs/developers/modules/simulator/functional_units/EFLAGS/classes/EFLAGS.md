[**ihme-core-x1-simulator**](../../../../README.md)

***

[ihme-core-x1-simulator](../../../../modules.md) / [simulator/functional\_units/EFLAGS](../README.md) / EFLAGS

# Class: EFLAGS

Defined in: [src/simulator/functional\_units/EFLAGS.ts:10](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L10)

This class represents the status register of a CPU core.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Extends

- [`Register`](../../Register/classes/Register.md)\<[`Byte`](../../../../binary_types/Byte/classes/Byte.md)\>

## Constructors

### new EFLAGS()

> **new EFLAGS**(): [`EFLAGS`](EFLAGS.md)

Defined in: [src/simulator/functional\_units/EFLAGS.ts:21](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L21)

#### Returns

[`EFLAGS`](EFLAGS.md)

#### Overrides

[`Register`](../../Register/classes/Register.md).[`constructor`](../../Register/classes/Register.md#constructors)

## Properties

### \_content

> `protected` **\_content**: [`Byte`](../../../../binary_types/Byte/classes/Byte.md)

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

### carry

#### Get Signature

> **get** **carry**(): [`Bit`](../../../../binary_types/Bit/type-aliases/Bit.md)

Defined in: [src/simulator/functional\_units/EFLAGS.ts:201](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L201)

This method reads the current status of the carry flag bit.

##### Returns

[`Bit`](../../../../binary_types/Bit/type-aliases/Bit.md)

***

### content

#### Get Signature

> **get** **content**(): [`Byte`](../../../../binary_types/Byte/classes/Byte.md)

Defined in: [src/simulator/functional\_units/EFLAGS.ts:30](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L30)

Accessor for retrieving a copy of the current registers content.

##### Returns

[`Byte`](../../../../binary_types/Byte/classes/Byte.md)

A copy of the current registers content.

#### Set Signature

> **set** **content**(`newValue`): `void`

Defined in: [src/simulator/functional\_units/EFLAGS.ts:39](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L39)

Accessor for setting the current registers content to a new value.

##### Parameters

###### newValue

[`Byte`](../../../../binary_types/Byte/classes/Byte.md)

The new value.

##### Returns

`void`

#### Overrides

[`Register`](../../Register/classes/Register.md).[`content`](../../Register/classes/Register.md#content-1)

***

### interrupt

#### Get Signature

> **get** **interrupt**(): [`Bit`](../../../../binary_types/Bit/type-aliases/Bit.md)

Defined in: [src/simulator/functional\_units/EFLAGS.ts:229](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L229)

This method reads the current status of the interrupt flag bit.

##### Returns

[`Bit`](../../../../binary_types/Bit/type-aliases/Bit.md)

***

### overflow

#### Get Signature

> **get** **overflow**(): [`Bit`](../../../../binary_types/Bit/type-aliases/Bit.md)

Defined in: [src/simulator/functional\_units/EFLAGS.ts:222](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L222)

This method reads the current status of the overflow flag bit.

##### Returns

[`Bit`](../../../../binary_types/Bit/type-aliases/Bit.md)

***

### parity

#### Get Signature

> **get** **parity**(): [`Bit`](../../../../binary_types/Bit/type-aliases/Bit.md)

Defined in: [src/simulator/functional\_units/EFLAGS.ts:194](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L194)

This method reads the current status of the parity flag bit.

##### Returns

[`Bit`](../../../../binary_types/Bit/type-aliases/Bit.md)

***

### sign

#### Get Signature

> **get** **sign**(): [`Bit`](../../../../binary_types/Bit/type-aliases/Bit.md)

Defined in: [src/simulator/functional\_units/EFLAGS.ts:215](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L215)

This method reads the current status of the signed flag bit.

##### Returns

[`Bit`](../../../../binary_types/Bit/type-aliases/Bit.md)

***

### zero

#### Get Signature

> **get** **zero**(): [`Bit`](../../../../binary_types/Bit/type-aliases/Bit.md)

Defined in: [src/simulator/functional\_units/EFLAGS.ts:208](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L208)

This method reads the current status of the zero flag bit.

##### Returns

[`Bit`](../../../../binary_types/Bit/type-aliases/Bit.md)

## Methods

### clearCarry()

> **clearCarry**(): `void`

Defined in: [src/simulator/functional\_units/EFLAGS.ts:94](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L94)

This method clears the carry flag bit to a binary 0.

#### Returns

`void`

***

### clearInterrupt()

> **clearInterrupt**(): `void`

Defined in: [src/simulator/functional\_units/EFLAGS.ts:166](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L166)

This method clears the interrupt flag bit to a binary 0.

#### Returns

`void`

***

### clearOverflow()

> **clearOverflow**(): `void`

Defined in: [src/simulator/functional\_units/EFLAGS.ts:148](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L148)

This method clears the overflow flag bit to a binary 0.

#### Returns

`void`

***

### clearParity()

> **clearParity**(): `void`

Defined in: [src/simulator/functional\_units/EFLAGS.ts:76](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L76)

This method clears the parity flag bit to a binary 0.

#### Returns

`void`

***

### clearSigned()

> **clearSigned**(): `void`

Defined in: [src/simulator/functional\_units/EFLAGS.ts:130](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L130)

This method clears the signed flag bit to a binary 0.

#### Returns

`void`

***

### clearZero()

> **clearZero**(): `void`

Defined in: [src/simulator/functional\_units/EFLAGS.ts:112](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L112)

This method clears the zero flag bit to a binary 0.

#### Returns

`void`

***

### enterKernelMode()

> **enterKernelMode**(): `void`

Defined in: [src/simulator/functional\_units/EFLAGS.ts:185](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L185)

This method clears the CPL flag bits to a binary 0.

#### Returns

`void`

***

### enterUserMode()

> **enterUserMode**(): `void`

Defined in: [src/simulator/functional\_units/EFLAGS.ts:175](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L175)

This method sets the CPL flag bits to a binary 3.

#### Returns

`void`

***

### isInKernelMode()

> **isInKernelMode**(): `boolean`

Defined in: [src/simulator/functional\_units/EFLAGS.ts:248](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L248)

This method checks whether the CPU is currently in kernel mode.

#### Returns

`boolean`

True if the CPU is currently in kernel mode, otherwise false.

***

### isInUserMode()

> **isInUserMode**(): `boolean`

Defined in: [src/simulator/functional\_units/EFLAGS.ts:237](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L237)

This method checks whether the CPU is currently in user mode.

#### Returns

`boolean`

True if the CPU is currently in user mode, otherwise false.

***

### setCarry()

> **setCarry**(): `void`

Defined in: [src/simulator/functional\_units/EFLAGS.ts:85](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L85)

This method sets the carry flag bit to a binary 1.

#### Returns

`void`

***

### setInterrupt()

> **setInterrupt**(): `void`

Defined in: [src/simulator/functional\_units/EFLAGS.ts:157](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L157)

This method sets the interrupt flag bit to a binary 1.

#### Returns

`void`

***

### setOverflow()

> **setOverflow**(): `void`

Defined in: [src/simulator/functional\_units/EFLAGS.ts:139](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L139)

This method sets the overflow flag bit to a binary 1.

#### Returns

`void`

***

### setParity()

> **setParity**(): `void`

Defined in: [src/simulator/functional\_units/EFLAGS.ts:67](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L67)

This method sets the parity flag bit to a binary 1.

#### Returns

`void`

***

### setSigned()

> **setSigned**(): `void`

Defined in: [src/simulator/functional\_units/EFLAGS.ts:121](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L121)

This method sets the signed flag bit to a binary 1.

#### Returns

`void`

***

### setZero()

> **setZero**(): `void`

Defined in: [src/simulator/functional\_units/EFLAGS.ts:103](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/functional_units/EFLAGS.ts#L103)

This method sets the zero flag bit to a binary 1.

#### Returns

`void`
