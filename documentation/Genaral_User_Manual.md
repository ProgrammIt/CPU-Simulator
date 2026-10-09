# Ihme-Core CPU Simulator User Manual

## 1 Writing Assembly Code for the CPU Simulator

## 1.1 Symbolic Constants

### 1.1.1 Symbolic Integer Constants

Symbolic integer constants can store a 32 bit integer value and can be defined as follows:

``` Assembly
.CONST myIntConst 5
```

The assembler stores the integer value and replaces all occurrences of the symbolic integer constant in the assembly code with their actual value.

The symbolic name of the integer constant can then be used like a normal integer value in the assembly code.
Here is an example of writing the previously defined integer constant into the EAX register:

``` Assembly
MOV $myIntConst, %eax
```

This writes the value 5 into the EAX register.

### 1.1.2 Symbolic String Constants

Symbolic string constants are treated a bit differently than symbolic integer constants and can be defined as follows:

``` Assembly
.CONST myStringConst "I am a string."
```

The given string is stored as a UTF-8 encoded and null terminated array in the code segment of the CPU-Simulator.

In case that the length of the encoded string is not divisible by four bytes, its storage is rounded up to a multiple of four bytes. This is due to the current CPU simulator design using fixed 32 bit instructions and operands. The unused rest of the four bytes storage at the end of such a string is filled by bytes with a zero value, so some memory overhead is expected.

Being stored in the code segment makes the string constant as the code segment is write protected in user mode and only writeable in kernel mode. To not interrupt the code execution, a jump instruction is automatically placed in front of the string array. The target of the jump instruction is the first virtual memory address after the string array.

The assembler replaces the symbolic name of the string constant with the virtual memory start address of the string array. The encoding of the first character in the string starts at the lowest virtual memory address.

The symbolic name of the string constant can then be used like a memory address in the assembly code.
Here is an example of writing the (start) virtual memory address of the previously defined string constant into the EAX register:

``` Assembly
MOV $myStringConst, %eax
```

In the current implementation the constants can be misused as variables, see the warning [below](#12-symbolic-variables).

## 1.2 Symbolic Variables

:warning:**Caution:** In the current implementation the symbolic integer and string variables are stored in the code segment. The code segment is write protected in user mode and only writeable in kernel mode. To assign different values to the variables during program runtime, the program has to switch into kernel mode. Under normal circumstances the program should not be able to switch into kernel mode directly. To make the variables work correctly, a modified NOP instruction has been implemented as a work-around, which switches the program into kernel mode. This NOP instruction has to be used once before variables can be assigned a new value (see the examples below). The modified NOP instruction is needed until a (writable) data segment or some other way of holding the variables in writable storage is implemented.

Using the modified NOP instruction also makes constants behave like variables, so caution is advised.

### 1.2.1 Symbolic Integer Variables

Symbolic integer variables can store a 32-Bit integer value. They can be created as follows:

``` Assembly
NOP
.DATA
.intVariable ;uninitialized integer variable
.intVariableWithValue 5 ;creates integer variable with the value 5
.CODE
```

Defining and declaring symbolic integer variables always has to be done between the `.DATA` and the `.CODE` blocks. The variable is initialized with zero internally if no value is given, like shown for the first variable above, otherwise it is initialized with the given numerical value.  
The assembler encodes the integer variable as a 32 bit integer and stores it in the code segment of the CPU simulator. To not interrupt the program flow, a jump instruction is automatically added by the assembler in front of the integer variable in virtual memory. The jump target is the first virtual memory address after the integer variable.  
The assembler replaces all occurrences of the symbolic name of the integer variable with its virtual memory address.
The `NOP` instruction switches the program into kernel mode, see the warning [above](#12-symbolic-variables).

Reassigning the value of a symbolic integer variable can be done as follows:

```Assembly
MOV $10, @intVariable
```

In the above example the value 10 is assigned to the symbolic integer variable `intVariable`.
The symbolic name can be used like a normal memory address.

### 1.2.2 Symbolic String Variables

Symbolic string variables are used to store a string in memory. They can be defined as follows:

``` Assembly
NOP
.DATA
.stringVariable "I am a string."
.CODE
```

In the current implementation the string is encoded in UTF-8 and stored in a null terminated array of bytes in the code segment of the CPU-Simulator like the symbolic string constants. Again, the `NOP` instruction is modified and needed to switch the program into kernel mode. For more details see [1.1.2 Symbolic String Constants](#112-symbolic-string-constants) and the warning [above](#12-symbolic-variables).

The assembler replaces the symbolic name of the string variables in the assembly code with their virtual memory address. The virtual memory address is the start address of the array of bytes that encodes the string. The symbolic name can be used like a normal memory address.

``` Assembly
MOV $stringVariable, %eax
```

In the above example the virtual memory start address of the `stringVariable` is written into the EAX register.

## 1.3 Console IO

The console has four different types of IO operations. These include writing a number to the console, reading a number from the console, writing a string to the console and reading a string from the console. Once the user has input data and presses the enter-key an interrupt is triggered, see [2.1.1 Keyboard Interrupt](#211-keyboard-interrupt) for details.

Internally the console uses an array of Uint8Arrays as input buffer. Each line on the console populates a new index in the input buffer. The `\n` escape sequence can be used as well to indicate a new line. The array is populated on the FIFO principle and is limited to 255 entries. If the user adds another input that would bring the buffer over 255 entries, then the first entry is removed and the new entry is put at the end of the buffer.

Both read operations for numbers and strings are blocking. When the process attempts to read from the console it changes into the blocked state waiting for IO and gets put into the waiting queue for IO. The waiting queue is FIFO. Once the keyboard interrupt triggers the first process in the waiting queue for IO changes into the ready state. If multiple processes wait for keyboard IO and multiple keyboard interrupts get triggered, then the processes change their state to ready and get put into the waiting queue in the order they have entered the blocked waiting for IO queue. Which process actually gets to read the data first is decided by the scheduler, depending on which process gets set to the running state first.

### 1.3.1 Console Read Number

To read a number from the console the `$CONST_SYSCALL_CONSOLE_PRINT_NUMBER` constant can be used if the `os/include/syscalls` file has been included in the program.

Parameters: none  

Return value:  
eax: Number read from the console  
ebx: Success status  
    0 -> Success  
   -1 -> No input ready  
   -2 -> Could not parse number  
   -3 -> Number does not fit into 32 bit DoubleWord  

The read operation is blocking, see [1.3 Console IO](#13-console-io) for more details.

``` Assembly
.INCLUDE "os/include/syscalls"
MOV $CONST_SYSCALL_CONSOLE_READ_NUMBER, %eax ; Sets up the syscall to be executed
INT $0x80 ; Trigger interrupt for syscall
```

In the above example `%eax` now contains the number read from the console and `%ebx` contains the status code of the operation.

### 1.3.2 Console Write Number

To write a number to the console the `$CONST_SYSCALL_CONSOLE_PRINT_NUMBER` constant can be used if the `os/include/syscalls` file has been included in the program.

Parameters (ebx is used as immediate value):  
ebx: Number to be printed to the console  

Return value:  
none

``` Assembly
MOV $0, %ebx
MOV $CONST_SYSCALL_CONSOLE_PRINT_NUMBER, %eax ; Sets up the syscall to be executed
INT $0x80 ; Trigger interrupt for syscall
```

In the above example the number `0` gets written to the `%ebx` register and then printed to the console.

### 1.3.3 Console Read String

Since the console gets treated as file, similar to Linux, the file read syscall is used to to read from the console. The console has the file descriptor `0` to differentiate it from normal files.  
To read a string from the console the `$CONST_SYSCALL_FILE_READ` constant can be used if the `os/include/syscalls` file has been included in the program.

Parameters (ebx is a pointer to the following struct):  
*(ebx): File descriptor (fd=0 for console, fd>0 for files)  
*(ebx+4): Pointer to buffer, this buffer will be filled by the file system  
*(ebx+8): Buffer size, limits the amount of bytes that will be read  

Return value (immediate value):  
eax: Success status  
\>=0 -> Number of bytes read  
-1 -> Invalid file descriptor  
-2 -> Seek position out of file bounds  
-3 -> No console input ready

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

In the above example the file read is set up to read four bytes from the console. The parameter for the file read, including the buffer to store the read data, are put on the stack. At the end of the above example the data read from the console is in the buffer on the stack and `%eax` contains the status code of the operation.

Both the [1.3.1 Console Read Number](#131-console-read-number) and the console read string operation access the same console input buffer. The console read string operation first reads only strings from the console input buffer since a number can be interpreted as a string on the console. Strings that can be interpreted as a number get skipped. This prevents the console read string operation from accidentally reading and flushing a number from the buffer, in the case that two programs are waiting for keyboard IO. One of the programs waiting for a number and one for a string. Only if no other strings are present in the console input buffer the read operation will fall back to reading a number as string.

If more bytes are read than are present in the buffer, then only the amount of bytes that are present get read. In the case that less bytes are read, the rest of the data stays in the buffer and the line is not removed from the buffer.

The read operation is blocking, see [1.3 Console IO](#13-console-io) for more details on the blocking behavior and the input buffer design.

### 1.3.4 Console Write String

Since the console gets treated as file, similar to Linux, the file read syscall is used to to read from the console. The console has the file descriptor `0` to differentiate it from normal files.  
To read a string from the console the `$CONST_SYSCALL_FILE_WRITE` constant can be used if the `os/include/syscalls` file has been included in the program.

Parameters (ebx is a pointer to the following struct):  
*(ebx): File descriptor (fd=0 for console, fd>0 for files)  
*(ebx+4): Pointer to buffer, this buffer will be used by the file system  
*(ebx+8): Buffer size, limits the amount of bytes that will be written  

Return value (immediate value):  
eax: Success status  
\>=0 -> Number of bytes written  
-1 -> Invalid file descriptor  
-2 -> Seek position out of file bounds

``` Assembly
.INCLUDE "os/include/syscalls"
CONST stringTest "Test"

; Prepare the parameter for file write
MOV $4, %eax ; Amount of bytes to write. 4 bytes for "Test"
PUSH %eax

MOV $stringTest, %eax ; Move pointer to the start of the string constant stringTest into eax
PUSH %eax

MOV $0, %eax ; File descriptor 0 for console
PUSH %eax

MOV %esp, %ebx 
MOV $CONST_SYSCALL_FILE_WRITE, %eax ; Sets up the syscall to be executed


INT $0x80 ; Trigger interrupt for syscall
```

In the previous example the string constant `stringTest` gets written to the console. The example puts the parameter for the file write onto the stack, including the file descriptor for the console. The string constant is used as buffer in this case. After the operation the string `Test` appears on the console and eax contains the success status of the operation.

## 2 Interrupts

## 2.1 Hardware Interrupts

### 2.1.1 Keyboard Interrupt

When the console [GUI element](#32-console) is focused by the user, indicated by a blinking cursor and the enter-key is pressed, then a hardware interrupt is triggered. The interrupt is classified as an external interrupt, since it is not generated by the CPU-Hardware. The designated interrupt number for the keyboard interrupt is `0x81`.

## 3 GUI

## 3.1 Registers

### 3.1.1 Clickable Registers

Some registers can hold memory addresses either for the virtual or for the physical memory. A feature has been implemented that allows the user to jump to those memory addresses by clicking on the GUI element of the register. The memory cell in the virtual or physical memory gets highlighted after the jump. This minimizes the scrolling necessary and makes it easier to find those memory address easier.
The following registers implement the jump on click feature:

- EAX
- EBX
- ECX
- ESP
- EIP
- ITP
- PTP

## 3.2 Console

The console GUI element is used as input and output for programs to read from or write to. The console is enabled by default but can be enabled or disabled through the settings.  
Settings -> Behavior -> Output -> Console -> Enable Console  
Settings -> Behavior -> Output -> Console -> Disable Console  
If the console is disabled the previous content stays intact. Only the GUI element gets hidden and the content is shown again on enablement.
Clicking anywhere inside the console window puts the selection focus on the write element of the console, indicated by the blinking cursor. Once the cursor is blinking the user can input data by writing and submitting it by pressing the enter key.

## 3 Operating System

## 3.1 Time-slice Management

To fairly distribute processing time between multiple running processes the Ihme-Core simulator uses time-slice management. Each process gets a time slice of a certain length. In the Ihme-Core OS the time slice is implemented through a counter in the process control block.
On boot the OS sets a periodic timer, the system timer. Each time the periodic timer runs out it sends an interrupt. The interrupt service routine decrements the time slice counter in the process control block of the currently running process. The time slice counter only gets decremented if the current running process is in the user mode. Once the time slice counter hits zero the process is put into the ready state and the scheduler picks a new process to run with a reset time slice counter.
If a process yields or is put in the blocked state, the time slice timer is reset.
The time slice counter uses periodic interrupts as unit of measurement and the periodic timer uses instructions. Both values can be set independently in the `os_filesystem/os/src/constants.asm` file.

``` Assembly
.CONST CONST_OS_PROCESS_TIME_SLICE_SIZE 3
.CONST CONST_OS_PERIODIC_TIMER_FREQUENCY 5
```

In this example three periodic timer interrupts can happen before the scheduler causes a context switch and 5 user instructions can be run before the periodic timer triggers a hardware interrupt.
