[**ihme-core-x1-simulator**](../../../../README.md)

***

[ihme-core-x1-simulator](../../../../modules.md) / [simulator/functional\_units/TranslationLookasideBuffer](../README.md) / TranslationLookasideBuffer

# Class: TranslationLookasideBuffer

Defined in: [src/simulator/functional\_units/TranslationLookasideBuffer.ts:4](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/functional_units/TranslationLookasideBuffer.ts#L4)

## Constructors

### new TranslationLookasideBuffer()

> **new TranslationLookasideBuffer**(`capacity`): [`TranslationLookasideBuffer`](TranslationLookasideBuffer.md)

Defined in: [src/simulator/functional\_units/TranslationLookasideBuffer.ts:8](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/functional_units/TranslationLookasideBuffer.ts#L8)

#### Parameters

##### capacity

`number`

#### Returns

[`TranslationLookasideBuffer`](TranslationLookasideBuffer.md)

## Accessors

### data

#### Get Signature

> **get** **data**(): \[`number`, \[[`VirtualAddress`](../../../../binary_types/VirtualAddress/classes/VirtualAddress.md), [`PageTableEntry`](../../../../binary_types/PageTableEntry/classes/PageTableEntry.md)\]\][]

Defined in: [src/simulator/functional\_units/TranslationLookasideBuffer.ts:25](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/functional_units/TranslationLookasideBuffer.ts#L25)

##### Returns

\[`number`, \[[`VirtualAddress`](../../../../binary_types/VirtualAddress/classes/VirtualAddress.md), [`PageTableEntry`](../../../../binary_types/PageTableEntry/classes/PageTableEntry.md)\]\][]

## Methods

### get()

> **get**(`virtualAddress`): `undefined` \| [`PageTableEntry`](../../../../binary_types/PageTableEntry/classes/PageTableEntry.md)

Defined in: [src/simulator/functional\_units/TranslationLookasideBuffer.ts:61](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/functional_units/TranslationLookasideBuffer.ts#L61)

#### Parameters

##### virtualAddress

[`VirtualAddress`](../../../../binary_types/VirtualAddress/classes/VirtualAddress.md)

#### Returns

`undefined` \| [`PageTableEntry`](../../../../binary_types/PageTableEntry/classes/PageTableEntry.md)

***

### has()

> **has**(`virtualAddress`): `boolean`

Defined in: [src/simulator/functional\_units/TranslationLookasideBuffer.ts:51](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/functional_units/TranslationLookasideBuffer.ts#L51)

#### Parameters

##### virtualAddress

[`VirtualAddress`](../../../../binary_types/VirtualAddress/classes/VirtualAddress.md)

#### Returns

`boolean`

***

### insert()

> **insert**(`item`): `void`

Defined in: [src/simulator/functional\_units/TranslationLookasideBuffer.ts:13](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/functional_units/TranslationLookasideBuffer.ts#L13)

#### Parameters

##### item

\[[`VirtualAddress`](../../../../binary_types/VirtualAddress/classes/VirtualAddress.md), [`PageTableEntry`](../../../../binary_types/PageTableEntry/classes/PageTableEntry.md)\]

#### Returns

`void`

***

### isEmpty()

> **isEmpty**(): `boolean`

Defined in: [src/simulator/functional\_units/TranslationLookasideBuffer.ts:47](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/functional_units/TranslationLookasideBuffer.ts#L47)

#### Returns

`boolean`

***

### peek()

> **peek**(): `undefined` \| \[`number`, \[[`VirtualAddress`](../../../../binary_types/VirtualAddress/classes/VirtualAddress.md), [`PageTableEntry`](../../../../binary_types/PageTableEntry/classes/PageTableEntry.md)\]\]

Defined in: [src/simulator/functional\_units/TranslationLookasideBuffer.ts:33](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/functional_units/TranslationLookasideBuffer.ts#L33)

#### Returns

`undefined` \| \[`number`, \[[`VirtualAddress`](../../../../binary_types/VirtualAddress/classes/VirtualAddress.md), [`PageTableEntry`](../../../../binary_types/PageTableEntry/classes/PageTableEntry.md)\]\]

***

### pop()

> **pop**(): `undefined` \| \[`number`, \[[`VirtualAddress`](../../../../binary_types/VirtualAddress/classes/VirtualAddress.md), [`PageTableEntry`](../../../../binary_types/PageTableEntry/classes/PageTableEntry.md)\]\]

Defined in: [src/simulator/functional\_units/TranslationLookasideBuffer.ts:39](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/functional_units/TranslationLookasideBuffer.ts#L39)

#### Returns

`undefined` \| \[`number`, \[[`VirtualAddress`](../../../../binary_types/VirtualAddress/classes/VirtualAddress.md), [`PageTableEntry`](../../../../binary_types/PageTableEntry/classes/PageTableEntry.md)\]\]

***

### size()

> **size**(): `number`

Defined in: [src/simulator/functional\_units/TranslationLookasideBuffer.ts:43](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/functional_units/TranslationLookasideBuffer.ts#L43)

#### Returns

`number`

***

### toString()

> **toString**(): `string`

Defined in: [src/simulator/functional\_units/TranslationLookasideBuffer.ts:73](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/functional_units/TranslationLookasideBuffer.ts#L73)

#### Returns

`string`
