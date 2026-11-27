; Kernel

; Memory layout (32 bit architecture, 4 GiB total)
; 0b11...   0xC0000000 - 0xFFFFFFFF - kernel space
; 0b10...   0x80000000 - 0xBFFFFFFF - user space
; 0b01...   0x40000000 - 0x7FFFFFFF - user space
; 0b00...   0x00000000 - 0x3FFFFFFF - user space

; Kernel space layout
;
; 0xD1205000 - 0xFFFFFFFF - unused space
; 0xD1204A01 - 0xD1204FFF - Padding             (4096 Entries - 1024*2 - 512 - 2 = 1535 Bytes)   \
; 0xD1204A00 - 0xD1204A00 - Running process id  (1 Byte)                                          |
; 0xD1204900 - 0xD12049FF - Blocked Queue       (256 Entries * 1 Byte (pid size) = 256 Bytes)     | - 1     Page Frame
; 0xD1204800 - 0xD12048FF - Wating Queue        (256 Entries * 1 Byte (pid size) = 256 Bytes)     | 
; 0xD1204400 - 0xD12047FF - Interrupt Table     (256 Entries * 4 Bytes = 1 KiB)                   |
; 0xD1204000 - 0xD12043FF - PCB Table Mapping   (256 Entries * 4 Bytes = 1 KiB)                  /
; 0xD1200000 - 0xD1203FFF - L2 PT Mapping       (4096 Entries * 4 Bytes = 16 KiB)                   - 4     Page Frames            
; 0xD11C0000 - 0xD11FFFFF - PCB List            (256 Entries * 1 KiB = 256 KiB)                     - 64    Page Frames
; 0xD1100000 - 0xD11BFFFF - Memory Map          (786432 Entries * 1 Byte = 786432 Bytes)            - 192   Page Frames   
; 0xD1000000 - 0xD10FFFFF - 1 Level Page Tables (256 Entries * 2¹⁰ * 4 = 1 MiB)                     - 256   Page Frames
; 0xD0000000 - 0xD0FFFFFF - 2 Level Page Tables (16 MiB / (2¹⁰*4) = 4096 L2 Page Tables)            - 4096  Page Frames 
; 0xC0000000 - 0xCFFFFFFF - OS Code             (256 MiB / 4 = 67_108_864 32 bit Instructions)      - 65536 Page Frames 

; Page Table layout
;
; 2 Level Paging
;
;         Level 1    Level 2     Offset 
;  VA = 0000000000 0000000000 000000000000     (32 bits)
;        (10 bits)  (10 bits)   (12 bits)
;           |           V          |
;           V        -------       |
;        -------    |  2L   |------+------> PA (32 bits)  
;       |  1L   |--> -------
;   ---> -------
;   |
;   |
;   |
;  PTP
; 
;
;
;                    Page Structure
;
;   --------------------------------------------------
;   |       12 Bits Flags     |       20 bits        |
;   | P M U U U U U U U U U U |                      |
;   | 0 0 0 0 0 0 0 0 0 0 0 0 | 00000000000000000000 |
;   --------------------------------------------------
;   P = Present bit (0 = not present, 1 = present)
;   M = Mode bit ( 0 = User mode allowed, 1 = Kernel mode only)
;   U = Unused
;
;
;
;  Level 2 Page Table Mapping List Structure
;  
;         L1 Entry Address     
;  00000000000000000000000000000000         
;            (32 bits)                  
; we have to save the corresponding L1 PT Entry for the L2 Page Table because if we need to free a L2 Page Table we need to set the Present bit in the L1 Page Table Entry
;
;
;
; if L1 Entry Address is 0x00000000 we know that no Page Table is mapped there because at position 0 in the L1 PT List there can not be a Page Table because the corresponding pid 0 is invalid
;


; Process Control Block layout (1KiB) 0x000 - 0x3FF
; 0x026 - 0x3FF unused        
; 0x006 - 0x025 name          (32 characters)
; 0x002 - 0x005 Page table    (4 Bytes)     
; 0x001 - 0x001 status        (Runnung, Waiting, Blocked)
; 0x000 - 0x000 pid           (Process ID)

; Proccess ID (pid) definition
;
; pid = Process ID = 8 bit number
; the pid starts at 1 (0 is invalid => A max of 2⁸ - 1 (255) Processes)
; Needed Process Wating list size = 255 Bytes but we use 256 for simplicity
; Needed Process Blocked list size = 255 Bytesbut we use 256 for simplicity
; Init Process has pid of 1


; Interrupt Table layout
;
; Interrupt Table has 256 Entries (0x00-0xFF)
;
; 0x00 - 0x00 Div by 0              |
; 0x01 - 0x05 Unused                |
; 0x06 - 0x06 Invalid Opcode        |
; 0x07 - 0x0C Unused                | CPU exceptions (32)
; 0x0D . 0x0D Privilege Violation   |
; 0x0E - 0x0E Page Fault            |
; 0x0F - 0x1F Unused                |
; -----------------------------------
; 0x20 - 0x7F Unused                |
; 0x80 - 0x80 System Calls          | External interrupts (224)
; 0x81 - 0xFF Unused                |

;--------------------------------------------------------------------------

; Start of the BOOT Code

.BOOT:
    ; This is the entry point of the OS
    ;
    ; Assumptions at this point:
    ;   - We are in kernel mode
    ;   - Memory Virtualization is disabled
    ;
    ; Things we needs to set up before starting the first process:
    ;   - Stack Pointer
    ;   - Stack Pointer Pointer
    ;   - Interrupt table itself
    ;   - Page Table Pointer
    ;   - Page Table itself
    ;   - A PCB
    ;   - Set the current running pid to the init process id (1)
    ;   - Loading the code for the init process into Memory
    ;   - Activate Memory Virtualization
    ;   - Switch to user mode
    ;   - Run the init process
    ;

    MOV $0xBFFFFFFF, %esp   ; initialize stack pointer

    MOV $0xD1144000, %itp   ; initialize interrupt pointer

; Set Up Interrupt Table
    
    ; Interrupt Table layout
    ;
    ; Interrupt Table has 256 Entries (0x00-0xFF)
    ;
    ; 0x00 - 0x00 Div by 0              |
    ; 0x01 - 0x05 Unused                |
    ; 0x06 - 0x06 Invalid Opcode        |
    ; 0x07 - 0x0C Unused                | CPU exceptions (32)
    ; 0x0D . 0x0D Privilege Violation   |
    ; 0x0E - 0x0E Page Fault            |
    ; 0x0F - 0x1F Unused                |
    ; -----------------------------------
    ; 0x20 - 0x7F Unused                |
    ; 0x80 - 0x80 System Calls          | External interrupts (224)
    ; 0x81 - 0xFF Unused                |

    
    ; --- Set up the CPU exceptions---

    ; Set up the ISR (Interrupt Service Routine) for the Interrupt 0x00 (Div by 0)
    MOV %itp, %eax
    ADD 0, %eax ; Interrupt Nummber 0x00 * 4 Bytes = 0
    MOV ISR_DIV_BY_ZERO, *%eax

    ; Set up the ISR for 0x06 (Invalid Opcode)
    MOV %itp, %eax
    ADD 0x24, %eax ; Interrupt Nummber 0x06 * 4 Bytes = 0x24
    MOV ISR_INVALID_OPCODE, *%eax

    ; Set up the ISR for 0x0D (Privilege Violation)
    MOV %itp, %eax
    ADD 0x34, %eax ; Interrupt Nummber 0x0D * 4 Bytes = 0x34
    MOV ISR_PRIVILEGE_VIOLATION, *%eax

    ; Set up the ISR for 0x0E (Page Fault)
    MOV %itp, %eax
    ADD 0x38, %eax ; Interrupt Nummber 0x0E * 4 Bytes = 0x38
    MOV ISR_PAGE_FAULT, *%eax

    ; --- Finished With The CPU exceptions---

    ; --- Set up the External interrupts---

    ; Set up the ISR for 0x80 (System Calls)
    MOV %itp, %eax
    ADD 0x200, %eax ; Interrupt Nummber 0x80 * 4 Bytes = 0x200
    MOV ISR_SYSTEM_CALLS, *%eax

    ; --- Finished with the External interrupts---


; Interrupt Table Is Set Up

    MOV $0xD1000000, %ptp   ; initialize PTP (Level 1 Page Table Location)

; Set Up Page Table (L1) for the init process

    MOV %ptp, %eax
    ADD 0xFFF %eax ; First entry is invalid because pid 0 is invalid

; Page Table Is Set Up (L1)



; Create a PCB for the init process - 0xD11C0000 - 0xD11FFFFF - PCB List (1 PCB = 1KiB)

    MOV $0xD11C0000, %eax
    ADD 0xCFF %eax ; First entry is invalid because pid 0 is invalid

    ; Process Control Block layout (1KiB) 0x000 - 0x3FF
    ; 0x026 - 0x3FF unused        
    ; 0x002 - 0x021 name          (32 characters)
    ; 0x001 - 0x001 status        (Runnung, Waiting, Blocked)
    ; 0x000 - 0x000 pid           (Process ID)

    ; Process ID (pid) definition
    ;
    ; pid = Process ID = 8 bit number
    ; the pid starts at 1 (0 is invalid => A max of 2⁸ - 1 (255) Processes)
    ; Needed Process Wating list size = 255 Bytes but we use 256 for simplicity
    ; Needed Process Blocked list size = 255 Bytesbut we use 256 for simplicity
    ; Init Process has pid of 1

    ; Process Status definition
    ;
    ; 8 bit number => max of 256 statuses
    ;
    ; we only use 4 : Runnung, Waiting, Blocked and Terminated
    ;
    ; Terminated has the id 0
    ; Runnung    has the id 1
    ; Waiting    has the id 2
    ; Blocked    has the id 3

    MOV $1, *%eax //set pid to 1
    ADD $1, %eax

    MOV $1, *%eax //set status to to Runnung 
    ADD $1, %eax

    ;set name to "init\0", ASCII code: i = "0x69", n = "0x6E", t = "0x74"
    MOV $0x69, *%eax ; i
    ADD $1, %eax
    MOV $0x6E, *%eax ; n
    ADD $1, %eax
    MOV $0x69, *%eax ; i
    ADD $1, %eax
    MOV $0x74, *%eax ; i
    ADD $1, %eax
    MOV $0x00, *%eax ; \0

; PCB created

; Add PCB to the system (PCB Mapping, any status mapping...)

    ; 0xD1204000 - 0xD12043FF - PCB Table Mapping   (256 Entries * 4 Bytes = 1 KiB)                  /

    MOV $0xD1204000, %eax ; Get a pointer to the PCB Table Mapping List
    ADD $4, %eax ; First entry is invalid because pid 0 is invalid

    MOV $0xD11C03FF, *%eax //update the Mapping for pid 1

    ; Running process id to 1
    ; 0xD1204A00 - 0xD1204A00 - Running process id  (1 Byte)
    MOV $0xD1204A00, %eax ; Get a pointer to the PCB Table Mapping List
    MOV $1, *%eax ; Set the active pid to 1

; Process is now initialized in the os data structures

; Load the Code of the init Program into memory
    ;
    ; To do this we need to find a free page frame in user memory
    ; right now this is easy because we know that user memory is empty (no process is running)

    ; the code for init Program should be located in the file os/init (in bynary)

    PUSH $0 ; null-termination for filename on stack
    PUSH $0x6F732F696E6974       ; move filename "os/init" onto stack
    DEV $0b0110, %esp   ; 00000110 - file_open (filename_ptr=op2) -> fd=eax

    ; set ebx to the file descriptor id
    MOV %eax, %ebx

    ; read 4KiB bytes (assume for now that the init program is not bigger than 4KiB)
    PUSH $0xFFF     ; buffer length
    PUSH $0x0 ; write init to the first page frame located at 0x0
    DEV $0b0010, %ebx     ; 00000010 - io_read_buffer (fd=op2, buffer=stack, b_size=stack) -> bytes_read=eax
    
    ; set ecx to bytes_read
    MOV %eax, %ecx ; bytes_read

    ; update Page Table 

    MOV %ptp, %eax
    ADD 0xFFF %eax ; First entry is invalid because pid 0 is invalid

    ; 0xD0000000 - 0xD0FFFFFF - 2 Level Page Tables


    MOV 0x800D0000, *%eax ; set the present bit to 1 and assign the first L2 Page Table

    MOV $0xD1200000, %ebx
    MOV %eax, *%ebx //set to the L1 PT Address of the pid 1

    ; Set up the L2 Page Table
    ; By updating the L2 mapping
    ; 0xD1200000 - 0xD1203FFF - L2 PT Mapping

    ;map the first page to the first frame

    MOV $0xD1200000, %eax
    MOV 0x80000000, *%eax ; set the present bit to 1 and assign the first Pysical Address of frame 0 starting at 0x00000000


    


; Activate Memory Virtualization
;TODO how?????????

;Switch to user mode
AND 0b00111111, %eflags

;Execute init
JMP 0x0


; Define the ISRs (Interrupt Service Routines)

; ---internal---

.ISR_DIV_BY_ZERO;
    ; Terminate the offending Process
    IRET

.ISR_INVALID_OPCODE;
    ; Terminate the offending Process
    IRET
    
.ISR_PRIVILEGE_VIOLATION;
    ; Terminate the offending Process
    IRET

.ISR_PAGE_FAULT;
    ; Load Page In if valid request
    IRET

; ---external---

.ISR_SYSTEM_CALLS;
    ; call the right System Call
    IRET

; ISR List END







; ------ Syscalls ---------

; SYSCALL_CREATE_PROCESS
; Parameters (ebx is a pointer to the start of an ASCII filename):
;   (ebx)     Pointer to a ASCII filename
; Return value:
;   none
.SYSCALL_CREATE_PROCESS
    CALL .SYSCALL_FILE_OPEN
    ; eax contains the file descriptor

    ; allocate memory for the new Process

    ; copy Process code to the allocated memory

    ; crate a new Process Control Block (PCB)

    ; add Process to the Proccess list

    RET



; SYSCALL_IO_SEEK
; Parameters (ebx is a pointer to the following struct):
;   *(ebx)     file descriptor
;   *(ebx+4)   seek offset
;   *(ebx+8)   seek mode (0 - Seek from current position, 1 - Seek from start of file, 2 - Seek from end of file)
; Return value (immediate value):
;   eax     success status (0 = success, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = negative seek position)
.SYSCALL_IO_SEEK:
    ; Check whether all user-provided data is within user space (file descriptor, seek offset, seek mode)
    MOV $12, %eax
    CALL ASSERT_EBX_IN_USERSPACE_WITH_OFFSET

    ; move syscall arguments onto stack as the DEV instruction requires it for io_seek
    ;   ebx+4     offset
    MOV %ebx, %eax
    ADD $4, %eax
    PUSH *%eax
    ;   ebx+8     mode
    ADD $4, %eax
    PUSH *%eax

    ; 0    00000000 - io_seek (fd=op2, offset=stack, mode=stack) -> success=eax
    ;          mode:   0 - Seek from current position
    ;              1 - Seek from start of file
    ;              2 - Seek from end of file
    DEV $0, %ebx
    ; print success status for debugging
    CALL PRINT_EAX
    RET


; SYSCALL_IO_CLOSE
; Parameters (ebx is used as a immediate value):
;   ebx     file descriptor
; Return value:
;   None
.SYSCALL_IO_CLOSE:
    ; Check whether all user-provided data is within user space (file descriptor)
    MOV $4, %eax
    CALL ASSERT_EBX_IN_USERSPACE_WITH_OFFSET

    ; 1    00000001 - io_close (fd=op2)
    DEV $1, %ebx
    RET


; SYSCALL_IO_READ_BUFFER
; Parameters (ebx is a pointer to the following struct):
;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
;   *(ebx+4)   pointer to buffer, this buffer will be filled by the file system
;   *(ebx+8)   buffer size, limits the amount of bytes that will be read
; Return value (immediate value):
;   eax     success status (>=0 = number of bytes read, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = no console input ready)
.SYSCALL_IO_READ_BUFFER:
    ; Check if all user-provided arguments are within user space (file descriptor, buffer_ptr, buffer_size)
    MOV $12, %eax
    CALL ASSERT_EBX_IN_USERSPACE_WITH_OFFSET

    ; move user-provided arguments onto stack (required for DEV instruction)
    ;   ebx+4   pointer to buffer
    MOV %ebx, %eax
    ADD $4, %eax
    PUSH *%eax
    ;   ebx+8   buffer size
    ADD $4, %eax
    PUSH *%eax

    ; Check if user-given buffer is completely within user space
    ; Calculate highest address of the buffer: %ecx = buffer_ptr + buffer_size   ebx+4 + ebx+8
    
    ; eax currently holds address of buffer_size argument
    ; Dereference buffer_size and save into ecx
    MOV *%eax, %ecx 
    ; Move eax back onto buffer_ptr address
    SUB $4, %eax
    ; Dereference buffer_ptr and save into eax
    MOV *%eax, %eax
    ; Calculate buffer_ptr + buffer_size
    ADD %ecx, %eax
    CALL ASSERT_EAX_IN_USERSPACE
    
    ; 2    00000010 - io_read_buffer (fd=op2, buffer_ptr=stack, buffer_size=stack) -> bytes_read=eax
    DEV $2, *%ebx

    ; print success status for debugging
    CALL PRINT_EAX
    RET


; SYSCALL_IO_WRITE_BUFFER
; Parameters (ebx is a pointer to the following struct):
;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
;   *(ebx+4)   pointer to buffer, this buffer will be used by the file system
;   *(ebx+8)   buffer size, limits the amount of bytes that will be written
; Return value (immediate value):
;   eax     success status (>=0 = number of bytes written, -1 = invalid file descriptor, -2 = seek position out of file bounds)
.SYSCALL_IO_WRITE_BUFFER:
    ; Check if all user-provided arguments are within user space (file descriptor, buffer_ptr, buffer_size)
    MOV $12, %eax
    ;CALL ASSERT_EBX_IN_USERSPACE_WITH_OFFSET

    ; move user-provided arguments onto stack (required for DEV instruction)
    ;   ebx+4   pointer to buffer
    MOV %ebx, %eax
    ADD $4, %eax
    PUSH *%eax
    ;   ebx+8   buffer size
    ADD $4, %eax
    PUSH *%eax

    ; Check if user-given buffer is completely within user space
    ; Calculate highest address of the buffer: %ecx = buffer_ptr + buffer_size   ebx+4 + ebx+8
    
    ; eax currently holds address of buffer_size argument
    ; Dereference buffer_size and save into ecx
    MOV *%eax, %ecx 
    ; Move eax back onto buffer_ptr address
    SUB $4, %eax
    ; Dereference buffer_ptr and save into eax
    MOV *%eax, %eax
    ; Calculate buffer_ptr + buffer_size
    ADD %ecx, %eax
    CALL ASSERT_EAX_IN_USERSPACE
    
    ; 3    00000011 - io_write_buffer (fd=op2, buffer_ptr=stack, buffer_size=stack) -> bytes_written=eax
    DEV $3, *%ebx

    ; print success status for debugging
    CALL PRINT_EAX
    RET


; SYSCALL_FILE_CREATE
; Parameters (ebx is a pointer to the start of an ASCII filename):
;   (ebx)     Pointer to a ASCII filename
; Return value (immediate value):
;   None
.SYSCALL_FILE_CREATE:
    CALL ASSERT_ZERO_TERMINATED_FILENAME_IN_USERSPACE
    ; 4    00000100 - file_create (filename_ptr=op2)
    DEV $4, %ebx
    RET


; SYSCALL_FILE_DELETE
; Parameters (ebx is a pointer to the start of an ASCII filename):
;   (ebx)     Pointer to a ASCII filename
; Return value (immediate value):
;   eax     success status (0 = success, -1 = file did not exist)
.SYSCALL_FILE_DELETE:
    CALL ASSERT_ZERO_TERMINATED_FILENAME_IN_USERSPACE
    ; 5    00000101 - file_delete (filename_ptr=op2) -> success=eax
    DEV $5, %ebx
    RET


; SYSCALL_FILE_OPEN
; Parameters (ebx is a pointer to the start of an ASCII filename):
;   (ebx)     Pointer to a ASCII filename
; Return value (immediate value):
;   eax     file descriptor
.SYSCALL_FILE_OPEN:
    CALL ASSERT_ZERO_TERMINATED_FILENAME_IN_USERSPACE
    ; 6    00000110 - file_open (filename_ptr=op2) -> fd=eax
    DEV $6, %ebx
    ; print the new filedescriptor for debugging
    CALL PRINT_EAX
    RET


; SYSCALL_FILE_STAT
; Parameters (ebx is a pointer to the start of an ASCII filename):
;   (ebx)     Pointer to a ASCII filename
; Return value (immediate value):
;   eax     file length or error code (>=0 = length, -1 = file already exists, -2 = not a file)
.SYSCALL_FILE_STAT:
    CALL ASSERT_ZERO_TERMINATED_FILENAME_IN_USERSPACE
    ; 7    00000111 - file_stat (filename_ptr=op2) -> file_length=eax
    DEV $7, %ebx
    ; print the length
    CALL PRINT_EBX
    RET


; SYSCALL_CONSOLE_READ_NUMBER
; Parameters (immediate value):
;   (ebx)     number to print
; Return value:
;   none
.SYSCALL_CONSOLE_PRINT_NUMBER:
    ; 8    00001000 - console_print_number(number=op2)
    DEV $8, %ebx
    RET


; SYSCALL_CONSOLE_READ_NUMBER
; Parameters:
;   none
; Return value (immediate value):
;   eax     number
;   ebx     success status (0=success, -1=no input ready, -2=could not parse number, -3=number does not fit into signed 32 bit DoubleWord)
.SYSCALL_CONSOLE_READ_NUMBER:
    ; 9    00001001 - console_read_number() -> number=eax, error=ebx
    DEV $9, $0
    RET




.INTERRUPT_HANDLER_PRIVILEGE_VIOLATION:
    DEV $0b00001000, $6666 ; console_print_number(number=op2)
    IRET


.INTERRUPT_HANDLER_PAGE_FAULT:
    DEV $0b00001000, $7777 ; console_print_number(number=op2)
    IRET


.INTERRUPT_HANDLER_CONSOLE_INPUT:
    DEV $0b00001000, $8888 ; console_print_number(number=op2)
    IRET




.ERROR_SYSCALL_STACK_POINTER_IN_KERNELSPACE:
    ; TODO better error logging
    ; debug print
    DEV $0b00001000, $400
    POP %eax
    JMP END_SYSCALL ; abort interrupt 

.ERROR_UNKOWN_SYSCALL:
    ; TODO better error logging
    ; debug print
    DEV $0b00001000, $401
    POP %eax
    JMP END_SYSCALL ; abort interrupt

.ERROR_POINTER_IN_KERNEL_SPACE:
    ; TODO better error logging
    ; debug print
    DEV $0b00001000, $402
    POP %eax
    JMP END_SYSCALL ; abort interrupt 

.END:
    DEV $0b01000, $9999
