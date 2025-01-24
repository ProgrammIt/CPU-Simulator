[**ihme-core-x1-simulator**](../../../../README.md)

***

[ihme-core-x1-simulator](../../../../modules.md) / [simulator/execution\_units/MemoryManagementUnit](../README.md) / MemoryManagementUnit

# Class: MemoryManagementUnit

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:23](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L23)

This class represents a Memory Management Unit (MMU). This specialized execution unit is responsible
for translating virtual memory addresses into physical memory addresses.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Constructors

### new MemoryManagementUnit()

> **new MemoryManagementUnit**(`mainMemory`, `ptp`, `alu`, `eflags`): [`MemoryManagementUnit`](MemoryManagementUnit.md)

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:126](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L126)

Constructs a new instance from the given references of the RAM, Page Table Pointer (PTP) register, the ALU and the EFLAGS register.

#### Parameters

##### mainMemory

[`RAM`](../../../functional_units/RAM/classes/RAM.md)

A reference to the main memory of this computer system.

##### ptp

[`PointerRegister`](../../../functional_units/PointerRegister/classes/PointerRegister.md)

A reference to the Page Table Pointer of the CPU core, this MMU is associated with.

##### alu

[`ArithmeticLogicUnit`](../../ArithmeticLogicUnit/classes/ArithmeticLogicUnit.md)

A reference to the ALU of the CPU core, this MMU is associated with.

##### eflags

[`EFLAGS`](../../../functional_units/EFLAGS/classes/EFLAGS.md)

A reference to the EFLAGS register of the CPU core, this MMU is associated with.

#### Returns

[`MemoryManagementUnit`](MemoryManagementUnit.md)

## Properties

### ACCESSABLE\_ONLY\_IN\_KERNEL\_MODE\_FLAG\_INDEX

> `readonly` `static` **ACCESSABLE\_ONLY\_IN\_KERNEL\_MODE\_FLAG\_INDEX**: `number` = `3`

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:73](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L73)

This class member stores the index of the flag bit, which indicates whether a page frame can be accessed
only on kernel mode.

***

### CHANGED\_FLAG\_INDEX

> `readonly` `static` **CHANGED\_FLAG\_INDEX**: `number` = `5`

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:85](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L85)

This class member stores the index of the changed flag bit.

***

### EXECUTABLE\_FLAG\_INDEX

> `readonly` `static` **EXECUTABLE\_FLAG\_INDEX**: `number` = `2`

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:66](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L66)

This class member stores the index of the executable flag bit.

***

### NUMBER\_BITS\_OFFSET

> `readonly` `static` **NUMBER\_BITS\_OFFSET**: `number` = `12`

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:28](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L28)

This class member stores the number of bits used for the offset in pages and page frames.

***

### NUMBER\_BITS\_PAGE\_ADDRESS

> `readonly` `static` **NUMBER\_BITS\_PAGE\_ADDRESS**: `number`

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:41](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L41)

This class member stores the number of bits representing the page number.
The page number can be extracted from a virtual memory address by removing the offset bits from the right.

***

### NUMBER\_BITS\_PAGE\_FRAME\_ADDRESS

> `readonly` `static` **NUMBER\_BITS\_PAGE\_FRAME\_ADDRESS**: `number` = `MemoryManagementUnit.NUMBER_BITS_PAGE_ADDRESS`

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:48](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L48)

This class member stores the number of bits representing the page frame number.
The page frame number can be extracted from a phyiscal memory address by removing the offset bits from the right.

***

### NUMBER\_FLAG\_BITS

> `readonly` `static` **NUMBER\_FLAG\_BITS**: `number` = `12`

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:34](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L34)

This class member stores the number of bits used for the page table entries flag bits.

***

### PINNED\_FLAG\_INDEX

> `readonly` `static` **PINNED\_FLAG\_INDEX**: `number` = `4`

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:79](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L79)

This class member stores the index of the pinned flag bit.

***

### PRESENT\_FLAG\_INDEX

> `readonly` `static` **PRESENT\_FLAG\_INDEX**: `number` = `0`

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:54](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L54)

This class member stores the index of the present flag bit.

***

### WRITABLE\_FLAG\_INDEX

> `readonly` `static` **WRITABLE\_FLAG\_INDEX**: `number` = `1`

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:60](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L60)

This class member stores the index of the writable flag bit.

## Methods

### clearMemory()

> **clearMemory**(`virtualAddress`, `length`): `void`

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:225](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L225)

This method clears all bits at the specified locations, depending on the given number of bytes.

#### Parameters

##### virtualAddress

[`VirtualAddress`](../../../../binary_types/VirtualAddress/classes/VirtualAddress.md)

The virtual address to clear all bits at.

##### length

[`DataSizes`](../../../../enumerations/DataSizes/enumerations/DataSizes.md)

The number of bytes to clear, starting at the given physical address.

#### Returns

`void`

#### Throws

If the page the given virtual address is part of, is currently not associated with a page frame.

#### Throws

If the page frame associated with this page is not accessable in user mode.

#### Throws

If the page frame associated with this page is not executable.

#### Throws

If the page frame associated with this page is not writable.

***

### disableMemoryVirtualization()

> **disableMemoryVirtualization**(): `void`

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:144](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L144)

This method disables memory virtualization.

#### Returns

`void`

***

### enableMemoryVirtualization()

> **enableMemoryVirtualization**(): `void`

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:137](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L137)

This method enables memory virtualization.

#### Returns

`void`

***

### readByteFrom()

> **readByteFrom**(`virtualAddress`): [`Byte`](../../../../binary_types/Byte/classes/Byte.md)

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:205](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L205)

This method tries to read a byte from the specified memory address.
Returns a binary zero for address not conatined in the
map in order to simulate a full size memory.

#### Parameters

##### virtualAddress

[`VirtualAddress`](../../../../binary_types/VirtualAddress/classes/VirtualAddress.md)

A binary value representing a virtual memory address to write the data to.

#### Returns

[`Byte`](../../../../binary_types/Byte/classes/Byte.md)

The byte of data found at the specified address.

#### Throws

If the page the given virtual address is part of, is currently not associated with a page frame.

#### Throws

If the page frame associated with this page is not accessable in user mode.

#### Throws

If the page frame associated with this page is not executable.

#### Throws

If the page frame associated with this page is not writable.

***

### readDoublewordFrom()

> **readDoublewordFrom**(`virtualAddress`, `attemptsToExecute`): [`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:173](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L173)

This method reads doubleword sized data from the main memory starting at the specified physical memory address.

#### Parameters

##### virtualAddress

[`VirtualAddress`](../../../../binary_types/VirtualAddress/classes/VirtualAddress.md)

A binary virtual memory address to read the doubleword-sized data from.

##### attemptsToExecute

`boolean`

Whether the reading process attempts to execute the content to read.

#### Returns

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Doubleword-sized binary data.

#### Throws

If the page the given virtual address is part of, is currently not associated with a page frame.

#### Throws

If the page frame associated with this page is not accessable in user mode.

#### Throws

If the page frame associated with this page is not executable.

#### Throws

If the page frame associated with this page is not writable.

***

### writeByteTo()

> **writeByteTo**(`virtualAddress`, `data`): `void`

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:188](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L188)

This method writes a specified byte of data to the specified address in
in the main memory. Throws an error, if the data exeeds a byte.

#### Parameters

##### virtualAddress

[`VirtualAddress`](../../../../binary_types/VirtualAddress/classes/VirtualAddress.md)

A binary value representing a virtual memory address to write the data to.

##### data

[`Byte`](../../../../binary_types/Byte/classes/Byte.md)

Byte-sized data to write to the specified pyhsical memory address.

#### Returns

`void`

#### Throws

If the page the given virtual address is part of, is currently not associated with a page frame.

#### Throws

If the page frame associated with this page is not accessable in user mode.

#### Throws

If the page frame associated with this page is not executable.

#### Throws

If the page frame associated with this page is not writable.

***

### writeDoublewordTo()

> **writeDoublewordTo**(`virtualAddress`, `doubleword`, `attemptsToExecute`): `void`

Defined in: [src/simulator/execution\_units/MemoryManagementUnit.ts:157](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/MemoryManagementUnit.ts#L157)

This methods writes a doubleword (4-byte) value to memory to the specified memory address.

#### Parameters

##### virtualAddress

[`VirtualAddress`](../../../../binary_types/VirtualAddress/classes/VirtualAddress.md)

##### doubleword

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Doubleword-sized data to write.

##### attemptsToExecute

`boolean`

#### Returns

`void`

#### Throws

If the page the given virtual address is part of, is currently not associated with a page frame.

#### Throws

If the page frame associated with this page is not accessable in user mode.

#### Throws

If the page frame associated with this page is not executable.

#### Throws

If the page frame associated with this page is not writable.
