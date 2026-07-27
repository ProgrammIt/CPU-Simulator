; Set Up Page Table
; assume than %ebx contains the base address of the Page Table

;                    Page Structure
;
;   --------------------------------------------------
;   |       12 Bits Flags     |       20 bits        |
;   | P W X M I C U U U U U U |                      |
;   | 0 0 0 0 0 0 0 0 0 0 0 0 | 00000000000000000000 |
;   --------------------------------------------------
;   P = Present bit (0 = not Present, 1 = Present)
;   W = Writable bit (0 = not Writable, 1 = Writable)
;   X = Executable bit (0 = not Executable, 1 = Executable)
;   M = Mode bit ( 0 = User mode allowed, 1 = Kernel mode only)
;   I = Pinned bit (0 = not Pinned, 1 = Pinned)
;   C = Changed bit (0 = not Changed, 1 = Changed)
;   U = Unused
;

; UTIL_INITIALIZE_PAGE_TABLE
; Parameters (ebx is a pointer to the start of the Page Table):
;   (ebx)     Pointer to the Page Table entry
; Return value (immediate value):
;   none
.UTIL_INITIALIZE_PAGE_TABLE:
DEV $CONST_DEV_COMMAND_PERFORMANCE_TIMER_START, $5
    PUSH %ebx

    .CONST _UTIL_INITIALIZE_PAGE_TABLE_CONST_PAGE_TABLE_FILE_PATH "os/util/page_table.bin"

    MOV $_UTIL_INITIALIZE_PAGE_TABLE_CONST_PAGE_TABLE_FILE_PATH, %ebx

    ; SYSCALLS_FILE_OPEN
    ; Parameters (ebx is a pointer to the start of an ASCII filename):
    ;   (ebx)     Pointer to a ASCII filename
    ; Return value (immediate value):
    ;   eax     file descriptor (-1 = error)
    CALL SYSCALLS_FILE_OPEN
    CMP $-1, %eax
    JNE _UTIL_INITIALIZE_PAGE_TABLE_FILE_OPEN
    ; this should not be able to happen

    ; panic

    ; TODO stop the simulator
    ._UTIL_INITIALIZE_PAGE_TABLE_FILE_OPEN:

    POP %ebx ; Pointer to the Page Table entry

    PUSH $CONST_OS_PAGE_TABLE_SIZE
    PUSH %ebx
    PUSH %eax

    MOV %esp, %ebx

    PUSH %eax ; file descriptor

    DEV $CONST_DEV_COMMAND_CPU_IS_MEMORY_VIRTUALIZATION_ENABLED, $0
    PUSH %eax ; is virtualization enabled
    DEV $CONST_DEV_COMMAND_CPU_DISABLE_MEMORY_VIRTUALIZATION, $0

    ; SYSCALLS_FILE_READ
    ; Parameters (ebx is a pointer to the following struct):
    ;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
    ;   *(ebx+4)   pointer to buffer, this buffer will be filled by the file system
    ;   *(ebx+8)   buffer size, limits the amount of bytes that will be read
    ; Return value (immediate value):
    ;   eax     success status (>=0 = number of bytes read, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = no console input ready)
    CALL SYSCALLS_FILE_READ
    CMP $0, %eax
    JG _UTIL_INITIALIZE_PAGE_TABLE_FILE_READ
    ; this should not be able to happen

    ; panic

    ; TODO stop the simulator
    ._UTIL_INITIALIZE_PAGE_TABLE_FILE_READ:

    POP %ebx ; was virtualization enabled
    CMP $0, %ebx
    JE _UTIL_INITIALIZE_PAGE_TABLE_SKIP_MEMORY_VIRTIALIZATION
        DEV $CONST_DEV_COMMAND_CPU_ENABLE_MEMORY_VIRTUALIZATION, $0
    ._UTIL_INITIALIZE_PAGE_TABLE_SKIP_MEMORY_VIRTIALIZATION:

    POP %ebx ; file descriptor

    ; SYSCALLS_FILE_CLOSE
    ; Parameters (ebx is used as a immediate value):
    ;   ebx     file descriptor
    ; Return value:
    ;   eax     success status (0 = success, -1 = invalid file descriptor)
    CALL SYSCALLS_FILE_CLOSE
    CMP $-1, %eax
    JNE _UTIL_INITIALIZE_PAGE_TABLE_FILE_CLOSED
    ; this should not be able to happen

    ; panic

    ; TODO stop the simulator

    ._UTIL_INITIALIZE_PAGE_TABLE_FILE_CLOSED:

    POP %ebx
    POP %ebx
    POP %ebx

; Page Table Is Set Up
DEV $CONST_DEV_COMMAND_PERFORMANCE_TIMER_STOP, $5 ; time it takes to initialize a page table
RET