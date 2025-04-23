NOP
PUSH $0x61616161        ; push "aaaa" on the stack as filename 
DEV $0b00000110, %esp   ; 00000110 - file_open (filename_ptr=op2) -> fd=eax 