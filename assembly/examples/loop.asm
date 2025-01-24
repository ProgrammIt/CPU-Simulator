MOV $0x4, %eax      ; Kopiere den Wert 100 in das Register eax.

.loop: 
    SUB $1, %eax     ; Subtrahiere den Wert 1 vom Wert im Register eax.
    CMP $0, %eax     ; Vergleiche den Inhalt von Register eax mit der 0.
    JG loop          ; Springe zum Schleifenanfang, wenn der Wert im Register eax noch größer als 0 ist.

; Ende des Programms. Das Ergebnis steht in Register eax.