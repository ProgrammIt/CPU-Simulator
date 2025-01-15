import { Doubleword } from "../types/Doubleword";

describe("Create doubleword from decimal integer values", () => {
    test("Create doubleword from decimal -6", () => {
        expect(Doubleword.fromInteger(-6).value.join("")).toBe("11111111111111111111111111111010");
    });

    test("Create doubleword from decimal -300", () => {
        expect(Doubleword.fromInteger(-300).value.join("")).toBe("11111111111111111111111011010100");
    });

    test("Trigger error because of converting a too large negative decimal integer", () => {
        const attemptToConvert = () => {
            Doubleword.fromInteger(-6_000_000_000_000);
        } 
        expect(attemptToConvert).toThrow(Error);
    });

    test("Create doubleword from positive decimal integer value", () => {
        expect(Doubleword.fromInteger(6).value.join("")).toBe("00000000000000000000000000000110");
    });

    test("Check wether (8)_10 is smaller than (11)_10", () => {
        expect(Doubleword.fromInteger(8).isSmallerThan(Doubleword.fromInteger(11))).toBe(true);
    });

    test("Check wether (-1)_10 is smaller than (1)_10", () => {
        expect(Doubleword.fromInteger(-1).isSmallerThan(Doubleword.fromInteger(1))).toBe(true);
    });

    test("Check wether (-1)_10 is smaller than (-2)_10", () => {
        expect(Doubleword.fromInteger(-1).isSmallerThan(Doubleword.fromInteger(-2))).toBe(false);
    });

    test("Check wether (100)_10 is smaller than (11)_10", () => {
        expect(Doubleword.fromInteger(100).isSmallerThan(Doubleword.fromInteger(11))).toBe(false);
    });
});