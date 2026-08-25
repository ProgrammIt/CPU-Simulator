# Ihme-Core CPU Simulator User Manual

## 1 Writing Assembly Code for the CPU Simulator

## 1.1 Symbolic Constants

### 1.1.1 Symbolic Integer Constants

Symbolic integer constants can store a 32-bit integer value and can be defined as follows:

``` Assembly
.CONST myIntConst 5
```

The assembler stores the integer value and replaces all occurrences of the symbolic integer constant in the assembly code with its actual value.

The symbolic name of the integer constant can then be used like a normal integer value in the assembly code.
Here is an example of writing the previously defined integer constant into the EAX register:

``` Assembly
MOV $myIntConst, %eax
```

This writes the value 5 into the EAX register.

### 1.1.2 Symbolic String Constants

Symbolic string constants are treated slightly differently from symbolic integer constants and can be defined as follows:

``` Assembly
.CONST myStringConst "I am a string."
```

The given string is stored as a UTF-8-encoded and null-terminated array in the read-only (`.rodata`) segment of the program in memory.
Because they are placed in the `.rodata` segment, these constants are write-protected and read-only, as the name implies.

If the length of the encoded string is not divisible by four bytes, its storage is rounded up to a multiple of four bytes. This is because the CPU simulator design uses fixed 32-bit instructions and operands. Any remaining unused bytes in the 4-byte block are padded with zeros, so some memory overhead is expected.

The assembler replaces the symbolic name of the string constant with the starting virtual memory address of the string array in the `.rodata` segment. The encoding of the first character in the string starts at the lowest virtual memory address.

The symbolic name of the string constant can then be used like a memory address in the assembly code.
Here is an example of writing the starting virtual memory address of the previously defined string constant into the EAX register:

``` Assembly
MOV $myStringConst, %eax
```

## 1.2 Symbolic Variables

Symbolic variables can store either an integer or a string. The actual values of the variables get stored in the data segment, which is writable in user mode. For more details about the layout of a program in memory, see [5 Ihme Core Executable Files](#5-ihme-core-executable-files).

By convention the variables should be defined and declared between the `.DATA` and the `.CODE` label in the program text.

### 1.2.1 Symbolic Integer Variables

Symbolic integer variables can store a 32-Bit integer value. They can be created as follows:

``` Assembly
.DATA
.intVariable ; uninitialized integer variable
.intVariableWithValue 5 ; creates integer variable with the value 5
.CODE
```

If no value is given, the variable is internally initialized with zero, as shown for the first variable above; otherwise, it is initialized with the given numerical value.
The assembler replaces all occurrences of the symbolic name of the integer variable with the virtual memory address that points to the memory containing the variable's value.

Accessing and reassigning the value of a symbolic integer variable can be done as follows:

```Assembly
MOV $intVariable, %eax ; move the memory address that contains the variable value into eax
MOV $10, *%eax ; moves the value 10 into the memory which eax points to
```

In the above example, the value 10 is assigned to the symbolic integer variable `intVariable`.
First, the virtual memory address that points to the variable's value is moved into EAX.
In the second step, the value 10 is moved into the actual memory location of the variable by dereferencing the memory address in EAX and moving the new value into it.
The symbolic name can be used like a normal memory address.

### 1.2.2 Symbolic String Variables

Symbolic string variables are used to store a string in memory. They can be defined as follows:

``` Assembly
.DATA
.stringVariable "I am a string."
.CODE
```

In the current implementation, the string is encoded in UTF-8 and stored as a null-terminated array of bytes in the data segment of the program.

The assembler replaces the symbolic name of the string variable in the assembly code with the virtual memory address that points to the location in the data segment containing the string value. The virtual memory address is the start address of the byte array that encodes the string. Analogous to string constants, the size of a string is rounded up to the next 4-byte-aligned size if the encoded string size is not divisible by four. The padding to achieve the needed length is done by adding null bytes to the end of the string. The symbolic name can be used like a normal memory address.

``` Assembly
MOV $stringVariable, %eax
```

In the above example, the starting virtual memory address of `stringVariable` is written into the EAX register.

Similar to integer variables, the content of string variables can be manipulated by writing to the memory that the virtual memory address points to.

``` Assembly
.DATA
.string "Strings are cool"
.newValue "Foo"
.CODE

MOV $string, %eax ; loads the virtual memory start address of stringVariable into eax
MOV $newValue, %ebx  ; loads the virtual memory start address of newValue into ebx
MOV *%ebx, %ebx ; moves the content of newValue into ebx
MOV *%eax, %ecx ; moves the content of string into ecx
AND $0xFF, %ecx ; masks the last byte (utf-8 encoded "i") and clears the rest
OR %ecx, %ebx ; combines the utf-8 encoded "i" with utf-8 encoded "Foo" in ebx (utf-8 encoded "Fooi")
MOV %ebx, *%eax ; Writes the content of ebx into the string variable string
```

The example above shows how to overwrite parts of one string with another string. Since registers are 32-bit, a `MOV` instruction always moves four bytes of the string content when accessing it.

In the example, the null terminator of the string `newValue` would overwrite the "i" in "Strings" of the variable `string`. One solution is to take the first four UTF-8-encoded characters of `string` and mask the last byte, which is the UTF-8-encoded "i".
The masking is achieved by the `AND` operation with the `0xFF` bitmask, setting every byte in the register to zero except the UTF-8-encoded "i".

In the next step, the "i" can be combined with the content of EBX, which is the null-terminated "Foo".
The `OR` operation can be applied immediately, as the null terminator in UTF-8 is a single zero byte.
After the `OR` operation, EBX contains "Fooi", which can now be written into the string variable string, resulting in "Fooings are cool" in memory.
Similarly, other parts of strings can be extracted, overwritten, and manipulated.
To overwrite or copy strings that are larger than a register, a loop has to be used.

``` Assembly
.DATA
.string "Strings are cool"
.newValue "Foo"
.CODE

MOV $string, %eax ; loads the virtual memory start address of stringVariable into eax
MOV $newValue, %ebx  ; loads the virtual memory start address of newValue into ebx

ADD $4, %eax ; move the memory pointer by 4 bytes

MOV *%ebx, %ebx ; moves the content of newValue into ebx
MOV *%eax, %ecx ; moves the content of string into ecx
AND $0xFF, %ecx ; masks the last byte (utf-8 encoded " ") and clears the rest
OR %ecx, %ebx ; combines the utf-8 encoded " " with utf-8 encoded "Foo" in ebx (utf-8 encoded "Foo ")
MOV %ebx, *%eax ; Writes the content of ebx into the string variable string
```

The previous example has been expanded to show that a string can be accessed like an array. To demonstrate, the last three characters of "Strings" in the variable `string` are overwritten by "Foo".
The approach is the same as in the previous example, with the exception that the memory pointer in EAX, which contains the base memory address of the variable `string`, is shifted by four bytes.
To shift the memory pointer by four bytes in the `string` variable, the `ADD` operation is used. The rest of the example is the same as previously.

### 1.2.3 Modifiable Buffers

Buffers are located in the data segment of a program, which is marked as writable in the page tables, and they are initialized to zero in memory. Because buffers are modifiable and located in the data segment, they are classified as variables. Similar to strings, buffers can be accessed and manipulated as arrays.

Analogous to strings, the size of a buffer must be a multiple of four bytes, as the simulator is designed around 32-bit instructions and operands. If a buffer's size is not a multiple of four bytes, it is padded to the next 4-byte-aligned size.
The assembler replaces all occurrences of the symbolic buffer name in the program with the virtual memory start address of the buffer. The syntax to create a buffer is `.BUF <buffer size in byte> <buffer name>`.

``` Assembly
.DATA
.BUF 3 myBuffer
.CODE
```

The example above shows the creation of a 3-byte buffer named `myBuffer`. The actual buffer size is padded to four bytes as mentioned before.

## 1.3 Console IO

The console has four different types of I/O operations. These include writing a number to the console, reading a number from the console, writing a string to the console, and reading a string from the console. Once the user inputs data and presses the Enter key, an interrupt is triggered (see [2.1.1 Keyboard Interrupt](#211-keyboard-interrupt) for details).

Internally, the console uses an array of `Uint8Array`s as an input buffer. Each line on the console populates a new index in the input buffer. The `\n` escape sequence can also be used to indicate a newline. The array is populated based on the FIFO (First-In-First-Out) principle and is limited to 255 entries. If the user adds an input that exceeds the 255-entry limit, the oldest entry is removed, and the new entry is placed at the end of the buffer.

Both read operations for numbers and strings are blocking if the console buffer is empty. If data is already in the console input buffer when a read operation is performed, the function executes and returns immediately. When a process attempts to read from an empty console, it enters a blocked state waiting for I/O and is placed in the I/O waiting queue. This waiting queue operates on a FIFO basis.

Once the keyboard interrupt triggers, the first process in the I/O waiting queue transitions to the `waiting` state. If multiple processes are waiting for keyboard I/O and multiple keyboard interrupts are triggered, the processes change to the waiting state in the order they originally entered the blocked queue. The scheduler ultimately decides which process actually gets to read the data first, depending on which process is set to the running state first.

A console library has also been implemented to simplify console access, removing the need to manually manage the stack for syscalls. To use these library functions, the library must first be included using the `.INCLUDE` directive, as shown in the examples.

### 1.3.1 Console Read Number

To read a number from the console, the `$CONST_SYSCALL_CONSOLE_READ_NUMBER` constant can be used if the `os/include/syscalls` file has been included in the program.

Parameters: `none`  

Return value:

* EAX: Number read from the console  
* EBX: Success status  
*   `0` -> Success
*   `-1` -> No input ready
*   `-2` -> Could not parse number
*   `-3` -> Number does not fit into 32 bit DoubleWord

The read operation is blocking, see [1.3 Console IO](#13-console-io) for more details.

``` Assembly
.INCLUDE "os/include/syscalls"
MOV $CONST_SYSCALL_CONSOLE_READ_NUMBER, %eax ; Sets up the syscall to be executed
INT $0x80 ; Trigger interrupt for syscall
```

In the above example, `%eax` now contains the number read from the console, and `%ebx` contains the status code of the operation.

### 1.3.2 Console Write Number

To write a number to the console the `$CONST_SYSCALL_CONSOLE_PRINT_NUMBER` constant can be used if the `os/include/syscalls` file has been included in the program.

Parameters:

*   EBX: Number to be printed to the console  (used as immediate value)

Return value: `none`

``` Assembly
MOV $0, %ebx
MOV $CONST_SYSCALL_CONSOLE_PRINT_NUMBER, %eax ; Sets up the syscall to be executed
INT $0x80 ; Trigger interrupt for syscall
```

In the above example, the number `0` is written to the `%ebx` register and then printed to the console.

### 1.3.3 Console Read String

Because the console is treated as a file, similar to Linux, the file read syscall is used to read from the console. The console uses the file descriptor `0` to differentiate it from normal files.

To read a string from the console, the `$CONST_SYSCALL_FILE_READ` constant can be used if the `os/include/syscalls` file has been included in the program.

* Parameters (EBX is a pointer to the following struct):  
*   `*(EBX)`: File descriptor (`fd=0` for console, `fd>0` for files)  
*   `*(EBX+4)`: Pointer to a buffer; this buffer will be filled by the file system  
*   `*(EBX+8)`: Buffer size; limits the amount of bytes that will be read  

* Return value (immediate value):  
* EAX: Success status  
*   `>=0` -> Number of bytes read  
*   `-1` -> Invalid file descriptor  
*   `-2` -> Seek position out of file bounds  
*   `-3` -> No console input ready

``` Assembly
.INCLUDE "os/include/syscalls"

; Prepare the arguments on the stack for the file read
MOV $4, %eax ; Buffer size for the read
PUSH %eax

MOV %esp, %ebx
SUB $8, %ebx ; Space for pointer and file descriptor
SUB $4, %ebx ; Space for the buffer content

PUSH %ebx ; Pointer to the buffer to store the read data
MOV $0, %eax ; File descriptor 0 = console
PUSH %eax

MOV %esp, %ebx ; Parameter for file read

MOV $CONST_SYSCALL_FILE_READ, %eax ; Sets up the syscall to be executed
INT $0x80 ; Trigger interrupt for syscall
```

In the above example, the file read is set up to read four bytes from the console. The parameters for the file read, including the buffer to store the read data, are pushed onto the stack. At the end of the above example, the data read from the console is in the buffer on the stack, and `%eax` contains the status code of the operation.

Both the [1.3.1 Console Read Number](#131-console-read-number) and the Console Read String operations access the same console input buffer. The Console Read String operation first reads only strings from the console input buffer, since a number can be interpreted as a string on the console. Strings that can be interpreted as a number are skipped. This prevents the Console Read String operation from accidentally reading and flushing a number from the buffer in the event that two programs are waiting for keyboard I/O (e.g., one program waiting for a number and one waiting for a string). Only if no other strings are present in the console input buffer will the read operation fall back to reading a number as a string.

If a read operation requests more bytes than are currently present in the buffer, only the number of bytes available are read. If fewer bytes are requested than are present, the remaining data stays in the buffer, and the line is not removed.

The read operation is blocking, see [1.3 Console IO](#13-console-io) for more details on the blocking behavior and the input buffer design.

### 1.3.4 Console Write String

Because the console is treated as a file, similar to Linux, the file write syscall is used to write to the console. The console uses the file descriptor `0` to differentiate it from normal files.

To write a string to the console, the `$CONST_SYSCALL_FILE_WRITE` constant can be used if the `os/include/syscalls` file has been included in the program.

* Parameters (EBX is a pointer to the following struct):  
*   `*(EBX)`: File descriptor (`fd=0` for console, `fd>0` for files)  
*   `*(EBX+4)`: Pointer to buffer; this buffer will be used by the file system  
*   `*(EBX+8)`: Buffer size; limits the amount of bytes that will be written  

* Return value (immediate value):  
*   EAX: Success status  
*   `>=0` -> Number of bytes written  
*   `-1` -> Invalid file descriptor  
*   `-2` -> Seek position out of file bounds

``` Assembly
.INCLUDE "os/include/syscalls"
CONST stringTest "Test"

; Prepare the parameter for file write
MOV $4, %eax ; Number of bytes to write. 4 bytes for "Test"
PUSH %eax

MOV $stringTest, %eax ; Move pointer to the start of the string constant stringTest into eax
PUSH %eax

MOV $0, %eax ; File descriptor 0 for console
PUSH %eax

MOV %esp, %ebx 
MOV $CONST_SYSCALL_FILE_WRITE, %eax ; Sets up the syscall to be executed


INT $0x80 ; Trigger interrupt for syscall
```

In the previous example, the string constant `stringTest` is written to the console. The example pushes the parameters for the file write onto the stack, including the file descriptor for the console. The string constant is used as the buffer in this case. After the operation, the string `Test` appears on the console, and EAX contains the success status of the operation.

### 1.3.5 Console Library Read Number

The console library function to read a number from the console has the following parameters and return values:

Parameters: `none`

Return value (immediate value):
*   EAX: The number read from the console
*   EBX: Success status
*   `0` -> Success
*   `-1` -> No input ready
*   `-2` -> Could not parse number
*   `-3` -> Number does not fit into 32 bit DoubleWord

``` Assembly
.INCLUDE "os/include/console"
CALL console_read_number
```

In the above example, EAX contains the number read from the console, and EBX contains the status code of the operation after the library function call. If the console input buffer already contains data that can be parsed as a number, the call returns immediately without blocking; otherwise, the program blocks until a keyboard interrupt is triggered.

### 1.3.6 Console Library Write Number

The console library function to write a number to console has the following parameters and return values:

* Parameters (immediate value)
*   EBX: Number to write to the console

Return value: `none`

``` Assembly
.INCLUDE "os/include/console"
MOV $10, %ebx ; Number to write to the console
CALL console_write_number
```

In the above example, the number 10 is written to the console. Console write operations are non-blocking.

### 1.3.7 Console Library Read String

The console library function to read a string from the console has the following parameters and return values:

Parameters:

*   EAX: Number of bytes to read from the cosnole
*   EBX: Pointer to buffer

Return value:

*   EAX: Success status
*   `>=0` -> Number of bytes read  
*   `-1` -> Invalid file descriptor  
*   `-2` -> Seek position out of file bounds  
*   `-3` -> No console input ready

The pointer to a buffer can be either the base address of a buffer or a memory address that references free space on the stack.

``` Assembly
.INCLUDE "os/include/console"

.DATA
.BUF 4 stringBuffer ; creates a four byte large buffer to store the string
.CODE

MOV $4, %eax ; Number of bytes to read from the console
MOV $stringBuffer, %ebx ; Buffer to store the string

CALL console_read_string ; Call the library function
```

In the above example, the console library function is used to read four bytes of a string from the console and store them in the buffer named `stringBuffer`. Similar to the other console read operations, the program returns immediately if data is already present in the console buffer. If no data is present, the program blocks until a keyboard interrupt is triggered.

### 1.3.8 Console Library Write String

The console library function to write a string to the console has the following parameters and return values:

Parameters:

*   EAX: Number of bytes to write to the console
*   EBX: Pointer to the buffer that contains the data to write to the console

Return value:

*   EAX: Success status
*   `>=0` -> Number of bytes written  
*   `-1` -> Invalid file descriptor  
*   `-2` -> Seek position out of file bounds

``` Assembly
.INCLUDE "os/include/console"

.CONST stringConstant "My string"

MOV $9, %eax ; Number of bytes to write to the console from the buffer
MOV $stringConstant, %ebx ; Set the string constant as buffer to read from 

CALL console_write_string ; Call the library function
```

In the above example, the string "My string" is written to the console. For write operations to the console, constants can be used as well, since their content is not modified. The program does not block, as the operation is a write operation, and the function returns immediately.

## 1.4 Process Management

Several syscalls are available for process management, allowing users to create, yield, or exit a process. Because the Ihme-Core OS is a multiprocess operating system, multiple processes must share CPU time. The scheduler dictates how long a process is allowed to run on the CPU by monitoring its time slice before switching to the next process. However, a process can also voluntarily give up its execution time by using the yield syscall.

### 1.4.1 Process Create

This syscall creates a new process by loading a program from an ICE (Ihme Core Executable) file. Internally, this involves creating the PCB for the process, setting up the page directory and necessary L2 page tables, and loading the program data into memory. Once loaded, the new process enters the `waiting` state, ready to be scheduled and transitioned to the `running` state after the syscall returns. The process starts with a fresh [time-slice](#41-time-slice-management).

Parameters:

* EBX: Pointer to a string containing the file path

Return value:

* EAX: Success status
*   `0` -> Success
*   `1` -> Error

This syscall has a predefined constant associated with it for easier use, which requires importing the `syscalls` file from the include directory. It can be called as follows:

``` Assembly
.INCLUDE "os/include/syscalls" ; import the constants for syscalls

.CONST FILE_PATH "bin/loop.bin" ; create a constant with the file path of the program to load

MOV $FILE_PATH, %ebx ; prepare the parameter for the syscall

MOV $CONST_SYSCALL_PROCESS_CREATE, %eax ; sets up the syscall to be executed
INT $0x80 ; Trigger interrupt for syscall
```

In the example above, a new process is created from the example program `loop`. The program needs to be compiled first, which can be done through the GUI.

### 1.4.2 Process Yield

A process can voluntarily give up its CPU time before its time slice expires. Its time slice is reset, and the process is placed back into the `waiting` state. This gives other processes a chance to execute, provided they are available and also in the `waiting` state.

Parameters: `none`

Return value: `none`

This syscall has a predefined constant associated with it for easier use, which requires importing the `syscalls` file from the include directory. It can be called as follows:

``` Assembly
.INCLUDE "os/include/syscalls" ; import the constants for syscalls

MOV $CONST_SYSCALL_PROCESS_YIELD, %eax ; Sets up the syscall to be executed
INT $0x80 ; Trigger interrupt for syscall
```

The example above causes the currently executing process to yield and return to the `waiting` state.

### 1.4.3 Process Exit

Exiting a process causes it to terminate, permanently ending its execution. Calling this syscall at the end of a program is strictly necessary; failing to do so leads to undefined behavior. Without an explicit exit, the CPU will continue fetching instructions past the end of the program, likely triggering an invalid opcode error or a general protection fault depending on the adjacent memory region.

When a process exits, all memory previously used by it is freed.

Parameters: `none`

Return value: `none`

This syscall has a predefined constant associated with it for easier use, which requires importing the `syscalls` file from the include directory. It can be called as follows:

``` Assembly
.INCLUDE "os/include/syscalls" ; import the constants for syscalls

MOV $CONST_SYSCALL_PROCESS_EXIT, %eax ; Sets up the syscall to be executed
INT $0x80 ; Trigger interrupt for syscall
```

The example above shows how to terminate the currently running process.

## 2 Interrupts

## 2.1 Hardware Interrupts

### 2.1.1 Keyboard Interrupt

When the console [GUI element](#32-console) is focused by the user (indicated by a blinking cursor) and the Enter key is pressed, a hardware interrupt is triggered. The interrupt is classified as an external interrupt, as it is not generated by the CPU hardware. The designated interrupt number for the keyboard interrupt is `0x81`.

## 3 GUI

## 3.1 Registers

### 3.1.1 Clickable Registers

Some registers can hold memory addresses for either virtual or physical memory. A feature has been implemented that allows users to jump directly to these memory addresses by clicking the register's GUI element. The target memory cell in virtual or physical memory is highlighted after the jump. This minimizes scrolling and makes finding those memory addresses much easier.

The following registers implement the jump-on-click feature:

- EAX
- EBX
- ECX
- ESP
- EIP
- ITP
- PTP

## 3.2 Console

The console GUI element serves as the input and output interface for programs to read from or write to. The console is enabled by default, but it can be enabled or disabled through the settings:  
`Settings -> Behavior -> Output -> Console -> Enable Console`  
`Settings -> Behavior -> Output -> Console -> Disable Console`  
If the console is disabled, its existing content remains intact; only the GUI element is hidden, and the content reappears when re-enabled.

Clicking anywhere inside the console window focuses the input field, as indicated by the blinking cursor. Once the cursor is blinking, the user can type data and submit it by pressing the Enter key.

## 4 Operating System

### 4.1 Time-slice Management

To fairly distribute processing time among multiple running processes, the Ihme-Core simulator uses time-slice management. Each process receives a time slice of a fixed duration. In the Ihme-Core OS, the time slice is implemented via a counter in the process control block.

On boot, the OS sets a periodic timer (the system timer). Every time the periodic timer expires, it triggers an interrupt. The interrupt service routine decrements the time-slice counter in the process control block of the currently running process. This counter is only decremented while the running process is executing in user mode. Once the time-slice counter reaches zero, the process is placed in the ready state, and the scheduler selects a new process to run with a freshly reset time-slice counter.

If a process yields or enters the blocked state, its time-slice counter is reset.

The time-slice counter uses periodic interrupts as its unit of measurement, while the periodic timer uses instruction counts. Both values can be configured independently in the `os_filesystem/os/src/constants.asm` file.

``` Assembly
.CONST CONST_OS_PROCESS_TIME_SLICE_SIZE 3
.CONST CONST_OS_PERIODIC_TIMER_FREQUENCY 5
```

In this example, three periodic timer interrupts can occur before the scheduler causes a context switch, and five user instructions can execute before the periodic timer triggers a hardware interrupt.

### 4.2 Process States

Processes in the Ihme-Core OS can be in one of several states. A process's current state is stored in its Process Control Block (PCB). The following table lists all currently implemented process states:

| Status | Numerical Value |
| :--- | ---: |
| Terminated | 0 |
| Running | 1 |
| Waiting | 2 |
| Timer Blocked | 3 |
| IO Blocked | 4 |

The `terminated` state indicates that the process has finished execution, will not be executed again, and its memory has been freed. When a process terminates, the scheduler finds the next available process and performs a context switch.

Because the simulated Ihme-Core CPU is single-core and single-threaded, only one process can be active at a time. The process currently being executed by the CPU is in the `running` state.

Processes in the `waiting` state are ready for execution and are held in a waiting queue. Multiple processes can be in the `waiting` state simultaneously. The scheduler selects the first process in the waiting queue to execute on the next context switch.

A process in a `blocked` state is not ready to execute because it is waiting for a specific event to occur. Currently, there are two types of `blocked` states implemented: `timer blocked` and `IO blocked`.

* Processes in the `timer blocked` state are waiting for a timer to expire. Once the timer expires, an interrupt is triggered, moving the process back into the `waiting` state.

* Processes waiting for I/O on the console enter the `IO blocked` state. They transition back to the waiting state once input becomes available on the [console](#13-console-io), which is signaled by an interrupt.

The OS maintains separate queues for processes in the `timer blocked` and `IO blocked` states.

A process can never transition directly from a `blocked` state to the `running` state; it must first be moved to the `waiting` state and then be scheduled by the scheduler.

## 5 DEV Operations

DEV operations are akin to hypercalls in a hypervisor. They allow the operating system to communicate directly with the simulator layer of the system. This includes interactions with the simulated hardware to change settings, and they are also used to interact with the file system of the host system that the simulator is running on.

DEV operations can only be used when the system is in kernel mode. To use a DEV operation, the `DEV <operand1>, <operand2>` instruction must be used. The first operand (`operand1`) determines which DEV operation is executed and is represented by an integer. Most DEV operations are used in conjunction with syscalls. Constants have been defined to make using DEV operations easier, making it possible to address the DEV operation with a symbolic name. All listed DEV operations are non-blocking.

The following table provides an overview of the DEV operations by their defined symbolic name, assigned integer, and the syscall they are used in (if applicable). The DEV operations that are not associated with a syscall are used for system-level management.

| DEV operation | DEV number | Syscall |
| :--- | ---: | :--- |
| CONST_DEV_COMMAND_IO_SEEK | 0 | CONST_SYSCALL_FILE_SEEK |
| CONST_DEV_COMMAND_IO_CLOSE | 1 | CONST_SYSCALL_FILE_CLOSE |
| CONST_DEV_COMMAND_IO_READ_BUFFER | 2 | CONST_SYSCALL_FILE_READ |
| CONST_DEV_COMMAND_IO_WRITE_BUFFER | 3 | CONST_SYSCALL_FILE_WRITE |
| CONST_DEV_COMMAND_FILE_CREATE | 4 | CONST_SYSCALL_FILE_CREATE |
| CONST_DEV_COMMAND_FILE_DELETE | 5 | CONST_SYSCALL_FILE_DELETE |
| CONST_DEV_COMMAND_OPEN_FILE | 6 | CONST_SYSCALL_FILE_OPEN |
| CONST_DEV_COMMAND_FILE_STAT | 7 | CONST_SYSCALL_FILE_STAT |
| CONST_DEV_COMMAND_CONSOLE_PRINT_NUMBER | 8 | CONST_SYSCALL_CONSOLE_PRINT_NUMBER |
| CONST_DEV_COMMAND_CONSOLE_READ_NUMBER | 9 | CONST_SYSCALL_CONSOLE_READ_NUMBER |
| CONST_DEV_COMMAND_CPU_IS_MEMORY_VIRTUALIZATION_ENABLED | 10 | - |
| CONST_DEV_COMMAND_CPU_ENABLE_MEMORY_VIRTUALIZATION | 11 | - |
| CONST_DEV_COMMAND_CPU_DISABLE_MEMORY_VIRTUALIZATION | 12 | - |
| CONST_DEV_COMMAND_TIMER_GET_FINISHED | 13 | - |
| CONST_DEV_COMMAND_TIMER_SET | 14 | - |
| CONST_DEV_COMMAND_PERIODIC_TIMER_SET | 15 | - |
| CONST_DEV_COMMAND_CONSOLE_BUFFER_STATUS | 16 | - |
| CONST_DEV_COMMAND_FRAME_MAPPED_SIGNAL | 17 | - |
| CONST_DEV_COMMAND_FRAME_UNMAPPED_SIGNAL | 18 | - |
| CONST_DEV_COMMAND_PERFORMANCE_TIMER_START | 19 | - |
| CONST_DEV_COMMAND_PERFORMANCE_TIMER_STOP | 20 | - |

## 5.1 IO Seek

This DEV operation is used to seek inside a file in the file system of the simulator. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_IO_SEEK, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: File descriptor

Additional parameters on the stack:

*   `stack + 0`: Seek Mode
*   `0` -> Seek from current position
*   `1` -> Seek from start of file
*   `2` -> Seek from end of file
*   `stack + 4`: Offset

Note: The values on the stack are removed by the DEV command, so the stack does not need to be cleaned manually.

Return value (EAX):

*   `0` -> Success
*   `-1` -> Invalid file descriptor
*   `-2` -> Seek position out of file bounds
*   `-3` -> Negative seek position

## 5.2 IO Close

This DEV operation is used to close an open file in the file system of the simulator. It can be called as follow:

``` Assembly
DEV $CONST_DEV_COMMAND_IO_CLOSE, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: File descriptor

* Return value (EAX):
*   `0` -> Success
*   `-1` -> Invalid file descriptor

## 5.3 IO Read Buffer

This DEV operation is used to read bytes from a file in the file system of the simulator or to read from the console of the simulator. The data is stored in a buffer. If more bytes are requested than are available in the file at the offset the file descriptor points to, only the available bytes are read. Trying to read more bytes than the buffer can store can lead to undefined behavior or cause a general protection fault. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_IO_READ_BUFFER, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: File descriptor
*   `0` -> Special file descriptor for console access

Additional parameters on the stack:

*   `stack + 0`: Buffer address
*   `stack + 4`: Number of bytes to read

Note: The values on the stack are removed by the DEV command, so the stack does not need to be cleaned manually.

Return value (EAX):

*   `>= 0` -> Number of bytes read
*   `-1` -> Invalid file descriptor
*   `-2` -> Invalid seek position
*   `-3` -> No console input ready

## 5.4 IO Write Buffer

This DEV operation writes bytes to a file in the simulator's file system or to the simulator console. Data is read from a source buffer and written to the target destination. Attempting to write more bytes than the source buffer contains can lead to undefined behavior or trigger a general protection fault. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_IO_WRITE_BUFFER, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: File descriptor
*   `0` -> Special file descriptor for console access

Additional parameters on the stack:

*   `stack + 0`: Buffer address
*   `stack + 4`: Number of bytes to write

Note: The values on the stack are removed by the DEV command, so the stack does not need to be cleaned manually.

Return value (EAX):

*   `>= 0` -> Number of bytes written
*   `-1` -> Invalid file descriptor
*   `-2` -> Invalid seek position

## 5.5 File Create

This DEV operation creates a file in the file system of the simulator. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_FILE_CREATE, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: Pointer to a string containing the filename

Return value (EAX):

*   `>= 0` -> Success
*   `-1` -> File already exists

## 5.6 File Delete

This DEV operation deletes a file in the file system of the simulator. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_FILE_DELETE, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: Pointer to a string containing the filename

Return value (EAX):

*   `0` -> Success
*   `-1` -> File does not exist

## 5.7 Open File

This DEV operation opens a file in the file system of the simulator. It returns a file descriptor for subsequent operations. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_OPEN_FILE, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: Pointer to a string containing the filename

Return value (EAX):

*   `>= 0` -> File descriptor
*   `-1` -> Invalid filename

## 5.8 File Stat

This DEV operation retrieves the file size of a file in the file system of the simulator. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_FILE_STAT, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: Pointer to a string containing the filename

Return value (EAX):

*   `>= 0` -> Filesize
*   `-1` -> File does not exist
*   `-2` -> Not a file

## 5.9 Console Print Number

This DEV operation prints a number to the console of the simulator. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_CONSOLE_PRINT_NUMBER, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: Number to print on the console

Return value: `none`

## 5.10 Console Read Number

This DEV operation reads a number from the console of the simulator. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_CONSOLE_READ_NUMBER, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: Unused operand, but must be set to prevent an invalid opcode error (passing `$0` is recommended).

Return value:

* EAX: Number read from the console
* EBX: Status
*   `0`  -> Success
*   `-1` -> No input ready
*   `-2` -> Not a number
*   `-3` -> Number does not fit into a 32-bit DoubleWord

## 5.11 Is Memory Virtualization Enabled

This DEV operation queries whether memory virtualization is enabled. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_CPU_IS_MEMORY_VIRTUALIZATION_ENABLED, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: Unused operand, but must be set to prevent an invalid opcode error (passing `$0` is recommended).

Return value (EAX):

*   `0` -> Disabled
*   `1` -> Enabled

## 5.12 Enable Memory Virtualization

This DEV operation enables memory virtualization. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_CPU_ENABLE_MEMORY_VIRTUALIZATION, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: Unused operand, but must be set to prevent an invalid opcode error (passing `$0` is recommended).

Return value: `none`

## 5.13 Disable Memory Virtualization

This DEV operation disables memory virtualization. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_CPU_DISABLE_MEMORY_VIRTUALIZATION, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: Unused operand, but must be set to prevent an invalid opcode error (passing `$0` is recommended).

Return value: `none`

## 5.14 Timer Get Finished

This DEV operation retrieves the ID of a hardware timer that expired and triggered an interrupt. The simulator maintains an internal queue in case multiple timers have finished counting down. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_TIMER_GET_FINISHED, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: Unused operand, but must be set to prevent an invalid opcode error (passing `$0` is recommended).

Return value:

*   EAX: ID of the finished timer

## 5.15 Timer Set

This DEV operation sets up a hardware timer with a specified ID and start value. The timer duration is expressed in user-mode instructions. Each time an instruction executes in user mode, the timer is decremented by one. It can be called as follows:


``` Assembly
DEV $CONST_DEV_COMMAND_TIMER_SET, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: Timer ID as an integer

Additional parameter on the stack:

*   `stack + 0`: Timer start value

Note: The values on the stack are removed by the DEV command, so the stack does not need to be cleaned manually.

Return value: `none`

## 5.16 Periodic Timer Set

This DEV operation configures the periodic hardware timer and sets the interval at which it will trigger interrupts. The interval is specified in user-mode instructions. For each instruction executed while the system is in user mode, the timer is decremented by one. Once set, the interval automatically repeats without needing to be reconfigured. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_PERIODIC_TIMER_SET, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: Timer interval in instructions as an integer

Return value: `none`

## 5.17 Console Buffer Status

This DEV operation queries the status of the console buffer. It returns how many lines in the buffer can be parsed as numbers and how many as strings.

A line containing only numbers can be parsed as a number, but it can also be interpreted as a string and is counted toward both totals. If a line contains any character other than digits, it is counted solely as a string. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_CONSOLE_BUFFER_STATUS, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: Unused operand, but must be set to prevent an invalid opcode error (passing `$0` is recommended).

Return value:

*   EAX: Number of lines that can be parsed as number
*   EBX: Number of lines that can be interpreted as string

## 5.18 Frame Mapped Signal

This DEV operation updates the reverse memory map in the MMU. The GUI uses this map to find all virtual memory addresses that point to a specific physical address without walking the page table of each process. This DEV operation informs the simulator that a new page frame has been mapped. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_FRAME_MAPPED_SIGNAL, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: The process ID of the process the frame is associated with

Additional parameters on the stack:

*   `stack + 0`: Physical memory address of the frame
*   `stack + 4`: The virtual memory address the frame was mapped to

Note: The values on the stack are removed by the DEV command, so the stack does not need to be cleaned manually.

Return value: `none`

## 5.19 Frame Unmapped Signal

This DEV operation updates the reverse memory map in the MMU. The GUI uses this map to find all virtual memory addresses that point to a specific physical address without walking the page table of each process. This DEV operation informs the simulator that a page frame has been freed and unmapped. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_FRAME_UNMAPPED_SIGNAL, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: The process ID of the process the frame is associated with

Additional parameters on the stack:

*   `stack + 0`: Physical memory address of the frame
*   `stack + 4`: The virtual memory address the frame got mapped to

Note: The values on the stack are removed by the DEV command, so the stack does not need to be cleaned manually.

Return value: `none`

## 5.20 Performance Timer Start

The performance timer is a special timer used to measure execution time between starting and stopping it. Its primary purpose is to benchmark performance changes when modifying the implementation of OS components. This DEV operation starts the performance timer with a specific ID. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_PERFORMANCE_TIMER_START, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: Timer ID as an integer

Return value: `none`

## 5.21 Performance Timer Stop

The performance timer is a special timer used to measure execution time between starting and stopping it. Its primary purpose is to benchmark performance changes when modifying the implementation of OS components. This DEV operation stops the performance timer associated with a specific ID. If there is no performance timer currently running with the given ID, an error is thrown. It can be called as follows:

``` Assembly
DEV $CONST_DEV_COMMAND_PERFORMANCE_TIMER_STOP, <operand2>
```

The DEV operation uses the following parameter:

* `operand2`: Timer ID as an integer

Return value: `none`

## 6 Ihme Core Executable Files

To load a program as a process in the simulator, it needs to be compiled into a binary file. Both compilation and loading can be executed through the GUI. Programs executed by the simulator are divided into different segments. Currently, three segments are implemented: the text segment, the rodata segment, and the data segment.

The text segment contains the actual program code that is executed by the simulator. Once the segment is loaded by the operating system, it is marked as executable in the page table. Because the segment is marked only as executable, it is write-protected by default, preventing the program from modifying its own code by writing to the text segment.

The rodata (read-only data) segment is used for constants. This segment is neither executable nor writable. Only read access is permitted, as the name implies. This ensures that constants are not modifiable.

The data segment is dedicated to writable data, such as [symbolic integer variables](#121-symbolic-integer-variables), [symbolic string variables](#122-symbolic-string-variables), and the [modifiable buffer](#123-modifiable-buffers). Because the segment is marked as read-write (RW) in the page table once the program is loaded into memory, this data can be altered at runtime. Leaving the executable bit unset protects the simulator from arbitrary code execution. This is especially relevant if the buffer is used to store data read from a file, which could contain executable code.

The simulator uses a custom format to structure the binary files, the so-called ICE (Ihme Core Executable) format. These files adhere to a specific structure and must end with the `.bin` file extension.

The following table shows the file structure of an ICE file:

### ICE File Layout

| ICE-File Structure |
| :---: |
| ICE Header |
| Program Header |
| Text Segment |
| Rodata Segment |
| Data Segment |

As the table shows, the files are split into the different data segments and metadata, such as the ICE header and the program header.

The ICE header is structured as shown in the following table:

### ICE Header Layout

| Offset (DWORD) | Function |
| ---: | :--- |
| 0 | Magic Number (0x7F 49 43 45) |
| 1 | Program Header Offset (Byte) |
| 2-7 | Reserved |

The ICE header is eight doublewords (32 bytes) large and contains important metadata about the file content. The first 32-bit doubleword in the ICE header contains the magic number. The magic number is used by the operating system during program loading to test and verify whether the binary file is valid and contains an executable program. If the magic number is not present or differs from the expected value, the loading is canceled immediately.

The second doubleword contains the offset at which the program header can be found inside the ICE file. The offset is given in bytes. The last six doublewords are reserved for future implementations.

The program header contains metadata about how the program segments are organized inside the binary file and how they must be loaded into memory once the program is initialized. It consists of 16 doublewords (64 bytes). The full structure of the program header is shown in the following table:

### Program Header Layout

| Offset (DWORD) | Function |
| ---: | :--- |
| 0 | Required L2 Page Tables |
| 1 | Text Segment Virt. Base Address |
| 2 | Text Segment Offset (Byte) |
| 3 | Text Segment Size (Byte) |
| 4 | Rodata Segment Virt. Base Address |
| 5 | Rodata Segment Offset (Byte) |
| 6 | Rodata Segment Size (Byte) |
| 7 | Data Segment Virt. Base Address |
| 8 | Data Segment Offset (Byte) |
| 9 | Data Segment Size (Byte) |
| 10-15 | Reserved |

The first doubleword contains the number of L2 page tables that the operating system needs to load so that all segments of the program can be mapped into memory. This is an optimization introduced to minimize the complexity of the code that loads the program.

The other entries contain information about the program segments. Each segment has a virtual memory base address. This base address dictates where the segment is mapped in the virtual address space of the program when it is loaded into memory. This virtual base address is always aligned to a page boundary (4 KiB aligned).

The offset for each segment describes where the segment is located inside the binary file. The offset is given in bytes and is used by the loader code to locate the segment within the file. Finally, the segment size specifies how large the segment is inside the binary file, so the program loader knows when to stop reading the segment data into memory.

The last six doublewords are reserved for future implementations and feature expansions.
