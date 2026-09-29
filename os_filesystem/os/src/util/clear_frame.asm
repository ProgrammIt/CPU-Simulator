; UTIL_CLEAR_FRAME
; Parameters:
;   (ebx)     Pointer to the frame base address
; Return value (immediate value):
;   none
.UTIL_CLEAR_FRAME:
    PUSH %eax
    PUSH %ebx
    PUSH %ecx
    
    DEV $CONST_DEV_COMMAND_CPU_IS_MEMORY_VIRTUALIZATION_ENABLED, $0
    PUSH %eax ; is virtualization enabled
    DEV $CONST_DEV_COMMAND_CPU_DISABLE_MEMORY_VIRTUALIZATION, $0

    MOV $0, %eax ; set counter to zero

    ._UTIL_CLEAR_FRAME_START:
        CMP $CONST_OS_FRAME_SIZE, %eax
        JGE _UTIL_CLEAR_FRAME_DONE
        MOV $0, *%ebx
        ADD $4, %eax ; increase counter
        ADD $4, %ebx ; next entry
        JMP _UTIL_CLEAR_FRAME_START
        
    ._UTIL_CLEAR_FRAME_DONE:
        POP %ebx ; was virtualization enabled
        CMP $0, %ebx
        JE _UTIL_CLEAR_FRAME_SKIP_MEMORY_VIRTUALIZATION
        DEV $CONST_DEV_COMMAND_CPU_ENABLE_MEMORY_VIRTUALIZATION, $0

    ._UTIL_CLEAR_FRAME_SKIP_MEMORY_VIRTUALIZATION:
        POP %ecx
        POP %ebx
        POP %eax

RET