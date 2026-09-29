; Interrupt ISR for a Page Fault (0x0E)
.INTERRUPTS_PAGE_FAULT:
    PUSH %eax
    PUSH %ebx
    PUSH %ecx

    MOV %esp, %ecx
    ADD $12, %ecx
    MOV *%ecx, %ecx
    PUSH %ecx ; save fault address

    ; ecx contains the address that caused the page fault

    ; extract page directory table index

    SHR $22, %ecx 
    SHL $2, %ecx ; calculate byte offset

    MOV $CONST_OS_CURRENT_PCB_POINTER, %ebx
    MOV *%ebx, %ebx ; PCB Pointer
    ADD $2, %ebx ; point to page directory table 
    MOV *%ebx, %eax ; page directory base address

    ADD %eax, %ecx ; address of page table directory entry

    MOV *%ecx, %eax ; page directory table entry
    TEST $0x80000000, %eax ; present bit set? 0x800 = matches present bit = 1
    JNZ _INTERRUPTS_PAGE_FAULT_FIND_PAGE_TABLE_INDEX ; if the present bit was set, do not create new L2 page table and jump
    ; L2 page table was not present, allocate and map
    ; ecx pointer to page directory table

    PUSH %ecx

    ; Searches for a free page table, marks it as used and returns the base address
    ; UTIL_ALLOCATE_PAGE_TABLE
    ; Parameters 
    ;   none
    ; Return value (immediate value):
    ;   eax     page table base address (0xFFFFFFFF = invalid)
    CALL UTIL_ALLOCATE_PAGE_TABLE
    CMP $0xFFFFFFFF, %eax
    JNE _INTERRUPTS_PAGE_FAULT_NO_ALLOCATE_PAGE_TABLE_FAULT
    ; No page table free, for now just kill process
    CALL SYSCALLS_PROCESS_EXIT
    
    ._INTERRUPTS_PAGE_FAULT_NO_ALLOCATE_PAGE_TABLE_FAULT:
        POP %ecx ; ecx page directory table entry pointer

        AND $0xFFF00000, *%ecx ;delete any old mapping, keep flags
        OR $0x80000000, *%ecx ;set present bit

        SHR $12, %eax ; make space for flags
        AND $0xFFFFF, %eax ; make sure any flags are removed
        OR %eax, *%ecx ; update entry without changing flags

    ._INTERRUPTS_PAGE_FAULT_FIND_PAGE_TABLE_INDEX:
        ; ecx contains pointer to page directory table entry
        MOV *%ecx, %ecx
        AND $0xFFFFF, %ecx ; remove flags
        SHL $12, %ecx ; physical address of L2 page table

        MOV *%esp, %ebx

        ; ebx fault address
        ; ecx physical address of L2 page table
        ; extract page table index
        AND $0x3FF000, %ebx ; 0x003FF000 masks the L2 page table index in the virtual address (10 bit pd index + 10 bit L2 index + 12 bit offset)
        SHR $12, %ebx ; page table index
        SHL $2, %ebx ; calculate byte offset
        ADD %ecx, %ebx ; ebx contains target address of page table entry

        ; UTIL_ALLOCATE_FRAME
        ; Parameters 
        ;   none
        ; Return value (immediate value):
        ;   eax     frame base address (0xFFFFFFFF = invalid)
        CALL UTIL_ALLOCATE_FRAME

        CMP $0xFFFFFFFF, %eax
        JNE _INTERRUPTS_PAGE_FAULT_NO_ALLOCATE_FRAME_FAULT
        ; No free memory, for now just kill process
        ; TODO implement swapping
        CALL SYSCALLS_PROCESS_EXIT

    ._INTERRUPTS_PAGE_FAULT_NO_ALLOCATE_FRAME_FAULT:
        ; inform simulator that frame has been allocated
        ; FRAME_MAPPED_SIGNAL
        ; (esp+8) fault address
        ; (esp+4) frame address
        ; (esp)   process id
        ; values get popped from stack
        PUSH %eax
        MOV $CONST_OS_CURRENT_PCB_POINTER, %ecx
        MOV *%ecx, %ecx ; PCB pointer
        MOV *%ecx, %ecx ; PCB content
        AND $0xFF000000, %ecx ; first byte is PID
        SHR $24, %ecx
        PUSH %ecx
        DEV $CONST_DEV_COMMAND_FRAME_MAPPED_SIGNAL, $0

        ; eax frame address
        ; ebx page table entry address

        AND $0xFFF00000, *%ebx  ; delete old mapping
        OR $0x80000000, *%ebx ; set present bit

        SHR $12, %eax ; make space for flags
        AND $0xFFFFF, %eax ; make sure any flags are removed
        OR %eax, *%ebx ; update entry without changing flags

        POP %ecx
        POP %ebx
        POP %eax
        ADD $4, %esp ; "pop" the address that caused the page fault
IRET