import { FLAGS } from "../simulator/functional_units/FLAGS";
import { describe, expect, test } from '@jest/globals';

describe("Set and clear flag bits in the EFLAGS register", () => {
    const eflags: FLAGS = new FLAGS();
    test("Set zero flag", () => {
        eflags.setZero();
        expect(eflags.content).toBe(0b11000100);
    });

    test("Clear zero flag", () => {
        eflags.clearZero();
        expect(eflags.content).toBe(0b11000000);
    });

    test("Set parity flag", () => {
        eflags.setParity();
        expect(eflags.content).toBe(0b11000001);
    });

    test("Clear parity flag", () => {
        eflags.clearParity();
        expect(eflags.content).toBe(0b11000000);
    });

    test("Enter kernel mode", () => {
        eflags.enterKernelMode();
        expect(eflags.content).toBe(0b00000000);
    });

    test("Test if CPU is in kernel mode", () => {
        expect(eflags.isInKernelMode()).toBeTruthy();
    });

    test("Exit kernel mode and enter user mode", () => {
        eflags.enterUserMode()
        expect(eflags.content).toBe(0b11000000);
    });

    test("Test if CPU is in kernel mode", () => {
        expect(eflags.isInKernelMode()).toBeFalsy();
    });

    test("Test if CPU is in user mode", () => {
        expect(eflags.isInUserMode()).toBeTruthy();
    });
});