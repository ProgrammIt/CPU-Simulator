; Interrupt ISR for keyboard hardware interrupt (0x81)

.INTERRUPTS_KEYBOARD:

    ; save register
    PUSH %eax
    PUSH %ebx
    PUSH %ecx

    MOV $CONST_OS_PROCESS_BLOCKED_IO_QUEUE_START, %ebx

    ; get pid of first entry

    MOV *%ebx, %eax
    SHR $24, %eax ; pid of first entry

    AND $0xFFFFFF, *%ebx ; clear the entry

    CMP $0, %eax
    JE _INTERRUPTS_KEYBOARD_RETURN ; invalid pid
    
    MOV $CONST_OS_PCB_MAPPING_TABLE_START, %ecx ; get the pcb list start

    ; eax = pid of IO blocked process
    ; ecx = start of pcb mapping list
    ; ebx = pid of pcb entry

    ._INTERRUPTS_KEYBOARD_FIND_PCB:
        MOV *%ecx, %ebx ; pcb pointer
        MOV *%ebx, %ebx ; pcb entry
        SHR $24, %ebx ; isolate pid
        ADD $4, %ecx
        CMP %ebx, %eax ; compare pid of blocked process with pid of pcb        
        JNE _INTERRUPTS_KEYBOARD_FIND_PCB

    SUB $4, %ecx
    MOV *%ecx, %ecx
    ; eax = pid of blocked process
    ; ecx = pcb pointer of blocked process


    ; set status to zero, shift new status into right position and set process to waiting
    AND $0xFF00FFFF, *%ecx
    MOV $CONST_OS_PROCESS_STATUS_WAITING, %ebx
    SHL $16, %ebx
    OR %ebx, *%ecx

    MOV %eax, %ebx ; save pid in ebx

    ;MOV *%ecx, %ebx
    ;SHR $24, %ebx

    ; add the process at the end of the waiting queue

    MOV $CONST_OS_PROCESS_WAITING_QUEUE_START, %ecx


    SUB $1, %ecx


    ._INTERRUPTS_KEYBOARD_SEARCH_WAITING_LIST:
        ; iterate through waiting list, Isolate pid of entry, find free entry (pid = 0)
        ADD $1, %ecx
        ;MOV *%ecx, %eax
        ;SHR $24, %eax
        ;CMP $0, %eax
        CMP $0, *%ecx
        JNE _INTERRUPTS_KEYBOARD_SEARCH_WAITING_LIST

        ; Move pid into position, clear pid of entry, set new pid
        SHL $24, %ebx
        AND $0xFFFFFF, *%ecx  
        OR %ebx, *%ecx

    ; clean up blocked queue for IO

    MOV $CONST_OS_PROCESS_BLOCKED_IO_QUEUE_START, %ecx
    SUB $1, %ecx

    ._INTERRUPTS_KEYBOARD_UPDATE_BLOCKED_IO_QUEUE:
        ADD $1, %ecx

        ; end of blocked io queue reached
        CMP $CONST_OS_PROCESS_BLOCKED_IO_QUEUE_END, %ecx
        JE _INTERRUPTS_KEYBOARD_UPDATE_BLOCKED_IO_QUEUE_SKIP

        MOV %ecx, %ebx
        ADD $1, %ebx
        MOV *%ebx, %ebx
        ; keep pid, clear rest
        AND $0xFF000000, %ebx
        ; keep rest, clear pid
        AND $0xFFFFFF, *%ecx
        ; set pid of element
        OR %ebx, *%ecx
        ; check if last element of list is reached
        SHR $24, %ebx
        CMP $0, %ebx
        JNE _INTERRUPTS_KEYBOARD_UPDATE_BLOCKED_IO_QUEUE

    ._INTERRUPTS_KEYBOARD_UPDATE_BLOCKED_IO_QUEUE_SKIP:

    
._INTERRUPTS_KEYBOARD_RETURN:
    POP %ecx
    POP %ebx
    POP %eax

    IRET