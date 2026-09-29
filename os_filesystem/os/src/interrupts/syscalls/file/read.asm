; SYSCALLS_FILE_READ
; Parameters (ebx is a pointer to the following struct):
;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
;   *(ebx+4)   pointer to buffer, this buffer will be filled by the file system
;   *(ebx+8)   buffer size, limits the amount of bytes that will be read
; Return value (immediate value):
;   eax     success status (>=0 = number of bytes read, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = no console input ready)
.SYSCALLS_FILE_READ_WITH_ASSERTS:
    
    ADD $8, %ebx ; TODO handle overflow
    CALL ASSERT_EBX_IN_USERSPACE
    MOV %ebx, %eax
    SUB $8, %ebx

    ; Check if user-given buffer is completely within user space
    ; Calculate highest address of the buffer: %ecx = buffer_ptr + buffer_size - 1   ebx+4 + ebx+8
    
    ; eax currently holds address of buffer_size argument
    ; Dereference buffer_size and save into ecx
    MOV *%eax, %ecx 
    ; Move eax onto buffer_ptr address
    SUB $4, %eax
    ; Dereference buffer_ptr and save into eax
    MOV *%eax, %eax
    ; Calculate buffer_ptr + buffer_size
    ADD %ecx, %eax
    SUB $1, %eax
    CALL ASSERT_EAX_POINTER_IN_USERSPACE

      
.SYSCALLS_FILE_READ:

    ; If the input is a normal file, then do not block and read immediately.
    CMP $0, *%ebx

    JG _SYSCALLS_FILE_READ_FILE

    PUSH %ebx
    DEV $CONST_DEV_COMMAND_CONSOLE_BUFFER_STATUS, $0
    MOV %ebx, %eax
    POP %ebx

    CMP $0, %eax
    JG _SYSCALLS_FILE_READ_FILE


    MOV $CONST_OS_CURRENT_PCB_POINTER, %eax
    MOV *%eax, %eax;

    ; set process status to blocked for IO
    AND $0xFF00FFFF, *%eax ; mask the page table bytes and set status to zero
    MOV $CONST_OS_PROCESS_STATUS_IO_BLOCKED, %ecx
    SHL $16, %ecx ; move the status bit into the correct position
    OR %ecx, *%eax ; apply the process status
 
    CALL UTIL_SCHEDULER ; reschedule
    JMP SYSCALLS_FILE_READ ; check again if buffer contains data race condition protection

._SYSCALLS_FILE_READ_FILE:
    ; move user-provided arguments onto stack (required for DEV instruction)
    ;   ebx+8    buffer size
    MOV %ebx, %eax
    ADD $8, %eax

    PUSH *%eax
    ;   ebx+4   pointer to buffer
    SUB $4, %eax
    PUSH *%eax
    
    ; 2    00000010 - io_read_buffer (fd=op2, buffer_ptr=stack, buffer_size=stack) -> bytes_read=eax
    DEV $CONST_DEV_COMMAND_IO_READ_BUFFER, *%ebx
    RET