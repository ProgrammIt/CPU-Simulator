[**ihme-core-x1-simulator**](../../../README.md)

***

[ihme-core-x1-simulator](../../../modules.md) / [binary\_types/PageTableEntry](../README.md) / PageTableEntry

# Class: PageTableEntry

Defined in: [src/binary\_types/PageTableEntry.ts:8](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L8)

This class represents a page table entry.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Constructors

### new PageTableEntry()

> **new PageTableEntry**(`flagBits`, `frameNbr`): [`PageTableEntry`](PageTableEntry.md)

Defined in: [src/binary\_types/PageTableEntry.ts:35](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L35)

This constructor creates a new page table entry with the given flag bits, page number and frame number.

#### Parameters

##### flagBits

[`Bit`](../../Bit/type-aliases/Bit.md)[]

The flag bits of the page table entry.

##### frameNbr

[`Bit`](../../Bit/type-aliases/Bit.md)[]

The number of the associated page frame.

#### Returns

[`PageTableEntry`](PageTableEntry.md)

## Properties

### flagBits

> `readonly` **flagBits**: [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/PageTableEntry.ts:22](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L22)

This field stores the flag bits of the page table entry.

***

### frameNbr

> `readonly` **frameNbr**: [`Bit`](../../Bit/type-aliases/Bit.md)[]

Defined in: [src/binary\_types/PageTableEntry.ts:27](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L27)

This field stores the number of the associated page frame.

***

### NUMBER\_OF\_BITS\_FOR\_FLAGS\_DEC

> `readonly` `static` **NUMBER\_OF\_BITS\_FOR\_FLAGS\_DEC**: `number` = `12`

Defined in: [src/binary\_types/PageTableEntry.ts:12](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L12)

The number of bits used for the flags.

***

### NUMBER\_OF\_BITS\_FOR\_PAGE\_FRAME\_NUMBER\_DEC

> `readonly` `static` **NUMBER\_OF\_BITS\_FOR\_PAGE\_FRAME\_NUMBER\_DEC**: `number` = `20`

Defined in: [src/binary\_types/PageTableEntry.ts:17](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L17)

The number of bits used for the page frame number.

## Methods

### clearAccessableOnlyInKernelModeFlag()

> **clearAccessableOnlyInKernelModeFlag**(): `void`

Defined in: [src/binary\_types/PageTableEntry.ts:139](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L139)

This method clears the flag that indicates that this page can only be accessed in kernel mode.

#### Returns

`void`

***

### clearChangedFlag()

> **clearChangedFlag**(): `void`

Defined in: [src/binary\_types/PageTableEntry.ts:187](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L187)

This method clears the changed flag of the page table entry.

#### Returns

`void`

***

### clearExecutableFlag()

> **clearExecutableFlag**(): `void`

Defined in: [src/binary\_types/PageTableEntry.ts:115](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L115)

This method clears the executable flag of the page table entry.

#### Returns

`void`

***

### clearPinnedFlag()

> **clearPinnedFlag**(): `void`

Defined in: [src/binary\_types/PageTableEntry.ts:163](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L163)

This method clears the pinned flag of the page table entry.

#### Returns

`void`

***

### clearPresentFlag()

> **clearPresentFlag**(): `void`

Defined in: [src/binary\_types/PageTableEntry.ts:67](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L67)

This method clears the present flag of the page table entry.

#### Returns

`void`

***

### clearWritableFlag()

> **clearWritableFlag**(): `void`

Defined in: [src/binary\_types/PageTableEntry.ts:91](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L91)

This method clears the writable flag of the page table entry.

#### Returns

`void`

***

### isAccessableOnlyInKernelMode()

> **isAccessableOnlyInKernelMode**(): `boolean`

Defined in: [src/binary\_types/PageTableEntry.ts:148](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L148)

This method checks whether the page is accessable only in kernel mode.

#### Returns

`boolean`

True if the page is accessable only in kernel mode, false otherwise.

***

### isExecutable()

> **isExecutable**(): `boolean`

Defined in: [src/binary\_types/PageTableEntry.ts:124](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L124)

This method checks whether the page is executable.

#### Returns

`boolean`

True if the page is executable, false otherwise.

***

### isPinned()

> **isPinned**(): `boolean`

Defined in: [src/binary\_types/PageTableEntry.ts:172](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L172)

This method checks whether the page is pinned.

#### Returns

`boolean`

True if the page is pinned, false otherwise.

***

### isPresent()

> **isPresent**(): `boolean`

Defined in: [src/binary\_types/PageTableEntry.ts:76](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L76)

This method checks whether the page is present (whether a page frame is associated to it).

#### Returns

`boolean`

True if the page is present, false otherwise.

***

### isWritable()

> **isWritable**(): `boolean`

Defined in: [src/binary\_types/PageTableEntry.ts:100](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L100)

This method checks whether the page is writable.

#### Returns

`boolean`

True if the page is writable, false otherwise.

***

### setAccessableOnlyInKernelModeFlag()

> **setAccessableOnlyInKernelModeFlag**(): `void`

Defined in: [src/binary\_types/PageTableEntry.ts:131](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L131)

This method sets the flag that indicates that this page can only be accessed in kernel mode.

#### Returns

`void`

***

### setChangedFlag()

> **setChangedFlag**(): `void`

Defined in: [src/binary\_types/PageTableEntry.ts:179](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L179)

This method sets the changed flag of the page table entry.

#### Returns

`void`

***

### setExecutableFlag()

> **setExecutableFlag**(): `void`

Defined in: [src/binary\_types/PageTableEntry.ts:107](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L107)

This method sets the executable flag of the page table entry.

#### Returns

`void`

***

### setPinnedFlag()

> **setPinnedFlag**(): `void`

Defined in: [src/binary\_types/PageTableEntry.ts:155](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L155)

This method sets the pinned flag of the page table entry.

#### Returns

`void`

***

### setPresentFlag()

> **setPresentFlag**(): `void`

Defined in: [src/binary\_types/PageTableEntry.ts:59](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L59)

This method sets the present flag of the page table entry.

#### Returns

`void`

***

### setWritableFlag()

> **setWritableFlag**(): `void`

Defined in: [src/binary\_types/PageTableEntry.ts:83](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L83)

This method sets the writable flag of the page table entry.

#### Returns

`void`

***

### toDoubleword()

> **toDoubleword**(): [`DoubleWord`](../../DoubleWord/classes/DoubleWord.md)

Defined in: [src/binary\_types/PageTableEntry.ts:52](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L52)

This method converts the page table entry to a doubleword.

#### Returns

[`DoubleWord`](../../DoubleWord/classes/DoubleWord.md)

A doubleword representing the page table entry.

***

### toString()

> **toString**(): `string`

Defined in: [src/binary\_types/PageTableEntry.ts:44](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L44)

This method returns a string representation of the page table entry.

#### Returns

`string`

A string representation of the page table entry.

***

### wasChanged()

> **wasChanged**(): `boolean`

Defined in: [src/binary\_types/PageTableEntry.ts:196](https://github.com/ProgrammIt/CPU-Simulator/blob/3f9c46c26c2e1cba2638010869a3cab9b9c737f9/src/binary_types/PageTableEntry.ts#L196)

This method checks whether the page was changed.

#### Returns

`boolean`

True if the page was changed, false otherwise.
