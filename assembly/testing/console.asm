NOP ; enter kernel mode (requires patched NOP instruction)

MOV $0x100, %esp

; print 123
PUSH $123
DEV $0b01000, *%esp  ; 00001000 - console_print_number(number=op2)

; print 'aaaa'
MOV $0, @0x108 ; null-termination
MOV $0b01100001011000010110000101100001, @0x104    ; "aaaa"
PUSH $4
PUSH $1000
DEV $0b0011, $0     ; 00000011 - io_write_buffer (fd=op2, buffer=stack, b_size=stack) -> bytes_written=eax

; read up to 100 bytes
PUSH $0x8000        ; buffer address
PUSH $100           ; buffer length
DEV $0b0010, $0     ; 00000010 - io_read_buffer (fd=op2, buffer_ptr=stack, buffer_size=stack) -> bytes_read=eax

; print amount of bytes read
DEV $0b01000, %eax  ; 00001000 - console_print_number(number=op2)

; print the read buffer
PUSH @0x8000        ; buffer address
PUSH %eax           ; buffer length
DEV $0b0011, $0     ; 00000011 - io_write_buffer (fd=op2, buffer=stack, b_size=stack) -> bytes_written=eax

; print amount of bytes written
DEV $0b01000, %eax  ; 00001000 - console_print_number(number=op2)

NOP