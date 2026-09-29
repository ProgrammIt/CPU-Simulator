JMP _OS_ENTRY ; start of the os

; include dependencies
.INCLUDE "os/src/constants"
.INCLUDE "os/src/include_interrupts"
.INCLUDE "os/src/include_util"

._OS_ENTRY:
    ; This is the entry point of the OS
    ;
    ; Assumptions at this point:
    ;   - We are in kernel mode
    ;   - Memory Virtualization is disabled
    ;
    ; Things we needs to set up before starting the first process:
    ;   - Stack Pointer        return
    ;   - Interrupt Pointer
    ;   - Interrupt table itself
    ;   - Page Table Pointer
    ;   - Page Table itself
    ;   - A PCB
    ;   - Set the current running pid to the init process id (1)
    ;   - Loading the code for the init process into Memory
    ;   - Activate Memory Virtualization
    ;   - Switch to user mode (init still runs in kernel mode)
    ;   - Run the init process
    ;

    MOV $CONST_OS_PCB_INTERRUPT_TABLE_START, %itp   ; initialize interrupt pointer

    MOV $CONST_OS_INTERRUPT_STACK_END, %esp   ; initialize stack pointer


; Set Up Interrupt Table
    
    ; Interrupt Table layout
    ;
    ; Interrupt Table has 256 Entries (0x00-0xFF)
    ;
    ; 0x00 - 0x00 Divide Error              |
    ; 0x01 - 0x05 Unused                    |
    ; 0x06 - 0x06 Invalid Opcode            |
    ; 0x07 - 0x0C Unused                    | CPU exceptions (32)
    ; 0x0D . 0x0D General Protection Fault  |
    ; 0x0E - 0x0E Page Fault                |
    ; 0x0F - 0x1F Unused                    |
    ; ---------------------------------------
    ; 0x20 - 0x7F Unused                    |
    ; 0x80 - 0x80 System Calls              | External interrupts (224)
    ; 0x81 - 0x81 Keyboard                  |
    ; 0x82 - 0xFF Unused                    |

    
    ; --- Set up the CPU exceptions---

    ; Set up the ISR (Interrupt Service Routine) for the Interrupt 0x00 (Divide error)
    MOV %itp, %eax
    ADD $0, %eax ; Interrupt Nummber 0x00 * 4 Bytes = 0
    MOV INTERRUPTS_DIVIDE_ERROR, *%eax

    ; Set up the ISR for 0x06 (Invalid Opcode)
    MOV %itp, %eax
    ADD $0x18, %eax ; Interrupt Nummber 0x06 * 4 Bytes = 0x18
    MOV INTERRUPTS_INVALID_OPCODE, *%eax

    ; Set up the ISR for 0x0D (General Protection Fault)
    MOV %itp, %eax
    ADD $0x34, %eax ; Interrupt Nummber 0x0D * 4 Bytes = 0x34
    MOV INTERRUPTS_GENERAL_PROTECTION_FAULT, *%eax

    ; Set up the ISR for 0x0E (Page Fault)
    MOV %itp, %eax
    ADD $0x38, %eax ; Interrupt Nummber 0x0E * 4 Bytes = 0x38
    MOV INTERRUPTS_PAGE_FAULT, *%eax

    ; --- Finished With The CPU exceptions---

    ; --- Set up the External interrupts---

    ; Set up the ISR for 0x20 (Timer)
    MOV %itp, %eax
    ADD $0x80, %eax ; Interrupt Nummber 0x20 * 4 Bytes = 0x80
    MOV INTERRUPTS_TIMER, *%eax

    ; Set up the ISR for 0x21 (Periodic Timer)
    MOV %itp, %eax
    ADD $0x84, %eax ; Interrupt Number 0x21 * 4 Bytes = 0x84
    MOV INTERRUPTS_PERIODIC_TIMER, *%eax

    ; Set up the ISR for 0x80 (System Calls)
    MOV %itp, %eax
    ADD $0x200, %eax ; Interrupt Nummber 0x80 * 4 Bytes = 0x200
    MOV INTERRUPTS_SYSCALLS, *%eax

    ; Set up the ISR for 0x81 Keyboard interrupt
    MOV %itp, %eax
    ADD $0x204, %eax ; Interrupt number 0x81 * 4 Bytes = 204
    MOV INTERRUPTS_KEYBOARD, *%eax

    ; --- Finished with the External interrupts---

; Interrupt Table Is Set Up

; UTIL_SETUP_KERNEL_L2_MAPPING
; Parameters:
;   none
; Return value (immediate value):
;   none
CALL UTIL_SETUP_KERNEL_L2_MAPPING

; L2 page tables that map the kernel space have been created
; These L2 maps later get linked into the page directory of new processes

; Create the init process
    
    ; the code for init Program should be located in the file os/user/init (as bynary file)


    .CONST _OS_ENTRY_CONST_INIT_FILE_PATH "os/bin/init.bin"


    MOV $_OS_ENTRY_CONST_INIT_FILE_PATH, %ebx

    ; SYSCALLS_PROCESS_CREATE
    ; Parameters (ebx is a pointer to the start of an ASCII filename):
    ;   (ebx)     Pointer to a ASCII filename
    ; Return value:
    ;   eax     success status (0 = success, -1 = error)
    CALL SYSCALLS_PROCESS_CREATE
    CMP $-1, %eax
    JNE _SOS_BOOT_INIT_PROCESS_CREATED

    ; this should not be able to happen

    ; panic

    ; TODO stop the simulator

    ._SOS_BOOT_INIT_PROCESS_CREATED:

; Create the idle process

    ; the code for idle Program should be located in the file os/user/idle (as bynary file)

    .CONST _OS_ENTRY_CONST_IDLE_FILE_PATH "os/bin/idle.bin"

    MOV $_OS_ENTRY_CONST_IDLE_FILE_PATH, %ebx

    ; SYSCALLS_PROCESS_CREATE
    ; Parameters (ebx is a pointer to the start of an ASCII filename):
    ;   (ebx)     Pointer to a ASCII filename
    ; Return value:
    ;   eax     success status (0 = success, -1 = error)
    CALL SYSCALLS_PROCESS_CREATE
    CMP $-1, %eax
    JNE _OS_ENTRY_IDLE_PROCESS_CREATED

    ; this should not be able to happen

    ; panic

    ; TODO stop the simulator

    ._OS_ENTRY_IDLE_PROCESS_CREATED:

    ; set the init process to the running process
    MOV $CONST_OS_CURRENT_PCB_POINTER, %eax
    MOV $CONST_OS_PCB_LIST_START, *%eax
    ADD $CONST_OS_PCB_SIZE, *%eax

    ; set ptp
    MOV *%eax, %eax
    ADD $2, %eax
    MOV *%eax, %ptp

    ; set process running
    SUB $1, %eax
    AND $0xFFFFFF, *%eax
    OR $0x1000000, *%eax ;set status to to Running 


; Activate Memory Virtualization
DEV $CONST_DEV_COMMAND_CPU_ENABLE_MEMORY_VIRTUALIZATION, $0

PUSH $CONST_KERNEl_MEMORY_START ; push the esp value after iret for the user stack

PUSH $0x20 ; flags

PUSH $0 ; push the address to return to after iret

IRET ;Switch to user mode and Execute init

