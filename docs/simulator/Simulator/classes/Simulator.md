[**ihme-core-x1-simulator**](../../../README.md)

***

[ihme-core-x1-simulator](../../../modules.md) / [simulator/Simulator](../README.md) / Simulator

# Class: Simulator

Defined in: [src/simulator/Simulator.ts:21](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/Simulator.ts#L21)

The main logic of the simulator. Trough this class, the CPU cores and execution is controlled.

## Properties

### autoScrollForPageTableEnabled

> **autoScrollForPageTableEnabled**: `boolean`

Defined in: [src/simulator/Simulator.ts:99](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/Simulator.ts#L99)

This field represents a flag, which enables automatic scroll for the GUIs Page Table widget.

***

### autoScrollForPhysicalRAMEnabled

> **autoScrollForPhysicalRAMEnabled**: `boolean`

Defined in: [src/simulator/Simulator.ts:94](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/Simulator.ts#L94)

This field represents a flag, which enables automatic scroll for the GUIs physical RAM widget.

***

### autoScrollForVirtualRAMEnabled

> **autoScrollForVirtualRAMEnabled**: `boolean`

Defined in: [src/simulator/Simulator.ts:89](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/Simulator.ts#L89)

This field represents a flag, which enables automatic scroll for the GUIs virtual RAM widget.

***

### core

> `readonly` **core**: [`CPUCore`](../../execution_units/CPUCore/classes/CPUCore.md)

Defined in: [src/simulator/Simulator.ts:22](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/Simulator.ts#L22)

***

### mainMemory

> `readonly` **mainMemory**: [`RAM`](../../functional_units/RAM/classes/RAM.md)

Defined in: [src/simulator/Simulator.ts:23](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/Simulator.ts#L23)

***

### HIGH\_ADDRESS\_PHYSICAL\_MEMORY\_DEC

> `readonly` `static` **HIGH\_ADDRESS\_PHYSICAL\_MEMORY\_DEC**: `number` = `4_294_967_295`

Defined in: [src/simulator/Simulator.ts:32](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/Simulator.ts#L32)

This class member stores the highest available memory address of physical memory.

***

### LOW\_ADDRESS\_PHYSICAL\_MEMORY\_DEC

> `readonly` `static` **LOW\_ADDRESS\_PHYSICAL\_MEMORY\_DEC**: `number` = `0`

Defined in: [src/simulator/Simulator.ts:38](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/Simulator.ts#L38)

This class member stores the highest available memory address of physical memory.

## Accessors

### programmLoaded

#### Get Signature

> **get** **programmLoaded**(): `boolean`

Defined in: [src/simulator/Simulator.ts:127](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/Simulator.ts#L127)

This method checks whether an assembly programm is currently loaded into the main memory.

##### Returns

`boolean`

True, if an assembly programm is currently loaded into main memory, false otherwise.

## Methods

### bootProcess()

> **bootProcess**(`pathToProgramCode`): `void`

Defined in: [src/simulator/Simulator.ts:364](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/Simulator.ts#L364)

This method is used to initialize a process and prepare its execution.

#### Parameters

##### pathToProgramCode

`string`

#### Returns

`void`

***

### cycle()

> **cycle**(): `boolean`

Defined in: [src/simulator/Simulator.ts:563](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/Simulator.ts#L563)

This method triggers execution of the next instruction of a loaded programm.

#### Returns

`boolean`

True, if the cycle was performed normally and false, if the cycle could not be performed because the programm has ended.

***

### loadProgramm()

> **loadProgramm**(`compiledProgram`, `virtualBaseAddressDec`?): `void`

Defined in: [src/simulator/Simulator.ts:614](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/Simulator.ts#L614)

This method loads the given and compiled assembly program into the main memory based on 
the given base address.

#### Parameters

##### compiledProgram

[`DoubleWord`](../../../binary_types/DoubleWord/classes/DoubleWord.md)[]

The compiled assembly program.

##### virtualBaseAddressDec?

`number` = `0`

The virtual base address of the program in decimal representation.

#### Returns

`void`

#### Throws

— {PrivilegeViolationError} If the page frame associated with this page is not accessable in user mode.

#### Throws

— {PageFrameNotExecutableError} If the page frame associated with this page is not executable.

#### Throws

— {PageFrameNotWritableError} If the page frame associated with this page is not writable.

***

### getInstance()

> `static` **getInstance**(`capacityOfMainMemory`): [`Simulator`](Simulator.md)

Defined in: [src/simulator/Simulator.ts:136](https://github.com/ProgrammIt/CPU-Simulator/blob/1018f35141b4ad3f48781b12aa9e5f0ba9cc7301/src/simulator/Simulator.ts#L136)

This method can be used to retrieve an initialized instance of the simulator.

#### Parameters

##### capacityOfMainMemory

`number`

#### Returns

[`Simulator`](Simulator.md)
