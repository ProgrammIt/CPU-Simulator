[**ihme-core-x1-simulator**](../../../../README.md)

***

[ihme-core-x1-simulator](../../../../modules.md) / [simulator/execution\_units/CPUCore](../README.md) / CPUCore

# Class: CPUCore

Defined in: [src/simulator/execution\_units/CPUCore.ts:38](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L38)

This class represents a CPU core which is capable of executing instructions.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Constructors

### new CPUCore()

> **new CPUCore**(`mainMemory`, `processingWidth`): [`CPUCore`](CPUCore.md)

Defined in: [src/simulator/execution\_units/CPUCore.ts:176](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L176)

Constructs an instance of a CPU core.

#### Parameters

##### mainMemory

[`RAM`](../../../functional_units/RAM/classes/RAM.md)

The main memory of the system.

##### processingWidth

[`DataSizes`](../../../../enumerations/DataSizes/enumerations/DataSizes.md)

The maximum number of bits that can be processed in one cycle. Defaults to 32 bits (a doubleword).

#### Returns

[`CPUCore`](CPUCore.md)

## Properties

### alu

> `readonly` **alu**: [`ArithmeticLogicUnit`](../../ArithmeticLogicUnit/classes/ArithmeticLogicUnit.md)

Defined in: [src/simulator/execution\_units/CPUCore.ts:142](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L142)

An exeuction unit which is capable of performing logical and arithmetical operations.

***

### eax

> `readonly` **eax**: [`GeneralPurposeRegister`](../../../functional_units/GeneralPurposeRegister/classes/GeneralPurposeRegister.md)

Defined in: [src/simulator/execution\_units/CPUCore.ts:65](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L65)

First general purpose register: can be used for storing all kinds of "datatypes".

***

### ebx

> `readonly` **ebx**: [`GeneralPurposeRegister`](../../../functional_units/GeneralPurposeRegister/classes/GeneralPurposeRegister.md)

Defined in: [src/simulator/execution\_units/CPUCore.ts:71](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L71)

Second general purpose register: can be used for storing all kinds of "datatypes".

***

### edx

> `readonly` **edx**: [`GeneralPurposeRegister`](../../../functional_units/GeneralPurposeRegister/classes/GeneralPurposeRegister.md)

Defined in: [src/simulator/execution\_units/CPUCore.ts:77](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L77)

Third general purpose register: can be used for storing all kinds of "datatypes".

***

### eflags

> `readonly` **eflags**: [`EFLAGS`](../../../functional_units/EFLAGS/classes/EFLAGS.md)

Defined in: [src/simulator/execution\_units/CPUCore.ts:89](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L89)

Status register: stores some important status information.

***

### eip

> `readonly` **eip**: [`PointerRegister`](../../../functional_units/PointerRegister/classes/PointerRegister.md)

Defined in: [src/simulator/execution\_units/CPUCore.ts:83](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L83)

Instruction pointer: stores the virtual/physical address of the currently executed instruction.

***

### eir

> `readonly` **eir**: [`InstructionRegister`](../../../functional_units/InstructionRegister/classes/InstructionRegister.md)

Defined in: [src/simulator/execution\_units/CPUCore.ts:95](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L95)

Instruction register: contains the currently executed instruction.

***

### esp

> `readonly` **esp**: [`PointerRegister`](../../../functional_units/PointerRegister/classes/PointerRegister.md)

Defined in: [src/simulator/execution\_units/CPUCore.ts:113](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L113)

Stack Pointer: contains the currently lowes address of the stack. Always points to its end.

***

### gptp

> **gptp**: `null` \| [`PointerRegister`](../../../functional_units/PointerRegister/classes/PointerRegister.md)

Defined in: [src/simulator/execution\_units/CPUCore.ts:124](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L124)

Guest Page Table Pointer: contains the start address of a structure containing the Page Table of the guest OS.

***

### itp

> `readonly` **itp**: [`PointerRegister`](../../../functional_units/PointerRegister/classes/PointerRegister.md)

Defined in: [src/simulator/execution\_units/CPUCore.ts:119](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L119)

Interrupt Table Pointer: containts the start address of a structure containing start addresses of interrupt handlers.

***

### mmu

> `readonly` **mmu**: [`MemoryManagementUnit`](../../MemoryManagementUnit/classes/MemoryManagementUnit.md)

Defined in: [src/simulator/execution\_units/CPUCore.ts:136](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L136)

An execution unit which converts virtual memory address to phyiscal memory address if memory virtualization is enbaled.

***

### nptp

> `readonly` **nptp**: [`PointerRegister`](../../../functional_units/PointerRegister/classes/PointerRegister.md)

Defined in: [src/simulator/execution\_units/CPUCore.ts:101](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L101)

Nested Page Table Pointer: contains the start address of a structure containing the Page Table of the host OS.

***

### ptp

> `readonly` **ptp**: [`PointerRegister`](../../../functional_units/PointerRegister/classes/PointerRegister.md)

Defined in: [src/simulator/execution\_units/CPUCore.ts:130](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L130)

Page Table Pointer: contains the tart address of a structure containing the Page Table of the OS, when virtualization is disabled.

***

### vmtpr

> `readonly` **vmtpr**: [`PointerRegister`](../../../functional_units/PointerRegister/classes/PointerRegister.md)

Defined in: [src/simulator/execution\_units/CPUCore.ts:107](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L107)

Virtual Machine Pointer: containts the start address of a structure containing an Virtual Machine Control Block (VMCB).

## Methods

### cycle()

> **cycle**(): `boolean`

Defined in: [src/simulator/execution\_units/CPUCore.ts:230](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L230)

This method performs a single instruction cycle.

#### Returns

`boolean`

True, if the cycle was performed normally and false, if the cycle could not be performed because the programm has ended.

***

### disableVirtualization()

> **disableVirtualization**(): `void`

Defined in: [src/simulator/execution\_units/CPUCore.ts:212](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L212)

This method disables virtualization for this core.
It disables the GPTP and enables the PTP register.

#### Returns

`void`

***

### enableVirtualization()

> **enableVirtualization**(): `void`

Defined in: [src/simulator/execution\_units/CPUCore.ts:202](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L202)

This method enables virtualization for this core.
It disables the PTP and enables the GPTP register.

#### Returns

`void`

***

### int()

> **int**(`target`): `void`

Defined in: [src/simulator/execution\_units/CPUCore.ts:2043](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L2043)

This method triggers a software interrupt by calling an interrupt handler. The operating system stores the 
interrupt handlers in a list located in a restricted area of the main memory. This erea is only accessable in kernel mode. 
Each interrupt handler is identified by a unique number or index. This method performs a jump to the physical memory address 
of the interrupt handler, which is computed by adding the interrupt handlers number to the interrupt tables base address.
This base address is stored in the interrupt table pointer (ITP) register. Before transfering control to the interrupt handler,
the current EFLAGS are saved on the STACK. In order to do so, this method enters kernel mode. To prevent the handler from beeing
interrupted, the interrupt flag is cleared as well. Afterwards the handler is called. 
The call follows the same rules as a normal function call.

#### Parameters

##### target

[`InstructionOperand`](../../../../binary_types/InstructionOperand/classes/InstructionOperand.md)

The interrupt handlers number.

#### Returns

`void`

#### Throws

If the ESP reached the lowest possible address (top) of the STACK segment.

***

### iret()

> **iret**(): `void`

Defined in: [src/simulator/execution\_units/CPUCore.ts:2088](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L2088)

This method returns from an interrupt handler triggered by a software interrupt. It reads the return address from the STACK
and transfers control back to the interrupted process. Additionally, the EFLAGS gets restored from the STACK, the interrupt flag
is cleared and the CPU switches back to user mode.

#### Returns

`void`

#### Throws

If the CPU is not in kernel mode when this mehtod is called.

***

### virtualizationEnabled()

> **virtualizationEnabled**(): `boolean`

Defined in: [src/simulator/execution\_units/CPUCore.ts:222](https://github.com/ProgrammIt/CPU-Simulator/blob/96764be0553f95d688bfe5600c9ae9aea8701845/src/simulator/execution_units/CPUCore.ts#L222)

This method checks whether virtualization is enabled for this core.

#### Returns

`boolean`

True, if virtualization is enabled, false otherwise.
