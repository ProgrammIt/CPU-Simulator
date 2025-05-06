
NOP                     ; enter kernel mode


MOV $0x979797, %eax     ; move filename "aaa" into eax 
DEV $0b00000110, %eax   ; 00000110 - file_open (filename_ptr=op2) -> fd=eax

MOV %eax, %ecx          ; ecx will keep the fd

MOV $2, %eax            ; seek offset
MOV $0, %eax            ; seek mode 0 (relative seek from current position) 
DEV $0b00000000, %ecx   ; 00000000 - io_seek (fd=op2, offset=eax, mode=ebx) -> success=eax





NOP