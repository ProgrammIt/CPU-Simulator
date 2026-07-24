; Interrupt ISR for the periodic timer interrupt (0x21)

.INTERRUPTS_PERIODIC_TIMER:

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



    MOV $CONST_OS_CURRENT_PCB_POINTER, %eax
    MOV *%eax, %eax ; pcb pointer

    ; Get time slice counter, decrement by one and check if rescheduling is needed
    ADD $CONST_OS_PCB_TIME_SLICE_COUNTER_OFFSET, %eax
    MOV *%eax, %ebx
    SHR $16, %ebx ; isolate counter
    SUB $1, %ebx
    CMP $0, %ebx
    JE _INTERRUPTS_PERIODIC_TIMER_RESCHEDULE

    SHL $16, %ebx
    AND $0xFFFF, *%eax
    OR %ebx, *%eax ; set counter
    JMP _INTERRUPTS_PERIODIC_TIMER_RETURN

    ._INTERRUPTS_PERIODIC_TIMER_RESCHEDULE:

        CALL UTIL_SCHEDULER

._INTERRUPTS_PERIODIC_TIMER_RETURN:
    POP %ecx
    POP %ebx
    POP %eax
    IRET
    
    

