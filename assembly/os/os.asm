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
; This procedure overwrites %eax and %ebx.
; If stack is in kernel space, then IRET.
.ASSERT_VALID_STACK:
    MOV $0x40000000, %ebx; highest allowed stack address (zero elements on stack)
    CALL PRINT_EBX
    MUL $4, %eax; 4 bytes per stack element
    SUB %eax, %ebx
    DEV $8, %ebx
    DEV $8, %esp
    CMP %esp, %ebx
    JL ERROR_SYSCALL_STACK_POINTER_IN_KERNELSPACE
    RET

.ASSERT_EAX_IN_USERSPACE:
    CMP $0x40000000, %eax
    JG ERROR_POINTER_IN_KERNEL_SPACE
    RET

.ASSERT_EBX_IN_USERSPACE:
    CMP $0x40000000, %ebx
    JG ERROR_POINTER_IN_KERNEL_SPACE
    RET

; Check if (%ebx + %eax) is still within user space.
; This procedure is used to guard against kernel information leakage if malicous programs requested syscalls with pointers to kernel space.
; This procedure does not change any registers.
; If (%ebx + <%eax>) is in kernel space, then IRET.
.ASSERT_EBX_IN_USERSPACE_WITH_OFFSET:
    ADD %eax, %ebx
    CMP $0x40000000, %ebx
    SUB %eax, %ebx
    JG ERROR_POINTER_IN_KERNEL_SPACE
    RET

.PRINT_EAX:
    DEV $8, %eax
    RET

.PRINT_EBX:
    DEV $8, %ebx
    RET

.PRINT_ECX:
    DEV $8, %ecx
    RET

; Check if every byte starting at the given pointer in %ebx before the next null byte is in user space.
; Overwrites EAX, does not modify EBX and ECX.
.ASSERT_ZERO_TERMINATED_FILENAME_IN_USERSPACE:
    MOV %ebx, %eax

    .FILENAME_ASSERT_LOOP:
    CMP $0, *%eax
    JE FINISH_FILENAME_ASSERT
    CALL ASSERT_EAX_IN_USERSPACE
    ADD $1, %eax
    JMP FILENAME_ASSERT_LOOP

    .FINISH_FILENAME_ASSERT:
    RET


; ---------- Syscalls ----------

; SYSCALL_IO_SEEK
; Parameters (ebx is a pointer to the following struct):
;   *(ebx)     file descriptor
;   *(ebx+4)   seek offset
;   *(ebx+8)   seek mode (0 - Seek from current position, 1 - Seek from start of file, 2 - Seek from end of file)
; Return value (immediate value):
;   eax     success status (0 = success, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = negative seek position)
.SYSCALL_IO_SEEK:
    ; Check whether all user-provided data is within user space (file descriptor, seek offset, seek mode)
    MOV $12, %eax
    CALL ASSERT_EBX_IN_USERSPACE_WITH_OFFSET

    ; move syscall arguments onto stack as the DEV instruction requires it for io_seek
    ;   ebx+4     offset
    MOV %ebx, %eax
    ADD $4, %eax
    PUSH *%eax
    ;   ebx+8     mode
    ADD $4, %eax
    PUSH *%eax

    ; 0    00000000 - io_seek (fd=op2, offset=stack, mode=stack) -> success=eax
    ;          mode:   0 - Seek from current position
    ;              1 - Seek from start of file
    ;              2 - Seek from end of file
    DEV $0, %ebx
    ; print success status for debugging
    CALL PRINT_EAX
    RET


; SYSCALL_IO_CLOSE
; Parameters (ebx is used as a immediate value):
;   ebx     file descriptor
; Return value:
;   None
.SYSCALL_IO_CLOSE:
    ; Check whether all user-provided data is within user space (file descriptor)
    MOV $4, %eax
    CALL ASSERT_EBX_IN_USERSPACE_WITH_OFFSET

    ; 1    00000001 - io_close (fd=op2)
    DEV $1, %ebx
    RET


; SYSCALL_IO_READ_BUFFER
; Parameters (ebx is a pointer to the following struct):
;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
;   *(ebx+4)   pointer to buffer, this buffer will be filled by the file system
;   *(ebx+8)   buffer size, limits the amount of bytes that will be read
; Return value (immediate value):
;   eax     success status (>=0 = number of bytes read, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = no console input ready)
.SYSCALL_IO_READ_BUFFER:
    ; Check if all user-provided arguments are within user space (file descriptor, buffer_ptr, buffer_size)
    MOV $12, %eax
    CALL ASSERT_EBX_IN_USERSPACE_WITH_OFFSET

    ; move user-provided arguments onto stack (required for DEV instruction)
    ;   ebx+4   pointer to buffer
    MOV %ebx, %eax
    ADD $4, %eax
    PUSH *%eax
    ;   ebx+8   buffer size
    ADD $4, %eax
    PUSH *%eax

    ; Check if user-given buffer is completely within user space
    ; Calculate highest address of the buffer: %ecx = buffer_ptr + buffer_size   ebx+4 + ebx+8
    
    ; eax currently holds address of buffer_size argument
    ; Dereference buffer_size and save into ecx
    MOV *%eax, %ecx 
    ; Move eax back onto buffer_ptr address
    SUB $4, %eax
    ; Dereference buffer_ptr and save into eax
    MOV *%eax, %eax
    ; Calculate buffer_ptr + buffer_size
    ADD %ecx, %eax
    CALL ASSERT_EAX_IN_USERSPACE
    
    ; 2    00000010 - io_read_buffer (fd=op2, buffer_ptr=stack, buffer_size=stack) -> bytes_read=eax
    DEV $2, *%ebx

    ; print success status for debugging
    CALL PRINT_EAX
    RET


; SYSCALL_IO_WRITE_BUFFER
; Parameters (ebx is a pointer to the following struct):
;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
;   *(ebx+4)   pointer to buffer, this buffer will be used by the file system
;   *(ebx+8)   buffer size, limits the amount of bytes that will be written
; Return value (immediate value):
;   eax     success status (>=0 = number of bytes written, -1 = invalid file descriptor, -2 = seek position out of file bounds)
.SYSCALL_IO_WRITE_BUFFER:
    ; Check if all user-provided arguments are within user space (file descriptor, buffer_ptr, buffer_size)
    MOV $12, %eax
    ;CALL ASSERT_EBX_IN_USERSPACE_WITH_OFFSET

    ; move user-provided arguments onto stack (required for DEV instruction)
    ;   ebx+4   pointer to buffer
    MOV %ebx, %eax
    ADD $4, %eax
    PUSH *%eax
    ;   ebx+8   buffer size
    ADD $4, %eax
    PUSH *%eax

    ; Check if user-given buffer is completely within user space
    ; Calculate highest address of the buffer: %ecx = buffer_ptr + buffer_size   ebx+4 + ebx+8
    
    ; eax currently holds address of buffer_size argument
    ; Dereference buffer_size and save into ecx
    MOV *%eax, %ecx 
    ; Move eax back onto buffer_ptr address
    SUB $4, %eax
    ; Dereference buffer_ptr and save into eax
    MOV *%eax, %eax
    ; Calculate buffer_ptr + buffer_size
    ADD %ecx, %eax
    CALL ASSERT_EAX_IN_USERSPACE
    
    ; 3    00000011 - io_write_buffer (fd=op2, buffer_ptr=stack, buffer_size=stack) -> bytes_written=eax
    DEV $3, *%ebx

    ; print success status for debugging
    CALL PRINT_EAX
    RET


; SYSCALL_FILE_CREATE
; Parameters (ebx is a pointer to the start of an ASCII filename):
;   (ebx)     Pointer to a ASCII filename
; Return value (immediate value):
;   None
.SYSCALL_FILE_CREATE:
    CALL ASSERT_ZERO_TERMINATED_FILENAME_IN_USERSPACE
    ; 4    00000100 - file_create (filename_ptr=op2)
    DEV $4, %ebx
    RET


; SYSCALL_FILE_DELETE
; Parameters (ebx is a pointer to the start of an ASCII filename):
;   (ebx)     Pointer to a ASCII filename
; Return value (immediate value):
;   eax     success status (0 = success, -1 = file did not exist)
.SYSCALL_FILE_DELETE:
    CALL ASSERT_ZERO_TERMINATED_FILENAME_IN_USERSPACE
    ; 5    00000101 - file_delete (filename_ptr=op2) -> success=eax
    DEV $5, %ebx
    RET


; SYSCALL_FILE_OPEN
; Parameters (ebx is a pointer to the start of an ASCII filename):
;   (ebx)     Pointer to a ASCII filename
; Return value (immediate value):
;   eax     file descriptor
.SYSCALL_FILE_OPEN:
    CALL ASSERT_ZERO_TERMINATED_FILENAME_IN_USERSPACE
    ; 6    00000110 - file_open (filename_ptr=op2) -> fd=eax
    DEV $6, %ebx
    ; print the new filedescriptor for debugging
    CALL PRINT_EAX
    RET


; SYSCALL_FILE_STAT
; Parameters (ebx is a pointer to the start of an ASCII filename):
;   (ebx)     Pointer to a ASCII filename
; Return value (immediate value):
;   eax     file length or error code (>=0 = length, -1 = file already exists, -2 = not a file)
.SYSCALL_FILE_STAT:
    CALL ASSERT_ZERO_TERMINATED_FILENAME_IN_USERSPACE
    ; 7    00000111 - file_stat (filename_ptr=op2) -> file_length=eax
    DEV $7, %ebx
    ; print the length
    CALL PRINT_EBX
    RET


; SYSCALL_CONSOLE_READ_NUMBER
; Parameters (immediate value):
;   (ebx)     number to print
; Return value:
;   none
.SYSCALL_CONSOLE_PRINT_NUMBER:
    ; 8    00001000 - console_print_number(number=op2)
    DEV $8, %ebx
    RET


; SYSCALL_CONSOLE_READ_NUMBER
; Parameters:
;   none
; Return value (immediate value):
;   eax     number
;   ebx     success status (0=success, -1=no input ready, -2=could not parse number, -3=number does not fit into signed 32 bit DoubleWord)
.SYSCALL_CONSOLE_READ_NUMBER:
    ; 9    00001001 - console_read_number() -> number=eax, error=ebx
    DEV $9, $0
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