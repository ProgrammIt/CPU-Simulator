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
.UTIL_LOAD_SEGMENT:
PUSH %eax
PUSH %ecx
PUSH %ebx
MOV %esp, %edx ; stack return point on exit

; get data offset
MOV %ebx, %eax
ADD $24, %eax ; offset for file offset
MOV *%eax, %eax ; eax contains segment file offset
MOV *%ebx, %ecx ; ecx contains file descriptor

PUSH %edx
; SYSCALLS_FILE_SEEK
; Parameters (ebx is a pointer to the following struct):
;   *(ebx)     file descriptor
;   *(ebx+4)   seek offset
;   *(ebx+8)   seek mode (0 - Seek from current position, 1 - Seek from start of file, 2 - Seek from end of file)
; Return value (immediate value):
;   eax     success status (0 = success, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = negative seek position)
PUSH $1 ; seek Mode
PUSH %eax ; offset
PUSH %ecx ; fd
MOV %esp, %ebx ; put struct in ebx for seek
CALL SYSCALLS_FILE_SEEK
JGE _UTIL_LOAD_SEGMENT_SEEK_SEGMENT_START_NO_ERROR
    ; remove seek params
    ADD $12, %esp
    ; restore edx
    POP %edx
    MOV %edx, %esp
    POP %ebx
    POP %ecx
    POP %eax
    MOV $-1, %eax
    RET


._UTIL_LOAD_SEGMENT_SEEK_SEGMENT_START_NO_ERROR:
    ADD $12, %esp ; clean stack from seek
    POP %edx ; restore stack return point

; calculate needed full frames
MOV *%esp, %ecx ; get saved struct pointer
ADD $8, %ecx ; offset in struct for segment size
MOV *%ecx, %ecx ; segment size in bytes
PUSH %ecx ; save segment size for later

; calculate needed amount of full frames
SHR $CONST_OS_FRAME_BIT_SIZE, %ecx ; divide by frame size (2¹²) = 12 bit shifts to the right
PUSH %ecx ; put needed amount of full frames on stack
PUSH $0 ; Push the number of written frames onto the stack
MOV %ecx, %eax

; calculate pd index offset and L2 index offset
MOV %esp, %ecx
ADD $12, %ecx ; offset to ebx struct on stack
MOV *%ecx, %ecx ; get struct
ADD $12, %ecx ; offset in struct for virtual address
MOV *%ecx, %ecx ; virtual start address of segment
MOV %ecx, %ebx ; copy virtual address
SHR $22, %ebx
AND $0x3FF, %ebx ; extract page directory index
SHR $12, %ecx
AND $0x3FF, %ecx ; extract L2 index


PUSH %ecx ; push page table index onto stack
PUSH %ebx ; push page directory index onto stack

CMP $0, %eax ; check if needed frames is 0, yes -> data smaller than 1 frame
JE _UTIL_LOAD_SEGMENT_REMAINDER_CHECK

._UTIL_LOAD_SEGMENT_ALLOCATE_FRAMES:
        PUSH %edx ; save stack return
        ; UTIL_ALLOCATE_FRAME
        ; Parameters 
        ;   none
        ; Return value (immediate value):
        ;   eax     frame address (0xFFFFFFFF = invalid)
        CALL UTIL_ALLOCATE_FRAME
        POP %edx ; restore stack return
        CMP $0xFFFFFFFF, %eax
        JNE _UTIL_LOAD_SEGMENT_ALLOCATE_FRAME_NO_ERROR
            ; error
            MOV %edx, %esp
            POP %ebx
            POP %ecx
            POP %eax
            MOV $-1, %eax
            RET

    ._UTIL_LOAD_SEGMENT_ALLOCATE_FRAME_NO_ERROR:
        ; eax = frame address

        ; inform simulator that frame has been allocated
        ; FRAME_MAPPED_SIGNAL
        ; (esp+8) virtual address
        ; (esp+4) frame address
        ; (esp)   process id
        ; values get popped from stack

        MOV *%esp, %ecx
        SHL $10, %ecx ; Page directory index with space for L2 index
        PUSH %ecx
        MOV %esp, %ecx 
        ADD $8, %ecx ; L2 index
        OR *%ecx, *%esp ; Created vpn
        POP %ecx ; vpn now in ecx
        SHL $12, %ecx ; create virtual address
        PUSH %ecx ; put virtual address onto stack
        PUSH %eax ; put frame address onto stack
        ; get PID
        MOV %esp, %ecx
        ADD $28, %ecx ; ebx struct on stack
        MOV *%ecx, %ecx ; get struct
        ADD $20, %ecx ; offset for PID
        PUSH *%ecx ; put PID on stack
        DEV $CONST_DEV_COMMAND_FRAME_MAPPED_SIGNAL, $0
        ; dev popped last three values from stack

        PUSH %eax ; Push the frame start address onto the stack

        ; struct for syscall Read
        PUSH $CONST_OS_FRAME_SIZE ; Push the buffer size onto the stack
        PUSH %eax ; Push the frame start address onto the stack

        MOV %esp, %ecx
        ADD $32, %ecx ; offset for original ebx on stack
        MOV *%ecx, %ecx ; ebx struct 
        PUSH *%ecx ; Push the file descriptor onto the stack, first entry in struct

        MOV %esp, %ebx ; set ebx to start of the struct

        DEV $CONST_DEV_COMMAND_CPU_IS_MEMORY_VIRTUALIZATION_ENABLED, $0
        PUSH %eax ; is virtualization enabled
        DEV $CONST_DEV_COMMAND_CPU_DISABLE_MEMORY_VIRTUALIZATION, $0

        PUSH %edx ; save stack return
        ; SYSCALLS_FILE_READ
        ; Parameters (ebx is a pointer to the following struct):
        ;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
        ;   *(ebx+4)   pointer to buffer, this buffer will be filled by the file system
        ;   *(ebx+8)   buffer size, limits the amount of bytes that will be read
        ; Return value (immediate value):
        ;   eax     success status (>=0 = number of bytes read, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = no console input ready)
        CALL SYSCALLS_FILE_READ
        CMP $0, %eax
        JGE _UTIL_LOAD_SEGMENT_FILE_READ_NO_ERROR
            POP %edx ; restore stack return
            POP %ebx ; was virtualization enabled
            CMP $0, %ebx
            JE _UTIL_LOAD_SEGMENT_SKIP_MEMORY_VIRTUALIZATION_SEGMENT_READ_ERROR
                DEV $CONST_DEV_COMMAND_CPU_ENABLE_MEMORY_VIRTUALIZATION, $0
            ._UTIL_LOAD_SEGMENT_SKIP_MEMORY_VIRTUALIZATION_SEGMENT_READ_ERROR:
            ; error
            MOV %edx, %esp
            POP %ebx
            POP %ecx
            POP %eax
            MOV $-1, %eax
            RET

    ._UTIL_LOAD_SEGMENT_FILE_READ_NO_ERROR:
        POP %edx ; restore stack return
        POP %ebx ; was virtualization enabled
        CMP $0, %ebx
        JE _UTIL_LOAD_SEGMENT_SKIP_MEMORY_VIRTUALIZATION
        DEV $CONST_DEV_COMMAND_CPU_ENABLE_MEMORY_VIRTUALIZATION, $0

    ._UTIL_LOAD_SEGMENT_SKIP_MEMORY_VIRTUALIZATION:
        ADD $12, %esp ; clear read params from stack

        PUSH $0         ; seek mode
        PUSH $CONST_OS_FRAME_SIZE    ; seek offset

        MOV %esp, %ecx
        ADD $32, %ecx ; offset to original ebx on stack
        MOV *%ecx, %ecx ; ebx struct
        PUSH *%ecx ; file descriptor first entry in struct

        MOV %esp, %ebx ; set ebx to start of the struct
        PUSH %edx ; save stack return
        ; SYSCALLS_FILE_SEEK
        ; Parameters (ebx is a pointer to the following struct):
        ;   *(ebx)     file descriptor
        ;   *(ebx+4)   seek offset
        ;   *(ebx+8)   seek mode (0 - Seek from current position, 1 - Seek from start of file, 2 - Seek from end of file)
        ; Return value (immediate value):
        ;   eax     success status (0 = success, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = negative seek position)
        CALL SYSCALLS_FILE_SEEK
        POP %edx ; restore stack return
        CMP $0, %eax
        JGE _UTIL_LOAD_SEGMENT_FILE_SEEK_NO_ERROR
            ; error
            MOV %edx, %esp
            POP %ebx
            POP %ecx
            POP %eax
            MOV $-1, %eax
            RET

        ._UTIL_LOAD_SEGMENT_FILE_SEEK_NO_ERROR:
        ADD $12, %esp ; clear seek params from stack

        ; map the frame into the virtual memory space

        ; *(%esp+16) = number of needed frames
        ; *(%esp+12) = number of written frames
        ; *(%esp+8) = page table index
        ; *(%esp+4) = page directory index
        ; *(%esp) = frame start address


        MOV %esp, %ebx ; get ebx back
        ADD $24, %ebx ; original ebx struct
        MOV *%ebx, %ebx ; dereference struct
        ADD $4, %ebx ; address of the Page directory Pointer
        MOV *%ebx, %eax ; Page directory base address

        ; get offset in page directory table
        MOV %esp, %ebx
        ADD $4, %ebx
        MOV *%ebx, %ecx
        SHL $2, %ecx
        ADD %ecx, %eax ; eax now points to the correct entry in the page directory table
        MOV *%eax, %eax ; get page directory entry
        ; get page table address
        AND $0xFFFFF, %eax ; mask the frame number
        SHL $12, %eax ; eax now contains base address of the L2 page table at the current base directory index
        ; Find entry in L2 page table
        ADD $4, %ebx ; stack offset for L2 index
        MOV *%ebx, %ecx
        SHL $2, %ecx
        ADD %ecx, %eax ; eax now points to the correct index in the L2 page table

        POP %ecx ; frame start address

        AND $0xFFFFF000, %ecx ; calculate the address part of the page table entry
        SHR $12, %ecx ; make space for the flags (12)

        MOV %esp, %ebx
        ADD $20, %ebx ; offset on stack for orig ebx struct
        MOV *%ebx, %ebx
        ADD $16, %ebx ; offset in struct for flags
        MOV *%ebx, %ebx ; get flags
        SHL $20, %ebx ; shift flags into place
        OR %ebx, %ecx ; set entry flags
        MOV %ecx, *%eax ; write entry

        ; increment L2 page table index
        MOV %esp, %eax
        ADD $4, %eax
        ADD $1, *%eax
        CMP $1024, *%eax ; has the L2 page table been filled?
        JNE _UTIL_LOAD_SEGMENT_L2_NOT_FULL
        MOV $0, *%eax ; reset L2 index
        SUB $4, %eax ; page directory index
        ADD $1, *%eax ; increase page directory index

    ._UTIL_LOAD_SEGMENT_L2_NOT_FULL:
        MOV %esp, %eax
        ADD $12, %eax ; number of needed frames pointer

        MOV %esp, %ebx
        ADD $8, %ebx ; number of written frames pointer
        ADD $1, *%ebx ; increase number of written frames
        CMP *%eax, *%ebx ; all frames written?
        JE _UTIL_LOAD_SEGMENT_REMAINDER_CHECK ; all full frames mapped, check for remainder

        JMP _UTIL_LOAD_SEGMENT_ALLOCATE_FRAMES

    ._UTIL_LOAD_SEGMENT_REMAINDER_CHECK:
        ; Remainder = segment size % frame size
        MOV %esp, %eax
        ADD $16, %eax ; pointer code size on stack from the beginning
        MOV *%eax, %ecx ; ecx now has code size
        AND $0xFFF, %ecx ; 4096 - 1 = 0x1000 - 1 = 0xFFF for modulo
        CMP $0, %ecx
        JE _UTIL_LOAD_SEGMENT_FIND_FRAMES_END ; no remainder left

        ; fill partial frame
        PUSH %ecx ; save remainder

        PUSH %edx ; save stack return
        ; UTIL_ALLOCATE_FRAME
        ; Parameters 
        ;   none
        ; Return value (immediate value):
        ;   eax     frame address (0xFFFFFFFF = invalid)
        CALL UTIL_ALLOCATE_FRAME
        POP %edx ; restore stack return
        CMP $0xFFFFFFFF, %eax
        JNE _UTIL_LOAD_SEGMENT_ALLOCATE_REMAINDER_FRAME_NO_ERROR
            MOV %edx, %esp
            POP %ebx
            POP %ecx
            POP %eax
            MOV $-1, %eax
            RET
        ._UTIL_LOAD_SEGMENT_ALLOCATE_REMAINDER_FRAME_NO_ERROR:

        ; inform simulator that frame has been allocated
        ; FRAME_MAPPED_SIGNAL
        ; (esp+8) virtual address
        ; (esp+4) frame address
        ; (esp)   process id
        ; values get popped from stack

        ; prepare stack
        MOV %esp, %ecx
        ADD $4, %ecx ; page directory index
        MOV *%ecx, %ecx
        SHL $10, %ecx ; make space for L2 index
        PUSH %ecx
        MOV %esp, %ecx
        ADD $12, %ecx ; L2 page table index
        OR *%ecx, *%esp ; combine pd index and L2 index
        POP %ecx ; vpn
        SHL $12, %ecx ; virtual address
        PUSH %ecx
        PUSH %eax ; frame base address

        MOV %esp, %ecx
        ADD $32, %ecx ; stack offset for orig ebx struct
        MOV *%ecx, %ecx ; get struct
        ADD $20, %ecx ; struct offset for PID
        PUSH *%ecx ; put PID on stack
        DEV $CONST_DEV_COMMAND_FRAME_MAPPED_SIGNAL, $0
        ; dev command popped last three stack entries

        PUSH %eax ; save frame base address for later

        ; setup read to frame

        MOV %esp, %ecx
        ADD $4, %ecx
        PUSH *%ecx ; remainder of program as buffer size

        MOV %esp, %ecx
        ADD $4, %ecx ; +4 because buffer size got pushed
        PUSH *%ecx ; buffer pointer = frame start address

        MOV %esp, %ecx
        ADD $36, %ecx ; offset to original ebx on stack
        MOV *%ecx, %ecx
        PUSH *%ecx ; push file descriptor, first struct entry
        MOV %esp, %ebx ; set ebx for file read

        DEV $CONST_DEV_COMMAND_CPU_IS_MEMORY_VIRTUALIZATION_ENABLED, $0
        PUSH %eax ; is virtualization enabled
        DEV $CONST_DEV_COMMAND_CPU_DISABLE_MEMORY_VIRTUALIZATION, $0

        PUSH %edx ; save stack return
        ; SYSCALLS_FILE_READ
        ; Parameters (ebx is a pointer to the following struct):
        ;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
        ;   *(ebx+4)   pointer to buffer, this buffer will be filled by the file system
        ;   *(ebx+8)   buffer size, limits the amount of bytes that will be read
        ; Return value (immediate value):
        ;   eax     success status (>=0 = number of bytes read, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = no console input ready)
        CALL SYSCALLS_FILE_READ
        POP %edx ; restore stack return
        CMP $0, %eax
        JGE _UTIL_LOAD_SEGMENT_REMAINDER_READ_NO_ERROR
            POP %ebx
            CMP $0, %ebx
            JE _UTIL_LOAD_SEGMENT_SKIP_MEMORY_VIRTUALIZATION_REMAINDER_ERROR
                DEV $CONST_DEV_COMMAND_CPU_ENABLE_MEMORY_VIRTUALIZATION, $0
            ._UTIL_LOAD_SEGMENT_SKIP_MEMORY_VIRTUALIZATION_REMAINDER_ERROR:

            MOV %edx, %esp
            POP %ebx
            POP %ecx
            POP %eax
            MOV $-1, %eax
            RET
        ._UTIL_LOAD_SEGMENT_REMAINDER_READ_NO_ERROR:

        POP %ebx ; virtualization
        CMP $0, %ebx
        JE _UTIL_LOAD_SEGMENT_SKIP_VIRT_REMAINDER
        DEV $CONST_DEV_COMMAND_CPU_ENABLE_MEMORY_VIRTUALIZATION, $0

        ._UTIL_LOAD_SEGMENT_SKIP_VIRT_REMAINDER:
        ADD $12, %esp ; remove struct from read from stack

        ; Map remainder frame into page table
        MOV %esp, %ebx
        ADD $28, %ebx ; offset to original ebx struct on stack
        MOV *%ebx, %ebx ; dereference struct
        ADD $4, %ebx ; page directory base address offset
        MOV *%ebx, %eax ; pd base

        ; page directory entry
        MOV %esp, %ebx
        ADD $8, %ebx ; pd index offset
        MOV *%ebx, %ecx
        SHL $2, %ecx ; calculate offset
        ADD %ecx, %eax ; pd entry address
        MOV *%eax, %eax ; pd entry
        AND $0xFFFFF, %eax ; remove flags
        SHL $12, %eax ; L2 base

        ; L2 entry

        ADD $4, %ebx ; page table index offset
        MOV *%ebx, %ecx ; page table index
        SHL $2, %ecx ; byte offset in L2
        ADD %ecx, %eax ; L2 entry address

        POP %ecx ; frame start address
        AND $0xFFFFF000, %ecx ; get frame number
        SHR $12, %ecx

        MOV %esp, %ebx
        ADD $24, %ebx ; stack offset to original ebx
        MOV *%ebx, %ebx ; ebx struct
        ADD $16, %ebx ; struct offset for flags
        MOV *%ebx, %ebx ; page table flags
        SHL $20, %ebx ; shift flags into place
        OR %ebx, %ecx ; set page table flags
        MOV %ecx, *%eax ; write page table entry


    ._UTIL_LOAD_SEGMENT_FIND_FRAMES_END:
        MOV %edx, %esp ; restore stack to entry after saving original registers
        
        ;Restore registers
        POP %ebx
        POP %ecx
        POP %eax
        MOV $0, %eax ; 0 = success
        RET
