
NOP                     ; enter kernel mode

;0b
PUSH $0b10010111100101111001011110010111          ; move filename "aaaa" onto stack
DEV $0b00000110, %esp   ; 00000110 - file_open (filename_ptr=op2) -> fd=eax

MOV %eax, %ecx          ; ecx will keep the file descriptor

PUSH $2                 ; seek offset
PUSH $0                 ; seek mode 0 (relative seek from current position) 
DEV $0b00000000, %ecx   ; 00000000 - io_seek (fd=op2, offset=eax, mode=ebx) -> success=eax





NOP