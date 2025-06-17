; Kernel


; Memory layout (32 bit architecture, 4 GiB total)
; 0b11...   0xC0000000 - 0xFFFFFFFF - unused
; 0b10...   0x80000000 - 0xBFFFFFFF - unused
; 0b01...   0x40000000 - 0x7FFFFFFF - kernel space
; 0b00...   0x00000000 - 0x3FFFFFFF - user space

.BOOT:
    ; TODO improve debug messages
    ; debug message
    DEV $0b00001000, $8007
    MOV $0x30000000, %esp   ; initialize stack pointer just above user space ; TODO change back to higher address
    
    DEV $0b00001000, $1
    CALL TEST_RETURN
    DEV $0b00001000, $3
    
    CALL INIT_INTERRUPT_TABLE
    DEV $0b00001000, $4
    CALL INIT_PAGE_TABLE
    DEV $0b00001000, $5

    ; finish boot process
    JMP END


.TEST_RETURN:
    DEV $0b00001000, $2
    RET


.INIT_PAGE_TABLE:
    ; TODO improve debug messages
    ; debug message
    DEV $0b00001000, $301
    RET


.INIT_INTERRUPT_TABLE:
    ; TODO improve debug messages
    ; fill interrupt table beginning at 0x40000000
    MOV $0x40000000, %ebx ; start of interrupt table
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

    DEV $0b00001000, $300
    RET



; This routine executes the requested syscall handler based from the arguments on stack.
; Does not return. Always ends with IRET.
.INTERRUPT_HANDLER_SYSCALL:
    ; TODO improve debug messages
    ; debug print
    DEV $0b00001000, $200
    ; Make sure there are atleast 2 values on the stack. (return address and syscall number)
    ;MOV $2, %eax
    ;CALL ASSERT_VALID_STACK
    ; Syscalls use the DEV instruction which will pop from stack to load the arguments pushed by the program that triggered the syscall.
    ; However, since the INT instruction pushed the return address onto the stack,
    ; we must first save it and must push it on the stack again later before calling IRET.
    ;POP %ebx
    ; Load the requested syscall number from stack into %eax.
    ; The syscall numbers are equal to the DEV instruction command numbers from CPUCore.dev().
    ;POP %eax
    ; JMP into the corresponding syscall handler
    CMP $0, %eax
    JNE SKIP_SYSCALL_IO_SEEK
    CALL SYSCALL_IO_SEEK
    JMP END_SYSCALL
    .SKIP_SYSCALL_IO_SEEK:

    CMP $1, %eax
    JNE SKIP_SYSCALL_IO_CLOSE
    CALL SYSCALL_IO_CLOSE
    JMP END_SYSCALL
    .SKIP_SYSCALL_IO_CLOSE:

    CMP $2, %eax
    JNE SKIP_SYSCALL_IO_READ_BUFFER
    CALL SYSCALL_IO_READ_BUFFER
    JMP END_SYSCALL
    .SKIP_SYSCALL_IO_READ_BUFFER:

    CMP $3, %eax
    JNE SKIP_SYSCALL_IO_WRITE_BUFFER
    CALL SYSCALL_IO_WRITE_BUFFER
    JMP END_SYSCALL
    .SKIP_SYSCALL_IO_WRITE_BUFFER:

    CMP $4, %eax
    JNE SKIP_SYSCALL_FILE_CREATE
    CALL SYSCALL_FILE_CREATE
    JMP END_SYSCALL
    .SKIP_SYSCALL_FILE_CREATE:

    CMP $5, %eax
    JNE SKIP_SYSCALL_FILE_DELETE
    CALL SYSCALL_FILE_DELETE
    JMP END_SYSCALL
    .SKIP_SYSCALL_FILE_DELETE:

    CMP $6, %eax
    JNE SKIP_SYSCALL_FILE_OPEN
    CALL SYSCALL_FILE_OPEN
    JMP END_SYSCALL
    .SKIP_SYSCALL_FILE_OPEN:

    CMP $7, %eax
    JNE SKIP_SYSCALL_FILE_STAT
    CALL SYSCALL_FILE_STAT
    JMP END_SYSCALL
    .SKIP_SYSCALL_FILE_STAT:

    CMP $8, %eax
    JNE SKIP_SYSCALL_CONSOLE_PRINT_NUMBER
    CALL SYSCALL_CONSOLE_PRINT_NUMBER
    JMP END_SYSCALL
    .SKIP_SYSCALL_CONSOLE_PRINT_NUMBER:

    CMP $9, %eax
    JNE SKIP_SYSCALL_CONSOLE_READ_NUMBER
    CALL SYSCALL_CONSOLE_READ_NUMBER
    JMP END_SYSCALL
    .SKIP_SYSCALL_CONSOLE_READ_NUMBER:

    ; no syscall routine matched the given number
    JMP ERROR_UNKOWN_SYSCALL

    .END_SYSCALL:
    IRET

; ---------- Utility ----------

; Check if POP can be used <%eax> times without %esp reaching into kernel space.
; Overwrites %eax and %ebx.
; If stack is in kernel space, then IRET.
.ASSERT_VALID_STACK:
    MOV $0x40000000, %ebx; highest allowed stack address (zero elements on stack)
    DEV $8, %ebx
    MUL $4, %eax; 4 bytes per stack element
    SUB %eax, %ebx
    DEV $8, %ebx
    DEV $8, %esp
    CMP %esp, %ebx
    JL ERROR_SYSCALL_STACK_POINTER_IN_KERNELSPACE
    RET

.ASSERT_EBX_IN_USERSPACE:
    CMP $0x40000000, %ebx
    JG ERROR_POINTER_IN_KERNEL_SPACE
    RET

; ---------- Syscalls ----------

.SYSCALL_IO_SEEK:
    ; Make sure there are atleast 3 values on the stack. (file descriptor, seek offset, seek mode)
    MOV $3, %eax
    CALL ASSERT_VALID_STACK
    ; 0    00000000 - io_seek (fd=op2, offset=stack, mode=stack) -> success=eax
    ;          mode:   0 - Seek from current position
    ;              1 - Seek from start of file
    ;              2 - Seek from end of file
    POP %eax ; file descriptor
    DEV $0, %eax
    PUSH %eax
    RET

.SYSCALL_IO_CLOSE:
    RET

.SYSCALL_IO_READ_BUFFER:
    RET

.SYSCALL_IO_WRITE_BUFFER:
    RET

.SYSCALL_FILE_CREATE:
    RET

.SYSCALL_FILE_DELETE:
    RET

; ebx = filename_ptr
.SYSCALL_FILE_OPEN:
    ; TODO assert filename is fully in user space, not just the first byte
    CALL ASSERT_EBX_IN_USERSPACE
    ; 6    00000110 - file_open (filename_ptr=op2) -> fd=eax
    DEV $6, %ebx
    ; print the new filedescriptor for debugging
    DEV $8, %eax
    RET

.SYSCALL_FILE_STAT:
    RET

; print ebx
.SYSCALL_CONSOLE_PRINT_NUMBER:
    ; debug print
    DEV $0b00001000, $280
    ; 8    00001000 - console_print_number(number=op2)
    DEV $8, %ebx
    RET

.SYSCALL_CONSOLE_READ_NUMBER:
    RET




.INTERRUPT_HANDLER_PRIVILEGE_VIOLATION:
    DEV $0b00001000, $6666 ; console_print_number(number=op2)
    IRET


.INTERRUPT_HANDLER_PAGE_FAULT:
    DEV $0b00001000, $7777 ; console_print_number(number=op2)
    IRET


.INTERRUPT_HANDLER_CONSOLE_INPUT:
    DEV $0b00001000, $8888 ; console_print_number(number=op2)
    IRET




.ERROR_SYSCALL_STACK_POINTER_IN_KERNELSPACE:
    ; TODO better error logging
    ; debug print
    DEV $0b00001000, $400
    POP %eax
    JMP END_SYSCALL ; abort interrupt 

.ERROR_UNKOWN_SYSCALL:
    ; TODO better error logging
    ; debug print
    DEV $0b00001000, $401
    POP %eax
    JMP END_SYSCALL ; abort interrupt

.ERROR_POINTER_IN_KERNEL_SPACE:
    ; TODO better error logging
    ; debug print
    DEV $0b00001000, $402
    POP %eax
    JMP END_SYSCALL ; abort interrupt 

; SimulationController checks whether a program is done by checking if the next instruction is 0.
.END:
    DEV $0b01000, $9999
    MOV $10000, %eip ; should be zero and therefore mark the end of the boot procedure