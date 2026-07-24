; Author: Moritz Müller <moritz.mueller2@stud.hs-hannover.de>
; This program demonstrates how a string can be read from the console. The data that has been read
; gets printed back to the console. 
; This program can also be used to demonstrate that the rest of a line stays in the buffer if the line is not read fully.
; The program reads four bytes of data and writes them back to the console. If the user inputs a line that is longer than four bytes, then the first four bytes are read and printed.
; If the user then triggers another keyboard interrupt by only inputting a single character for example and hitting enter, then the next four bytes of the previous input are read.
; If less than four bytes are left, then only the remaining bytes are read.
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

; Read from console
; SYSCALLS_FILE_READ
; Parameters (ebx is a pointer to the following struct):
;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
;   *(ebx+4)   pointer to buffer, this buffer will be filled by the file system
;   *(ebx+8)   buffer size, limits the amount of bytes that will be read
; Return value (immediate value):
;   eax     success status (>=0 = number of bytes read, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = no console input ready)
MOV $CONST_SYSCALL_FILE_READ, %eax ; Sets up the syscall to be executed
INT $0x80 ; Trigger interrupt for syscall


; Write the data that was read back to the console
; SYSCALLS_FILE_WRITE
; Parameters (ebx is a pointer to the following struct):
;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
;   *(ebx+4)   pointer to buffer, this buffer will be used by the file system
;   *(ebx+8)   buffer size, limits the amount of bytes that will be written
; Return value (immediate value):
;   eax     success status (>=0 = number of bytes written, -1 = invalid file descriptor, -2 = seek position out of file bounds)

MOV %esp, %ebx ; Parameter for file write
MOV $CONST_SYSCALL_FILE_WRITE, %eax
INT $0x80


; Demonstrate that the rest of the buffer is still filled by doing another read from and print to the console

MOV %esp, %ebx ; Parameter for file read
; Read from console
MOV $CONST_SYSCALL_FILE_READ, %eax
INT $0x80


; Write the data that was read back to the console

MOV %esp, %ebx ; Parameter for file read
MOV $CONST_SYSCALL_FILE_WRITE, %eax
INT $0x80


; Exit the process
MOV $CONST_SYSCALL_PROCESS_EXIT, %eax
INT $0x80
