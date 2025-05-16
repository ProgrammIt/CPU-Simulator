NOP
PUSH $123
DEV $0b01000, %esp  ; 00001000 - console_print_number(number=op2)

PUSH $0 ; null-termination
PUSH $0b01100001011000010110000101100001    ; "aaaa"
PUSH $4
PUSH %esp
DEV $0b0011, $0 ; 00000011 - io_write_buffer (fd=op2, buffer=stack, b_size=stack) -> bytes_written=eax

NOP