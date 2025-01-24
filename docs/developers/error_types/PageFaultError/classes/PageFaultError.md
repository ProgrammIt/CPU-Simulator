[**ihme-core-x1-simulator**](../../../README.md)

***

[ihme-core-x1-simulator](../../../modules.md) / [error\_types/PageFaultError](../README.md) / PageFaultError

# Class: PageFaultError

Defined in: [src/error\_types/PageFaultError.ts:8](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/error_types/PageFaultError.ts#L8)

Error which gets thrown whenever a page is currently not associated with a page frame.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Extends

- `Error`

## Constructors

### new PageFaultError()

> **new PageFaultError**(`description`, `flags`, `addressOfPageTableEntry`): [`PageFaultError`](PageFaultError.md)

Defined in: [src/error\_types/PageFaultError.ts:25](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/error_types/PageFaultError.ts#L25)

Constructs a new instance with the given message.

#### Parameters

##### description

`string`

A short text describing the error and its cause.

##### flags

[`Bit`](../../../binary_types/Bit/type-aliases/Bit.md)[]

##### addressOfPageTableEntry

[`PhysicalAddress`](../../../binary_types/PhysicalAddress/classes/PhysicalAddress.md)

#### Returns

[`PageFaultError`](PageFaultError.md)

#### Overrides

`Error.constructor`

## Properties

### addressOfPageTableEntry

> `readonly` **addressOfPageTableEntry**: [`PhysicalAddress`](../../../binary_types/PhysicalAddress/classes/PhysicalAddress.md)

Defined in: [src/error\_types/PageFaultError.ts:19](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/error_types/PageFaultError.ts#L19)

This field stores the page table entrys pyhsical address which
is currently not associated with a page.

***

### flags

> `readonly` **flags**: [`Bit`](../../../binary_types/Bit/type-aliases/Bit.md)[]

Defined in: [src/error\_types/PageFaultError.ts:13](https://github.com/ProgrammIt/CPU-Simulator/blob/5d337ac19330b661110818bd865328f41c53783f/src/error_types/PageFaultError.ts#L13)

This field sotres the flag bits associated with the page for
which this error was thrown.

***

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
