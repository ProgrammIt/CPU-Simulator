[**ihme-core-x1-simulator**](../../../../README.md)

***

[ihme-core-x1-simulator](../../../../modules.md) / [simulator/execution\_units/ArithmeticLogicUnit](../README.md) / ArithmeticLogicUnit

# Class: ArithmeticLogicUnit

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:12](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L12)

## Author

Erik Burmester <erik.burmester@nextbeam.net>

## Constructors

### new ArithmeticLogicUnit()

> **new ArithmeticLogicUnit**(`eflags`): [`ArithmeticLogicUnit`](ArithmeticLogicUnit.md)

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:24](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L24)

Constructs a new instance from the given arguments.

#### Parameters

##### eflags

[`EFLAGS`](../../../functional_units/EFLAGS/classes/EFLAGS.md)

The EFLAGS register of the CPU core this ALU is associated with.

#### Returns

[`ArithmeticLogicUnit`](ArithmeticLogicUnit.md)

## Methods

### adc()

> **adc**(`firstSummand`, `secondSummand`): [`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:282](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L282)

This method adds two given binary numbers while taking the carry into account.

Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.

#### Parameters

##### firstSummand

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The first operand/summand.

##### secondSummand

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The second operand/summand.

#### Returns

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The sum of both operands/summands.

***

### add()

> **add**(`firstSummand`, `secondSummand`): [`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:240](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L240)

This method adds two given binary numbers without taking the carry into account.

Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.

#### Parameters

##### firstSummand

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The first operand/summand.

##### secondSummand

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The second operand/summand.

#### Returns

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The sum of both operands/summands.

***

### and()

> **and**(`firstOperand`, `secondOperand`): [`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:140](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L140)

This method performs an bit-wise, logical AND operation on two given binary values, 
according to the following table.

| Bit x | Bit y | Result |
|-------|-------|--------|
| 0     | 0     | 0      |
| 1     | 0     | 0      |
| 0     | 1     | 0      |
| 1     | 1     | 1      |

Both the **carry** and the **overflow** flag are *cleared*, while the **zero**, 
**sign** and **parity** flags are *set* or *cleared* according to the operations result.

#### Parameters

##### firstOperand

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The first doubleword.

##### secondOperand

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The second doubleword.

#### Returns

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The resulting binary value.

***

### cmp()

> **cmp**(`firstOperand`, `secondOperand`): `void`

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:507](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L507)

This method compares both given binary values, by performing a subtraction.

Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.

In contrast to SUB, this operation does not effect the second operands value.

#### Parameters

##### firstOperand

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

##### secondOperand

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

#### Returns

`void`

***

### div()

> **div**(`dividend`, `divisor`): [`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:461](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L461)

This method divides both the given binary, doubleword sized values.

Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.

#### Parameters

##### dividend

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The first operand, which divides the dividend.

##### divisor

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The second operand, which gets divided by the divisor.

#### Returns

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The resulting quotient.

***

### leftShift()

> **leftShift**\<`T`\>(`operand`): [`Bit`](../../../../binary_types/Bit/type-aliases/Bit.md)

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:409](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L409)

This method performs an arithmetic shift on the given binary value one bit to the left.

#### Type Parameters

• **T** *extends* [`BinaryValue`](../../../../binary_types/BinaryValue/classes/BinaryValue.md)

#### Parameters

##### operand

`T`

The operand to perform a right shift on.

#### Returns

[`Bit`](../../../../binary_types/Bit/type-aliases/Bit.md)

The bit left shifted.

***

### mul()

> **mul**(`multiplier`, `multiplicand`): [`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:430](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L430)

This method multiplies both the given binary, doubleword sized values using Booths mulitplication algorithm, 
according to <https://medium.com/@jetnipit54/booth-algorithm-e6b8a6c5b8d>.

Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.

#### Parameters

##### multiplier

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The operand, which determines, how often the first operand gets multiplied.

##### multiplicand

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The operand, which gets multiplied by the multiplicand.

#### Returns

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The resulting product.

***

### neg()

> **neg**(`operand`): [`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:227](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L227)

This method computes the two's complement of the given binary value.

Both the **carry** and the **overflow** flag are *cleared*, while the **zero**,
**sign** and **parity** flags are *set* or *cleared* according to the operations result.

#### Parameters

##### operand

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The operand.

#### Returns

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The two's complement.

***

### not()

> **not**(`operand`): [`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:115](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L115)

This method performs the logical NOT operation bit-wise on a doubleword sized binary value.
All its bits will be inverted: 1 becomes 0 and vice versa.The result corresponds 
to the one's complement of the given binary value.

All flags remain unchanged.

#### Parameters

##### operand

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The doubleword sized binary value to invert.

#### Returns

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The inverted binary value.

***

### or()

> **or**(`firstOperand`, `secondOperand`): [`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:171](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L171)

This method performs an bit-wise, logical OR operation on two given binary values, 
according to the following table.

| Bit x | Bit y | Result |
|-------|-------|--------|
| 0     | 0     | 0      |
| 1     | 0     | 1      |
| 0     | 1     | 1      |
| 1     | 1     | 1      |

Both the **carry** and the **overflow** flag are *cleared*, while the **zero**, 
**sign** and **parity** flags are *set* or *cleared* according to the operations result.

#### Parameters

##### firstOperand

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The first word.

##### secondOperand

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The second word.

#### Returns

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The resulting binary value.

***

### rightShift()

> **rightShift**\<`T`\>(`operand`): [`Bit`](../../../../binary_types/Bit/type-aliases/Bit.md)

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:392](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L392)

This method performs an arithmetic shift on the given binary value one bit to the right.

#### Type Parameters

• **T** *extends* [`BinaryValue`](../../../../binary_types/BinaryValue/classes/BinaryValue.md)

#### Parameters

##### operand

`T`

The operand to perform a right shift on.

#### Returns

[`Bit`](../../../../binary_types/Bit/type-aliases/Bit.md)

The bit right shifted.

***

### sbb()

> **sbb**(`minuend`, `subtrahend`): [`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:347](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L347)

This method subtracts two given binary numbers without taking the carry into account.

Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.

#### Parameters

##### minuend

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The binary value to subtract from.

##### subtrahend

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The binary value to subtract.

#### Returns

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The difference of the first operand (minuend) and the second operand (subtrahend).

***

### signExtend()

> **signExtend**\<`T`\>(`operand`, `maxLength`): `void`

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:373](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L373)

This method sign extends a given binary value to the specified length.

#### Type Parameters

• **T** *extends* [`BinaryValue`](../../../../binary_types/BinaryValue/classes/BinaryValue.md)

#### Parameters

##### operand

`T`

A binary value to sign extend.

##### maxLength

`number`

The lenght to sign extend the operand to.

#### Returns

`void`

***

### sub()

> **sub**(`minuend`, `subtrahend`): [`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:323](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L323)

This method subtracts two given binary numbers without taking the carry into account.

Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.

#### Parameters

##### minuend

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The binary value to subtract from.

##### subtrahend

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The binary value to subtract.

#### Returns

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The difference of the first operand (minuend) and the second operand (subtrahend).

***

### test()

> **test**(`firstOperand`, `secondOperand`): `void`

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:521](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L521)

This method compares both given binary values, by performing a logical AND operation.

Affects the **sign**, **zero**, **carry**, **overflow** and **parity** bit according to the result.

In contrast to AND, this operation does not effect the second operands value.

#### Parameters

##### firstOperand

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

##### secondOperand

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

#### Returns

`void`

***

### xor()

> **xor**(`firstOperand`, `secondOperand`): [`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

Defined in: [src/simulator/execution\_units/ArithmeticLogicUnit.ts:202](https://github.com/ProgrammIt/CPU-Simulator/blob/e2e026db90406d6486eead3a66922074c98b6175/src/simulator/execution_units/ArithmeticLogicUnit.ts#L202)

This method performs an bit-wise, logical XOR operation on two given binary values, 
according to the following table.

| Bit x | Bit y | Result |
|-------|-------|--------|
| 0     | 0     | 0      |
| 1     | 0     | 1      |
| 0     | 1     | 1      |
| 1     | 1     | 0      |

Both the **carry** and the **overflow** flag are *cleared*, while the **zero**,
**sign** and **parity** flags are *set* or *cleared* according to the operations result.

#### Parameters

##### firstOperand

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The first doubleword.

##### secondOperand

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The second doubleword.

#### Returns

[`DoubleWord`](../../../../binary_types/DoubleWord/classes/DoubleWord.md)

The resulting binary value.
