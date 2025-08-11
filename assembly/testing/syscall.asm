; enter kernel mode because of broken page table
NOP


; print '42'
MOV $42, %ebx
; SYSCALL_CONSOLE_READ_NUMBER
; Parameters (immediate value):
;   (ebx)     number to print
; Return value:
;   none
MOV $8, %eax; syscall id 8 for SYSCALL_CONSOLE_READ_NUMBER
INT $0


; create 'cccc' file
; cccc in binary ascii -> 01100011011000110110001101100011 
MOV $1000, %ebx
MOV $0b01100011011000110110001101100011, *%ebx
; SYSCALL_FILE_CREATE
; Parameters (ebx is a pointer to the start of an ASCII filename):
;   (ebx)     Pointer to a ASCII filename
; Return value (immediate value):
;   None
MOV $4, %eax; syscall id 4 for SYSCALL_FILE_CREATE
INT $0


; open 'cccc' file
MOV $1000, %ebx
MOV $0b01100011011000110110001101100011, *%ebx
; SYSCALL_FILE_OPEN
; Parameters (ebx is a pointer to the start of an ASCII filename):
;   (ebx)     Pointer to a ASCII filename
; Return value (immediate value):
;   eax     success status (>0 = new file descriptor, -1 = file already exists)
MOV $6, %eax; syscall id 6 for SYSCALL_FILE_OPEN
INT $0

; move file descriptor into ecx
MOV %eax, %ecx

; write 5 bytes '12345'
; prepare buffer
MOV $1, @1000
MOV $2, @1001
MOV $3, @1002
MOV $4, @1003
MOV $5, @1004
; setup struct for syscall parameter
MOV $2000, %ebx
; file descriptor
MOV %ecx, *%ebx

ADD $4, %ebx
; buffer size = 5
MOV $5, *%ebx

ADD $4, %ebx
; buffer pointer = 1000
MOV $1000, *%ebx

; reset ebx to struct base address
SUB $8, %ebx
; SYSCALL_IO_WRITE_BUFFER
; Parameters (ebx is a pointer to the following struct):
;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
;   *(ebx+4)   pointer to buffer, this buffer will be used by the file system
;   *(ebx+8)   buffer size, limits the amount of bytes that will be written
; Return value (immediate value):
;   eax     success status (>=0 = number of bytes written, -1 = invalid file descriptor, -2 = seek position out of file bounds)
MOV $3, %eax; syscall id 3 for SYSCALL_IO_WRITE_BUFFER
INT $0


; seek to the middle of the file
; setup struct for syscall parameter
MOV $2000, %ebx
; file descriptor
MOV %ecx, *%ebx
ADD $4, %ebx
; seek mode = 1 - Seek from start of file
MOV $0, *%ebx
ADD $4, %ebx
; seek offset = 2
MOV $2, *%ebx
SUB $8, %ebx
; SYSCALL_IO_SEEK
; Parameters (ebx is a pointer to the following struct):
;   *(ebx)     file descriptor
;   *(ebx+4)   seek offset
;   *(ebx+8)   seek mode (0 - Seek from current position, 1 - Seek from start of file, 2 - Seek from end of file)
; Return value (immediate value):
;   eax     success status (0 = success, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = negative seek position)
MOV $0, %eax; syscall id 0 for SYSCALL_IO_SEEK
INT $0


; read 2 bytes -> '45'
; setup struct for syscall parameter
MOV $2000, %ebx
; file descriptor
MOV %ecx, *%ebx
ADD $4, %ebx
; pointer to buffer
MOV $3000, *%ebx
ADD $4, %ebx
; buffer size
MOV $2, *%ebx
ADD $4, %ebx
; SYSCALL_IO_READ_BUFFER
; Parameters (ebx is a pointer to the following struct):
;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
;   *(ebx+4)   pointer to buffer, this buffer will be filled by the file system
;   *(ebx+8)   buffer size, limits the amount of bytes that will be read
; Return value (immediate value):
;   eax     success status (>=0 = number of bytes read, -1 = invalid file descriptor, -2 = seek position out of file bounds, -3 = no console input ready)
MOV $2, %eax; syscall id 2 for SYSCALL_IO_READ_BUFFER
INT $0


; write 2 bytes -> '45'
; setup struct for syscall parameter
MOV $2000, %ebx
; file descriptor
MOV %ecx, *%ebx
ADD $4, %ebx
; pointer to buffer
MOV $3000, *%ebx
ADD $4, %ebx
; buffer size
MOV $2, *%ebx
ADD $4, %ebx
; SYSCALL_IO_WRITE_BUFFER
; Parameters (ebx is a pointer to the following struct):
;   *(ebx)     file descriptor (fd=0 for console, fd>0 for files)
;   *(ebx+4)   pointer to buffer, this buffer will be used by the file system
;   *(ebx+8)   buffer size, limits the amount of bytes that will be written
; Return value (immediate value):
;   eax     success status (>=0 = number of bytes written, -1 = invalid file descriptor, -2 = seek position out of file bounds)
MOV $3, %eax; syscall id 3 for SYSCALL_IO_WRITE_BUFFER
INT $0


; close file
MOV %ecx, *%ebx
; SYSCALL_IO_CLOSE
; Parameters (ebx is used as a immediate value):
;   ebx     file descriptor
; Return value:
;   None
MOV $1, %eax; syscall id 1 for SYSCALL_IO_CLOSE
INT $0




; delete file
MOV $0b01100011011000110110001101100011, %ebx
; SYSCALL_FILE_DELETE
; Parameters (ebx is a pointer to the start of an ASCII filename):
;   (ebx)     Pointer to a ASCII filename
; Return value (immediate value):
;   eax     success status (0 = success, -1 = file did not exist)



