; The Loader is responsible for loading the code of a program into memory

; assume %ebx is the pointer to the filename of the to be loaded program

; UTIL_LOAD_PROGRAM
; Parameters (ebx is a pointer to the following struct):
;   *(ebx)     Pointer to a ASCII filename
;   *(ebx+4)   Pointer to the PCB
; Return value (immediate value):
;   eax     success status (0 = success, -1 = file does not exists, -2 = not a file, -3 = out of memory, -4 = unknown)
.UTIL_LOAD_PROGRAM:
    PUSH %ebx
    PUSH %ecx
    MOV %esp, %edx ; save stack return

    PUSH %ebx ; save ebx

    MOV *%ebx, %ebx
    ; %ebx is a pointer to the filename

    ; SYSCALLS_FILE_STAT
    ; Parameters (ebx is a pointer to the start of an ASCII filename):
    ;   (ebx)     Pointer to a ASCII filename
    ; Return value (immediate value):
    ;   eax     file length or error code (>=0 = length, -1 = file does not exists, -2 = not a file)
    PUSH %edx ; save stack return
    CALL SYSCALLS_FILE_STAT
    POP %edx ; restore stack return
    CMP $0, %eax
    JGE _UTIL_LOAD_PROGRAM_FILE_STAT
        MOV %edx, %esp ; clean stack
        POP %ecx
        POP %ebx
        RET

    ._UTIL_LOAD_PROGRAM_FILE_STAT:
        ; SYSCALLS_FILE_OPEN
        ; Parameters (ebx is a pointer to the start of an ASCII filename):
        ;   (ebx)     Pointer to a ASCII filename
        ; Return value (immediate value):
        ;   eax     file descriptor (-1 = error)
        PUSH %edx
        CALL SYSCALLS_FILE_OPEN
        POP %edx ; stack return point
        CMP $0, %eax
        JGE _UTIL_LOAD_PROGRAM_FILE_OPEN
        MOV %edx, %esp
        POP %ecx
        POP %ebx
        MOV $-4, %eax
        RET
    
    ._UTIL_LOAD_PROGRAM_FILE_OPEN:
        PUSH %eax ; Push the file descriptor onto the stack

        ; *(%esp) = file descriptor

        ; prepare stack for further calls
        
        .BUF 32 ICE_HEADER ; prepare buffer to store ice header

        ; SYSCALLS_FILE_READ
        ; Parameters (ebx is a pointer to the following struct):
        ;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
        ;   *(ebx+4)   pointer to buffer, this buffer will be filled by the file system
        ;   *(ebx+8)   buffer size, limits the amount of bytes that will be read
        ; Return value (immediate value):
        ;   eax     success status (>=0 = number of bytes read, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = no console input ready)
        PUSH $32 ; buffer size
        PUSH $ICE_HEADER ; pointer to buffer
        PUSH %eax ; file descriptor
        MOV %esp, %ebx ; prepare bx for read
        PUSH %edx
        CALL SYSCALLS_FILE_READ
        POP %edx
        CMP $0, %eax
        JGE _UTIL_LOAD_PROGRAM_READ_ICE_HEADER_NO_ERROR
            MOV %edx, %esp ; reset stack
            POP %ecx
            POP %ebx
            MOV $-4, %eax
            RET

        ._UTIL_LOAD_PROGRAM_READ_ICE_HEADER_NO_ERROR:
        ADD $12, %esp ; clear read params from stack
        ; get magic number
        MOV $ICE_HEADER, %ebx
        MOV *%ebx, %ebx
        CMP $0x7F494345, %ebx ; check magic number
        JE _UTIL_LOAD_PROGRAM_MAGIC_MATCH
            MOV %edx, %esp ; reset stack
            POP %ecx
            POP %ebx
            MOV $-4, %eax
            RET

        ._UTIL_LOAD_PROGRAM_MAGIC_MATCH:
        MOV $ICE_HEADER, %ebx
        ADD $4, %ebx ; offset to read program header offset
        MOV *%ebx, %eax ; program header offset
        MOV *%esp, %ecx ; get FD from stack
        ; SYSCALLS_FILE_SEEK
        ; Parameters (ebx is a pointer to the following struct):
        ;   *(ebx)     file descriptor
        ;   *(ebx+4)   seek offset
        ;   *(ebx+8)   seek mode (0 - Seek from current position, 1 - Seek from start of file, 2 - Seek from end of file)
        ; Return value (immediate value):
        ;   eax     success status (0 = success, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = negative seek position)
        PUSH $1 ; seek mode start from file start to get the correct offset
        PUSH %eax ; second dword in ice header is program header offset
        PUSH %ecx ; file descriptor
        MOV %esp, %ebx ; set pointer to start of struct
        PUSH %edx ; save stack return
        CALL SYSCALLS_FILE_SEEK
        POP %edx
        CMP $0, %eax
        JGE _UTIL_LOAD_PROGRAM_PH_SEEK_NO_ERROR
            MOV %edx, %esp ; reset stack
            POP %ecx
            POP %ebx
            MOV $-4, %eax
            RET
        ._UTIL_LOAD_PROGRAM_PH_SEEK_NO_ERROR:

        ADD $12, %esp ; clear seek params from stack

        MOV *%esp, %ecx ; get fd from stack
        ; SYSCALLS_FILE_READ
        ; Parameters (ebx is a pointer to the following struct):
        ;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
        ;   *(ebx+4)   pointer to buffer, this buffer will be filled by the file system
        ;   *(ebx+8)   buffer size, limits the amount of bytes that will be read
        ; Return value (immediate value):
        ;   eax     success status (>=0 = number of bytes read, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = no console input ready)
        .BUF 64 PROGRAM_HEADER ; prepare buffer for program header
        PUSH $64 ; buffer size
        PUSH $PROGRAM_HEADER ; pointer to buffer
        PUSH %ecx ; fd
        MOV %esp, %ebx ; set ebx for read
        PUSH %edx
        CALL SYSCALLS_FILE_READ
        POP %edx ; restore stack return
        CMP $0, %eax
        JGE _UTIL_LOAD_PROGRAM_READ_PH_NO_ERROR
            MOV %edx, %esp ; reset stack
            POP %ecx
            POP %ebx
            MOV $-4, %eax
            RET
        ._UTIL_LOAD_PROGRAM_READ_PH_NO_ERROR:
        ADD $12, %esp ; clear read params from stack

        ; stack now
        ; esp + 4 = original ebx struct
        ; esp = file descriptor

        MOV $PROGRAM_HEADER, %eax
        MOV *%eax, %eax ; first DWORD in program header is the amount of needed L2 tables

        ; prepare page tables

        ; %eax now holds amount of needed L2 page tables
        ; initialize and map L2 page tables to base directory

        ; get PCB pointer from stack
        MOV %esp, %ebx
        ADD $4, %ebx
        MOV *%ebx, %ebx
        ADD $4, %ebx
        MOV *%ebx, %ebx ; ebx = pcb pointer
        ADD $2, %ebx ; move to page directory base address in pcb
        MOV *%ebx, %ebx ; page directory base address now in ebx
        MOV %ebx, %ecx ; copy
        PUSH %ecx ; save page directory base address

        MOV $0, %ebx ; counter for base directory index
        ; eax needed amount of L2 page tables
        ; ebx page directory index counter
        ; ecx page directory base address
    
    ._UTIL_LOAD_PROGRAM_ALLOCATE_PAGE_TABLES:
        CMP %eax, %ebx ; all L2 page tab mapped?
        JGE _UTIL_LOAD_PROGRAM_ALLOCATE_PAGE_TABLES_DONE
        ; save counters and free registers for use
        PUSH %eax
        PUSH %ebx
        PUSH %ecx

        ; Searches for a free page table, marks it as used and returns the base address
        ; UTIL_ALLOCATE_PAGE_TABLE
        ; Parameters 
        ;   none
        ; Return value (immediate value):
        ;   eax     page table base address (0xFFFFFFFF = invalid)
        PUSH %edx
        CALL UTIL_ALLOCATE_PAGE_TABLE
        POP %edx
        POP %ecx
        CMP $0xFFFFFFFF, %eax
        JNE _UTIL_LOAD_PROGRAM_ALLOCATE_PAGE_TABLE_NO_ERROR
            MOV %edx, %esp ; reset stack
            POP %ecx
            POP %ebx
            MOV $-4, %eax
            RET

    ._UTIL_LOAD_PROGRAM_ALLOCATE_PAGE_TABLE_NO_ERROR:
        MOV %eax, %ebx
        ; ecx current page directory address
        ; ebx initialized page table base address
        AND $0xFFFFF000, %ebx ; calculate the address part of the page table entry
        SHR $12, %ebx ; make space for the flags (12)
        OR $0x80000000, %ebx ; 8 = Present bit, access rights are checked on L2 level
        MOV %ebx, *%ecx ; write the base directory entry

        POP %ebx ; page directory index counter
        POP %eax ; needed amount of L2 page tables
        ADD $1, %ebx
        ADD $4, %ecx ; next base directory entry address

        JMP _UTIL_LOAD_PROGRAM_ALLOCATE_PAGE_TABLES
    
    ._UTIL_LOAD_PROGRAM_ALLOCATE_PAGE_TABLES_DONE:

    ; stack now
    ; esp = page directory base address
    ; esp + 4 = file descriptor
    ; esp + 8 = original ebx struct
    
    ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; prepare stack to load text segment ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

    MOV $PROGRAM_HEADER, %eax
    ADD $8, %eax ; offset in PH
    PUSH *%eax ; put text segment file offset on stack

    MOV %esp, %eax
    ADD $12, %eax ; get original ebx struct from stack
    MOV *%eax, %eax ; struct
    ADD $4, %eax ; struct offset
    MOV *%eax, %eax ; get pcb pointer
    MOV *%eax, %eax ; get first dword from pcb
    AND $0xFF000000, %eax ; mask PID, first byte in pcb
    SHR $24, %eax ; PID
    PUSH %eax ; put pid on stack

    ; prepare flags
    PUSH $0xA00 ; A00 = present + Executable

    ; prepare virtual address offset
    MOV $PROGRAM_HEADER, %eax
    ADD $4, %eax ; offset in program header for virtual base address
    PUSH *%eax ; put virtual address on stack

    ; prepare segment size
    MOV $PROGRAM_HEADER, %eax
    ADD $12, %eax ; offset for text segment size in PH
    PUSH *%eax ; put on stack 

    ; prepare page directory base address
    MOV %esp, %eax
    ADD $20, %eax ; stack offset for page directory base
    PUSH *%eax ; put page directory base on stack

    ; prepare fd
    MOV %esp, %eax
    ADD $28, %eax ; stack offset for fd
    PUSH *%eax ; push fd

    MOV %esp, %ebx ; set ebx to struct start
    
    ; UTIL_LOAD_SEGMENT
    ; Parameters
    ;   ebx holds the start of the following struct
    ;   ebx + 24 = segment offset in file
    ;   ebx + 20 = process id
    ;   ebx + 16 = page table flags
    ;   ebx + 12 = segment virtual memory start address
    ;   ebx +  8 = segment size in bytes
    ;   ebx +  4 = page directory base address
    ;   ebx      = file descriptor
    ; Return value (immediate value):
    ;   eax success status (0 = success, -1 = error)
    PUSH %edx ; save stack return
    CALL UTIL_LOAD_SEGMENT
    POP %edx
    CMP $0, %eax
    JGE _UTIL_LOAD_PROGRAM_LOAD_TEXT_SEGMENT_SUCCESS
        ; error
        MOV %edx, %esp ; reset stack
        POP %ecx
        POP %ebx
        MOV $-4, %eax
        RET

    ._UTIL_LOAD_PROGRAM_LOAD_TEXT_SEGMENT_SUCCESS:

    ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; prepare stack to load roData segment ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

    ; get roData segment size
    MOV $PROGRAM_HEADER, %eax
    ADD $24, %eax ; PH offset
    MOV *%eax, %eax 
    CMP $0, %eax
    JE _UTIL_LOAD_PROGRAM_RO_DATA_SEGMENT_SKIP
    ; prepare stack for roData segment
    MOV %esp, %ebx
    ADD $8, %ebx ; roData segment size
    MOV %eax, *%ebx ; set new segment size

    ; get virtual address start of roData segment
    MOV $PROGRAM_HEADER, %eax
    ADD $16, %eax ; PH offset
    MOV *%eax, %eax ; get v-address
    MOV %esp, %ebx
    ADD $12, %ebx ; offset for stack v-address
    MOV %eax, *%ebx ; set new v-address

    ; set new flags
    MOV %esp, %eax
    ADD $16, %eax ; stack offset for flags
    MOV $0x800, *%eax ; set new flags 800 = present, writeable not set

    ; set new file offset
    MOV $PROGRAM_HEADER, %eax
    ADD $20, %eax ; offset in PH
    MOV *%eax, %eax ; file offset for roData segment
    MOV %esp, %ebx
    ADD $24, %ebx ; stack offset for file offset
    MOV %eax, *%ebx ; write new file offset
    MOV %esp, %ebx ; set ebx to start of struct for call

    ; UTIL_LOAD_SEGMENT
    ; Parameters
    ;   ebx holds the start of the following struct
    ;   ebx + 24 = segment offset in file
    ;   ebx + 20 = process id
    ;   ebx + 16 = page table flags
    ;   ebx + 12 = segment virtual memory start address
    ;   ebx +  8 = segment size in bytes
    ;   ebx +  4 = page directory base address
    ;   ebx      = file descriptor
    ; Return value (immediate value):
    ;   eax success status (0 = success, -1 = error)
    PUSH %edx ; save stack return
    CALL UTIL_LOAD_SEGMENT
    POP %edx
    CMP $0, %eax
    JGE _UTIL_LOAD_PROGRAM_LOAD_RO_DATA_SEGMENT_SUCCESS
        ; error
        MOV %edx, %esp ; reset stack
        POP %ecx
        POP %ebx
        MOV $-4, %eax
        RET

    ._UTIL_LOAD_PROGRAM_LOAD_RO_DATA_SEGMENT_SUCCESS:



    ._UTIL_LOAD_PROGRAM_RO_DATA_SEGMENT_SKIP:


    ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; prepare stack to load data segment ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
    ; get data segment size
    MOV $PROGRAM_HEADER, %eax
    ADD $36, %eax ; PH offset
    MOV *%eax, %eax 
    CMP $0, %eax
    JE _UTIL_LOAD_PROGRAM_DATA_SEGMENT_SKIP
    ; prepare stack for data segment
    MOV %esp, %ebx
    ADD $8, %ebx ; data segment size
    MOV %eax, *%ebx ; set new segment size

    ; get virtual address start of data segment
    MOV $PROGRAM_HEADER, %eax
    ADD $28, %eax ; PH offset
    MOV *%eax, %eax ; get v-address
    MOV %esp, %ebx
    ADD $12, %ebx ; offset for stack v-address
    MOV %eax, *%ebx ; set new v-address

    ; set new flags
    MOV %esp, %eax
    ADD $16, %eax ; stack offset for flags
    MOV $0xC00, *%eax ; set new flags C00 = present + Writable

    ; set new file offset
    MOV $PROGRAM_HEADER, %eax
    ADD $32, %eax ; offset in PH
    MOV *%eax, %eax ; file offset for data segment
    MOV %esp, %ebx
    ADD $24, %ebx ; stack offset for file offset
    MOV %eax, *%ebx ; write new file offset
    MOV %esp, %ebx ; set ebx to start of struct for call

    ; UTIL_LOAD_SEGMENT
    ; Parameters
    ;   ebx holds the start of the following struct
    ;   ebx + 24 = segment offset in file
    ;   ebx + 20 = process id
    ;   ebx + 16 = page table flags
    ;   ebx + 12 = segment virtual memory start address
    ;   ebx +  8 = segment size in bytes
    ;   ebx +  4 = page directory base address
    ;   ebx      = file descriptor
    ; Return value (immediate value):
    ;   eax success status (0 = success, -1 = error)
    PUSH %edx ; save stack return
    CALL UTIL_LOAD_SEGMENT
    POP %edx
    CMP $0, %eax
    JGE _UTIL_LOAD_PROGRAM_LOAD_DATA_SEGMENT_SUCCESS
        ; error
        MOV %edx, %esp ; reset stack
        POP %ecx
        POP %ebx
        MOV $-4, %eax
        RET

    ._UTIL_LOAD_PROGRAM_LOAD_DATA_SEGMENT_SUCCESS:



    ._UTIL_LOAD_PROGRAM_DATA_SEGMENT_SKIP:


        MOV %edx, %esp ; reset stack
        POP %ecx
        POP %ebx
        MOV $0, %eax
        RET
