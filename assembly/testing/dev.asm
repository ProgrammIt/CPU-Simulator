NOP

; filename
PUSH $100 $97        ; "a"
PUSH $101 $98        ; "b"
PUSH $102 $99        ; "c"
PUSH $103 $0         ; null-terminated

; get file handle into eax
DEV $0b00000110, $400   ; 00000110 - file_open (filename_ptr=op2) -> fd=eax 



NOP