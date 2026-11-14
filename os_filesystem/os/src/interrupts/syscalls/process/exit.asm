; SYSCALLS_PROCESS_EXIT:
; Parameters
;   none
; Return value:
;   none
.SYSCALLS_PROCESS_EXIT_WITH_ASSERTS:
.SYSCALLS_PROCESS_EXIT:
    ; set status of current process to terminated

    MOV $CONST_OS_CURRENT_PCB_POINTER, %eax
    MOV *%eax, %eax ; pcb pointer

    ; set status bit to terminated
    ADD $1, %eax
    AND $0xFFFFFF, *%eax

    ; free all allocated frames for the process

    ADD $1, %eax ; point to page directory table base address in PCB
    MOV *%eax, %ebx ; directory table base address
    ; clear page tables and frames

    ; UTIL_CLEAR_PAGE_DIRECTORY_TABLE
    ; Parameters:
    ;   (ebx)     Pointer to the page directory table base address
    ; Return value (immediate value):
    ;   none
    CALL UTIL_CLEAR_PAGE_DIRECTORY_TABLE
    
    ; Let the simulator know the program exited and the memory has been cleaned up.
    ; This is needed to make sure the simulator can halt on program exit once all the clean up is done.
    ; Otherwise the simulator would halt while the program technically has not exited fully yet.
    DEV $CONST_DEV_COMMAND_PROGRAM_EXIT_SIGNAL, $0

    ; UTIL_SCHEDULER
    ; Parameters:
    ;   none     
    ; Return value :
    ;   none
    CALL UTIL_SCHEDULER

RET ; we should never reach this RET