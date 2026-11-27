# Operating System User Manual

## Table of Contents

- [1 System Calls](#1-system-calls)
  - [1.1 Process System Calls](#11-process-system-calls)
    - [1.1.1 PROCESS_CREATE](#111-process_create)
    - [1.1.2 PROCESS_EXIT](#112-process_exit)
    - [1.1.3 PROCESS_YIELD](#113-process_yield)
  - [1.2 Timer System Calls](#12-timer-system-calls)
    - [1.1.3 TIMER_START](#121-timer_start)

# 1 System Calls

## 1.1 Process System Calls

> ### 1.1.1 PROCESS_CREATE
>
> The `PROCESS_CREATE` system call creates a new process.
>
> **System call number:** `16`
>
> **Parameters**
>
> - Pointer to an ASCII file path, the path must point to a binary file from which the process is to be created.
>
> **Return Value**
>
> - `0` → Process created successfully
> - `-1` → Error creating the process
>
> **Blocking**
>
> - No.



> ### 1.1.2 PROCESS_EXIT
>
> The system call `PROCESS_EXIT` terminates the current process.
>
> **System call number:** `17`
>
> **Parameters**
>
> - None.
>
> **Return value**
>
> - No return value.
>
> **Blocking**
>
> - No, but it causes a process switch.




> ### 1.1.3 PROCESS_YIELD
>
> The system call `PROCESS_YIELD` performs an immediate process switch.
>
> **System call number:** `18`
> 
> **Parameters**
> 
> - None.
>
> **Return Value**
>
> - No return value.
>
> **Blocking**
>
> - No, but it causes a process switch.




## 1.2 Timer System Calls

> ### 1.2.1 TIMER_START
>
> The system call `TIMER_START` starts a new timer.
>
> **System call number:** `24`
>
> **Parameters**
>
> - Duration of the timer, must be `> 0`.
>
> **Return Value**
>
> - `0` → Timer successfully created.
> - `-1` → Error creating the timer.
>
> **Blocking**
>
> - Yes.

