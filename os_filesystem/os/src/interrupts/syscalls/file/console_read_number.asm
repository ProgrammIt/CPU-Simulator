; SYSCALLS_CONSOLE_READ_NUMBER
; Parameters
;   none
; Return value:
;   eax     Number
;   ebx success status (0 = success, -1 = no input ready, -2 = could not parse number, -3 = number does not fit into 32 bit DoubleWord)

.SYSCALLS_CONSOLE_READ_NUMBER_WITH_ASSERTS:
.SYSCALLS_CONSOLE_READ_NUMBER:


    DEV $CONST_DEV_COMMAND_CONSOLE_BUFFER_STATUS, $0
    CMP $0, %eax
    JG _SKIP_BLOCKING

    MOV $CONST_OS_CURRENT_PCB_POINTER, %eax
    MOV *%eax, %eax;

    ; set process status to blocked for IO
    AND $0xFF00FFFF, *%eax ; mask the page table bytes and set status to zero
    MOV $CONST_OS_PROCESS_STATUS_IO_BLOCKED, %ecx
    SHL $16, %ecx ; move the status bit into the correct position
    OR %ecx, *%eax ; apply the process status
 
    
    CALL UTIL_SCHEDULER ; reschedule

    JMP SYSCALLS_CONSOLE_READ_NUMBER ; check again if buffer contains data race condition protection

    ._SKIP_BLOCKING:
    ;   9   0b00001001 console_read_number (op2=none)
    DEV $CONST_DEV_COMMAND_CONSOLE_READ_NUMBER, %eax
    RET