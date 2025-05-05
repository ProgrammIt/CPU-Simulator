NOP
NOP
NOP
PUSH @4292870142  ; "abc" (null terminated)
POP %eax
NOP

; filename
MOV $0b011000010110001001100011, @0x50        ; "abc" (null terminated)
PUSH $0x00999897  ; "abc" (null terminated)


; get file handle
DEV $0b00000110, %esp   ; 00000110 - file_open (filename_ptr=op2) -> fd=eax 



NOP