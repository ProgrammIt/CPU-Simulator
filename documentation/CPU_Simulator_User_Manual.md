# CPU Simulator User Manual

## Table of Contents

- [1 Instruction Set](#1-instruction-set)
  - [1.1 Bit Shift Instructions](#11-bit-shift-instructions)
    - [1.1.1 SHR](#111-shr)
    - [1.1.2 SHL](#112-shl)
    - [1.1.3 SAR](#113-sar)
    - [1.1.4 SAL](#114-sal)
  - [1.2 TLB Instructions](#12-tlb-instructions)
    - [1.2.1 INVTLB](#121-invtlb)
  - [1.3 Jump Instructions](#13-jump-instructions)
    - [1.3.1 JA](#131-ja)
    - [1.3.2 JAE](#132-jae)
    - [1.3.3 JB](#133-jb)
    - [1.3.4 JBE](#134-jbe)
  - [1.4 Preprocessor Commands](#14-preprocessor-commands)
    - [1.4.1 .INCLUDE](#141-include)
- [2 DEV Operations](#2-dev-operations)
  - [2.1 Virtual Memory Management Operations](#21-virtual-memory-management-operations)
    - [2.1.1 CPU_IS_MEMORY_VIRTUALIZATION_ENABLED](#211-cpu_is_memory_virtualization_enabled)
    - [2.1.2 CPU_ENABLE_MEMORY_VIRTUALIZATION](#212-cpu_enable_memory_virtualization)
    - [2.1.3 CPU_DISABLE_MEMORY_VIRTUALIZATION](#213-cpu_disable_memory_virtualization)
  - [2.2 Timer Operations](#22-timer-operations)
    - [2.2.1 TIMER_GET_FINISHED](#221-timer_get_finished)
    - [2.2.2 TIMER_SET](#222-timer_set)

# 1 Instruction Set

## 1.1 Bit Shift Instructions

> ### 1.1.1 SHR
>
> `SHR` (Shift Logical Right) performs a logical bitwise right shift.
>
> **Syntax**
> ```
> SHR <count>, <destination>
> ```
> **Description**
>
> Shifts the bits in `<destination>` by `<count>` positions to the right. With each shift, the LSB is transferred to the carry flag, while the MSB is filled with 0.
>
> The `<count>` operand can be a memory address, a register, or a literal value.    
> The `<destination>` operand can be a memory address or a register.
>
> **Affected Flags**
>
> - **CF (Carry Flag)** Contains the most recently shifted-out bit.
> - **ZF (Zero Flag)** Is set to `1` if the result is `0`, otherwise set to `0`.
> - **SF (Sign Flag)** Corresponds to the MSB of the result.
> - **PF (Parity Flag)** Corresponds to the parity of the least significant byte of the result.
> - **OF (Overflow Flag)** Is defined only for `<count>` = 1. In this case, OF is set to the original value of the MSB before the shift.
>
> **Possible Exceptions**
>
> - **Page Fault** If `<count>` or `<destination>` is a memory address and the access triggers a page fault.
> - **General Protection Fault** If `<count>` or `<destination>` is a memory address and the access is not permitted.




> ### 1.1.2 SHL
>
> `SHL` (Shift Logical Left) performs a logical bitwise left shift.
>
> **Syntax**
> ```
> SHL <count>, <destination>
> ```
> **Description**
>
> Shifts the bits in `<destination>` by `<count>` positions to the left. With each shift, the MSB is transferred to the carry flag, while the LSB is filled with 0.
>
> The `<count>` operand can be a memory address, a register, or a literal value.    
> The `<destination>` operand can be a memory address or a register.
>
> **Affected Flags**
>
> - **CF (Carry Flag)** Contains the most recently shifted-out bit.
> - **ZF (Zero Flag)** Is set to `1` if the result is `0`, otherwise set to `0`.
> - **SF (Sign Flag)** Corresponds to the MSB of the result.
> - **PF (Parity Flag)** Corresponds to the parity of the least significant byte of the result.
> - **OF (Overflow Flag)** Is defined only for `<count>` = 1. In this case, OF is set to `1` if, after the shift, the MSB is not equal to the carry flag, otherwise set to `0`.
>
> **Possible Exceptions**
>
> - **Page Fault** If `<count>` or `<destination>` is a memory address and the access triggers a page fault.
> - **General Protection Fault** If `<count>` or `<destination>` is a memory address and the access is not permitted.




> ### 1.1.3 SAR
>
> `SAR` (Shift Arithmetic Right) performs an arithmetic bitwise right shift.
>
> **Syntax**
> ```
> SAR <count>, <destination>
> ```
> **Description**
>
> Shifts the bits in `<destination>` by `<count>` positions to the right. During each shift, the LSB is carried to the carry flag, while the MSB is filled with its original value (sign is preserved).
>
> The `<count>` operand can be a memory address, a register, or a literal value.    
> The `<destination>` operand can be a memory address or a register.
>
> **Affected Flags**
>
> - **CF (Carry Flag)** Contains the most recently shifted-out bit.
> - **ZF (Zero Flag)** Is set to `1` if the result is `0`; otherwise, it is set to `0`.
> - **SF (Sign Flag)** Corresponds to the MSB of the result.
> - **PF (Parity Flag)** Corresponds to the parity of the least significant byte of the result.
> - **OF (Overflow Flag)** Is set to `0`.
>
> **Possible exceptions**
>
> - **Page Fault** If `<count>` or `<destination>` is a memory address and the access triggers a page fault.
> - **General Protection Fault** If `<count>` or `<destination>` is a memory address and access is not permitted.




> ### 1.1.4 SAL
>
> `SAL` (Shift Arithmetic Left) performs an arithmetic bitwise left shift.
>
> **Syntax**
> ```
> SAL <count>, <destination>
> ```
> **Description**
>
> Shifts the bits in `<destination>` by `<count>` positions to the left. During each shift, the MSB is set in the carry flag, whilst the LSB is filled with 0s.
>
> The `<count>` operand can be a memory address, a register or a literal value.    
> The `<destination>` operand can be a memory address or a register.
>
> **Affected flags**
>
> - **CF (Carry flag)** Contains the most recently shifted-out bit.
> - **ZF (Zero flag)** Is set to `1` if the result is `0`, otherwise to `0`.
> - **SF (Sign flag)** Corresponds to the MSB of the result.
> - **PF (Parity flag)** Corresponds to the parity of the least significant byte of the result.
> - **OF (Overflow flag)** Is only defined for `<count>` = 1. In this case, OF is set to `1` if, after shifting, the MSB is not equal to the carry flag, otherwise set to `0`.
>
> **Possible exceptions**
>
> - **Page Fault** If `<count>` or `<destination>` is a memory address and the access triggers a page fault.
> - **General Protection Fault** If `<count>` or `<destination>` is a memory address and the access is not permitted.




## 1.2 TLB Instructions

> ### 1.2.1 INVTLB
>
> `INVTLB` (Invalidate TLB) clears the TLB.
>
> **Syntax**
> ```
> INVTLB
> ```
> **Description**
>
> Clears the entire TLB. This instruction is privileged and may therefore only be executed in kernel mode.
>
> **Affected flags**
>
> - None.
>
> **Possible exceptions**
>
> - **General Protection Fault** if the instruction is executed in user mode.




## 1.3 Jump Instructions

> ### 1.3.1 JA
>
> `JA` (Jump Above) performs a jump if the comparison of two **unsigned numbers** (`X`, `Y` using ```CMP Y, X```) shows that `X > Y`.
>
> **Syntax**
> ```
> JA <destination>
> ```
> **Description**
>
> Jumps to the specified memory address `<destination>`, **only if** both the carry flag (CF) and the zero flag (ZF) are `0`. This corresponds to the result of a comparison of two unsigned numbers (`X`, `Y` using ```CMP Y, X```), where `X > Y` holds true.
>
> The `<destination>` operand can be a register or a memory address.
>
> **Affected Flags**
>
> - None.
>
> **Possible Exceptions**
>
> - **Page Fault** If `<destination>` is a memory address and the jump to that address triggers a page fault.
> - **General Protection Fault** If `<destination>` is a memory address and the jump to that address is not permitted.




> ### 1.3.2 JAE
>
> `JAE` (Jump Above Equal) executes a jump if the comparison of two **unsigned numbers** (`X`, `Y` with ```CMP Y, X```) shows that `X >= Y`.
>
> **Syntax**
> ```
> JAE <destination>
> ```
> **Description**
>
> Jumps to the specified memory address `<destination>`, **only if** the carry flag (CF) is `0`. This corresponds to the result of a comparison of two unsigned numbers (`X`, `Y` using ```CMP Y, X```), where `X >= Y` holds true.
>
> The `<destination>` operand can be a register or a memory address.
>
> **Affected flags**
>
> - None.
>
> **Possible exceptions**
>
> - **Page Fault** If `<destination>` is a memory address and the jump to that address triggers a page fault.
> - **General Protection Fault** If `<destination>` is a memory address and the jump to that address is not permitted.




> ### 1.3.3 JB
>
> `JB` (Jump Below) executes a jump if the comparison of two **unsigned numbers** (`X`, `Y` using ```CMP Y, X```) shows that `X < Y`.
>
> **Syntax**
> ```
> JB <destination>
> ```
> **Description**
>
> Jumps to the specified memory address `<destination>`, **only if** the carry flag (CF) is `1`. This corresponds to the result of a comparison of two unsigned numbers (`X`, `Y` using ```CMP Y, X```), where `X < Y` holds true.
>
> The `<destination>` operand can be a register or a memory address.
>
> **Flags Affected**
>
> - None.
>
> **Possible Exceptions**
>
> - **Page Fault** If `<destination>` is a memory address and the jump to that address triggers a page fault.
> - **General Protection Fault** If `<destination>` is a memory address and the jump to that address is not permitted.




>> ### 1.3.4 JBE
>
> `JBE` (Jump Below Equal) executes a jump if the comparison of two **unsigned numbers** (`X`, `Y` using ```CMP Y, X```) shows that `X <= Y`.
>
> **Syntax**
> ```
> JB <destination>
> ```
> **Description**
>
> Jumps to the specified memory address `<destination>`, **only if** both the carry flag (CF) and the zero flag (ZF) are `1`. This corresponds to the result of a comparison between two unsigned numbers (`X`, `Y` using ```CMP Y, X```), where `X <= Y` holds true.
>
> The `<destination>` operand can be a register or a memory address.
>
> **Affected Flags**
>
>- None.
>
> **Possible Exceptions**
>
> - **Page Fault** If `<destination>` is a memory address and the jump to that address triggers a page fault.
> - **General Protection Fault** If `<destination>` is a memory address and the jump to that address is not permitted.




## 1.4 Preprocessor Commands

> ### 1.4.1 INCLUDE
>
> `INCLUDE` is a preprocessor command that inserts the contents of another file at the point of the declaration.
>
> **Syntax**
> ```
> .INCLUDE <file_path>
> ```
> **Description**
>
> Before assembly, the `INCLUDE` directive replaces the declaration with the contents of the file located in the CPU simulator’s operating system file system at the path `<file_path>`.
>
> The file must be a valid assembler file. If this file contains further `INCLUDE` commands, these are resolved recursively before the content is inserted into >the current file.




# 2 DEV Operations

## 2.1 Virtual Memory Management Operations

> ### 2.1.1 CPU_IS_MEMORY_VIRTUALIZATION_ENABLED
>
> The DEV operation `CPU_IS_MEMORY_VIRTUALIZATION_ENABLED` checks whether virtual memory management is enabled.
>
> **Description**
>
> This operation uses `<command>` number 10. The `<data>` operand is ignored.
>
> - This operation uses `<command>` number 10.
> - The `<data>` operand is ignored.
> - The result is written to the `EAX` register:
>     - `1` → Virtual memory management is enabled
>     - `0` → Virtual memory management is disabled




> ### 2.1.2 CPU_ENABLE_MEMORY_VIRTUALIZATION
>
> The DEV operation `CPU_ENABLE_MEMORY_VIRTUALIZATION` enables virtual memory management.
>
> **Description**
>
> - This operation uses `<command>` number 11.
> - The `<data>` operand is ignored.
> - There is no return value.




> ### 2.1.3 CPU_DISABLE_MEMORY_VIRTUALIZATION
>
> The DEV operation `CPU_DISABLE_MEMORY_VIRTUALIZATION` disables virtual memory management.
>
> **Description**
>
> - This operation occupies `<command>` number 12.
> - The `<data>` operand is ignored.
> - There is no return value.




## 2.2 Timer Operations

> ### 2.2.1 TIMER_GET_FINISHED
>
> The DEV operation `TIMER_GET_FINISHED` returns the timer ID of the most recently expired timer.
>
> **Description**
>
> - This operation occupies `<command>` number 13.
> - The `<data>` operand is ignored.
> - The timer ID is written to the `EAX` register (0 if no timer has expired yet).




> ### 2.2.2 TIMER_SET
>
> The DEV operation `TIMER_SET` starts a new timer.
>
> **Description**
>
> - This operation occupies `<command>` number 14.
> - The `<data>` operand is used as the timer ID for the new timer.
> - The duration of the timer is retrieved from the stack.
> - There is no return value.
