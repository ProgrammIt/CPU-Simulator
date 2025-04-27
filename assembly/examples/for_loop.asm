; Author: Jannik Rosendahl

; testing for loops
; for (i=0; i<7; i++)
; using eax as counter register

MOV $0x0, %eax ; 0 - 11 th address

.loop_begin:
    ; if eax >= 7, break loop
    CMP $0x7, %eax ; 12 - 23 th address
    JGE loop_end

    ; else eax++, loop
    ADD $0x1, %eax
    JMP loop_begin

.loop_end:
    MOV $0xFF, %ebx      ; debug marker

; 12 Byte -> 3 x 4 Byte -> 3 x 4 Adressen
