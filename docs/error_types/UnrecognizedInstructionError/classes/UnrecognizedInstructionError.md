[**ihme-core-x1-simulator**](../../../README.md)

***

[ihme-core-x1-simulator](../../../modules.md) / [error\_types/UnrecognizedInstructionError](../README.md) / UnrecognizedInstructionError

# Class: UnrecognizedInstructionError

Defined in: [src/error\_types/UnrecognizedInstructionError.ts:5](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/error_types/UnrecognizedInstructionError.ts#L5)

Error which gets thrown whenever an instruction could not be recognized by the Assembler or the instruction decoder.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Extends

- `Error`

## Constructors

### new UnrecognizedInstructionError()

> **new UnrecognizedInstructionError**(`description`): [`UnrecognizedInstructionError`](UnrecognizedInstructionError.md)

Defined in: [src/error\_types/UnrecognizedInstructionError.ts:10](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/error_types/UnrecognizedInstructionError.ts#L10)

Constructs a new instance with the given message.

#### Parameters

##### description

`string`

A short text describing the error and its cause.

#### Returns

[`UnrecognizedInstructionError`](UnrecognizedInstructionError.md)

#### Overrides

`Error.constructor`

## Properties

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/@types/node/globals.d.ts:98

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/@types/node/globals.d.ts:100

#### Inherited from

`Error.stackTraceLimit`

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/@types/node/globals.d.ts:91

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`
