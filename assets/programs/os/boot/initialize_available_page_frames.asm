; Author: Erik Burmester <erik.burmester@nextbeam.net>
; Created at: 2024-12-16
; Last modified at: 2024-12-21

; ---------------------------------------------------- Warning ----------------------------------------------------
; | This program is part of the operating systems kernel.                                                         |
; | Do NOT change this file unless you know what you are doing!                                                   |
; -----------------------------------------------------------------------------------------------------------------

; -------------------------------------------------- Description --------------------------------------------------
; | This program initializes the list of available page frames and is executed during the boot process.           |
; | With an 12 bit offset of an 32 Bit address, each page and page frame is 4096 bytes big.                       |
; | With an 32 bit address, 4294967296 (0xFFFFFFFF) memory cells (with 1 byte per memory cell) can be addressed.  |
; | This means, there are 4294967296 / 4096 = 1048576 possible pages or page frames.                              |
; | Therefore, the page table has 1048576 unique entries (page frames).                                           |
; | The list of used page frames is the same size.                                                                |
; -----------------------------------------------------------------------------------------------------------------

MOV $0, %eax                    ; Initialize EAX with physical address of first page frame.
MOV $4292870142, %ebx           ; Initialize EBX with the lists first entry's physical address.

.loop:
    
    MOV %eax, *%ebx             ; Add first page frames physical address to the list.

    ADD $4096, %eax             ; Physical address of next page frame is located at: current address + 4096.

    ADD $4, %ebx;               ; Make EBX point to the physical address of the next entry in the list.

    CMP $1048576, %eax          ; Check, if 1048576 entries have been added to the list.
    JL loop                     ; While there are less entries, jump to start of the loop.

MOV $0, %eax                    ; Set exit code for program (sys_exit).
INT $0x1                        ; Call Kernel to exit the program.