; Author: Moritz Müller <moritz.mueller2@stud.hs-hannover.de>
; This program demonstrates how to read a number from the console. 
; For demonstration purposes the number is written back to the console.
.INCLUDE "os/include/syscalls"

; SYSCALLS_CONSOLE_READ_NUMBER
; Parameters
;   none
; Return value:
;   eax     Number
;   ebx success status (0 = success, -1 = no input ready, -2 = could not parse number, -3 = number does not fit into 32 bit DoubleWord)
MOV $CONST_SYSCALL_CONSOLE_READ_NUMBER, %eax ; Sets up the syscall to be executed
INT $0x80 ; Trigger interrupt for syscall

PUSH %eax ; Save eax (number)

; SYSCALLS_CONSOLE_PRINT_NUMBER
; Parameters (ebx is used as immediate value):
;   ebx     Number
; Return value:
;   none
MOV $CONST_SYSCALL_CONSOLE_PRINT_NUMBER, %eax ; Sets up the syscall to be executed
INT $0x80 ; Print status code of the previous console read number to the console

POP %ebx ; Restore the number previously read from the console

MOV $CONST_SYSCALL_CONSOLE_PRINT_NUMBER, %eax
INT $0x80 ; Print number to the console

; Exit the process
MOV $CONST_SYSCALL_PROCESS_EXIT, %eax
INT $0x80
