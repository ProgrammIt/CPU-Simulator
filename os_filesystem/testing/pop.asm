NOP

; immediate
PUSH $1
DEV $0b01000, *%esp  ; 00001000 - console_print_number(number=op2)

PUSH $0x2
DEV $0b01000, *%esp  ; 00001000 - console_print_number(number=op2)

PUSH $0b011
DEV $0b01000, *%esp  ; 00001000 - console_print_number(number=op2)

; address
PUSH @4
DEV $0b01000, *%esp  ; 00001000 - console_print_number(number=op2)

PUSH @0x5
DEV $0b01000, *%esp  ; 00001000 - console_print_number(number=op2)

PUSH @0b0101
DEV $0b01000, *%esp  ; 00001000 - console_print_number(number=op2)

NOP
