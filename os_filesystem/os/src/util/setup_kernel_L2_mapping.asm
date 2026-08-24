; TODO 
; UTIL_SETUP_KERNEL_L2_MAPPING
; Parameters:
;   none
; Return value (immediate value):
;   none
.UTIL_SETUP_KERNEL_L2_MAPPING:
    PUSH %eax
    PUSH %ebx
    PUSH %ecx
    PUSH %edx

    MOV %esp, %edx ; save stack return point

    .CONST _UTIL_SETUP_KERNEL_L2_MAPPING_FILE_PATH "os/bin/ihmeOS.bin"
    MOV $_UTIL_SETUP_KERNEL_L2_MAPPING_FILE_PATH, %ebx
    ; SYSCALLS_FILE_STAT
    ; Parameters (ebx is a pointer to the start of an ASCII filename):
    ;   (ebx)     Pointer to a ASCII filename
    ; Return value (immediate value):
    ;   eax     file length or error code (>=0 = length, -1 = file does not exists, -2 = not a file)
    PUSH %edx ; save stack return
    CALL SYSCALLS_FILE_STAT
    POP %edx ; restore stack return
    CMP $0, %eax
    JGE _UTIL_SETUP_KERNEL_L2_MAPPING_FILE_STAT
        DEV $8, %eax
        MOV %edx, %esp ; clean stack
        POP %edx
        POP %ecx
        POP %ebx
        POP %eax
        RET

    ._UTIL_SETUP_KERNEL_L2_MAPPING_FILE_STAT:

    ; SYSCALLS_FILE_OPEN
    ; Parameters (ebx is a pointer to the start of an ASCII filename):
    ;   (ebx)     Pointer to a ASCII filename
    ; Return value (immediate value):
    ;   eax     file descriptor (-1 = error)
    PUSH %edx
    CALL SYSCALLS_FILE_OPEN
    POP %edx ; stack return point
    CMP $0, %eax
    JGE _UTIL_INITIALIZE_PAGE_DIRECTORY_FILE_OPEN
        MOV %edx, %esp ; clean stack
        POP %edx
        POP %ecx
        POP %ebx
        POP %eax
        RET
    
    ._UTIL_INITIALIZE_PAGE_DIRECTORY_FILE_OPEN:

    PUSH %eax ; save fd
    .BUF 32 _UTIL_SETUP_KERNEL_L2_MAPPING_ICE_HEADER

    ; SYSCALLS_FILE_READ
    ; Parameters (ebx is a pointer to the following struct):
    ;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
    ;   *(ebx+4)   pointer to buffer, this buffer will be filled by the file system
    ;   *(ebx+8)   buffer size, limits the amount of bytes that will be read
    ; Return value (immediate value):
    ;   eax     success status (>=0 = number of bytes read, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = no console input ready)
    PUSH $32 ; buffer size
    PUSH $_UTIL_SETUP_KERNEL_L2_MAPPING_ICE_HEADER ; pointer to buffer
    PUSH %eax ; file descriptor
    MOV %esp, %ebx ; prepare ebx for read
    PUSH %edx
    CALL SYSCALLS_FILE_READ
    POP %edx
    CMP $0, %eax
    JGE _UTIL_SETUP_KERNEL_L2_MAPPING_READ_ICE_HEADER_NO_ERROR
        MOV %edx, %esp ; clean stack
        POP %edx
        POP %ecx
        POP %ebx
        POP %eax
        RET

    ._UTIL_SETUP_KERNEL_L2_MAPPING_READ_ICE_HEADER_NO_ERROR:
    ADD $12, %esp ; clear read params from stack

    
    ;seek to PH header in binary

    MOV $_UTIL_SETUP_KERNEL_L2_MAPPING_ICE_HEADER, %ebx
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
    PUSH $1 ; seek mode start from file start to get the correct offset in file
    PUSH %eax ; second dword in ICE header is program header offset
    PUSH %ecx ; file descriptor
    MOV %esp, %ebx ; set pointer to start of struct
    PUSH %edx ; save stack return
    CALL SYSCALLS_FILE_SEEK
    POP %edx
    CMP $0, %eax
    JGE _UTIL_SETUP_KERNEL_L2_MAPPING_PH_SEEK_NO_ERROR
        MOV %edx, %esp ; clean stack
        POP %edx
        POP %ecx
        POP %ebx
        POP %eax
        RET
    ._UTIL_SETUP_KERNEL_L2_MAPPING_PH_SEEK_NO_ERROR:

    ADD $12, %esp ; clear seek params from stack

    ; read PH header into buffer

    MOV *%esp, %ecx ; get fd from stack
    ; SYSCALLS_FILE_READ
    ; Parameters (ebx is a pointer to the following struct):
    ;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
    ;   *(ebx+4)   pointer to buffer, this buffer will be filled by the file system
    ;   *(ebx+8)   buffer size, limits the amount of bytes that will be read
    ; Return value (immediate value):
    ;   eax     success status (>=0 = number of bytes read, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = no console input ready)
    
    .BUF 64 _UTIL_SETUP_KERNEL_L2_MAPPING_PROGRAM_HEADER ; prepare buffer for program header

    PUSH $64 ; buffer size
    PUSH $_UTIL_SETUP_KERNEL_L2_MAPPING_PROGRAM_HEADER ; pointer to buffer
    PUSH %ecx ; fd
    MOV %esp, %ebx ; set ebx for read
    PUSH %edx
    CALL SYSCALLS_FILE_READ
    POP %edx ; restore stack return
    CMP $0, %eax
    JGE _UTIL_SETUP_KERNEL_L2_MAPPING_READ_PH_NO_ERROR
        MOV %edx, %esp ; clean stack
        POP %edx
        POP %ecx
        POP %ebx
        POP %eax
        RET
    ._UTIL_SETUP_KERNEL_L2_MAPPING_READ_PH_NO_ERROR:

    ADD $16, %esp ; clear read params from stack and FD
    ; stack clean again for working and program header loaded in buffer
    ; put segment start addresses on stack

    MOV $_UTIL_SETUP_KERNEL_L2_MAPPING_PROGRAM_HEADER, %ebx
    MOV %ebx, %ecx ; copy for easier use
    ADD $4, %ecx
    PUSH *%ecx ; put base address of text data on stack
    MOV %ebx, %ecx ; restore buffer base
    ADD $16, %ecx ; roData base address in buffer
    PUSH *%ecx ; put roData base address on stack
    ADD $28, %ebx ; offset in buffer for data base address
    PUSH *%ebx ; put data base address on stack


    ; kernel space is the top 1Gib, so 256 L2 page tables are needed to map it

    PUSH $0 ; amount of page tables counter
    PUSH $CONST_KERNEl_MEMORY_START ; current physical memory address
    PUSH $0 ; page table index

    ; Stack Layout:
    ; esp + 20 text base address
    ; esp + 16 roData base address
    ; esp + 12 data base address
    ; esp + 8  amount of page tables counter
    ; esp + 4  current physical memory address
    ; esp      page table index

    ._UTIL_SETUP_KERNEL_L2_MAPPING_START:
        MOV %esp, %ebx
        ADD $8, %ebx
        CMP $256, *%ebx ; reached amount of page tables needed?
        JGE _UTIL_SETUP_KERNEL_L2_MAPPING_DONE

        ; allocate new page table
        ; Searches for a free page table, marks it as used and returns the base address
        ; UTIL_ALLOCATE_PAGE_TABLE
        ; Parameters 
        ;   none
        ; Return value (immediate value):
        ;   eax     page table base address (0xFFFFFFFF = invalid)
        CALL UTIL_ALLOCATE_PAGE_TABLE
        CMP $0xFFFFFFFF, %eax
        JE _UTIL_SETUP_KERNEL_L2_MAPPING_TABLE_ERROR

        MOV $0, *%esp ; reset page table index counter

    ._UTIL_SETUP_KERNEL_L2_MAPPING_POPULATE_TABLE_START:
        CMP $1024, *%esp
        JGE _UTIL_SETUP_KERNEL_L2_MAPPING_POPULATE_TABLE_DONE

        ; calculate entry address
        ; eax has table base address
        MOV *%esp, %ecx ; index
        SHL $2, %ecx ; byte offset in page table
        ADD %eax, %ecx ; pointer to L2 entry

        PUSH %eax ; free eax to build entry value, offset stack by +4

        ; Stack Layout:
        ; esp + 24 text base address
        ; esp + 20 roData base address
        ; esp + 16 data base address
        ; esp + 12 amount of page tables counter
        ; esp +  8 current physical memory address
        ; esp +  4 page table index
        ; esp      saved eax L2 base address
        
        ; get physical address to map
        MOV %esp, %ebx
        ADD $8, %ebx
        MOV *%ebx, %ebx ; current physical memory address of kernel space to map

        ; prepare page table entry
        MOV %ebx, %eax 
        AND $0xFFFFF000, %eax ; calculate the address part of the page table entry
        SHR $12, %eax ; make space for the flags (12)

        ; free up ecx for boundary check
        PUSH %ecx

        ; Stack Layout:
        ; esp + 28 text base address
        ; esp + 24 roData base address
        ; esp + 20 data base address
        ; esp + 16 amount of page tables counter
        ; esp + 12 current physical memory address
        ; esp +  8 page table index
        ; esp +  4 saved eax L2 base address
        ; esp      saved ecx pointer to L2 entry

        ; check if we are in the text segment range
        MOV %esp, %ecx
        ADD $24, %ecx
        MOV *%ecx, %ecx ; roData base
        CMP %ecx, %ebx ; check with current physical address
        JAE _UTIL_SETUP_KERNEL_L2_MAPPING_CHECK_DATA_SEGMENT
        OR $0xB0000000, %eax ; set flags for text segment B = Present, Executable, Mode bits set
        JMP _UTIL_SETUP_KERNEL_L2_MAPPING_SETUP_FLAGS_DONE


        ._UTIL_SETUP_KERNEL_L2_MAPPING_CHECK_DATA_SEGMENT:
        ; check if we are in the roData segment
        MOV %esp, %ecx
        ADD $20, %ecx
        MOV *%ecx, %ecx ; data base address
        CMP %ecx, %ebx ; check with current physical address
        JAE _UTIL_SETUP_KERNEL_L2_MAPPING_APPLY_DEFAULT_FLAGS
        OR $0x90000000, %eax ; roData flags 9 = Present and Mode bits set
        JMP _UTIL_SETUP_KERNEL_L2_MAPPING_SETUP_FLAGS_DONE

        ._UTIL_SETUP_KERNEL_L2_MAPPING_APPLY_DEFAULT_FLAGS:
        OR $0xD0000000, %eax ; default flags D = present, writable, mode 


    ._UTIL_SETUP_KERNEL_L2_MAPPING_SETUP_FLAGS_DONE:
        POP %ecx ; restore ecx pointer to L2

        MOV %eax, *%ecx ; map entry

        ; add frame size to current physical address
        MOV %esp, %eax
        ADD $8, %eax
        ADD $CONST_OS_FRAME_SIZE, *%eax ; update stack entry

        ; increase page table index
        MOV %esp, %eax
        ADD $4, %eax
        ADD $1, *%eax

        POP %eax ; restore eax L2 base address
        JMP _UTIL_SETUP_KERNEL_L2_MAPPING_POPULATE_TABLE_START

    ._UTIL_SETUP_KERNEL_L2_MAPPING_POPULATE_TABLE_DONE:
        ; increase page table counter of how many page tables are done
        MOV %esp, %ecx
        ADD $8, %ecx
        ADD $1, *%ecx
        JMP _UTIL_SETUP_KERNEL_L2_MAPPING_START


    ._UTIL_SETUP_KERNEL_L2_MAPPING_DONE:
        MOV %edx, %esp ; clear stack

        POP %edx
        POP %ecx
        POP %ebx
        POP %eax
        RET

    ._UTIL_SETUP_KERNEL_L2_MAPPING_TABLE_ERROR:
        ; no space left for page tables
        ; this should not happen
        ; TODO stop simulator
        MOV %edx, %esp ; clear variables from stack
        POP %edx
        POP %ecx
        POP %ebx
        POP %eax
        RET