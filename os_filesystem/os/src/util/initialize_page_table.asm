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
;   (ebx)     Pointer to the Page Table base address
; Return value (immediate value):
;   none
.UTIL_INITIALIZE_PAGE_TABLE:   
    PUSH %eax
    PUSH %ebx
    PUSH %ecx

    DEV $CONST_DEV_COMMAND_CPU_IS_MEMORY_VIRTUALIZATION_ENABLED, $0
    PUSH %eax ; is virtualization enabled
    DEV $CONST_DEV_COMMAND_CPU_DISABLE_MEMORY_VIRTUALIZATION, $0

    MOV $0, %eax ; set counter to zero

    ._INITIALIZE_PAGE_TABLE_START:
        CMP $CONST_OS_PAGE_TABLE_SIZE, %eax
        JGE _PAGE_TABLE_INITIALIZATION_DONE
        MOV $0x40000000, *%ebx ; $0x40000000 = writeable bit set
        ADD $4, %eax
        ADD $4, %ebx
        JMP _INITIALIZE_PAGE_TABLE_START
        
    ._PAGE_TABLE_INITIALIZATION_DONE:
        POP %ebx ; was virtualization enabled
        CMP $0, %ebx
        JE _UTIL_INITIALIZE_PAGE_TABLE_SKIP_MEMORY_VIRTIALIZATION
        DEV $CONST_DEV_COMMAND_CPU_ENABLE_MEMORY_VIRTUALIZATION, $0

    ._UTIL_INITIALIZE_PAGE_TABLE_SKIP_MEMORY_VIRTIALIZATION:
        POP %ecx
        POP %ebx
        POP %eax
        ; Page Table Is Set Up
        RET