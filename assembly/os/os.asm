; Kernel

.BOOT:
    ; debug message
    DEV $0b00001000, $42 ; console_print_number(number=op2)

    ; fill interrupt table beginning at 0xC0000000
    MOV $0x30, %eax ; start of interrupt table
    MOV %eax, %itp

    MOV INTERRUPT_HANDLER_SYSCALL, %eax
    DEV $0b01000, %eax
    ADD $4, %eax

    MOV INTERRUPT_HANDLER_PRIVILEGE_VIOLATION, %eax
    DEV $0b01000, %eax
    ADD $4, %eax

    MOV INTERRUPT_HANDLER_PAGE_FAULT, %eax
    DEV $0b01000, %eax
    ADD $4, %eax

    MOV INTERRUPT_HANDLER_CONSOLE_INPUT, %eax
    DEV $0b01000, %eax

    DEV $0b01000, %itp

    ; finish boot process
    JMP END




.INTERRUPT_HANDLER_SYSCALL:
    DEV $0b00001000, $80 ; console_print_number(number=op2)


.INTERRUPT_HANDLER_PRIVILEGE_VIOLATION:
    DEV $0b00001000, $70 ; console_print_number(number=op2)


.INTERRUPT_HANDLER_PAGE_FAULT:
    DEV $0b00001000, $60 ; console_print_number(number=op2)


.INTERRUPT_HANDLER_CONSOLE_INPUT:
    DEV $0b00001000, $50 ; console_print_number(number=op2)




; this must be at the end of the file because SimulationController checks whether a program is done
; by checking if the next instruction is 0, which is usually the case at the end of the program.
.END:
    DEV $0b01000, $43