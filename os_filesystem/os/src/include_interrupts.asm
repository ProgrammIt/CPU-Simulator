
; collect all the ISRs for the interrupts here

    ; collect all the ISRs for intenal interrupts (exceptions)

    .INCLUDE "os/src/interrupts/exceptions/divide_error"                   ; 0x00
    .INCLUDE "os/src/interrupts/exceptions/invalid_opcode"                 ; 0x06
    .INCLUDE "os/src/interrupts/exceptions/general_protection_fault"       ; 0x0D
    .INCLUDE "os/src/interrupts/exceptions/page_fault"                     ; 0x0E


    ; collect all the ISRs for external interrupts here

    .INCLUDE "os/src/interrupts/hardware/timer/timer"                      ; 0x20
    .INCLUDE "os/src/interrupts/hardware/timer/periodic_timer"             ; 0x21
    .INCLUDE "os/src/interrupts/syscalls/syscalls"                         ; 0x80
    .INCLUDE "os/src/interrupts/hardware/io/hid/keyboard/keyboard"         ; 0x81