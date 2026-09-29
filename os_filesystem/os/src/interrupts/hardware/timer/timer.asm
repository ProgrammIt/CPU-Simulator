; Interrupt ISR for the Timer Interrupt (0x20)

.INTERRUPTS_TIMER:

    PUSH %eax
    PUSH %ebx
    PUSH %ecx

    ; switch from interrupt stack to kernel stack

    MOV %esp, %eax

    MOV $CONST_OS_CURRENT_PCB_POINTER, %ecx

    MOV *%ecx, %ecx ; pcb pointer
    ADD $CONST_OS_PCB_KERNEL_STACK_TOP_OFFSET, %ecx
    MOV %ecx, %esp ; switch stack pointer

    ADD $20, %eax   ; pointer to old esp
    PUSH *%eax       ; push old esp

    SUB $4, %eax    ; pointer to old eflags
    PUSH *%eax       ; push old eflags

    SUB $4, %eax    ; pointer to old eip
    PUSH *%eax       ; push old eip

    SUB $4, %eax    ; pointer to old eax
    PUSH *%eax       ; push old eax

    SUB $4, %eax    ; pointer to old ebx
    PUSH *%eax       ; push old ebx

    SUB $4, %eax    ; pointer to old ecx
    PUSH *%eax       ; push old ecx

    DEV $CONST_DEV_COMMAND_TIMER_GET_FINISHED, %eax

    ; %eax = timer id

    CMP $255, %eax
    JA _INTERRUPTS_TIMER_RETURN ; error invalid id


    MOV $CONST_OS_PROCESS_BLOCKED_TIMER_QUEUE_START, %ebx

    ADD %eax, %ebx

    ; get pid of entry at index ecx

    MOV *%ebx, %eax
    SHR $24, %eax

    ; eax = pid at blocked index id

    ; free the entry (set to 0)

    AND $0xFFFFFF, *%ebx

    CMP $0, %eax
    JE _INTERRUPTS_TIMER_RETURN ; invalid pid

    ; get the pcb

    MOV $CONST_OS_PCB_LIST_START, %ecx

    SHL $CONST_OS_PCB_BIT_SIZE, %eax ; eax = offset

    ADD %eax, %ecx

    ; ecx = pcb pointer

    ADD $1, %ecx ; get status bit

    AND $0xFFFFFF, *%ecx
    MOV $CONST_OS_PROCESS_STATUS_WAITING, %ebx
    SHL $24, %ebx
    OR %ebx, *%ecx ; set to waiting

    ; add to waiting queue

    SUB $1, %ecx
    MOV *%ecx, %ebx
    SHR $24, %ebx

    ; ebx = pid

    ; add process to the waiting queue

    CMP $2, %ebx ; idle process should not be added to the waiting list
    JE _INTERRUPTS_TIMER_RETURN

    MOV $CONST_OS_PROCESS_WAITING_QUEUE_START, %ecx

    SUB $1, %ecx

    ._INTERRUPTS_TIMER_SEARCH_WAITING_LIST:
        ADD $1, %ecx
        CMP $0, *%ecx
        JNE _INTERRUPTS_TIMER_SEARCH_WAITING_LIST

        SHL $24, %ebx
        AND $0xFFFFFF, *%ecx  
        OR %ebx, *%ecx ; add the current process to the end of the waiting queue   
        JMP _INTERRUPTS_TIMER_RETURN

._INTERRUPTS_TIMER_RETURN:
    POP %ecx
    POP %ebx
    POP %eax

    IRET
