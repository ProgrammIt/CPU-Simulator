; Author: Erik Burmester <erik.burmester@nextbeam.net>
; Created at: 2024-12-16
; Last modified at: 2024-12-21

; ---------------------------------------------------- Warning ----------------------------------------------------
; | This program is part of the operating systems kernel.                                                         |
; | Do NOT change this file unless you know what you are doing!                                                   |
; -----------------------------------------------------------------------------------------------------------------

; -------------------------------------------------- Description --------------------------------------------------
; | This interrupt handler searches the list with available page frames.                                                    |
; | The first available page frame is removed from this list and added to the list with used page frames.         |
; | Afterwards the page frame is located in the EBX register.                                                     |
; |                                                                                                               |
; | This interrupt handler is assigned to the number 0x2.                                                         |
; -----------------------------------------------------------------------------------------------------------------

; At start of this interrupt handler, the virtual memory address (page), which is currently not associated with
; an page frame, can be found in EAX register. In order to prevent this address from beeing overriden, the value
; is pushed onto the STACK first.
PUSH %eax

; Put two arguments on the STACK.
PUSH @4292870142                    ; This value represents the first address of the list with available page frames.
PUSH @4293918718                    ; This value represents the last address of the list with available page frames.

                                    ; Current STACK
                                    ; |-----------------|
                                    ; | page_address    | <- %esp + 8 (virtual memory address of page)
                                    ; |-----------------|
                                    ; | (4292870142)_10 | <- %esp + 4 (1. argument)
                                    ; |-----------------|
                                    ; | (4293918718)_10 | <- %esp     (2. argument)
                                    ; |-----------------|

CALL search_available_page_frame    ; Call function to search for any available page frame.

POP %eax                            ; Remove 2. argument from STACK.
POP %eax                            ; Remove 1. argument from STACK.

                                    ; Current STACK
                                    ; |-----------------|
                                    ; | page_address    | <- %esp (virtual memory address of page)
                                    ; |-----------------|

; Put an argument on the STACK.
PUSH @4291821565                    ; This value represents the first address of the list with used page frames.

                                    ; Current STACK
                                    ; |-----------------|
                                    ; | page_address    | <- %esp + 4 (virtual memory address of page)
                                    ; |-----------------|
                                    ; | (4291821565)_10 | <- %esp (1. argument)
                                    ; |-----------------|

CALL add_to_used_page_frames        ; Call function to add available page frame to the list containing used page frames.

POP %eax                            ; Remove argument from STACK.

                                    ; Current STACK
                                    ; |-----------------|
                                    ; | page_address    | <- %esp (virtual memory address of page)
                                    ; |-----------------|

PUSH %ebx                           ; Write page frame address onto STACK.

                                    ; Current STACK
                                    ; |-----------------------|
                                    ; | page_address          | <- %esp + 4 (1. argument and virtual memory address of page)
                                    ; |-----------------------|
                                    ; | page_frame_address    | <- %esp (2. argument and virtual memory address of page frame)
                                    ; |-----------------------|

PUSH @4293918719                    ; Write lowest physical memory address of page table to STACK.

                                    ; Current STACK
                                    ; |-----------------------|
                                    ; | page_address          | <- %esp + 8 (1. argument and virtual memory address of page)
                                    ; |-----------------------|
                                    ; | page_frame_address    | <- %esp +4 (2. argument and virtual memory address of page frame)
                                    ; |-----------------------|
                                    ; | (4293918719)_10       | <- %esp (3. argument and base address of page table)
                                    ; |-----------------------|

CALL mount_page_frame

POP %eax                            ; Remove 3. argument from STACK.
POP %eax                            ; Remove 2. argument from STACK.
POP %eax                            ; Remove 1. argument from STACK.

MOV $0, %eax                        ; Set exit code for program (sys_exit).
INT $0x1                            ; Call Kernel to exit the program.

; -----------------------------------------------------------------------------------------------------------------
; |                                         "search_available_page_frame"                                         |
; | ------------------------------------------------------------------------------------------------------------- |
; | This function returns a physical address of an available page frame or -1 if no page frame is available.      |
; | The result is saved to EBX register.                                                                          |
; -----------------------------------------------------------------------------------------------------------------
.search_available_page_frame:

                                    ; Current STACK
                                    ; |-----------------|
                                    ; | page_address    | <- %esp + 12 (virtual memory address of page)
                                    ; |-----------------|
                                    ; | (4292870142)_10 | <- %esp + 8 (1. argument)
                                    ; |-----------------|
                                    ; | (4293918718)_10 | <- %esp + 4 (2. argument)
                                    ; |-----------------|
                                    ; | return_address  | <- %esp
                                    ; |-----------------|

    PUSH %ebx                       ; Save content of EBX temporarily to STACK.
    MOV %esp, %ebx                  ; Move virtual memory address saved in ESP to EBX.
    ADD $8, %ebx                    ; Increase this virtual memory address by decimal 8.
    MOV *%ebx, %eax                 ; Write physical address of the first element (argument is located at %esp+8) from the list with available page frames to register EAX.
    POP %ebx                        ; Restore old content of EBX.

    PUSH $-1                        ; Initialize local variable which is used for saving the page frames address. -1 is returned, if there is no available page frame.

                                    ; Current STACK
                                    ; |-----------------|
                                    ; | page_address    | <- %esp + 16 (virtual memory address of page)
                                    ; |-----------------|
                                    ; | (4292870142)_10 | <- %esp + 12 (1. argument)
                                    ; |-----------------|
                                    ; | (4293918718)_10 | <- %esp + 8 (2. argument)
                                    ; |-----------------|
                                    ; | return_address  | <- %esp + 4
                                    ; |-----------------|
                                    ; | local_variable  | <- %esp
                                    ; |-----------------|

                                    ; Check if virtual memory address of currently examined entry is in range of the address space associated with the list.
    PUSH %ebx                       ; Save content of EBX temporarily to STACK.
    MOV %esp, %ebx                  ; Move virtual memory address saved in ESP to EBX.
    ADD $8, %ebx                    ; Increase this virtual memory address by decimal 8.
    CMP *%ebx, %eax                 ; Is virtual memory address of the currently observed element (stored in EAX) in range of list?
    POP %ebx                        ; Restore old content of EBX.
    JG found_available

    .loop_available:                ; Loop through list of available page frames, until the first available page frame (non zero entry) was found.
        CMP $0, *%eax               ; Check if currently examined page table entry is unequal to a decimal 0 (which means it is unavailable).
        JNZ found_available         ; Quit function.
        ADD $4, %eax                ; Add value of 4 to EAX in order to search the next doubleword-sized entry in the page table.

                                    ; Check if virtual memory address of currently examined entry is in range of the address space associated with the list.
        PUSH %ebx                   ; Save content of EBX temporarily to STACK.
        MOV %esp, %ebx              ; Move virtual memory address saved in ESP to EBX.
        ADD $8, %ebx                ; Increase this virtual memory address by decimal 8.
        CMP *%eax, %ebx             ; Current address in range of list?
        POP %ebx                    ; Restore old content of EBX.

        JLE loop_available
        JG error

    .error:
        ; TODO: Call Kernel to displace a page frame to an available background memory.
        ; INT $0x4

        ; For now just quit program with an error.
        MOV $-1, %eax
        INT $0x1
    
    .found_available:
        MOV *%eax, %esp             ; Move the address of available page frame to the local variable.
        MOV $0, *%eax               ; Remove the address of page frame found from the list of available page frames by setting it to zero.
    
    MOV *%esp, %ebx                 ; Save value from local variable with result to register EBX.
    
    POP %eax                        ; Remove local variable from STACK.
    MOV $0, %eax                    ; Delete value of local variable in EAX.
    IRET                             ; Return from this function.
; -----------------------------------------------------------------------------------------------------------------


; -----------------------------------------------------------------------------------------------------------------
; |                                          "add_to_used_page_frames"                                            |
; | --------------------------------------------------------------------------------------------------------------|
; | This function adds a physical address of an available page frame to the list of used page frames.             |
; -----------------------------------------------------------------------------------------------------------------
.add_to_used_page_frames:

    MOV *%esp, %eax                 ; Write first physical address of list with used page frames to register EAX.

    CMP %eax, *%esp                 ; Current address in range of list?
    JG return2

    .loop_used:                     ; Loop through list of used page frames, until an available slot (a zero entry) was found. 
        CMP $0, *%eax
        JZ found_empty
        ADD $4, %eax
        CMP %eax, *%esp             ; Current address in range of list?
        JLE loop_used
        JG return2

    .found_empty:
        MOV %ebx, *%eax             ; Move the address of the found page frame (located in EBX register) to the available space in the list of used page frames.
    
    .return2:

    RET                             ; Return from this function.
; -----------------------------------------------------------------------------------------------------------------

; -----------------------------------------------------------------------------------------------------------------
; |                                         "search_available_page_frame"                                         |
; | ------------------------------------------------------------------------------------------------------------- |
; | This function mounts a physical address of an available page frame to the given page.                         |
; -----------------------------------------------------------------------------------------------------------------
.mount_page_frame:

                                                        ; Current STACK
                                                        ; |-----------------------|
                                                        ; | page_address          | <- %esp + 8 (1. argument and virtual memory address of page)
                                                        ; |-----------------------|
                                                        ; | page_frame_address    | <- %esp +4 (2. argument and virtual memory address of page frame)
                                                        ; |-----------------------|
                                                        ; | (4293918719)_10       | <- %esp (3. argument and base address of page table)
                                                        ; |-----------------------|

    MOV %esp, %ebx                                      ; Copy current value of ESP register to EBX.
    ADD $8, %ebx                                        ; Add decimal 8 to the address EBX/ESP are currently pointing. Now EBX is pointing at %esp+8.
    AND $0b11111111111111111111000000000000, %ebx         ; Use bitmask to extract the base address of the page frame.
    ADD *%esp, %ebx                                     ; Add base address.
    ; TODO : Create page table entry with flag bits and assign the page frame address.

    RET
; -----------------------------------------------------------------------------------------------------------------