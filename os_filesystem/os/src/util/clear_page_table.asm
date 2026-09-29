; UTIL_CLEAR_PAGE_TABLE
; Parameters:
;   (ebx)     Page directory index
;   (ecx)     L2 page table base address
; Return value (immediate value):
;   none
.UTIL_CLEAR_PAGE_TABLE:
    PUSH %eax
    PUSH %ebx
    PUSH %ecx
    PUSH %edx

    DEV $CONST_DEV_COMMAND_CPU_IS_MEMORY_VIRTUALIZATION_ENABLED, $0
    PUSH %eax ; is virtualization enabled
    DEV $CONST_DEV_COMMAND_CPU_DISABLE_MEMORY_VIRTUALIZATION, $0

    PUSH %ebx ; page directory index

    MOV %ecx, %eax
    MOV $0, %ebx ; index counter

    ._UTIL_CLEAR_PAGE_TABLE_WALK_START:
        CMP $1024, %ebx
        JGE _UTIL_CLEAR_PAGE_TABLE_WALK_DONE
        ; calculate entry address
        MOV %ebx, %ecx
        SHL $2, %ecx
        ADD %eax, %ecx ; index * 4 (byte) + base
        MOV %ecx, %edx ; create copy of page table entry address

        MOV *%ecx, %ecx ; ecx contains page table entry now
        MOV $0, *%edx ; clear page table entry
        TEST $0x80000000, %ecx ; present bit set?
        JZ _UTIL_CLEAR_PAGE_TABLE_SKIP_ENTRY
        AND $0xFFFFF, %ecx ; strip flags
        SHL $12, %ecx ; get frame base address

        PUSH %eax
        PUSH %ebx
        PUSH %ecx
        MOV %ecx, %ebx

        ; UTIL_CLEAR_FRAME
        ; Parameters:
        ;   (ebx)     Pointer to the frame base address
        ; Return value (immediate value):
        ;   none
        CALL UTIL_CLEAR_FRAME

        ; inform simulator that frame has been freed
        ; FRAME_UNMAPPED_SIGNAL
        ; (esp+8) virtual address
        ; (esp+4) frame address
        ; (esp)   process id
        ; values get popped from stack

        MOV %esp, %eax
        ADD $12, %eax
        MOV *%eax, %eax ; eax page directory index
        SHL $10, %eax ; make space for L2 index
        PUSH %eax
        MOV %esp, %eax
        ADD $8, %eax
        OR *%eax, *%esp ; create vpn
        SHL $12, *%esp ; virtual address
        MOV %esp, %eax
        ADD $4, %eax
        MOV *%eax, %eax
        PUSH %eax ; push physical address

        MOV $CONST_OS_CURRENT_PCB_POINTER, %eax
        MOV *%eax, %eax ; PCB pointer
        MOV *%eax, %eax ; PCB content
        AND $0xFF000000, %eax ; first byte is PID
        SHR $24, %eax
        PUSH %eax ; put pid on stack
        DEV $CONST_DEV_COMMAND_FRAME_UNMAPPED_SIGNAL, $0 ; DEV command pops 3 entries from stack

        ; clear bit in memory bitmap
        POP %eax
        MOV $CONST_USER_MEMORY_START, %ebx
        MOV $CONST_OS_MEMORY_BITMAP_START, %ecx

        ; eax frame base address
        ; ebx memory start address
        ; ecx memory bitmap start address

        SUB %ebx, %eax
        SHR $CONST_OS_FRAME_BIT_SIZE, %eax ; global index of frame

        ; find word offset in bitmap
        MOV %eax, %ebx
        SHR $5, %ebx ; word index (global index / 32) division by 32 because each dword has 32 bit
        SHL $2, %ebx ; byte offset in bitmap (word index * 4) each dword has 4 byte so multiply by 4
        ADD %ebx, %ecx ; memory address of dword in bitmap

        ; find bit position in dword
        AND $31, %eax ; AND $31 = modulo 32
        MOV %eax, %ebx ; index of the bit

        ; create mask to clear bit
        MOV $0x80000000, %eax ; bitmask with first bit set
        SHR %ebx, %eax ; shift bit into position to create bitmask
        NOT %eax ; invert to zero specific bit

        ; eax bitmask
        ; ecx memory address bitmap

        MOV *%ecx, %ebx ; load dword from bitmap
        AND %eax, %ebx ; apply mask
        MOV %ebx, *%ecx ; write back to bitmap

        POP %ebx
        POP %eax

    ._UTIL_CLEAR_PAGE_TABLE_SKIP_ENTRY:
        ADD $1, %ebx
        JMP _UTIL_CLEAR_PAGE_TABLE_WALK_START
        

    ._UTIL_CLEAR_PAGE_TABLE_WALK_DONE:
        POP %ebx ; clear page directory index from stack

        ; clear page table bitmap 

        MOV $CONST_OS_PAGE_TABLE_LIST_START, %ebx
        MOV $CONST_OS_PAGE_TABLE_BITMAP_START, %ecx

        ; eax page table base address
        ; ebx page table list start address
        ; ecx page table bitmap start address

        SUB %ebx, %eax
        SHR $CONST_OS_PAGE_TABLE_BIT_SIZE, %eax ; global index of page table

        ; find word offset in bitmap
        MOV %eax, %ebx
        SHR $5, %ebx ; word index (global index / 32)
        SHL $2, %ebx ; byte offset in bitmap (word index * 4)
        ADD %ebx, %ecx ; memory address of dword in bitmap

        ; find bit position
        AND $31, %eax 
        MOV $31, %ebx
        SUB %eax, %ebx ; index of the bit

        ; create mask to clear bit
        MOV $1, %eax
        SHL %ebx, %eax ; shift bit into position
        NOT %eax ; invert to zero specific bit

        ; eax bitmask
        ; ecx memory address bitmap

        MOV *%ecx, %ebx ; load dword from bitmap
        AND %eax, %ebx ; apply mask
        MOV %ebx, *%ecx ; write back to bitmap


        POP %ebx ; was virtualization enabled
        CMP $0, %ebx
        JE _CLEAR_PAGE_TABLE_SKIP_MEMORY_VIRTUALIZATION
        DEV $CONST_DEV_COMMAND_CPU_ENABLE_MEMORY_VIRTUALIZATION, $0

    ._CLEAR_PAGE_TABLE_SKIP_MEMORY_VIRTUALIZATION:
        POP %edx
        POP %ecx
        POP %ebx
        POP %eax
        RET