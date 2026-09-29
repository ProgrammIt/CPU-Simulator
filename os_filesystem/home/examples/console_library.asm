; Author: Moritz Müller <moritz.mueller2@stud.hs-hannover.de>
; This program demonstrates how to use the console library to first read a string from the console,
; write it back to the console and then do the same with a number.

; First the console library needs to be included
.INCLUDE "os/include/console"

; A four byte large buffer of the name "test" is reserved to later save the string to
.BUF 4 test
MOV $4, %eax ; number of bytes to read
MOV $test, %ebx ; buffer to store the string

;   Parameters:
;       eax     amount of bytes to read from the console
;       ebx     pointer to buffer
;   Return:
;       eax     success status (>=0 = number of bytes read, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = no console input ready)
CALL console_read_string ; read from console by calling the library function

MOV $test, %ebx
MOV $4, %eax ; number of bytes to write 

;   Parameters:
;       eax     amount of bytes to write to console
;       ebx     pointer to buffer to read from
;   Return: 
;       eax     success status (>=0 = number of bytes written, -1 = invalid file descriptor, -2 = seek position out of file bounds)
CALL console_write_string ; write to console by calling the library function

; Parameters:
;   none
; Return value:
;   eax     Number
;   ebx success status (0 = success, -1 = no input ready, -2 = could not parse number, -3 = number does not fit into 32 bit DoubleWord)
CALL console_read_number ; read number from console by calling the library function
MOV %eax, %ebx ; move the number that was read to ebx

; Parameters (ebx is used as immediate value):
;   ebx     Number
; Return value:
;   none
CALL console_write_number ; write number to console by calling the library function

; exit the process
MOV $CONST_SYSCALL_PROCESS_EXIT, %eax
INT $0x80

