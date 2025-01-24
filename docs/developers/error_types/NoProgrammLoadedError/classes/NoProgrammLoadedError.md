[**ihme-core-x1-simulator**](../../../README.md)

***

[ihme-core-x1-simulator](../../../modules.md) / [error\_types/NoProgrammLoadedError](../README.md) / NoProgrammLoadedError

# Class: NoProgrammLoadedError

Defined in: [src/error\_types/NoProgrammLoadedError.ts:6](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/error_types/NoProgrammLoadedError.ts#L6)

Error which gets thrown when the user attempts to start execution of an
assembly programm but forgot to load one into the simulator beforehand.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Extends

- `Error`

## Constructors

### new NoProgrammLoadedError()

> **new NoProgrammLoadedError**(`description`): [`NoProgrammLoadedError`](NoProgrammLoadedError.md)

Defined in: [src/error\_types/NoProgrammLoadedError.ts:11](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/error_types/NoProgrammLoadedError.ts#L11)

Constructs a new instance with the given message.

#### Parameters

##### description

`string`

A short text describing the error and its cause.

#### Returns

[`NoProgrammLoadedError`](NoProgrammLoadedError.md)

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
