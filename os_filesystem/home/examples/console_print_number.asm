; Author: Moritz Müller <moritz.mueller2@stud.hs-hannover.de>
; This program demonstrates how to write a number to the console in a loop.
; Each cycle the number is increased by one.
.INCLUDE "os/include/syscalls"


MOV $0, %ebx ; Number/counter to print on the console

; SYSCALLS_CONSOLE_PRINT_NUMBER
; Parameters (ebx is used as immediate value):
;   ebx     Number
; Return value:
;   none
MOV $CONST_SYSCALL_CONSOLE_PRINT_NUMBER, %eax ; Sets up the syscall to be executed

.loop_start:

INT $0x80 ; Trigger interrupt for syscall

ADD $1, %ebx ; Increase number by one

JMP loop_start