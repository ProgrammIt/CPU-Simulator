; Kernel

.BOOT:
    ; debug message
    DEV $0b00001000, $42 ; console_print_number(number=op2)

    ; fill interrupt table beginning at 0xC0000000
    MOV $0xFFFF, %eax ; start of interrupt table
    MOV %eax, %itp
    MOV .INTERRUPT_HANDLER_SYSCALL, %eax
    ADD $4, %eax
    MOV .INTERRUPT_HANDLER_PRIVILEGE_VIOLATION, %eax
    ADD $4, %eax
    MOV .INTERRUPT_HANDLER_PAGE_FAULT, %eax
    ADD $4, %eax
    MOV .INTERRUPT_HANDLER_CONSOLE_INPUT, %eax
    ADD $4, %eax




.INTERRUPT_HANDLER_SYSCALL:
    DEV $0b00001000, $80 ; console_print_number(number=op2)


.INTERRUPT_HANDLER_PRIVILEGE_VIOLATION:
    DEV $0b00001000, $70 ; console_print_number(number=op2)


.INTERRUPT_HANDLER_PAGE_FAULT:
    DEV $0b00001000, $60 ; console_print_number(number=op2)


.INTERRUPT_HANDLER_CONSOLE_INPUT:
    DEV $0b00001000, $50 ; console_print_number(number=op2)


