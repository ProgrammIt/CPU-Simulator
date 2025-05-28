; Kernel

.BOOT:
    ; debug message
    DEV $0b00001000, $8007 ; console_print_number(number=op2)

    ; fill interrupt table beginning at 0xC0000000
    MOV $0x30, %ebx ; start of interrupt table
    MOV %ebx, %itp
    DEV $0b01000, %itp 

    DEV $0b01000, %ebx
    MOV INTERRUPT_HANDLER_SYSCALL, *%ebx
    DEV $0b01000, *%ebx 
    ADD $4, %ebx

    DEV $0b01000, %ebx
    MOV INTERRUPT_HANDLER_PRIVILEGE_VIOLATION, *%ebx
    DEV $0b01000, *%ebx 
    ADD $4, %ebx

    DEV $0b01000, %ebx
    MOV INTERRUPT_HANDLER_PAGE_FAULT, *%ebx
    DEV $0b01000, *%ebx 
    ADD $4, %ebx

    DEV $0b01000, %ebx
    MOV INTERRUPT_HANDLER_CONSOLE_INPUT, *%ebx
    DEV $0b01000, *%ebx 
    ADD $4, %ebx

    ; finish boot process
    JMP END




.INTERRUPT_HANDLER_SYSCALL:
    DEV $0b00001000, $5555 ; console_print_number(number=op2)
    IRET


.INTERRUPT_HANDLER_PRIVILEGE_VIOLATION:
    DEV $0b00001000, $6666 ; console_print_number(number=op2)
    IRET


.INTERRUPT_HANDLER_PAGE_FAULT:
    DEV $0b00001000, $7777 ; console_print_number(number=op2)
    IRET


.INTERRUPT_HANDLER_CONSOLE_INPUT:
    DEV $0b00001000, $8888 ; console_print_number(number=op2)
    IRET



; this must be at the end of the file because SimulationController checks whether a program is done
; by checking if the next instruction is 0, which is usually the case at the end of the program.
.END:
    DEV $0b01000, $8007