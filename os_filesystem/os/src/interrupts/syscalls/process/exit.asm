; SYSCALLS_PROCESS_EXIT:
; Parameters
;   none
; Return value:
;   none
.SYSCALLS_PROCESS_EXIT_WITH_ASSERTS:
.SYSCALLS_PROCESS_EXIT:
    DEV $CONST_DEV_COMMAND_PERFORMANCE_TIMER_START, $4
    ; set status of current process to terminated

    MOV $CONST_OS_CURRENT_PCB_POINTER, %eax
    MOV *%eax, %eax ; pcb pointer

    ; get pid
    MOV *%eax, %ebx
    AND $0xFF000000, %ebx
    SHR $24, %ebx
    ; ebx = pid

    ; set status bit to terminated
    ADD $1, %eax
    AND $0xFFFFFF, *%eax

    ; free all allocated frames for the process

    MOV $CONST_OS_MEMORY_MAP_START, %eax

    ._SYSCALLS_PROCESS_EXIT_FIND_FRAMES: 
        MOV *%eax, %ecx
        SHR $24, %ecx   
        CMP %ebx, %ecx ; is this frame mapped to the current process ?
        JE _SYSCALLS_PROCESS_EXIT_FREE_FRAME

        ;CMP $CONST_OS_MEMORY_MAP_END, %eax ; are we at the end ? (this is to slow)
        SUB $CONST_OS_MEMORY_MAP_START, %eax
        CMP $256, %eax ; are we at the end ?
        JE _SYSCALLS_PROCESS_EXIT_FREE_FRAMES_DONE
       
        ADD $CONST_OS_MEMORY_MAP_START, %eax
        ADD $1, %eax
        JMP _SYSCALLS_PROCESS_EXIT_FIND_FRAMES

    ._SYSCALLS_PROCESS_EXIT_FREE_FRAME: 
        PUSH %ebx
        PUSH %eax
        MOV %eax, %ebx
        SUB $CONST_OS_MEMORY_MAP_START, %ebx
        SHL $CONST_OS_FRAME_BIT_SIZE, %ebx

        ; UTIL_CLEAR_FRAME
        ; Parameters:
        ;   (ebx)     Pointer to the frame base address
        ; Return value (immediate value):
        ;   none
        CALL UTIL_CLEAR_FRAME ; override frame with 0s
        POP %eax
        AND $0xFFFFFF, *%eax 
        ADD $1, %eax
        POP %ebx
        JMP _SYSCALLS_PROCESS_EXIT_FIND_FRAMES


    ._SYSCALLS_PROCESS_EXIT_FREE_FRAMES_DONE:

    DEV $CONST_DEV_COMMAND_PERFORMANCE_TIMER_STOP, $4 ; measure the time it takes to exit a process and free resources
    ; UTIL_SCHEDULER
    ; Parameters:
    ;   none     
    ; Return value :
    ;   none
    CALL UTIL_SCHEDULER

RET ; we should never reach this RET