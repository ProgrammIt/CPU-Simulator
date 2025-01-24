[**ihme-core-x1-simulator**](../../README.md)

***

[ihme-core-x1-simulator](../../modules.md) / [render](../README.md) / Renderer

# Class: Renderer

Defined in: [src/render.ts:18](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L18)

This class encapsulates the logic needed to initialize and sync the GUI
with the backend process.

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Constructors

### new Renderer()

> **new Renderer**(`document`, `window`): [`Renderer`](Renderer.md)

Defined in: [src/render.ts:748](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L748)

Constructs an instance with the given HTML document associated.

#### Parameters

##### document

`Document`

A reference to an HTML document.

##### window

[`Window`](../../preload/interfaces/Window.md) & *typeof* `globalThis`

A reference to the browser "window".

#### Returns

[`Renderer`](Renderer.md)

## Properties

### autoScrollForPageTableEnabled

> **autoScrollForPageTableEnabled**: `boolean`

Defined in: [src/render.ts:741](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L741)

This field represents a flag, which enables automatic scroll for the GUIs Page Table widget.

***

### autoScrollForPhysicalRAMEnabled

> **autoScrollForPhysicalRAMEnabled**: `boolean`

Defined in: [src/render.ts:736](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L736)

This field represents a flag, which enables automatic scroll for the GUIs physical RAM widget.

***

### autoScrollForVirtualRAMEnabled

> **autoScrollForVirtualRAMEnabled**: `boolean`

Defined in: [src/render.ts:731](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L731)

This field represents a flag, which enables automatic scroll for the GUIs virtual RAM widget.

***

### dataRepresentationEAX

> **dataRepresentationEAX**: [`NumberSystem`](../enumerations/NumberSystem.md)

Defined in: [src/render.ts:56](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L56)

This field stores the currently selected representation of the data for the EAX register.

***

### dataRepresentationEBX

> **dataRepresentationEBX**: [`NumberSystem`](../enumerations/NumberSystem.md)

Defined in: [src/render.ts:67](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L67)

This field stores the currently selected representation of the data for the EBX register.

***

### dataRepresentationEDX

> **dataRepresentationEDX**: [`NumberSystem`](../enumerations/NumberSystem.md)

Defined in: [src/render.ts:78](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L78)

This field stores the currently selected representation of the data for the EDX register.

***

### dataRepresentationEIP

> **dataRepresentationEIP**: [`NumberSystem`](../enumerations/NumberSystem.md)

Defined in: [src/render.ts:89](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L89)

This field stores the currently selected representation of the data for the EIP register.

***

### dataRepresentationEIR

> **dataRepresentationEIR**: [`NumberSystem`](../enumerations/NumberSystem.md)

Defined in: [src/render.ts:110](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L110)

TODO: Implement mechanism for retrieving textual instruction from main process of the Simulator!
This field is currently unused, as there is no such mechanism.
The only available representation for the EIR register is binary.

This field stores the currently selected representation of the data for the EIR register.

***

### dataRepresentationESP

> **dataRepresentationESP**: [`NumberSystem`](../enumerations/NumberSystem.md)

Defined in: [src/render.ts:143](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L143)

This field stores the currently selected representation of the data for the ESP register.

***

### dataRepresentationGPTP

> **dataRepresentationGPTP**: [`NumberSystem`](../enumerations/NumberSystem.md)

Defined in: [src/render.ts:165](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L165)

This field stores the currently selected representation of the data for the GPTP register.

***

### dataRepresentationITP

> **dataRepresentationITP**: [`NumberSystem`](../enumerations/NumberSystem.md)

Defined in: [src/render.ts:154](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L154)

This field stores the currently selected representation of the data for the ITP register.

***

### dataRepresentationNPTP

> **dataRepresentationNPTP**: [`NumberSystem`](../enumerations/NumberSystem.md)

Defined in: [src/render.ts:121](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L121)

This field stores the currently selected representation of the data for the NPTP register.

***

### dataRepresentationPTP

> **dataRepresentationPTP**: [`NumberSystem`](../enumerations/NumberSystem.md)

Defined in: [src/render.ts:176](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L176)

This field stores the currently selected representation of the data for the PTP register.

***

### dataRepresentationVMPTR

> **dataRepresentationVMPTR**: [`NumberSystem`](../enumerations/NumberSystem.md)

Defined in: [src/render.ts:132](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L132)

This field stores the currently selected representation of the data for the VMPTR register.

***

### programLoaded

> **programLoaded**: `boolean`

Defined in: [src/render.ts:45](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L45)

This field indicates, whether an assembly program is currently loaded.

***

### HIGH\_ADDRESS\_PHYSICAL\_MEMORY\_DEC

> `readonly` `static` **HIGH\_ADDRESS\_PHYSICAL\_MEMORY\_DEC**: `number` = `4_294_967_295`

Defined in: [src/render.ts:22](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L22)

This class member stores the highest available physical memory address.

***

### NUMBER\_BITS\_PAGE\_FRAME\_ADDRESS

> `readonly` `static` **NUMBER\_BITS\_PAGE\_FRAME\_ADDRESS**: `number` = `20`

Defined in: [src/render.ts:29](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L29)

This class member stores the number of bits representing the page frame number.
The page frame number can be extracted from a phyiscal memory address by removing the offset bits from the right.

## Methods

### createPageTableEntryElement()

> **createPageTableEntryElement**(`pageNumberDecString`, `presentFlag`, `writableFlag`, `executableFlag`, `accessableOnlyInKernelModeFlag`, `pinnedFlag`, `changedFlag`, `pageFrameNumberDecString`): `HTMLElement`

Defined in: [src/render.ts:1039](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L1039)

This method creates a GUI element, which represents an entry of the Page Table.

#### Parameters

##### pageNumberDecString

`string`

The virtual page address, which is often refered to as the pages number.

##### presentFlag

`boolean`

This flag indicates whether the page is currently mounted to a page frame.

##### writableFlag

`boolean`

This flag indicates whether the page is writable or read-only.

##### executableFlag

`boolean`

This flag indicates whether the page is executable or not.

##### accessableOnlyInKernelModeFlag

`boolean`

This flag indicates whether the page can only be accessed in kernel mode.

##### pinnedFlag

`boolean`

This flag indicates whether the page is protected against attempts to write it to a background memory.

##### changedFlag

`boolean`

This flag indicates whether the page was changed since it was mounted to a page frame.

##### pageFrameNumberDecString

`string`

The physical page frame address, which is often refered to as the page frames number.

#### Returns

`HTMLElement`

An GUI element representing a single Page Table entry.

***

### createPageTableView()

> **createPageTableView**(`firstPageNumberToReadDec`?, `lastPageNumberToReadDec`?): `Promise`\<`void`\>

Defined in: [src/render.ts:1085](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L1085)

This method initializes the view of the Page Table reading the first thirty entries of the Page Table
and creats GUI elements, which represents the individual entries.

#### Parameters

##### firstPageNumberToReadDec?

`number` = `0`

The first page number to read from Page Table.

##### lastPageNumberToReadDec?

`number` = `30`

The last page number to read from Page Table.

#### Returns

`Promise`\<`void`\>

***

### createPhysicalRAMGuiElement()

> **createPhysicalRAMGuiElement**(`physicalAddressHexString`, `binaryStringContent`): `HTMLElement`

Defined in: [src/render.ts:986](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L986)

This method creates an HTMLElement representing a physical RAM cell. This element consist out of a label with the 
pyhsical memory address and the binary content of the main memory at this address.

#### Parameters

##### physicalAddressHexString

`string`

The physical memory address of the RAM cell.

##### binaryStringContent

`string`

The binary content of this RAM cell.

#### Returns

`HTMLElement`

A HTMLElement representing a RAM cell.

***

### createPhysicalRAMView()

> **createPhysicalRAMView**(`firstPhysicalAddressToReadHex`?, `lastPhysicalAddressToReadHex`?): `Promise`\<`void`\>

Defined in: [src/render.ts:927](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L927)

This method initializes the view of the physical RAM by reading the first twenty
entries of the main memory and creating HTMLElements, which represents the individual 
RAM cells.

#### Parameters

##### firstPhysicalAddressToReadHex?

`string` = `"0x0"`

The first physical memory address to read from main memory in hexadecimal representation.

##### lastPhysicalAddressToReadHex?

`string` = `"0x1e"`

The last physical memory address to read from main memory in hexadecimal representation.

#### Returns

`Promise`\<`void`\>

***

### createVirtualRAMGuiElement()

> **createVirtualRAMGuiElement**(`virtualAddressHexString`, `binaryStringContent`): `HTMLElement`

Defined in: [src/render.ts:1010](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L1010)

This method creates an HTMLElement representing a virtual RAM cell. This element consist out of a label with the 
pyhsical memory address and the binary content of the main memory at this address.

#### Parameters

##### virtualAddressHexString

`string`

The virtual memory address of the RAM cell.

##### binaryStringContent

`string`

The binary content of this RAM cell.

#### Returns

`HTMLElement`

A HTMLElement representing a RAM cell.

***

### createVirtualRAMView()

> **createVirtualRAMView**(`firstVirtualAddressToReadHex`?, `lastVirtualAddressToReadHex`?): `Promise`\<`void`\>

Defined in: [src/render.ts:956](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L956)

This method initializes the view of the virtual RAM by reading the first twenty entries of the main memory 
and creating HTMLElements, which represents the individual RAM cells.

#### Parameters

##### firstVirtualAddressToReadHex?

`string` = `"0x0"`

The first virtual memory address to read from main memory in hexadecimal representation.

##### lastVirtualAddressToReadHex?

`string` = `"0x1e"`

The last virtual memory address to read from main memory in hexadecimal representation.

#### Returns

`Promise`\<`void`\>

***

### cycle()

> **cycle**(): `Promise`\<`void`\>

Defined in: [src/render.ts:1363](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L1363)

Performs the next CPU cycle (fetch, decode, execute).

#### Returns

`Promise`\<`void`\>

***

### readEAX()

> **readEAX**(`radix`): `Promise`\<`void`\>

Defined in: [src/render.ts:1175](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L1175)

This method reads the content of the EAX register.

#### Parameters

##### radix

[`NumberSystem`](../enumerations/NumberSystem.md)

#### Returns

`Promise`\<`void`\>

***

### readEBX()

> **readEBX**(`radix`): `Promise`\<`void`\>

Defined in: [src/render.ts:1186](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L1186)

This method reads the content of the EBX register.

#### Parameters

##### radix

[`NumberSystem`](../enumerations/NumberSystem.md)

#### Returns

`Promise`\<`void`\>

***

### readEDX()

> **readEDX**(`radix`): `Promise`\<`void`\>

Defined in: [src/render.ts:1197](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L1197)

This method reads the content of the EDX register.

#### Parameters

##### radix

[`NumberSystem`](../enumerations/NumberSystem.md)

#### Returns

`Promise`\<`void`\>

***

### readEFLAGS()

> **readEFLAGS**(): `Promise`\<`void`\>

Defined in: [src/render.ts:1265](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L1265)

This method reads the content of the EFLAGS register.

#### Returns

`Promise`\<`void`\>

***

### readEIP()

> **readEIP**(`radix`): `Promise`\<`void`\>

Defined in: [src/render.ts:1208](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L1208)

This method reads the content of the EIP register.

#### Parameters

##### radix

[`NumberSystem`](../enumerations/NumberSystem.md)

#### Returns

`Promise`\<`void`\>

***

### readEIR()

> **readEIR**(`asInstruction`): `Promise`\<`void`\>

Defined in: [src/render.ts:1286](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L1286)

This method reads the content of the EIR register.

#### Parameters

##### asInstruction

`boolean` = `false`

Indicates, wethert to display the instruction in its textual representation or not.

#### Returns

`Promise`\<`void`\>

***

### readESP()

> **readESP**(`radix`): `Promise`\<`void`\>

Defined in: [src/render.ts:1319](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L1319)

This method reads the content of the ESP register.

#### Parameters

##### radix

[`NumberSystem`](../enumerations/NumberSystem.md)

#### Returns

`Promise`\<`void`\>

***

### readGPTP()

> **readGPTP**(`radix`): `Promise`\<`void`\>

Defined in: [src/render.ts:1341](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L1341)

This method reads the content of the GPTP register.

#### Parameters

##### radix

[`NumberSystem`](../enumerations/NumberSystem.md)

#### Returns

`Promise`\<`void`\>

***

### readITP()

> **readITP**(`radix`): `Promise`\<`void`\>

Defined in: [src/render.ts:1330](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L1330)

This method reads the content of the ITP register.

#### Parameters

##### radix

[`NumberSystem`](../enumerations/NumberSystem.md)

#### Returns

`Promise`\<`void`\>

***

### readNPTP()

> **readNPTP**(`radix`): `Promise`\<`void`\>

Defined in: [src/render.ts:1297](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L1297)

This method reads the content of the NPTP register.

#### Parameters

##### radix

[`NumberSystem`](../enumerations/NumberSystem.md)

#### Returns

`Promise`\<`void`\>

***

### readPTP()

> **readPTP**(`radix`): `Promise`\<`void`\>

Defined in: [src/render.ts:1352](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L1352)

This method reads the content of the PTP register.

#### Parameters

##### radix

[`NumberSystem`](../enumerations/NumberSystem.md)

#### Returns

`Promise`\<`void`\>

***

### readVMPTR()

> **readVMPTR**(`radix`): `Promise`\<`void`\>

Defined in: [src/render.ts:1308](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L1308)

This method reads the content of the VMPTR register.

#### Parameters

##### radix

[`NumberSystem`](../enumerations/NumberSystem.md)

#### Returns

`Promise`\<`void`\>

***

### registerChangeListener()

> **registerChangeListener**(): `void`

Defined in: [src/render.ts:802](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L802)

This method registers the change listeners for all <select> elements inside the GUI elements, which represent
registers during start of the simulator.

#### Returns

`void`

***

### reloadPageTableView()

> **reloadPageTableView**(): `Promise`\<`void`\>

Defined in: [src/render.ts:1128](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L1128)

This method reloads the view of the Page Table depending on the visible Page Table entries.

#### Returns

`Promise`\<`void`\>

***

### reloadPhysicalRAMView()

> **reloadPhysicalRAMView**(): `Promise`\<`void`\>

Defined in: [src/render.ts:860](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L860)

This function reloads the RAM view, by taking the visible elements into account. This is done in order to avoid
weird jumps in the widget, representing the physical main memory.

#### Returns

`Promise`\<`void`\>

***

### reloadVirtualRAMView()

> **reloadVirtualRAMView**(): `Promise`\<`void`\>

Defined in: [src/render.ts:892](https://github.com/ProgrammIt/CPU-Simulator/blob/7552359f9aa6207ad192c9a5fcb9c9063dd40c2c/src/render.ts#L892)

This function reloads the RAM view, by taking the visible elements into account. This is done in order to avoid
weird jumps in the widget, representing the virtual main memory.

#### Returns

`Promise`\<`void`\>
