; UTIL_LOAD_UNINITIALIZED_SEGMENT
; Parameters
;   ebx holds the start of the following struct
;   ebx + 16 = process id
;   ebx + 12 = page table flags
;   ebx +  8 = segment virtual memory start address
;   ebx +  4 = segment size in bytes
;   ebx      = page directory base address
; Return value (immediate value):
;   eax success status (0 = success, -1 = error)
.UTIL_LOAD_UNINITIALIZED_SEGMENT:
PUSH %eax
PUSH %ecx
PUSH %ebx
MOV %esp, %edx ; stack return point on exit
; calculate needed full frames
MOV %ebx, %ecx ; get struct pointer
ADD $4, %ecx ; offset in struct for segment size
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
ADD $8, %ecx ; offset in struct for virtual address
MOV *%ecx, %ecx ; virtual start address of segment
MOV %ecx, %ebx ; copy virtual address
SHR $22, %ebx
AND $0x3FF, %ebx ; extract page directory index
SHR $12, %ecx
AND $0x3FF, %ecx ; extract L2 index


PUSH %ecx ; push page table index onto stack
PUSH %ebx ; push page directory index onto stack

CMP $0, %eax ; check if needed frames is 0, yes -> data smaller than 1 frame
JE _UTIL_LOAD_UNINITIALIZED_SEGMENT_REMAINDER_CHECK

._UTIL_LOAD_UNINITIALIZED_SEGMENT_ALLOCATE_FRAMES:
        PUSH %edx ; save stack return
        ; UTIL_ALLOCATE_FRAME
        ; Parameters 
        ;   none
        ; Return value (immediate value):
        ;   eax     frame address (0xFFFFFFFF = invalid)
        CALL UTIL_ALLOCATE_FRAME
        POP %edx ; restore stack return
        CMP $0xFFFFFFFF, %eax
        JNE _UTIL_LOAD_UNINITIALIZED_SEGMENT_ALLOCATE_FRAME_NO_ERROR
            ; error
            MOV %edx, %esp
            POP %ebx
            POP %ecx
            POP %eax
            MOV $-1, %eax
            RET

    ._UTIL_LOAD_UNINITIALIZED_SEGMENT_ALLOCATE_FRAME_NO_ERROR:
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
        ADD $16, %ecx ; offset for PID
        PUSH *%ecx ; put PID on stack
        DEV $CONST_DEV_COMMAND_FRAME_MAPPED_SIGNAL, $0
        ; dev popped last three values from stack

        PUSH %eax ; Push the frame start address onto the stack

        ; initialize frame with 0s

        DEV $CONST_DEV_COMMAND_CPU_IS_MEMORY_VIRTUALIZATION_ENABLED, $0
        PUSH %eax ; is virtualization enabled
        DEV $CONST_DEV_COMMAND_CPU_DISABLE_MEMORY_VIRTUALIZATION, $0

        ; eax = frame start address
        MOV $CONST_OS_FRAME_SIZE, %ebx ; pop segment size
        MOV $0, %ecx ; set counter

        ; eax = v-address
        ; ebx = size
        ; ecx counter
        ._UTIL_LOAD_UNINITIALIZED_SEGMENT_INITIALIZE_FULL_FRAME_LOOP_START:
        
        CMP %ebx, %ecx
        JAE _UTIL_LOAD_UNINITIALIZED_SEGMENT_INITIALIZE_FULL_FRAME_SKIP
        ADD $4, %ecx
        MOV $0, *%eax
        ADD $4, %eax
        JMP _UTIL_LOAD_UNINITIALIZED_SEGMENT_INITIALIZE_FULL_FRAME_LOOP_START

        ._UTIL_LOAD_UNINITIALIZED_SEGMENT_INITIALIZE_FULL_FRAME_SKIP:

        POP %ebx ; was virtualization enabled
        CMP $0, %ebx
        JE _UTIL_LOAD_UNINITIALIZED_SEGMENT_FULL_FRAME_SKIP_MEMORY_VIRTUALIZATION
        DEV $CONST_DEV_COMMAND_CPU_ENABLE_MEMORY_VIRTUALIZATION, $0

        ._UTIL_LOAD_UNINITIALIZED_SEGMENT_FULL_FRAME_SKIP_MEMORY_VIRTUALIZATION:

        ; map the frame into the virtual memory space

        ; *(%esp+16) = number of needed frames
        ; *(%esp+12) = number of written frames
        ; *(%esp+8) = page table index
        ; *(%esp+4) = page directory index
        ; *(%esp) = frame start address


        MOV %esp, %ebx ; get ebx back
        ADD $24, %ebx ; original ebx struct
        MOV *%ebx, %ebx ; dereference struct
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
        ADD $12, %ebx ; offset in struct for flags
        MOV *%ebx, %ebx ; get flags
        SHL $20, %ebx ; shift flags into place
        OR %ebx, %ecx ; set entry flags
        MOV %ecx, *%eax ; write entry

        ; increment L2 page table index
        MOV %esp, %eax
        ADD $4, %eax
        ADD $1, *%eax
        CMP $1024, *%eax ; has the L2 page table been filled?
        JNE _UTIL_LOAD_UNINITIALIZED_SEGMENT_L2_NOT_FULL
        MOV $0, *%eax ; reset L2 index
        SUB $4, %eax ; page directory index
        ADD $1, *%eax ; increase page directory index

    ._UTIL_LOAD_UNINITIALIZED_SEGMENT_L2_NOT_FULL:
        MOV %esp, %eax
        ADD $12, %eax ; number of needed frames pointer

        MOV %esp, %ebx
        ADD $8, %ebx ; number of written frames pointer
        ADD $1, *%ebx ; increase number of written frames
        CMP *%eax, *%ebx ; all frames written?
        JE _UTIL_LOAD_UNINITIALIZED_SEGMENT_REMAINDER_CHECK ; all full frames mapped, check for remainder

        JMP _UTIL_LOAD_UNINITIALIZED_SEGMENT_ALLOCATE_FRAMES

    ._UTIL_LOAD_UNINITIALIZED_SEGMENT_REMAINDER_CHECK:
        ; Remainder = segment size % frame size
        MOV %esp, %eax
        ADD $16, %eax ; pointer code size on stack from the beginning
        MOV *%eax, %ecx ; ecx now has code size
        AND $0xFFF, %ecx ; 4096 - 1 = 0x1000 - 1 = 0xFFF for modulo
        CMP $0, %ecx
        JE _UTIL_LOAD_UNINITIALIZED_SEGMENT_FIND_FRAMES_END ; no remainder left

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
        JNE _UTIL_LOAD_UNINITIALIZED_SEGMENT_ALLOCATE_REMAINDER_FRAME_NO_ERROR
            MOV %edx, %esp
            POP %ebx
            POP %ecx
            POP %eax
            MOV $-1, %eax
            RET
        ._UTIL_LOAD_UNINITIALIZED_SEGMENT_ALLOCATE_REMAINDER_FRAME_NO_ERROR:

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
        ADD $16, %ecx ; struct offset for PID
        PUSH *%ecx ; put PID on stack
        DEV $CONST_DEV_COMMAND_FRAME_MAPPED_SIGNAL, $0
        ; dev command popped last three stack entries

        PUSH %eax ; save frame base address for later

        ; initialize frame with 0s

        DEV $CONST_DEV_COMMAND_CPU_IS_MEMORY_VIRTUALIZATION_ENABLED, $0
        PUSH %eax ; is virtualization enabled
        DEV $CONST_DEV_COMMAND_CPU_DISABLE_MEMORY_VIRTUALIZATION, $0

        MOV %esp, %eax
        ADD $4, %eax
        MOV *%eax, %eax ; frame start address
        MOV %esp, %ebx
        ADD $8, %ebx
        MOV *%ebx, %ebx ; remainder of program as buffer size
        MOV $0, %ecx ; set counter

        ; eax = v-address
        ; ebx = size
        ; ecx counter
        ._UTIL_LOAD_UNINITIALIZED_SEGMENT_INITIALIZE_PARTIAL_FRAME_LOOP_START:
        
        CMP %ebx, %ecx
        JAE _UTIL_LOAD_UNINITIALIZED_SEGMENT_INITIALIZE_PARTIAL_FRAME_SKIP
        ADD $4, %ecx
        MOV $0, *%eax
        ADD $4, %eax
        JMP _UTIL_LOAD_UNINITIALIZED_SEGMENT_INITIALIZE_PARTIAL_FRAME_LOOP_START

        ._UTIL_LOAD_UNINITIALIZED_SEGMENT_INITIALIZE_PARTIAL_FRAME_SKIP:

        POP %ebx ; was virtualization enabled
        CMP $0, %ebx
        JE _UTIL_LOAD_UNINITIALIZED_SEGMENT_PARTIAL_FRAME_SKIP_MEMORY_VIRTUALIZATION
        DEV $CONST_DEV_COMMAND_CPU_ENABLE_MEMORY_VIRTUALIZATION, $0

        ._UTIL_LOAD_UNINITIALIZED_SEGMENT_PARTIAL_FRAME_SKIP_MEMORY_VIRTUALIZATION:

        ; Map remainder frame into page table
        MOV %esp, %ebx
        ADD $28, %ebx ; offset to original ebx struct on stack
        MOV *%ebx, %ebx ; dereference struct
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
        ADD $12, %ebx ; struct offset for flags
        MOV *%ebx, %ebx ; page table flags
        SHL $20, %ebx ; shift flags into place
        OR %ebx, %ecx ; set page table flags
        MOV %ecx, *%eax ; write page table entry

    ._UTIL_LOAD_UNINITIALIZED_SEGMENT_FIND_FRAMES_END:
        MOV %edx, %esp ; restore stack to entry after saving original registers
        
        ;Restore registers
        POP %ebx
        POP %ecx
        POP %eax
        MOV $0, %eax ; 0 = success
        RET
