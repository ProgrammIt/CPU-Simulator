; UTIL_CREATE_PCB
; Parameters (ebx is a pointer to the start of an ASCII process name):
;   (ebx)   Pointer to a ASCII process name
; Return value:
;   (eax)   Pointer to the new PCB (0xFFFFFFFF = error)
.UTIL_CREATE_PCB:

    PUSH %ebx ; push the Pointer to a ASCII process name

    MOV $CONST_OS_PCB_LIST_START, %eax

    ADD $CONST_OS_PCB_SIZE, %eax ; First entry is invalid because pid 0 is invalid

    ; Process Control Block layout (1KiB) 0x000 - 0x3FF
    ; 0x03D - 0x3FF unused
    ; 0x03A - 0x03D flags         (4 bytes) \
    ; 0x036 - 0x039 esp           (4 bytes) |
    ; 0x032 - 0x035 eip           (4 bytes) |
    ; 0x02E - 0x031 ecx           (4 bytes) | - CPU registers
    ; 0x02A - 0x02D ebx           (4 bytes) |
    ; 0x026 - 0x039 eax           (4 bytes) /
    ; 0x006 - 0x025 name          (32 characters/bytes)
    ; 0x002 - 0x005 Page table    (4 Bytes)     
    ; 0x001 - 0x001 status        (Runnung, Waiting, Blocked)
    ; 0x000 - 0x000 pid           (Process ID)
    ;

    ; Process ID (pid) definition
    ;
    ; pid = Process ID = 8 bit number
    ; the pid starts at 1 (0 is invalid => A max of 2⁸ - 1 (255) Processes)
    ; Needed Process Wating list size = 255 Bytes but we use 256 for simplicity
    ; Needed Process Blocked list size = 255 Bytesbut we use 256 for simplicity
    ; Init Process has pid of 1

    ; Process Status definition
    ;
    ; 8 bit number => max of 256 states
    ;
    ; we only use 4 : Runnung, Waiting, Blocked and Terminated
    ;
    ; Terminated has the id 0
    ; Runnung    has the id 1
    ; Waiting    has the id 2
    ; Blocked    has the id 3

    ; find a free PCB (with status Terminated)

    MOV $1, %ecx ; keep track of the pid

    ADD $1, %eax ; location of the status bit

    ._UTIL_CREATE_PCB_FIND_FREE:
        MOV *%eax, %ebx ; get status 
        AND $0xFF000000, %ebx
        CMP $0, %ebx
        JE _UTIL_CREATE_PCB_FOUND_FREE ; is this PCB entry free (pid = 0)
        ADD $CONST_OS_PCB_SIZE, %eax
        ADD $1, %ecx ; pid %ecx taken check for %ecx + 1
        CMP $256, %ecx
        JNE _UTIL_CREATE_PCB_FIND_FREE ; check next pid

        ; if here, we failed to find a free PCB -> max process count already reached

        ; return error

        POP %eax ; pop ASCII name
        MOV $0xFFFFFFFF, %eax
        RET

    ._UTIL_CREATE_PCB_FOUND_FREE:
        SUB $1, %eax

        ;eax is the pointer to the new PCB

        PUSH %ecx ; push pid

        PUSH %eax ; push the pointer to the new PCB

        SHL $24, %ecx ; move the id to the msb
        AND $0xFFFFFF, *%eax
        OR %ecx, *%eax ;set pid
        ;SHR $24, %ecx
        ADD $1, %eax

        AND $0xFFFFFF, *%eax
        MOV $CONST_OS_PROCESS_STATUS_WAITING, %ebx
        SHL $24, %ebx
        OR %ebx, *%eax ; set status to to Waiting 
        ADD $1, %eax


        ; find free page table
        PUSH %eax ; save eax
        
        ; Searches for a free page table, marks it as used and returns the base address
        ; UTIL_ALLOCATE_PAGE_TABLE
        ; Parameters 
        ;   none
        ; Return value (immediate value):
        ;   eax     page table base address (0xFFFFFFFF = invalid)
        CALL UTIL_ALLOCATE_PAGE_TABLE

        MOV %eax, %ecx
        POP %eax ; restore eax

        MOV %ecx, *%eax  ; set page table pointer
        ADD $4, %eax

        MOV %ecx, %ebx ; ebx = pointer to the Page Table

        PUSH %eax ; save eax
        PUSH %ecx ; save pointer to page table

        CMP $CONST_OS_PAGE_TABLE_LIST_START, %ebx
        JB _UTIL_CREATE_PCB_INVALID_PAGE_TABLE_POINTER
        CMP $CONST_OS_PAGE_TABLE_LIST_END, %ebx
        JA _UTIL_CREATE_PCB_INVALID_PAGE_TABLE_POINTER

        JMP _UTIL_CREATE_PCB_VALID_PAGE_TABLE_POINTER

        ._UTIL_CREATE_PCB_INVALID_PAGE_TABLE_POINTER:
            POP %eax ; clear pointer to page table from stack
            POP %eax ; eax
            POP %eax ; pcb
            ADD $1, *%eax ; status bit 
            MOV $0, *%eax ; set status to to terminated 
            POP %eax ; pid
            POP %eax ; pop ASCII name
            MOV $0xFFFFFFFF, %eax
            RET
        ._UTIL_CREATE_PCB_VALID_PAGE_TABLE_POINTER:


        POP %ebx
        ; UTIL_INITIALIZE_PAGE_DIRECTORY_TABLE
        ; Parameters (ebx is a pointer to the start of the Page Table):
        ;   (ebx)     Pointer to the Page Table base address
        ; Return value (immediate value):
        ;   none
        CALL UTIL_INITIALIZE_PAGE_DIRECTORY_TABLE

        POP %eax ; restore eax

        ; copy name

        MOV $0, %ecx
        MOV %esp, %ebx
        ADD $7, %ebx ; get the ASCII Pointer - 1

    ._UTIL_CREATE_PCB_COPY_NAME:
        ADD $1, %ebx
        ADD $1, %ecx
        MOV *%ebx, *%eax
        SHL $24, *%eax
        ADD $1, %eax

        CMP $32, %ecx ; did we copy 32 chars
        JZ _UTIL_CREATE_PCB_COPY_NAME_DONE

        CMP $0, *%ebx ; did we just copy the null byte
        JNE _UTIL_CREATE_PCB_COPY_NAME

    ._UTIL_CREATE_PCB_COPY_NAME_DONE:
        MOV $0, *%eax ; make sure last char is a null byte

        MOV $32, %ebx
        SUB %ecx, %ebx
        ADD %ebx, %eax ; To make sure we point to the next PCB element independently from the name length


        ; reset PCB CPU registers 

        ; 0x03A - 0x03D flags         (4 bytes) \
        ; 0x036 - 0x039 esp           (4 bytes) |
        ; 0x032 - 0x035 eip           (4 bytes) |
        ; 0x02E - 0x031 ecx           (4 bytes) | - CPU registers
        ; 0x02A - 0x02D ebx           (4 bytes) |
        ; 0x026 - 0x039 eax           (4 bytes) /

        MOV $0, *%eax   ; eax
        ADD $4, %eax

        MOV $0, *%eax   ; ebx
        ADD $4, %eax

        MOV $0, *%eax   ; ecx
        ADD $4, %eax

        MOV _UTIL_CREATE_PCB_START_POINT, *%eax   ; eip
        ADD $4, %eax

        MOV %esp, %ebx ; get pcb pointer
        MOV *%ebx, %ebx ; ebx = pcb pointer
        ADD $CONST_OS_PCB_KERNEL_STACK_TOP_OFFSET, %ebx
        MOV %ebx, *%eax   ; esp
        ADD $4, %eax

        MOV $0x0, *%eax   ; flags - set cpl and interrupt bit to 0 (kernel mode with interrupts disabled)
        ADD $4, %eax

        ; set fresh time slice
        MOV $CONST_OS_PROCESS_TIME_SLICE_SIZE, %ebx;
        SHL $16, %ebx
        AND $0xFFFF, *%eax
        OR %ebx, *%eax
        ADD $4, %eax

    ; PCB created

    ; Add PCB to the system (PCB Mapping, any status mapping...)

        ; 0xE0100000 - 0xE01003FF - PCB Table Mapping   (256 Entries * 4 Bytes = 1 KiB)                  /

        MOV $CONST_OS_PCB_MAPPING_TABLE_START, %eax ; Get a pointer to the PCB Table Mapping List
        ADD $4, %eax ; First entry is invalid because pid 0 is invalid

        MOV %esp, %ebx
        ADD $4, %ebx ; get pid

        MOV $1, %ecx ; pid counter (entry 0 is invalid)

    ._UTIL_CREATE_PCB_UPDATE_PCB_MAPPING_LIST:
        CMP %ecx, *%ebx
        JE _UTIL_CREATE_PCB_UPDATED_PCB_MAPPING_LIST

        ADD $1, %ecx
        ADD $4, %eax

        JMP _UTIL_CREATE_PCB_UPDATE_PCB_MAPPING_LIST

    ._UTIL_CREATE_PCB_UPDATED_PCB_MAPPING_LIST:

        ; *%esp = pcb pointer

        MOV %esp, %ecx

        MOV *%ecx, *%eax ; update the Mapping

    ; Add to waiting queue

    MOV %esp, %ebx
    ADD $4, %ebx ; get pointer to pid
    MOV *%ebx, %ebx
    CMP $1, %ebx
    JE _UTIL_CREATE_PCB_SKIP_WAITING_QUEUE
    CMP $2, %ebx
    JE _UTIL_CREATE_PCB_SKIP_WAITING_QUEUE

    MOV $CONST_OS_PROCESS_WAITING_QUEUE_START, %eax
    SUB $1, %eax 

    ._UTIL_CREATE_PCB_SEARCH_WAITING_LIST:
        ADD $1, %eax
        MOV *%eax, %ebx
        SHR $24, %ebx
        CMP $0, %ebx ; find next free entry in the queue
        JNE _UTIL_CREATE_PCB_SEARCH_WAITING_LIST ; entry is present
        
        ; entry is free

        ; eax is the pointer to the next free entry in the waiting queue

        MOV %esp, %ebx
        ADD $4, %ebx ; get pointer to pid
        MOV *%ebx, %ebx
        SHL $24, %ebx
        AND $0xFF000000, %ebx
        AND $0xFFFFFF, *%eax
        OR %ebx, *%eax ; add the pid to the queue

    ._UTIL_CREATE_PCB_SKIP_WAITING_QUEUE:


; Process is now initialized in the os data structures

POP %eax ; pcb pointer (return value)

POP %ebx ; pop pid

POP %ebx ; process name

RET


._UTIL_CREATE_PCB_START_POINT:

    ; Activate Memory Virtualization (just in case)
    DEV $CONST_DEV_COMMAND_CPU_ENABLE_MEMORY_VIRTUALIZATION, $0

    PUSH $CONST_KERNEl_MEMORY_START ; push the esp value after iret for the user stack

    PUSH $0xE0 ; eflags

    PUSH $0 ; push the address to return to after iret

    IRET