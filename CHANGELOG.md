# Release Notes for version 1.0.2

This document summarizes the changes to the **Ihme-Core CPU-Simulator** that this version provides.

## Bug fixes

* We fixed a bug, which prevents the assembler from recognizing decimal and hexadecimal addresses and immediate values in your programs.
* In the calculation of a page number there was an error due to string conversion, which leads to an incorrect calculated page table index.
