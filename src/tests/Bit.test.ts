import { Bit } from "../types/binary/Bit";

// --- constants ----------------------------------------------------------------

describe("Bit constants", () => {
    test("SIZE is 2", () => {
        expect(Bit.SIZE).toBe(2);
    });
});

// --- fromNumber ---------------------------------------------------------------

describe("Bit.fromNumber", () => {
    test("0 -> 0", () => {
        expect(Bit.fromNumber(0)).toBe(0);
    });

    test("1 -> 1", () => {
        expect(Bit.fromNumber(1)).toBe(1);
    });

    test("even numbers yield 0 (only LSB is kept)", () => {
        expect(Bit.fromNumber(2)).toBe(0);
        expect(Bit.fromNumber(100)).toBe(0);
    });

    test("odd numbers yield 1", () => {
        expect(Bit.fromNumber(3)).toBe(1);
        expect(Bit.fromNumber(255)).toBe(1);
    });

    test("-1 (all bits set) yields 1", () => {
        expect(Bit.fromNumber(-1)).toBe(1);
    });

    test("-2 (even, all bits set except LSB) yields 0", () => {
        expect(Bit.fromNumber(-2)).toBe(0);
    });
});

// --- invert -------------------------------------------------------------------

describe("Bit.invert", () => {
    test("invert 0 returns 1", () => {
        expect(Bit.invert(0)).toBe(1);
    });

    test("invert 1 returns 0", () => {
        expect(Bit.invert(1)).toBe(0);
    });

    test("double invert of 0 returns 0", () => {
        expect(Bit.invert(Bit.invert(0))).toBe(0);
    });

    test("double invert of 1 returns 1", () => {
        expect(Bit.invert(Bit.invert(1))).toBe(1);
    });
});
