; SYSCALLS_TIMER_START
; Parameters:
;   (ebx)     Time to wait
; Return value:
;   eax     success status (0 = success, -1 = error)
.SYSCALLS_TIMER_START_WITH_ASSERTS:
.SYSCALLS_TIMER_START:


    PUSH %ebx

    MOV $CONST_OS_CURRENT_PCB_POINTER, %eax
    MOV *%eax, %eax ; pcb pointer

    ; set status to blocked
    ADD $1, %eax
    AND $0xFFFFFF, *%eax

    MOV $CONST_OS_PROCESS_STATUS_TIMER_BLOCKED, %ebx
    SHL $24, %ebx
    OR %ebx, *%eax

    ; find free entry in the blocked list and use the index as the id

    MOV $CONST_OS_PROCESS_BLOCKED_TIMER_QUEUE_START, %ebx

    ._SYSCALLS_TIMER_START_FIND_FREE:

    MOV *%ebx, %ecx
    SHR $24, %ecx ; pid at blocked list entry ebx

    CMP $0, %ecx
    JE _SYSCALLS_TIMER_START_FOUND_FREE
    ADD $1, %ebx
    CMP $CONST_OS_PROCESS_BLOCKED_TIMER_QUEUE_END, %ebx
    JA _SYSCALLS_TIMER_START_ERROR
    JMP _SYSCALLS_TIMER_START_FIND_FREE

    ._SYSCALLS_TIMER_START_FOUND_FREE:

    SUB $CONST_OS_PROCESS_BLOCKED_TIMER_QUEUE_START, %ebx

    ; ebx = list index

    ;  - timer_set (id=op2, time=stack)
    DEV $CONST_DEV_COMMAND_TIMER_SET, %ebx

    ; reschedule

    ; UTIL_SCHEDULER
    ; Parameters:
    ;   none     
    ; Return value :
    ;   none
    CALL UTIL_SCHEDULER

    MOV $0, %eax
    RET

._SYSCALLS_TIMER_START_ERROR:
    MOV $-1, %eax
    RET
