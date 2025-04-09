# Version 1.0.0

This is the first release of the **Ihme-Core CPU-Simulator**. This document summarizes the key features and functionalities of the simulator. For more information please head over to the documentation.

# Key features

## Simulation

The main goal of this application is to simulate the functionality of a single-core CPU. The CPU is called Ihme-Core and supports basic arithmetic and logic instructions.

## Assembly support

The **Ihme-Core** can be programmed with a custom version of the x86-/x64 assembly language. No need to write programs in machine code. Programs written in the assembly language can be loaded into the simulator. The simulator includes an assembler to compile the human-readable programs into machine-readable ones.

## Visualization

The graphical user interface (GUI) displays the current state of the CPU, including registers, memory, and the program counter. This helps users understand how instructions are being executed step by step. Users can observe the execution of instructions in real-time or step through them manually. This is particularly useful for debugging and learning purposes. Furthermore the GUI allows users to load assembly programs into the simulator, compile them, and see how they are executed.

# Installation

There are distributables for the operating systems Linux, macOS and Windows. For Windows, there are `.msi` and `.exe` installers. For Debian-based Linux distributions there is an `.deb` package, while for RedHat-based Linux distributions there is an `.rpm` package. For macOS systems choose the `.zip` installer.
