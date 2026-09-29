; UTIL_INITIALIZE_PAGE_DIRECTORY_TABLE
; Parameters (ebx is a pointer to the start of the Page Table):
;   (ebx)     Pointer to the Page Table base address
; Return value (immediate value):
;   none
.UTIL_INITIALIZE_PAGE_DIRECTORY_TABLE:
    PUSH %eax
    PUSH %ebx
    PUSH %ecx
    PUSH %edx

    DEV $CONST_DEV_COMMAND_CPU_IS_MEMORY_VIRTUALIZATION_ENABLED, $0
    PUSH %eax ; is virtualization enabled
    DEV $CONST_DEV_COMMAND_CPU_DISABLE_MEMORY_VIRTUALIZATION, $0

    PUSH %ebx ; page directory table base address
    PUSH $768 ; index in page directory table 768 = start of kernel space
    PUSH $CONST_OS_PAGE_TABLE_LIST_START ; current L2 memory map base address

    ; Stack Layout:
    ; esp + 8 page directory base address
    ; esp + 4  page directory index
    ; esp +   current L2 memory map base address

    ._UTIL_INITIALIZE_PAGE_DIRECTORY_TABLE_START:
        MOV %esp, %ebx
        ADD $4, %ebx
        CMP $1024, *%ebx ; reached end of page directory table?
        JGE _UTIL_INITIALIZE_PAGE_DIRECTORY_TABLE_DONE

        MOV *%esp, %eax

        ; format page directory entry
        AND $0xFFFFF000, %eax ; calculate the address part of the page table entry
        SHR $12, %eax ; make space for the flags (12)
        OR $0x80000000, %eax ; 8 = Present bit set, access control on L2 level
        
        ; write entry to page directory entry
        MOV %esp, %ecx
        ADD $8, %ecx
        MOV *%ecx, %ecx ; page directory base address
        MOV %esp, %ebx
        ADD $4, %ebx
        MOV *%ebx, %ebx ; current pde index
        SHL $2, %ebx ; byte offset in pde
        ADD %ecx, %ebx ; ebx pointer to pde entry
        MOV %eax, *%ebx ; write to page directory


        ; increase pde index
        MOV %esp, %eax
        ADD $4, %eax
        ADD $1, *%eax
        ; increase L2 page table base address
        MOV %esp, %edx
        ADD $CONST_OS_PAGE_TABLE_SIZE, *%edx

        JMP _UTIL_INITIALIZE_PAGE_DIRECTORY_TABLE_START

    ._UTIL_INITIALIZE_PAGE_DIRECTORY_TABLE_DONE:
        ADD $12, %esp ; clear variables from stack

        POP %ebx ; was virtualization enabled
        CMP $0, %ebx
        JE _INITIALIZE_PAGE_DIRECTORY_TABLE_SKIP_MEMORY_VIRTUALIZATION_NO_ERROR
        DEV $CONST_DEV_COMMAND_CPU_ENABLE_MEMORY_VIRTUALIZATION, $0

    ._INITIALIZE_PAGE_DIRECTORY_TABLE_SKIP_MEMORY_VIRTUALIZATION_NO_ERROR:
        POP %edx
        POP %ecx
        POP %ebx
        POP %eax
        RET
