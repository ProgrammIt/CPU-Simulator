
.CONST _INIT_START_CONST_PROCES_NAME_FILE_PATH "os/util/new_process_name.bin"

; set periodic timer for _UTIL_SCHEDULER_PROCESS_RUNNING
MOV $CONST_OS_PERIODIC_TIMER_FREQUENCY, %eax
DEV $CONST_DEV_COMMAND_PERIODIC_TIMER_SET, %eax



._INIT_START:

MOV $_INIT_START_CONST_PROCES_NAME_FILE_PATH, %ebx

; SYSCALLS_FILE_STAT
; Parameters (ebx is a pointer to the start of an ASCII filename):
;   (ebx)     Pointer to a ASCII filename
; Return value (immediate value):
;   eax     file length or error code (>=0 = length, -1 = file does not exists, -2 = not a file)
MOV $CONST_SYSCALL_FILE_STAT, %eax
INT $0x80
CMP $2, %eax ; if SYSCALLS_FILE_STAT reurns error or file does not contain a valid file name (file length > 1) no new process needs to be created
JL _INIT_SET_TIMER

MOV $_INIT_START_CONST_PROCES_NAME_FILE_PATH, %ebx

; create new process
PUSH %eax ; push lenght

; SYSCALLS_FILE_OPEN
; Parameters (ebx is a pointer to the start of an ASCII filename):
;   (ebx)     Pointer to a ASCII filename
; Return value (immediate value):
;   eax     file descriptor (-1 = error)
MOV $CONST_SYSCALL_FILE_OPEN, %eax
INT $0x80
CMP $-1, %eax
JNE _INIT_FILE_OPEN
    POP %eax
    JMP _INIT_SET_TIMER
._INIT_FILE_OPEN:

PUSH %eax ; file descriptor

; read the file

    ; get file length
    MOV %esp, %ecx
    ADD $4, %ecx

    PUSH *%ecx ; file length

    ; calculate pointer position
    MOV %esp, %ebx
    SUB $8, %ebx ; space for the pointer and file descriptor
    SUB *%ecx, %ebx ; space for the file content

    PUSH %ebx ; pointer
    PUSH %eax ; file descriptor

    MOV %esp, %ebx

    ; make space on the stack for the content
    SUB *%ecx, %esp

    PUSH %ecx ; save ecx
 
    ; SYSCALLS_FILE_READ
    ; Parameters (ebx is a pointer to the following struct):
    ;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
    ;   *(ebx+4)   pointer to buffer, this buffer will be filled by the file system
    ;   *(ebx+8)   buffer size, limits the amount of bytes that will be read
    ; Return value (immediate value):
    ;   eax     success status (>=0 = number of bytes read, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = no console input ready)
    MOV $CONST_SYSCALL_FILE_READ, %eax
    INT $0x80
    CMP $0, %eax
    JG _INIT_FILE_READ_NO_ERROR
        ; just ignore for now
    ._INIT_FILE_READ_NO_ERROR:


    ; on the stack + 4 is the file name for the new process

    MOV %esp, %ebx
    ADD $4, %ebx

    ; if the name start with a null byte -> stop
    MOV *%ebx, %eax
    SHR $24, %eax
    CMP $0, %eax
    JE _INIT_FILE_ABORT_AFTER_READ

    ; create the new process
    ; SYSCALLS_PROCESS_CREATE
    ; Parameters (ebx is a pointer to the start of an ASCII filename):
    ;   (ebx)     Pointer to a ASCII filename
    ; Return value:
    ;   eax     success status (0 = success, -1 = error)
    MOV $CONST_SYSCALL_PROCESS_CREATE, %eax
    INT $0x80
    ; just ignore any error for now

    POP %ecx ; saved ecx

    ; pop the file name from stack
    ADD *%ecx, %esp

    ; pop arguments for CONST_SYSCALL_FILE_READ 
    POP %ebx
    POP %ebx
    POP %ebx

; overwrite new_process_name.bin with a null terminator

    POP %eax ; restore file descriptor
    PUSH %eax

    PUSH $0 ; buffer (a null byte)

    PUSH $1 ; buffer size
    MOV %esp, %ebx
    ADD $4, %ebx
    PUSH %ebx ; pointer to buffer
    PUSH %eax ; file descriptor

    MOV %esp, %ebx

    ; SYSCALLS_FILE_WRITE
    ; Parameters (ebx is a pointer to the following struct):
    ;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
    ;   *(ebx+4)   pointer to buffer, this buffer will be used by the file system
    ;   *(ebx+8)   buffer size, limits the amount of bytes that will be written
    ; Return value (immediate value):
    ;   eax     success status (>=0 = number of bytes written, -1 = invalid file descriptor, -2 = seek position out of file bounds)
    MOV $CONST_SYSCALL_FILE_WRITE, %eax
    INT $0x80
    ; just ignore error for now

    ADD $16, %esp ; pop arguments and buffer for the SYSCALLS_FILE_WRITE

    JMP _INIT_FILE_SKIP_ABORT
    
    ._INIT_FILE_ABORT_AFTER_READ:
            POP %ecx ; saved ecx

            ; pop the file name from stack
            ADD *%ecx, %esp
            ADD $12, %esp ; pop read arguments
    ._INIT_FILE_SKIP_ABORT:

    POP %ebx ; file descriptor

    ; SYSCALLS_FILE_CLOSE
    ; Parameters (ebx is used as a immediate value):
    ;   ebx     file descriptor
    ; Return value:
    ;   eax     success status (0 = success, -1 = invalid file descriptor)
    MOV $CONST_SYSCALL_FILE_CLOSE, %eax
    INT $0x80
    ; just ignore any error for now

    POP %ebx ; file length

._INIT_SET_TIMER:
    MOV $13, %ebx
    MOV $CONST_SYSCALL_TIMER_START, %eax
    INT $0x80
    JMP _INIT_START


.INCLUDE "os/src/constants"