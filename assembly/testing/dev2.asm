
NOP                     ; enter kernel mode


MOV $0x200, %esp    ; move stack low for easier viewing in the GUI
PUSH $0b01100001011000010110000101100001          ; move filename "aaaa" onto stack
DEV $0b0110, %esp   ; 00000110 - file_open (filename_ptr=op2) -> fd=eax

MOV %eax, %ebx          ; ebx for file descriptor of "aaaa"

PUSH $2                 ; seek offset
PUSH $0                 ; seek mode 0 (relative seek from current position) 
DEV $0b00000000, %ebx   ; 00000000 - io_seek (fd=op2, offset=eax, mode=ebx) -> success=eax

; read 9 bytes from file "aaaa"
PUSH $9     ; buffer length
PUSH $0x400 ; 10 byte buffer at 0x400 
DEV $0b00000010, %ecx     ; 00000010 - io_read_buffer (fd=op2, buffer=eax, b_size=ebx) -> bytes_read=eax

; create file "bbbb"
; 00000100 - file_create (filename_ptr=op2)

; open file "bbbb" and move fd into ecx
; 00000110 - file_open (filename_ptr=op2) -> fd=eax

; write the 9 bytes from "aaaa" back to file "bbbb"
; 00000011 - io_write_buffer (fd=op2, buffer=stack, b_size=stack) -> bytes_written=eax


NOP