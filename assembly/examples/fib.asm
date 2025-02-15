; Author: Jannik Rosendahl <jannik.rosendahl@stud.hs-hannover.de>

; calculates the n'th fibonacci number with 2 < n

; a = 0
; b = 1
; for i in 2..n
;     tmp = a + b
;     a = b
;     b = temp
; return b

; n @ 0x200
; a @ 0x204
; b @ 0x208
; i @ 0x20C


MOV $0x7, @0x200     ; store 6 <- input n-1 here
MOV $0x0, @0x204     ; store a
MOV $0x1, @0x208     ; store b
MOV $0x1, @0x20C     ; store i

.loop:
    ; tmp = a + b
    MOV @0x204, %eax        ; load a -> eax
    MOV @0x208, %ebx        ; load b -> ebx
    ADD %ebx, %eax          ; add b to eax
    ; eax holds tmp
    ; ebx holds b

    MOV %ebx, @0x204        ; a = b
    MOV %eax, @0x208        ; b = temp

    ; increment i
    MOV @0x20C, %eax        ; load i -> eax
    ADD $1, %eax
    MOV %eax, @0x20C        ; store i

    ; check if i < n
    MOV @0x20C, %eax        ; load i -> eax
    MOV @0x200, %ebx        ; load n -> ebx
    CMP %ebx, %eax
    JL loop

; load res into eax
MOV @0x208, %eax
