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

; Put two arguments on the STACK.
PUSH $4292870142                    ; This value represents the first address of the list with available page frames.
PUSH $4293918718                    ; This value represents the last address of the list with available page frames.

CALL search_available_page_frame    ; Call function to search for any available page frame.

POP %eax                            ; Remove second argument from STACK.
POP %eax                            ; Remove first argument from STACK.

CMP $-1, %ebx                       ; Check if page frame address was found.
JE error_exit                       ; Exit program with error code if no page frame is available.

; Put an argument on the STACK.
PUSH $4291821565                    ; This value represents the first address of the list with used page frames.

CALL add_to_used_page_frames        ; Call function to add available page frame to the list containing used page frames.

POP %eax                            ; Remove argument from STACK.

MOV $0, %eax                        ; Set exit code for program (sys_exit).
INT $0x1                            ; Call Kernel to exit the program.

; -----------------------------------------------------------------------------------------------------------------
; |                                         "search_available_page_frame"                                         |
; | ------------------------------------------------------------------------------------------------------------- |
; | This function returns a physical address of an available page frame or -1 if no page frame is available.      |
; | The result is saved to EBX register.                                                                          |
; -----------------------------------------------------------------------------------------------------------------
.search_available_page_frame:

    MOV *(%esp+8), %eax             ; Write first physical address of list with available page frames to register EAX.

    PUSH $-1                        ; Initialize local variable which is used for saving the page frames address. -1 is returned, if there is no available page frame.

    CMP %eax, *(%esp+4)             ; Current address in range of list?
    JG return1

    .loop_available:                ; Loop through list of available page frames, until the first available page frame (non zero entry) was found.
        CMP $0, *%eax
        JNZ found_available
        ADD $4, %eax
        CMP %eax, *(%esp+4)         ; Current address in range of list?
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
    
    MOV *%esp, %ebx             ; Save value from local variable with result to register EBX.
    
    POP %eax                        ; Remove local variable from STACK.
    MOV $0, %eax                    ; Delete value of local variable.
    RET                             ; Return from this function.
; -----------------------------------------------------------------------------------------------------------------


; -----------------------------------------------------------------------------------------------------------------
; |                                          "add_to_used_page_frames"                                            |
; | --------------------------------------------------------------------------------------------------------------|
; | This function adds a physical address of an available page frame to the list of used page frames.             |
; -----------------------------------------------------------------------------------------------------------------
.add_to_used_page_frames:

    MOV *%esp, %eax             ; Write first physical address of list with used page frames to register EAX.

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