import { DoubleWord } from "../binary_types/DoubleWord";

describe("Create doubleword from decimal integer values", () => {
    test("Create doubleword from decimal -6", () => {
        expect(DoubleWord.fromInteger(-6).value.join("")).toBe("11111111111111111111111111111010");
    });

    test("Create doubleword from decimal -300", () => {
        expect(DoubleWord.fromInteger(-300).value.join("")).toBe("11111111111111111111111011010100");
    });

    test("Group bytes in doubleword string", () => {
        expect(DoubleWord.fromInteger(8).toString(true)).toBe("00000000 00000000 00000000 00001000");
    });

    test("Trigger error because of converting a too large negative decimal integer", () => {
        const attemptToConvert = () => {
            DoubleWord.fromInteger(-6_000_000_000_000);
        } 
        expect(attemptToConvert).toThrow(Error);
    });

    test("Create doubleword from positive decimal integer value", () => {
        expect(DoubleWord.fromInteger(6).value.join("")).toBe("00000000000000000000000000000110");
    });

    test("Check wether (8)_10 is smaller than (11)_10", () => {
        expect(DoubleWord.fromInteger(8).isSmallerThan(DoubleWord.fromInteger(11))).toBe(true);
    });

    test("Check wether (-1)_10 is smaller than (1)_10", () => {
        expect(DoubleWord.fromInteger(-1).isSmallerThan(DoubleWord.fromInteger(1))).toBe(true);
    });

    test("Check wether (-1)_10 is smaller than (-2)_10", () => {
        expect(DoubleWord.fromInteger(-1).isSmallerThan(DoubleWord.fromInteger(-2))).toBe(false);
    });

    test("Check wether (100)_10 is smaller than (11)_10", () => {
        expect(DoubleWord.fromInteger(100).isSmallerThan(DoubleWord.fromInteger(11))).toBe(false);
    });
});