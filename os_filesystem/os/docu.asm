; os documentation

; Kernel

; Memory layout (32 bit architecture, 4 GiB total)
; 0b11...   0xC0000000 - 0xFFFFFFFF - kernel space
; 0b10...   0x80000000 - 0xBFFFFFFF - user space
; 0b01...   0x40000000 - 0x7FFFFFFF - user space
; 0b00...   0x00000000 - 0x3FFFFFFF - user space

; User space layout
;
; 
; 0xBFFFFFFF <- stack
;      |
;      V
;
;      ^
;      |
; 0x00000000 <- Code segment

; Kernel space layout
;
; 0xFFFFF000 - 0xFFFFFFFF - interrupt stack     (4096 Bytes)                                        - 1 Page Frame
; 0xE0101000 - 0xFFFFFFFF - unused space
; 0xE0100B04 - 0xE0100FFF - Padding             (4096 Entries - 1024*2 - 256*3 - 4 = 1276 Bytes)   \
; 0xE0100A04 - 0xE0100B03 - Blocked Queue for IO(256 Entries * 1 Byte (pid size) = 256 Bytes)     |
; 0xE0100A00 - 0xE0100A03 - Running process *PCB(4 Byte)                                          |
; 0xE0100900 - 0xE01009FF - Blocked Queue       (256 Entries * 1 Byte (pid size) = 256 Bytes)     | - 1     Page Frame
; 0xE0100800 - 0xE01008FF - Waiting Queue       (256 Entries * 1 Byte (pid size) = 256 Bytes)     | 
; 0xE0100400 - 0xE01007FF - Interrupt Table     (256 Entries * 4 Bytes = 1 KiB)                   |
; 0xE0100000 - 0xE01003FF - PCB Table Mapping   (256 Entries * 4 Bytes = 1 KiB)                  /
; 0xE00C0000 - 0xE00FFFFF - PCB List            (256 Entries * 1 KiB = 256 KiB)                     - 64    Page Frames
; 0xE0000000 - 0xE00BFFFF - Memory Map          (786432 Entries * 1 Byte = 786432 Bytes)            - 192   Page Frames   
; 0xD0000000 - 0xDFFFFFFF - Page Tables         (64 * 2²⁰ * 4 = 256 MiB)                            - 65536 Page Frames  
; 0xC0000000 - 0xCFFFFFFF - OS Code             (256 MiB / 4 = 67_108_864 32 bit Instructions)      - 65536 Page Frames 

; Page Table layout
;
; Paging
;
;              Level 1          Offset 
;  VA = 00000000000000000000 000000000000     (32 bits)
;             (20 bits)        (12 bits)
;                 |                |
;                 V                |
;              -------             |
;             |  1L   |------------+------> PA (32 bits) 
;   -------->  -------
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



;
; Process Control Block layout (1KiB) 0x000 - 0x3FF
; 0x200 - 0x3FF kernel stack  (512 bytes)
; 0x040 - 0x1FF unused
; 0x03E - 0x03F time slice counter  (2 bytes)
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
; IO Blocked has the id 4
;
;
; Process ID (pid) definition
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
; |--------------------------------------------------|
; | 0x00 - 0x00 Divide Error (div by 0)              |
; | 0x01 - 0x05 Unused                               |
; | 0x06 - 0x06 Invalid Opcode                       |
; | 0x07 - 0x0C Unused                               | CPU exceptions (32)
; | 0x0D - 0x0D General Protection Fault             |
; | 0x0E - 0x0E Page Fault                           |
; | 0x0F - 0x1F Unused                               |
; | -------------------------------------------------|
; | 0x20 - 0x20 Timer           - Hardware interrupt |
; | 0x21 - 0x21 Periodic Timer  - Hardware interrupt |
; | 0x22 - 0x7F Unused          - Hardware interrupt |
; | 0x80 - 0x80 System Calls    - Software interrupt | External interrupts (224)
; | 0x81 - 0x81 Keyboard        - Hardware interrupt |
; | 0x82 - 0xFF Unused          - Hardware interrupt |
; |--------------------------------------------------|
;
;
; There are 2 types of interrupts:
;
;   1) Internal interrupts (exceptions)    | Interrupts generated by the CPU hardware
;
;   2) External interrupts                 | Interrupts not generated by the CPU hardware
;
; The External interrupts can be subdivided into:
;
;   1) Software interrupts: Initiated by Software
;
;   2) Hardware interrupts: Generated by external Hardware (devices)
;
;
; By default Exceptions re-executes the instrution after handling the interrupt (after IRET)
;
; By default External interrupts executes the next instrution after handling the interrupt (after IRET)


; syscall list (8 bit = 255 syscalls)
;
; file_read = 0
; file_write = 1
; file_open = 2
; file_close = 3
; file_stat = 4
; file_seek = 5
; file_create = 6
; file_delete = 7
; console_print_number = 8
; console_read_number = 9
;
; 10-15 unused
;
; process_create = 16
; process_exit = 17
; process_yield = 18
; 
; 19-23 unused
;
; timer_start = 24