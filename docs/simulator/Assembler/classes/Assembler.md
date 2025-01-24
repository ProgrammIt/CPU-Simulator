[**ihme-core-x1-simulator**](../../../README.md)

***

[ihme-core-x1-simulator](../../../modules.md) / [simulator/Assembler](../README.md) / Assembler

# Class: Assembler

Defined in: [src/simulator/Assembler.ts:9](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/Assembler.ts#L9)

## Constructors

### new Assembler()

> **new Assembler**(`processingWidth`, `pathToLanguageDefinition`): [`Assembler`](Assembler.md)

Defined in: [src/simulator/Assembler.ts:20](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/Assembler.ts#L20)

Constructs a new assembler object with the given processing width.

#### Parameters

##### processingWidth

[`DataSizes`](../../../enumerations/DataSizes/enumerations/DataSizes.md)

The processing width of the computer system the assembler is used for.

##### pathToLanguageDefinition

`string` = `"./settings/language_definition.json"`

The path to the language definition file of the assembly language used by this assembler.

#### Returns

[`Assembler`](Assembler.md)

## Properties

### languageDefinition

> `readonly` **languageDefinition**: [`AssemblyLanguageDefinition`](../../compiler/AssemblyLanguageDefinition/interfaces/AssemblyLanguageDefinition.md)

Defined in: [src/simulator/Assembler.ts:11](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/Assembler.ts#L11)

***

### processingWidth

> `readonly` **processingWidth**: [`DataSizes`](../../../enumerations/DataSizes/enumerations/DataSizes.md)

Defined in: [src/simulator/Assembler.ts:13](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/Assembler.ts#L13)

***

### translations

> `readonly` **translations**: `Map`\<`string`, [`DoubleWord`](../../../binary_types/DoubleWord/classes/DoubleWord.md)[]\>

Defined in: [src/simulator/Assembler.ts:12](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/Assembler.ts#L12)

## Methods

### compile()

> **compile**(`s`): [`DoubleWord`](../../../binary_types/DoubleWord/classes/DoubleWord.md)[]

Defined in: [src/simulator/Assembler.ts:532](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/simulator/Assembler.ts#L532)

This method compiles a given computer program written in assembly language into its binary representation.
The instructions will be encoded using the opcodes defined in the language definition.
The order in which the instructions appear in the input program is preserved during the compilation process.

#### Parameters

##### s

`string`

File contents of an .asm file containing a computer program written in assembly language.

#### Returns

[`DoubleWord`](../../../binary_types/DoubleWord/classes/DoubleWord.md)[]

An array of strings representing the binary encoded instructions of the given computer program.
