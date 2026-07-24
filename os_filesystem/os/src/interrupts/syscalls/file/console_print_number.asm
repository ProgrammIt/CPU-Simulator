; SYSCALLS_CONSOLE_PRINT_NUMBER
; Parameters (ebx is used as immediate value):
;   ebx     Number
; Return value:
;   none
.SYSCALLS_CONSOLE_PRINT_NUMBER_WITH_ASSERTS:
.SYSCALLS_CONSOLE_PRINT_NUMBER:

    ; 8 0b00001000 console_print_number (number=op2)
    DEV $CONST_DEV_COMMAND_CONSOLE_PRINT_NUMBER, %ebx
    RET