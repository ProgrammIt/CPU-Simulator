; Author: Erik Burmester <erik.burmester@nextbeam.net>
; Created at: 2024-12-21
; Last modified at: 2024-12-21

; ---------------------------------------------------- Warning ----------------------------------------------------
; | This program is part of the operating systems kernel.                                                         |
; | Do NOT change this file unless you know what you are doing!                                                   |
; -----------------------------------------------------------------------------------------------------------------

; -------------------------------------------------- Description --------------------------------------------------
; | This interrupt handler takes the page frame to unmount from the EBX register, removes it from the list of     |
; | used and adds it to the list of available page frames.                                                        |
; |                                                                                                               |
; | This interrupt handler is assigned to the number 0x3.                                                         |
; -----------------------------------------------------------------------------------------------------------------

; Put an argument on the STACK.
PUSH @4291821565                            ; This value represents the first address of the list with used page frames.

CALL remove_page_frame_from_list_of_used    ; Call function to search for any available page frame.

POP %eax                                    ; Remove argument from STACK.

; Put an argument on the STACK.
PUSH @4292870142                            ; This value represents the first address of the list with available page frames.

CALL add_page_frame_to_list_of_available    ; Call function to search for any available page frame.

POP %eax                                    ; Remove argument from STACK.

IRET

; -----------------------------------------------------------------------------------------------------------------
; |                                     "remove_page_frame_from_list_of_used"                                     |
; | ------------------------------------------------------------------------------------------------------------- |
; | This function removes a given page frame from the lis of used page frames.                                    |
; -----------------------------------------------------------------------------------------------------------------
.remove_page_frame_from_list_of_used:

    PUSH %ebx                               ; Save content of EBX temporarily to STACK.
    MOV %esp, %ebx                          ; Move virtual memory address saved in ESP to EBX.
    ADD $4, %ebx                            ; Increase this virtual memory address by decimal 4 (because first arguement is stored at %esp+4).
    MOV *%ebx, %eax                         ; Write first physical address of list with used page frames to register EAX.
    POP %ebx                                ; Restore old content of EBX.

    .loop_used:                             ; Loop through list of used page frames, until the entry containing the page frame was found.
        CMP *%eax, %ebx                     ; Compare the entry's value EAX is pointing at, with the page frame to unmount.
        JE remove_entry
        ADD $4, %eax
        CMP %eax, *%esp                     ; Current address in range of list?
        JLE loop_used
        JG error

    .error:
        ; Quit program with an error, because page frame is not present in list of used page frames.
        MOV $-1, %eax
        INT $0x1 
    
    .remove_entry:
        MOV $0, *%eax                       ; Remove the address of page frame from the list of used page frames by setting it to 0b0.

    RET
; -----------------------------------------------------------------------------------------------------------------


; -----------------------------------------------------------------------------------------------------------------
; |                                     "add_page_frame_to_list_of_available"                                     |
; | ------------------------------------------------------------------------------------------------------------- |
; | This function adds a given page frame to the lis of available page frames.                                    |
; -----------------------------------------------------------------------------------------------------------------
.add_page_frame_to_list_of_available:
    
    MOV *%esp, %eax                         ; Write first physical address of list with available page frames to register EAX.

    .loop_available:                        ; Loop through list of available page frames, until an empty slot (a zero entry) was found.
        CMP $0, *%eax                       ; Compare the entry's value EAX is pointing at, with the page frame to unmount.
        JZ add_entry
        ADD $4, %eax
        JMP loop_available
    
    .add_entry:
        MOV %ebx, *%eax                      ; Add the available page frame stored in EBX to the list of available page frames.

    RET
; -----------------------------------------------------------------------------------------------------------------