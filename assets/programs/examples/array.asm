; Dieses Programm initialisiert ein 3x3 Array im Hauptspeicher mit 0-en. Die Startadresse für das Array ist 100.

MOV $0b0, %eax      ; Kopiere den Wert 0 in das Register EAX.
MOV $0x64, %ebx      ; Kopiere den Wert 100 in das Register EBX.

.loop:
    MOV $0, *%ebx   ; Kopiere den Wert 0 an die Speicheradresse, auf die das Register EBX zeigt. Der Wert in EBX wird dabei als Speicheradresse verwendet.
    ADD $1, %eax    ; Inkrementiere den Wert im Register EAX.
    ADD $4, %ebx    ; Inkrementiere den Wert im Register EBX um 4 (Byte <=> 32 Bit <=> eine Zahl).
    CMP $9, %eax    ; Vergleiche den aktuellen Wert im Register EAX mit dem Wert 9.
    JL loop         ; Springe zurueck.
    