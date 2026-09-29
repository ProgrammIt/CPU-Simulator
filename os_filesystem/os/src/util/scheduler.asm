

; UTIL_SCHEDULER
; Parameters:
;   none  
; Return value :
;   none
.UTIL_SCHEDULER:
    ;
    ; Process Control Block layout (1KiB) 0x000 - 0x3FF
    ; 0x200 - 0x3FF kernel stack  (512 bytes)
    ; 0x03E - 0x1FF unused
    ; 0x03A - 0x03D eflags        (4 bytes) \
    ; 0x036 - 0x039 esp           (4 bytes) |
    ; 0x032 - 0x035 eip           (4 bytes) |
    ; 0x02E - 0x031 ecx           (4 bytes) | - CPU registers
    ; 0x02A - 0x02D ebx           (4 bytes) |
    ; 0x026 - 0x039 eax           (4 bytes) /
    ; 0x006 - 0x025 name          (32 characters/bytes)
    ; 0x002 - 0x005 Page table *  (4 Bytes)     
    ; 0x001 - 0x001 status        (Runnung, Waiting, Blocked)
    ; 0x000 - 0x000 pid           (Process ID)
    ;
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
    ;

    PUSHF
    PUSH %eax ;save eax value


    MOV $CONST_OS_CURRENT_PCB_POINTER, %eax
    MOV *%eax, %eax ; pcb pointer

    ; save state

    ADD $0x26, %eax

    ; eax
    MOV *%esp, *%eax
    ADD $4, %eax
    ADD $4, %esp ; "pop" saved eax value

    ; ebx
    MOV %ebx, *%eax
    ADD $4, %eax

    ; ecx
    MOV %ecx, *%eax
    ADD $4, %eax

    ; eip
    MOV _UTIL_SCHEDULER_RESCHEDULE, *%eax
    ADD $4, %eax

    ; esp
    MOV %esp, *%eax
    ADD $4, *%eax ; ignore flags
    ADD $4, %eax

    ; eflags
    MOV *%esp, *%eax
    ADD $4, %esp ; "pop" eflgs

    ; state saved

    ; reset time slice counter
    MOV $CONST_OS_CURRENT_PCB_POINTER, %eax
    MOV *%eax, %eax ; pcb pointer

    ADD $CONST_OS_PCB_TIME_SLICE_COUNTER_OFFSET, %eax
    MOV $CONST_OS_PROCESS_TIME_SLICE_SIZE, %ebx
    SHL $16, %ebx
    AND $0xFFFF, *%eax
    OR %ebx, *%eax


    MOV $CONST_OS_CURRENT_PCB_POINTER, %eax
    MOV *%eax, %eax ; pcb pointer

    ; get status
    ADD $1, %eax
    MOV *%eax, %ebx
    SHR $24, %ebx ; move the 8 bit status to the lsb

    ; ebx = status

    CMP $CONST_OS_PROCESS_STATUS_TERMINATED, %ebx ; is the process terminated ?
    JE _UTIL_SCHEDULER_FIND_NEXT

    CMP $CONST_OS_PROCESS_STATUS_RUNNING, %ebx ; is the process running ?
    JE _UTIL_SCHEDULER_PROCESS_RUNNING

    CMP $CONST_OS_PROCESS_STATUS_TIMER_BLOCKED, %ebx  ; is the process blocked ?
    JE _UTIL_SCHEDULER_PROCESS_BLOCKED

    CMP $CONST_OS_PROCESS_STATUS_IO_BLOCKED, %ebx ; is the process blocked waiting for IO?
    JE _UTIL_SCHEDULER_PROCESS_IO_BLOCKED

    ._UTIL_SCHEDULER_PROCESS_RUNNING:

    ; ebx = status, eax = pointer to status bit in the pcb

    ; set process to waiting
    AND $0xFFFFFF, *%eax

    MOV $CONST_OS_PROCESS_STATUS_WAITING, %ebx
    SHL $24, %ebx
    OR %ebx, *%eax

    ; get pid

    SUB $1, %eax

    ; eax = pcb pointer

    MOV *%eax, %ebx
    SHR $24, %ebx ; move the 8 bit pid to the lsb

    MOV $CONST_OS_PROCESS_WAITING_QUEUE_START, %ecx

    ; ebx = pid, ecx = process waiting queue start

    ; add current process to the waiting queue

    CMP $2, %ebx ; idle process should not be added to the waiting list
    JE _UTIL_SCHEDULER_FIND_NEXT

    SUB $1, %ecx
    SHL $24, %ebx


    ._UTIL_SCHEDULER_SEARCH_WAITING_LIST:
    ADD $1, %ecx
    MOV *%ecx, %eax
    SHR $24, %eax
    CMP $0, %eax
    JNE _UTIL_SCHEDULER_SEARCH_WAITING_LIST
    AND $0xFFFFFF, *%ecx
    OR %ebx, *%ecx ; add the current process to the end of the waiting queue
    JMP _UTIL_SCHEDULER_FIND_NEXT

    ._UTIL_SCHEDULER_PROCESS_BLOCKED:


    MOV $CONST_OS_PROCESS_BLOCKED_TIMER_QUEUE_START, %ecx

    ; ecx = process blocked queue start

    ; get pid

    MOV $CONST_OS_CURRENT_PCB_POINTER, %eax
    MOV *%eax, %eax ; pcb pointer

    MOV *%eax, %ebx
    AND $0xFF000000, %ebx

    ; add to the blocked queue

    SUB $1, %ecx

    ._UTIL_SCHEDULER_SEARCH_BLOCKED_LIST:
    ADD $1, %ecx
    MOV *%ecx, %eax
    SHR $24, %eax
    CMP $0, %eax
    JNE _UTIL_SCHEDULER_SEARCH_BLOCKED_LIST
    AND $0xFFFFFF, *%ecx
    OR %ebx, *%ecx ; add the current process to the end of the blocked queue

    ._UTIL_SCHEDULER_FIND_NEXT:

    MOV $CONST_OS_PROCESS_WAITING_QUEUE_START, %ecx

    MOV *%ecx, %eax
    SHR $24, %eax

    ; eax = first entry (pid) in the waiting queue

    ; ecx = process waiting queue start

    SUB $1, %ecx
    
    ._UTIL_SCHEDULER_UPDATE_WAITING_LIST:
        ADD $1, %ecx
        MOV %ecx, %ebx
        ADD $1, %ebx
        MOV *%ebx, %ebx
        AND $0xFF000000, %ebx
        AND $0xFFFFFF, *%ecx
        OR %ebx, *%ecx
        SHR $24, %ebx
        CMP $0, %ebx
        JNE _UTIL_SCHEDULER_UPDATE_WAITING_LIST

    
    MOV $CONST_OS_PCB_MAPPING_TABLE_START, %ecx

    MOV $0, %ebx

    CMP $0, %eax
    JNE _UTIL_SCHEDULER_FIND_PCB

    ; no process is waiting, run the idle process 

    ; set eax to 2 (idle process)
    MOV $2, %eax

    ; find the PCB for the pid

    ; eax = pid to run, ecx = pcb mapping pointer, ebx = pid for the pcb at ecx

    ._UTIL_SCHEDULER_FIND_PCB:
        ADD $4, %ecx
        ADD $1, %ebx
        CMP %ebx, %eax
        JNE _UTIL_SCHEDULER_FIND_PCB


    MOV *%ecx, %ecx ; pcb pointer

    MOV $CONST_OS_CURRENT_PCB_POINTER, %ebx
    MOV %ecx, *%ebx ; set the CONST_OS_CURRENT_PCB_POINTER to the found pcb


    ; set the process status to running
    ADD $1, %ecx
    AND $0xFFFFFF, *%ecx
    MOV $CONST_OS_PROCESS_STATUS_RUNNING, %ebx
    SHL $24, %ebx
    OR %ebx, *%ecx

    ; set the ptp to the pcbs ptp
    ADD $1, %ecx
    MOV *%ecx, %ptp
    INVTLB ; invalidate TLB

  ; restore CPU state 

    ; 0x03A - 0x03D flags         (4 bytes) \
    ; 0x036 - 0x039 esp           (4 bytes) |
    ; 0x032 - 0x035 eip           (4 bytes) |
    ; 0x02E - 0x031 ecx           (4 bytes) | - CPU registers
    ; 0x02A - 0x02D ebx           (4 bytes) |
    ; 0x026 - 0x039 eax           (4 bytes) /

    MOV $CONST_OS_CURRENT_PCB_POINTER, %eax
    MOV *%eax, %eax ; pcb pointer
    ADD $0x26, %eax

    PUSH *%eax   ; save eax
    ADD $4, %eax

    PUSH  *%eax  ; ebx
    ADD $4, %eax

    PUSH  *%eax  ; ecx
    ADD $4, %eax

    PUSH  *%eax  ; eip
    ADD $4, %eax

    MOV *%eax, %ebx  ; esp
    ADD $4, %eax

    PUSH *%eax   ; flags

    MOV %esp, %eax

    ; eax = old esp | ebx = new esp

    MOV %ebx, %esp ; set esp

    ; push eflags and return address to return with a ret instruction

    PUSH $0 ; new return value (gets overridden later by the old eip)
    MOV %esp, %ecx

    PUSH *%eax ; push new flags value
    ADD $4, %eax
    
    MOV *%eax, *%ecx ; set the return value to the restored eip value
    ADD $4, %eax

    MOV *%eax, %ecx ; restore ecx
    ADD $4, %eax

    MOV *%eax, %ebx ; ebx
    ADD $4, %eax

    MOV *%eax, %eax ; eax

    POPF ; eflags 

._UTIL_SCHEDULER_RESCHEDULE:
    RET

._UTIL_SCHEDULER_PROCESS_IO_BLOCKED:

    MOV $CONST_OS_PROCESS_BLOCKED_IO_QUEUE_START, %ecx

    MOV $CONST_OS_CURRENT_PCB_POINTER, %eax
    MOV *%eax, %eax ; pcb pointer

    MOV *%eax, %ebx
    AND $0xFF000000, %ebx ; Isolate the pid byte

    ; add to the blocked queue
    SUB $1, %ecx

    ._UTIL_SCHEDULER_FIND_FREE_BLOCKED_IO:
        ADD $1, %ecx
        MOV *%ecx, %eax ; Copy list entry to eax
        SHR $24, %eax ; Move pid to the right
        CMP $0, %eax ; Is entry free or not
        JNE _UTIL_SCHEDULER_FIND_FREE_BLOCKED_IO
    AND $0xFFFFFF, *%ecx ; Clear the pid of the entry
    OR %ebx, *%ecx ; add the current process to the end of the blocked queue
    JMP _UTIL_SCHEDULER_FIND_NEXT


