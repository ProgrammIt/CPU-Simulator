; Author: Moritz Müller <moritz.mueller2@stud.hs-hannover.de>
; This program demonstrates how to write a string to the console.
.INCLUDE "os/include/syscalls"

; The string to be written to the console.
.CONST stringTest "Test"

; Prepare the parameter for file write
MOV $4, %eax ; Amount of bytes to write. 4 bytes for "Test"
PUSH %eax

MOV $stringTest, %eax ; Move pointer to the start of the string constant stringTest into eax
PUSH %eax

MOV $0, %eax ; File descriptor 0 for console
PUSH %eax

; All the parameter for the file write syscall are now on the stack

; SYSCALLS_FILE_WRITE
; Parameters (ebx is a pointer to the following struct):
;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
;   *(ebx+4)   pointer to buffer, this buffer will be used by the file system
;   *(ebx+8)   buffer size, limits the amount of bytes that will be written
; Return value (immediate value):
;   eax     success status (>=0 = number of bytes written, -1 = invalid file descriptor, -2 = seek position out of file bounds)

MOV %esp, %ebx 
MOV $CONST_SYSCALL_FILE_WRITE, %eax ; Sets up the syscall to be executed


INT $0x80 ; Trigger interrupt for syscall

; Exit the process
MOV $CONST_SYSCALL_PROCESS_EXIT, %eax
INT $0x80


                       


