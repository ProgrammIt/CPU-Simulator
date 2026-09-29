
; searches for an unused frame and returns it
; if memory is "full" it returns the address 0xFFFFFFFF as invalid
; otherwise it returns the start address of the frame

; UTIL_ALLOCATE_FRAME
; Parameters 
;   none
; Return value (immediate value):
;   eax     frame base address (0xFFFFFFFF = invalid)
.UTIL_ALLOCATE_FRAME:
    PUSH %ebx
    PUSH %ecx
    MOV $0, %ecx
    
    ; find free frame
        
    MOV $CONST_OS_MEMORY_BITMAP_START, %eax

    ._UTIL_ALLOCATE_FRAME_WALK_MEMORY_BITMAP_START:
        CMP $CONST_OS_MEMORY_BITMAP_END, %eax ; end of bitmap reached?
        JAE _UTIL_ALLOCATE_FRAME_ALLOCATE_FRAME_NO_FRAME_FOUND

        MOV *%eax, %ebx ; get content
        MOV $0, %ecx ; set bit counter to zero

    ._UTIL_ALLOCATE_FRAME_WALK_REGISTER_START:
        CMP $32, %ecx ; tested all 32 bits?
        JE _UTIL_ALLOCATE_FRAME_NEXT_DOUBLE_WORD
        TEST $0x80000000, %ebx
        JZ _UTIL_ALLOCATE_FRAME_FOUND_FREE_FRAME ; is the left most bit zero, frame found
        SHL $1, %ebx
        ADD $1, %ecx ; otherwise increase counter and try again
        JMP _UTIL_ALLOCATE_FRAME_WALK_REGISTER_START

    ._UTIL_ALLOCATE_FRAME_NEXT_DOUBLE_WORD:
        ADD $4, %eax
        JMP _UTIL_ALLOCATE_FRAME_WALK_MEMORY_BITMAP_START

    ._UTIL_ALLOCATE_FRAME_FOUND_FREE_FRAME:
        MOV $0x80000000, %ebx
        SHR %ecx, %ebx
        OR %ebx, *%eax ; set the bit at the index to 1, marking frame as used
        SUB $CONST_OS_MEMORY_BITMAP_START, %eax
        SHL $3, %eax ; multiply by 8
        ADD %ecx, %eax ; eax now contains index of first zero in bitmap
        
        ; calculate frame base address
        SHL $CONST_OS_FRAME_BIT_SIZE, %eax ; multiply index by size of one frame
        ADD $CONST_USER_MEMORY_START, %eax ; eax now holds address of first free frame
        POP %ecx
        POP %ebx
        RET

    ._UTIL_ALLOCATE_FRAME_ALLOCATE_FRAME_NO_FRAME_FOUND:
        POP %ecx
        POP %ebx
        MOV $0xFFFFFFFF, %eax
        RET

