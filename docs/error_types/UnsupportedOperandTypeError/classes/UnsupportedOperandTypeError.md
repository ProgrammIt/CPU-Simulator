[**ihme-core-x1-simulator**](../../../README.md)

***

[ihme-core-x1-simulator](../../../modules.md) / [error\_types/UnsupportedOperandTypeError](../README.md) / UnsupportedOperandTypeError

# Class: UnsupportedOperandTypeError

Defined in: [src/error\_types/UnsupportedOperandTypeError.ts:5](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/error_types/UnsupportedOperandTypeError.ts#L5)

Error which gets thrown whenever the type of an instructions operand is unsupported.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Extends

- `Error`

## Constructors

### new UnsupportedOperandTypeError()

> **new UnsupportedOperandTypeError**(`description`): [`UnsupportedOperandTypeError`](UnsupportedOperandTypeError.md)

Defined in: [src/error\_types/UnsupportedOperandTypeError.ts:10](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/error_types/UnsupportedOperandTypeError.ts#L10)

Constructs a new instance with the given message.

#### Parameters

##### description

`string`

A short text describing the error and its cause.

#### Returns

[`UnsupportedOperandTypeError`](UnsupportedOperandTypeError.md)

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
