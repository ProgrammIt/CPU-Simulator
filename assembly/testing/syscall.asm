NOP


MOV $8, %eax ; eax for syscall id.  8 = SYSCALL_CONSOLE_PRINT_NUMBER
MOV $1234, %ebx ; ebx for syscall parameters. In case of SYSCALL_CONSOLE_PRINT_NUMBER, the value to be printed
INT $0 ; INT 0 = syscall


PUSH $0b01100001011000010110000101100001 ; move filename "aaaa" onto stack
MOV $6, %eax ; eax for syscall id.  6 = SYSCALL_FILE_OPEN
MOV %esp, %ebx ; ebx for syscall parameters. In case of SYSCALL_FILE_OPEN, a pointer to the filename.
INT $0 ; INT 0 = syscall

NOP