; Author: Erik Burmester <erik.burmester@nextbeam.net>
; Created at: 2024-12-16
; Last modified at: 2024-12-21

; ---------------------------------------------------- Warning ----------------------------------------------------
; | This program is part of the operating systems kernel.                                                         |
; | Do NOT change this file unless you know what you are doing!                                                   |
; -----------------------------------------------------------------------------------------------------------------

; -------------------------------------------------- Description --------------------------------------------------
; | This program initializes a single-stage page table and is executed during the boot process.                   | 
; | With an 12 bit offset of an 32 Bit address, each page and page frame is 4096 bytes big.                       |
; | With an 32 bit address, 4294967296 (0xFFFFFFFF) memory cells (with 1 byte per memory cell) can be addressed.  |
; | This means, there are 4294967296 / 4096 = 1048576 possible pages or page frames.                              |
; | Therefore, a single-stage page table has 1048576 unique entries.                                              |
; -----------------------------------------------------------------------------------------------------------------

MOV $0, %eax                                            ; Initialize counter.
MOV %ebx, %ptp                                          ; Initialize PTP register with first/lowest physical address of page table which is saved in EBX during boot.

.loop:

    MOV $0b01000000000000000000000000000010, *%ebx      ; Create page table entry with pinned flag set.
    SUB $1, %eax                                        ; Decrement counter.
    SUB $4, %ebx                                        ; Subtract 4 from current address, in order to move to the next address of a page table entry.
    CMP $1048576, %eax                                  ; If counter is greater or equal to zero, than loop again.
    JL loop

MOV $0, %eax                                            ; Set exit code for program (sys_exit).
INT $0x1                                                ; Call Kernel to exit the program.