; Searches for a free page table, marks it as used and returns the base address
; UTIL_ALLOCATE_PAGE_TABLE
; Parameters 
;   none
; Return value (immediate value):
;   eax     page table base address (0xFFFFFFFF = invalid)
.UTIL_ALLOCATE_PAGE_TABLE:

    PUSH %ebx
    PUSH %ecx

    DEV $CONST_DEV_COMMAND_CPU_IS_MEMORY_VIRTUALIZATION_ENABLED, $0
    PUSH %eax ; is virtualization enabled
    DEV $CONST_DEV_COMMAND_CPU_DISABLE_MEMORY_VIRTUALIZATION, $0

    ; find free page table
    MOV $CONST_OS_PAGE_TABLE_BITMAP_START, %eax

    ._UTIL_ALLOCATE_PAGE_TABLE_WALK_PAGE_TABLE_BITMAP_START:
        CMP $CONST_OS_PAGE_TABLE_BITMAP_END, %eax ; end of bitmap reached?
        JAE _UTIL_ALLOCATE_PAGE_TABLE_NO_PAGE_TABLE_FREE

        MOV *%eax, %ebx ; get content
        MOV $0, %ecx ; set bit counter to zero

    ._UTIL_ALLOCATE_PAGE_TABLE_WALK_REGISTER_START:
        CMP $32, %ecx ; tested all 32 bits?
        JE _UTIL_ALLOCATE_PAGE_TABLE_NEXT_DOUBLE_WORD
        TEST $0x80000000, %ebx ; $0x80000000 = bitmask to check first byte
        JZ _UTIL_ALLOCATE_PAGE_TABLE_FOUND_FREE_PAGE_TABLE ; is left most bit zero, free page table found
        SHL $1, %ebx
        ADD $1, %ecx ; otherwise increase counter and try again
        JMP _UTIL_ALLOCATE_PAGE_TABLE_WALK_REGISTER_START

    ._UTIL_ALLOCATE_PAGE_TABLE_NEXT_DOUBLE_WORD:
        ADD $4, %eax
        JMP _UTIL_ALLOCATE_PAGE_TABLE_WALK_PAGE_TABLE_BITMAP_START

    ._UTIL_ALLOCATE_PAGE_TABLE_FOUND_FREE_PAGE_TABLE:
        MOV $0x80000000, %ebx ; $0x80000000 = bitmask to check first byte
        SHR %ecx, %ebx
        OR %ebx, *%eax ; set the bit at the index to 1, marking page table as used
        SUB $CONST_OS_PAGE_TABLE_BITMAP_START, %eax ; calculate the index of the dword in the bitmap
        SHL $3, %eax ; multiply by 8
        ADD %ecx, %eax ; eax now contains index of first zero in bitmap

        ; calculate page table base address
        SHL $CONST_OS_PAGE_TABLE_BIT_SIZE, %eax ; multiply index by size of one page table
        ADD $CONST_OS_PAGE_TABLE_LIST_START, %eax ; eax now holds address of first free page table

        PUSH %eax ; save free page table base address
        MOV %eax, %ebx
        ; UTIL_INITIALIZE_PAGE_TABLE
        ; Parameters (ebx is a pointer to the start of the Page Table):
        ;   (ebx)     Pointer to the Page Table base address
        ; Return value (immediate value):
        ;   none
        CALL UTIL_INITIALIZE_PAGE_TABLE
        POP %eax ; restore free page table base address

        POP %ebx ; was virtualization enabled
        CMP $0, %ebx
        JE _ALLOCATE_PAGE_TABLE_SKIP_MEMORY_VIRTUALIZATION
        DEV $CONST_DEV_COMMAND_CPU_ENABLE_MEMORY_VIRTUALIZATION, $0

    ._ALLOCATE_PAGE_TABLE_SKIP_MEMORY_VIRTUALIZATION:
        POP %ecx
        POP %ebx
        RET

    ._UTIL_ALLOCATE_PAGE_TABLE_NO_PAGE_TABLE_FREE:
        POP %ebx ; was virtualization enabled
        CMP $0, %ebx
        JE _ALLOCATE_PAGE_TABLE_ERROR_SKIP_MEMORY_VIRTUALIZATION
            DEV $CONST_DEV_COMMAND_CPU_ENABLE_MEMORY_VIRTUALIZATION, $0
        ._ALLOCATE_PAGE_TABLE_ERROR_SKIP_MEMORY_VIRTUALIZATION:

        MOV $0xFFFFFFFF, %eax
        POP %ecx
        POP %ebx
        RET
