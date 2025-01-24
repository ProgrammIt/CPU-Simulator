[**ihme-core-x1-simulator**](../../../../README.md)

***

[ihme-core-x1-simulator](../../../../modules.md) / [simulator/compiler/AssemblyLanguageDefinition](../README.md) / AssemblyLanguageDefinition

# Interface: AssemblyLanguageDefinition

Defined in: [src/simulator/compiler/AssemblyLanguageDefinition.ts:1](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/simulator/compiler/AssemblyLanguageDefinition.ts#L1)

## Properties

### addressable\_registers

> **addressable\_registers**: `object`[]

Defined in: [src/simulator/compiler/AssemblyLanguageDefinition.ts:15](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/simulator/compiler/AssemblyLanguageDefinition.ts#L15)

#### aliases

> **aliases**: `undefined` \| `string`[]

#### code

> **code**: `string`

#### name

> **name**: `string`

***

### addressModes

> **addressModes**: `object`[]

Defined in: [src/simulator/compiler/AssemblyLanguageDefinition.ts:27](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/simulator/compiler/AssemblyLanguageDefinition.ts#L27)

#### code

> **code**: `string`

#### name

> **name**: `string`

***

### comment\_format

> **comment\_format**: `string`

Defined in: [src/simulator/compiler/AssemblyLanguageDefinition.ts:2](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/simulator/compiler/AssemblyLanguageDefinition.ts#L2)

***

### instruction\_types

> **instruction\_types**: `object`[]

Defined in: [src/simulator/compiler/AssemblyLanguageDefinition.ts:32](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/simulator/compiler/AssemblyLanguageDefinition.ts#L32)

#### code

> **code**: `string`

#### name

> **name**: `string`

***

### instructions

> **instructions**: `object`[]

Defined in: [src/simulator/compiler/AssemblyLanguageDefinition.ts:37](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/simulator/compiler/AssemblyLanguageDefinition.ts#L37)

#### address\_modes

> **address\_modes**: `string`[]

#### illegal\_combinations\_of\_operand\_types

> **illegal\_combinations\_of\_operand\_types**: `undefined` \| `object`[]

#### mnemonic

> **mnemonic**: `string`

#### opcode

> **opcode**: `string`

#### operands

> **operands**: `undefined` \| `object`[]

#### regex

> **regex**: `string`

#### type

> **type**: `string`

***

### label\_formats

> **label\_formats**: `object`

Defined in: [src/simulator/compiler/AssemblyLanguageDefinition.ts:4](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/simulator/compiler/AssemblyLanguageDefinition.ts#L4)

#### declaration

> **declaration**: `string`

#### usage

> **usage**: `string`

***

### number\_formats

> **number\_formats**: `object`

Defined in: [src/simulator/compiler/AssemblyLanguageDefinition.ts:9](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/simulator/compiler/AssemblyLanguageDefinition.ts#L9)

#### binary

> **binary**: `string`

#### decimal

> **decimal**: `string`

#### hexadecimal

> **hexadecimal**: `string`

***

### operand\_types

> **operand\_types**: `object`[]

Defined in: [src/simulator/compiler/AssemblyLanguageDefinition.ts:21](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/simulator/compiler/AssemblyLanguageDefinition.ts#L21)

#### code

> **code**: `string`

#### name

> **name**: `string`

#### regex

> **regex**: `string`
